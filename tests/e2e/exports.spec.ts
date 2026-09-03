import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool } from './helpers';

test.describe('exports', () => {
  test('agent gets a handle and reads it in slices; the human gets the same file', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const created = await callTool<{
      exportId: string;
      rowCount: number;
      columns: string[];
      downloadUrl: string;
      preview: Record<string, string>[];
      rows?: unknown;
    }>(page, 'careers_create_export', { dataset: 'jobs' });

    expect(created.rowCount).toBeGreaterThanOrEqual(20);
    expect(created.rows).toBeUndefined();
    expect(created.preview.length).toBeLessThanOrEqual(3);

    // Slice it the way an agent scanning for compensation would.
    const slice = await callTool<{ returnedRows: number; hasMore: boolean; columns: string[] }>(
      page,
      'careers_read_export',
      { exportId: created.exportId, offset: 0, limit: 5, columns: ['title', 'compensationMax'] },
    );
    expect(slice.returnedRows).toBe(5);
    expect(slice.columns).toEqual(['title', 'compensationMax']);
    expect(slice.hasMore).toBe(true);

    // The human is offered the same export, and the page renders it.
    await expect(page.getByTestId('agent-export-offer')).toBeVisible();
    await page.getByTestId('agent-export-offer').click();
    await expect(page).toHaveURL(new RegExp(`/careers/exports/${created.exportId}`));
    await expect(page.getByTestId('export-row-count')).toHaveText(String(created.rowCount));
  });

  test('a human can export the current results with no agent involved', async ({ page }) => {
    await page.goto('/careers/open-positions');
    await expect(page.getByTestId('job-card').first()).toBeVisible();

    const download = page.waitForEvent('download');
    await page.getByTestId('export-results').click();
    const file = await download;
    expect(file.suggestedFilename()).toMatch(/^northwind-jobs-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  test('an unknown export id shows a normal not-found page', async ({ page }) => {
    await page.goto('/careers/exports/exp_missing');
    await expect(page.getByText('Export not found')).toBeVisible();
  });
});
