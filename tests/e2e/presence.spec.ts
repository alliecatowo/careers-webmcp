import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, DEMO_JOBS } from './helpers';

test.describe('agent presence', () => {
  test('renders nothing at all until a tool actually runs', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    // The shim is installed and tools are registered, but no tool has been called.
    await expect(page.getByTestId('agent-presence')).toHaveCount(0);

    await callTool(page, 'careers_get_context');
    await expect(page.getByTestId('agent-presence')).toBeVisible();
  });

  test('reports the tool that ran, then clears itself', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    await callTool(page, 'careers_search_jobs', { query: 'platform' });
    const activity = page.getByTestId('agent-activity').filter({ hasText: 'Searching jobs' });
    await expect(activity).toBeVisible();
    await expect(activity).toHaveAttribute('data-phase', 'done');

    // Transient: it goes away on its own without the human doing anything.
    await expect(page.getByTestId('agent-activity')).toHaveCount(0, { timeout: 15_000 });
  });

  test('types the query into the site own search box and filters the real list', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const input = page.getByTestId('job-search-input');
    await expect(input).toHaveValue('');

    const call = callTool(page, 'careers_set_search_view', { query: 'Research Engineer' });

    // Mid-animation the input is agent-driven and shows a caret.
    await expect(page.getByTestId('agent-caret')).toBeVisible();
    await call;

    await expect(input).toHaveValue('Research Engineer');
    await expect(page).toHaveURL(/q=Research\+Engineer/);
    await expect(page.getByTestId('job-card').first()).toContainText('Research Engineer');

    // The input is handed back to the human once the animation releases.
    await expect(input).not.toHaveAttribute('data-agent-typing', 'true', { timeout: 5000 });
    await input.fill('security');
    await expect(input).toHaveValue('security');
  });

  test('spotlights the job title when the agent navigates the human to a role', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    await callTool(page, 'careers_open_job', { jobId: DEMO_JOBS.staffPlatform });

    await expect(page.getByTestId('job-title')).toBeVisible();
    await expect(page.locator('[data-agent-spotlight="true"]')).toBeVisible();
  });

  test('flashes exactly the application fields the agent wrote', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));
    await page.getByTestId('demo-sign-in').first().click();

    const started = await callTool<{ id: string; revision: number }>(page, 'careers_start_application', {
      jobId: DEMO_JOBS.staffPlatform,
    });
    await expect(page.getByTestId('application-form')).toBeVisible();

    await callTool(page, 'careers_update_application', {
      applicationId: started.id,
      expectedRevision: started.revision,
      fields: { phone: '+1 555 0100' },
    });

    await expect(page.locator('#phone')).toHaveValue('+1 555 0100');
    await expect(page.locator('#phone')).toHaveClass(/ring-sky-400/);
    // A field the agent did not touch is not flashed.
    await expect(page.locator('#coverNote')).not.toHaveClass(/ring-sky-400/);
  });

  test('moves the cursor to the field the agent points at', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));
    await page.getByTestId('demo-sign-in').first().click();

    const started = await callTool<{ id: string }>(page, 'careers_start_application', {
      jobId: DEMO_JOBS.staffPlatform,
    });
    await expect(page.getByTestId('application-form')).toBeVisible();

    await callTool(page, 'careers_focus_application_field', { applicationId: started.id, field: 'availability' });
    await expect(page.locator('#availability')).toBeFocused();

    // The human can just start typing where the agent pointed.
    await page.keyboard.type('2 weeks notice');
    await expect(page.locator('#availability')).toHaveValue('2 weeks notice');
  });
});
