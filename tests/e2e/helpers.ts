import type { Page } from '@playwright/test';
import { serializeShimForBrowser } from '../webmcp-shim';

/** Install the test-only WebMCP shim before any page script runs. */
export async function installWebMCPShim(page: Page): Promise<void> {
  await page.addInitScript(serializeShimForBrowser());
}

/** Call a registered WebMCP tool from the page and return its parsed JSON result. */
export async function callTool<T = unknown>(page: Page, name: string, input: Record<string, unknown> = {}): Promise<T> {
  return page.evaluate(
    ([n, i]) => (window as unknown as { __webmcp: { call: (n: string, i: unknown) => Promise<unknown> } }).__webmcp.call(n, i),
    [name, input] as const,
  ) as Promise<T>;
}

/** List currently registered tool names from the page. */
export async function listTools(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __webmcp: { tools: () => string[] } }).__webmcp.tools());
}

export const DEMO_JOBS = {
  staffPlatform: 'job_staff_platform',
  staffAiInfra: 'job_staff_ai_infra',
  principalReliability: 'job_principal_reliability',
  seniorStaffPlatform: 'job_senior_staff_platform',
  seniorBackend: 'job_senior_backend',
} as const;

export function jobDetailUrl(jobId: string, countrySlug = 'united-states'): string {
  return `/careers/countries/${countrySlug}/jobs/${jobId}`;
}

export function applicationUrl(jobId: string, countrySlug = 'united-states'): string {
  return `/careers/application/${countrySlug}?jobId=${jobId}`;
}

export async function signInAsDemoCandidate(page: Page): Promise<void> {
  const signIn = page.getByTestId('demo-sign-in').first();
  if (await signIn.isVisible().catch(() => false)) {
    await signIn.click();
  }
}
