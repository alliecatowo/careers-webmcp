import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, DEMO_JOBS } from './helpers';

test.describe('signed-out enforcement', () => {
  test('candidate-only tools return AUTH_REQUIRED when signed out', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const setSaved = await callTool<{ error?: string }>(page, 'careers_set_saved_job', {
      jobId: DEMO_JOBS.staffPlatform,
      saved: true,
    });
    expect(setSaved.error).toBe('AUTH_REQUIRED');

    const start = await callTool<{ error?: string }>(page, 'careers_start_application', {
      jobId: DEMO_JOBS.staffPlatform,
    });
    expect(start.error).toBe('AUTH_REQUIRED');

    const update = await callTool<{ error?: string }>(page, 'careers_update_application', {
      applicationId: 'app_does_not_matter',
      expectedRevision: 1,
      fields: {},
    });
    expect(update.error).toBe('AUTH_REQUIRED');

    const myApps = await callTool<{ error?: string }>(page, 'careers_get_my_applications');
    expect(myApps.error).toBe('AUTH_REQUIRED');
  });
});
