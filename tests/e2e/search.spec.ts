import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool, DEMO_JOBS } from './helpers';

test.describe('careers_search_jobs', () => {
  test('a structured engineering query returns the expected demo jobs', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const result = await callTool<{ totalMatches: number; jobs: { id: string }[] }>(page, 'careers_search_jobs', {
      departments: ['Engineering'],
      maxResults: 30,
    });

    const ids = result.jobs.map((j) => j.id);
    for (const jobId of Object.values(DEMO_JOBS)) {
      expect(ids).toContain(jobId);
    }
  });
});
