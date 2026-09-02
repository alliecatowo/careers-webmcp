import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool } from './helpers';

test.describe('human click -> agent context', () => {
  test('clicking the Staff Platform Engineer card is reflected in careers_get_context', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const card = page.getByTestId('job-card').filter({ hasText: 'Staff Platform Engineer' }).first();
    await card.getByRole('link', { name: 'Staff Platform Engineer' }).click();
    await expect(page.getByTestId('job-title')).toHaveText('Staff Platform Engineer');

    const context = await callTool<{
      page: { kind: string };
      currentJob: { id: string; title: string } | null;
      session: { signedIn: boolean };
    }>(page, 'careers_get_context');

    expect(context.page.kind).toBe('job_detail');
    expect(context.currentJob?.id).toBe('job_staff_platform');
    expect(context.session.signedIn).toBe(false);
  });
});
