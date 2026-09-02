import { test, expect } from '@playwright/test';

/**
 * BUILD_CONTRACT #46: "No WebMCP" — the normal careers site must work with
 * zero WebMCP shim installed. No `page.addInitScript` here on purpose.
 */
test.describe('normal site without WebMCP', () => {
  test('jobs list renders at least 10 job cards and browsing works without a shim', async ({ page }) => {
    await page.goto('/careers/open-positions');

    const cards = page.getByTestId('job-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(10);

    const modelContextType = await page.evaluate(() => typeof (document as { modelContext?: unknown }).modelContext);
    expect(modelContextType).toBe('undefined');
  });

  test('clicking a job card opens the normal job detail page', async ({ page }) => {
    await page.goto('/careers/open-positions');
    const firstCard = page.getByTestId('job-card').first();
    const jobId = await firstCard.getAttribute('data-job-id');
    await firstCard.getByRole('link').first().click();

    await expect(page).toHaveURL(new RegExp(`/careers/countries/[^/]+/jobs/${jobId}`));
    await expect(page.getByTestId('job-title')).toBeVisible();
  });
});
