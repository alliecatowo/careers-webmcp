import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, signInAsDemoCandidate, DEMO_JOBS } from './helpers';

test.describe('human + agent shared application flow', () => {
  test('start, agent update, human edit, stale protection, human submit', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));
    await signInAsDemoCandidate(page);

    // Agent starts the application; browser navigates to the normal application page.
    const started = await callTool<{ id: string; url: string }>(page, 'careers_start_application', {
      jobId: DEMO_JOBS.staffPlatform,
    });
    await expect(page).toHaveURL(new RegExp(`/careers/application/united-states\\?jobId=${DEMO_JOBS.staffPlatform}`));
    await expect(page.getByTestId('application-form')).toBeVisible();
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Avery Chen');

    // Agent fills the portfolio URL; the visible input must update without a reload.
    const afterAgentUpdate = await callTool<{ revision: number }>(page, 'careers_update_application', {
      applicationId: started.id,
      expectedRevision: 1,
      fields: { portfolioUrl: 'https://example.test/avery' },
    });
    expect(afterAgentUpdate.revision).toBe(2);
    await expect(page.locator('input[name="portfolioUrl"]')).toHaveValue('https://example.test/avery');

    // Human types into the cover note; the agent must see the typed text and a bumped revision.
    await page.locator('textarea[name="coverNote"]').fill('I would love to build platform infrastructure here.');
    await page.locator('textarea[name="coverNote"]').blur();

    const afterHumanEdit = await callTool<{ fields: { coverNote: string }; revision: number }>(
      page,
      'careers_get_application',
      { applicationId: started.id },
    );
    expect(afterHumanEdit.fields.coverNote).toBe('I would love to build platform infrastructure here.');
    expect(afterHumanEdit.revision).toBeGreaterThan(afterAgentUpdate.revision);

    const staleRevision = afterAgentUpdate.revision; // now stale: human edit already bumped it further

    // Human changes the phone field manually.
    await page.locator('input[name="phone"]').fill('+1 555 0100');
    await page.locator('input[name="phone"]').blur();

    // Agent attempts an update using the old (now stale) revision.
    const staleResult = await callTool<{ error?: string; expectedRevision?: number; currentRevision?: number }>(
      page,
      'careers_update_application',
      {
        applicationId: started.id,
        expectedRevision: staleRevision,
        fields: { location: 'San Francisco, CA' },
      },
    );
    expect(staleResult.error).toBe('STALE_APPLICATION');
    expect(staleResult.expectedRevision).toBe(staleRevision);

    // The human's phone edit must have survived the rejected agent write.
    await expect(page.locator('input[name="phone"]')).toHaveValue('+1 555 0100');

    // Reread, then retry with the current revision — should succeed.
    const reread = await callTool<{ revision: number }>(page, 'careers_get_application', { applicationId: started.id });
    const retried = await callTool<{ revision: number; fields: { location: string } }>(
      page,
      'careers_update_application',
      {
        applicationId: started.id,
        expectedRevision: reread.revision,
        fields: { location: 'San Francisco, CA' },
      },
    );
    expect(retried.fields.location).toBe('San Francisco, CA');

    // Fill the remaining required fields, then hand off to the human.
    await page.locator('input[name="availability"]').fill('Available immediately');
    await page.locator('input[name="availability"]').blur();

    const beforeSubmit = await callTool<{ revision: number }>(page, 'careers_get_application', {
      applicationId: started.id,
    });

    const handedOff = await callTool<{ status: string; applicationStatus: string }>(
      page,
      'careers_submit_application',
      { applicationId: started.id, expectedRevision: beforeSubmit.revision },
    );
    expect(handedOff.status).toBe('awaiting_human_confirmation');
    expect(handedOff.applicationStatus).toBe('draft');

    // The page tells the human it is their turn, and the draft is untouched.
    await expect(page.getByTestId('submit-handoff-note')).toBeVisible();
    await expect(page.getByTestId('agent-pending-confirmation')).toBeVisible();
    await expect(page).not.toHaveURL(/success/);

    // Only the human's click submits.
    await page.getByTestId('submit-application').click();
    await expect(page).toHaveURL(new RegExp(`/careers/application/united-states/success\\?appId=${started.id}`));
    await expect(page.getByTestId('application-submitted')).toBeVisible();
  });
});
