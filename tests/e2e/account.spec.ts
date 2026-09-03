import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool } from './helpers';

test.describe('agent-prepared account creation', () => {
  test('agent fills the real sign-up form; only the human click creates the session', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const staged = await callTool<{ status: string; readyToConfirm: boolean }>(page, 'careers_create_account', {
      fullName: 'Sam Rivera',
      email: 'sam.rivera@example.test',
      location: 'Austin, TX',
      yearsExperience: 6,
    });
    expect(staged.status).toBe('awaiting_human_confirmation');
    expect(staged.readyToConfirm).toBe(true);

    // The browser is now on the site's normal sign-up page, pre-filled.
    await expect(page).toHaveURL(/\/careers\/signup/);
    await expect(page.getByTestId('signup-fullName')).toHaveValue('Sam Rivera');
    await expect(page.getByTestId('signup-email')).toHaveValue('sam.rivera@example.test');
    await expect(page.getByTestId('signup-location')).toHaveValue('Austin, TX');
    await expect(page.getByTestId('signup-agent-notice')).toBeVisible();

    // No session yet — the agent did not sign anyone in.
    const before = await callTool<{ session: { signedIn: boolean } }>(page, 'careers_get_context');
    expect(before.session.signedIn).toBe(false);

    await page.getByTestId('confirm-signup').click();
    await expect(page).toHaveURL(/\/careers\/open-positions/);

    const after = await callTool<{ session: { signedIn: boolean; candidate: { displayName: string } } }>(
      page,
      'careers_get_context',
    );
    expect(after.session.signedIn).toBe(true);
    expect(after.session.candidate.displayName).toBe('Sam Rivera');
  });

  test('the human can edit an agent-filled field before confirming', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    await callTool(page, 'careers_create_account', { fullName: 'Sam Rivera', email: 'typo@example.test' });
    await expect(page).toHaveURL(/\/careers\/signup/);

    await page.getByTestId('signup-email').fill('sam.rivera@example.test');
    await page.getByTestId('confirm-signup').click();

    const context = await callTool<{ session: { candidate: { id: string } } }>(page, 'careers_get_context');
    expect(context.session.candidate).not.toBeNull();
  });

  test('sign-up works with no agent present', async ({ page }) => {
    await page.goto('/careers/signup');
    await expect(page.getByTestId('signup-card')).toBeVisible();
    await expect(page.getByTestId('signup-agent-notice')).toHaveCount(0);
    await expect(page.getByTestId('agent-presence')).toHaveCount(0);

    await page.getByTestId('signup-fullName').fill('Jordan Blake');
    await page.getByTestId('signup-email').fill('jordan.blake@example.test');
    await page.getByTestId('confirm-signup').click();

    await expect(page).toHaveURL(/\/careers\/open-positions/);
    await expect(page.getByTestId('session-menu')).toContainText('Jordan Blake');
  });

  test('the confirm button stays disabled until the form is actually valid', async ({ page }) => {
    await page.goto('/careers/signup');
    await expect(page.getByTestId('confirm-signup')).toBeDisabled();
    await page.getByTestId('signup-fullName').fill('Jordan Blake');
    await expect(page.getByTestId('confirm-signup')).toBeDisabled();
    await page.getByTestId('signup-email').fill('jordan.blake@example.test');
    await expect(page.getByTestId('confirm-signup')).toBeEnabled();
  });
});
