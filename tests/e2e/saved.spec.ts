import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, jobDetailUrl, DEMO_JOBS } from './helpers';

test.describe('saved jobs: human + agent share one store', () => {
  test('human save is visible to the agent, and agent unsave is visible to the human', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto(jobDetailUrl(DEMO_JOBS.staffPlatform));
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    // Human clicks Save (this also signs in the demo candidate, per SaveJobButton).
    const saveButton = page.getByTestId('save-job-button');
    await saveButton.click();
    await expect(saveButton).toHaveAttribute('data-saved', 'true');

    const saved = await callTool<{ savedJobs: { id: string }[] }>(page, 'careers_get_saved_jobs');
    expect(saved.savedJobs.map((j) => j.id)).toContain(DEMO_JOBS.staffPlatform);

    // Agent unsaves; the human-visible button must reflect it without a reload.
    const unsetResult = await callTool<{ saved: boolean }>(page, 'careers_set_saved_job', {
      jobId: DEMO_JOBS.staffPlatform,
      saved: false,
    });
    expect(unsetResult.saved).toBe(false);
    await expect(saveButton).toHaveAttribute('data-saved', 'false');
  });
});
