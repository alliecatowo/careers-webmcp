import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, jobDetailUrl, DEMO_JOBS } from './helpers';

test.describe('careers_open_job', () => {
  test('navigates the browser to the normal job detail page', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const result = await callTool<{ opened: boolean; job: { title: string } }>(page, 'careers_open_job', {
      jobId: DEMO_JOBS.staffPlatform,
    });
    expect(result.opened).toBe(true);

    await expect(page).toHaveURL(new RegExp(jobDetailUrl(DEMO_JOBS.staffPlatform)));
    await expect(page.getByTestId('job-title')).toHaveText('Staff Platform Engineer');
  });
});
