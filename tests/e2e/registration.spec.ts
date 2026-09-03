import { test, expect } from '@playwright/test';
import { installWebMCPShim, listTools } from './helpers';

const EXPECTED_TOOLS = [
  'careers_get_context',
  'careers_search_jobs',
  'careers_get_job',
  'careers_open_job',
  'careers_get_saved_jobs',
  'careers_set_saved_job',
  'careers_get_my_applications',
  'careers_get_application',
  'careers_start_application',
  'careers_update_application',
  'careers_submit_application',
  'careers_set_search_view',
  'careers_focus_application_field',
  'careers_create_account',
  'careers_create_export',
  'careers_read_export',
];

test.describe('WebMCP tool registration', () => {
  test('registers all 16 tools exactly once on initial load', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const names = await listTools(page);
    expect(names.sort()).toEqual([...EXPECTED_TOOLS].sort());
    expect(new Set(names).size).toBe(names.length);
  });

  test('tool set stays stable (not re-registered) after a client-side navigation', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const firstCard = page.getByTestId('job-card').first();
    await firstCard.getByRole('link').first().click();
    await expect(page.getByTestId('job-title')).toBeVisible();

    const names = await listTools(page);
    expect(names.sort()).toEqual([...EXPECTED_TOOLS].sort());
  });
});
