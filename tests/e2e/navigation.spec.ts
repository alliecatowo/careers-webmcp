import { test, expect } from '@playwright/test';
import { installWebMCPShim, callTool } from './helpers';

interface Destination {
  id: string;
  label: string;
  requiresAuth: boolean;
  available: boolean;
}

test.describe('site navigation from anywhere', () => {
  test('an agent landing on the home page can see the whole site and reach the job board', async ({ page }) => {
    await installWebMCPShim(page);
    // Deliberately NOT the careers board — the agent starts where the user is.
    await page.goto('/');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const context = await callTool<{
      page: { kind: string };
      destinations: Destination[];
    }>(page, 'careers_get_context');
    const ids = context.destinations.map((d) => d.id);
    expect(ids).toContain('jobs');
    expect(ids).toContain('hiring_process');

    // Signed out: candidate destinations are advertised but not available.
    const saved = context.destinations.find((d) => d.id === 'saved_jobs');
    expect(saved?.requiresAuth).toBe(true);
    expect(saved?.available).toBe(false);

    // The agent can search without the human ever having seen the board.
    const results = await callTool<{ totalMatches: number }>(page, 'careers_search_jobs', {
      departments: ['Engineering'],
    });
    expect(results.totalMatches).toBeGreaterThan(0);

    const opened = await callTool<{ opened: boolean }>(page, 'careers_open_page', { page: 'jobs' });
    expect(opened.opened).toBe(true);
    await expect(page).toHaveURL(/\/careers\/open-positions/);
  });

  test('candidate destinations require a session, like every other candidate tool', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const result = await callTool<{ error?: string }>(page, 'careers_open_page', { page: 'saved_jobs' });
    expect(result.error).toBe('AUTH_REQUIRED');
  });

  test('an unknown page is refused with the list the site actually knows', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const result = await callTool<{ error?: string; known?: string[] }>(page, 'careers_open_page', {
      page: 'careers_blog',
    });
    expect(result.error).toBe('VALIDATION_ERROR');
    expect(result.known).toContain('jobs');
  });

  test('the hiring process the agent reads is the one the page renders', async ({ page }) => {
    await installWebMCPShim(page);
    await page.goto('/careers/open-positions');
    await page.waitForFunction(() => Boolean((window as unknown as { __webmcp?: unknown }).__webmcp));

    const info = await callTool<{ hiring_process: { steps: { name: string }[] } }>(
      page,
      'careers_get_site_info',
      { topic: 'hiring_process' },
    );
    const names = info.hiring_process.steps.map((s) => s.name);
    expect(names).toEqual(['Apply', 'Interview', 'Assessment', 'Offer']);

    await callTool(page, 'careers_open_page', { page: 'hiring_process' });
    await expect(page).toHaveURL(/\/careers\/hiring-process/);
    // The same four steps are on screen for the human — one source, two consumers.
    for (const name of names) {
      await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
    }
  });
});
