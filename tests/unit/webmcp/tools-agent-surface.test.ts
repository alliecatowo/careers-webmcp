/**
 * Unit tests for the tools added for the agent-visible surface:
 * account creation, exports, field focus and the visible search view.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobsModule, savedJobsModule, applicationsModule, resetApplicationsFixture } from './fixtures';
import { DEMO_CANDIDATE } from '@/domain/session/session.store';

vi.mock('@/domain/jobs', () => jobsModule);
vi.mock('@/domain/saved-jobs', () => savedJobsModule);
vi.mock('@/domain/applications', () => applicationsModule);

import { tools } from '@/webmcp/tools';
import { useSessionStore } from '@/domain/session/session.store';
import { useUiContextStore } from '@/domain/ui-context/ui-context.store';
import { setNavigator } from '@/webmcp/navigation';
import { clearSignUpDraft, getSignUpFields } from '@/domain/session/signup.store';
import { clearExports } from '@/domain/exports';
import { usePresenceStore, resetPresence } from '@/webmcp/presence';

function getTool(name: string) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`missing tool ${name}`);
  return tool;
}

async function call(name: string, input: Record<string, unknown> = {}) {
  return (await getTool(name).execute(input, { signal: new AbortController().signal })) as {
    isError?: boolean;
    structuredContent: any;
  };
}

const navigated: string[] = [];

beforeEach(() => {
  useSessionStore.setState({ status: 'ready', candidate: null });
  useUiContextStore.setState({ pathname: '/', searchParams: {}, currentJobId: null, currentApplicationId: null });
  resetApplicationsFixture();
  clearSignUpDraft();
  clearExports();
  resetPresence();
  navigated.length = 0;
  setNavigator((path) => navigated.push(path));
});

function signIn() {
  useSessionStore.setState({ status: 'ready', candidate: DEMO_CANDIDATE });
}

describe('careers_create_account', () => {
  it('stages the sign-up form and hands off without creating a session', async () => {
    const result = await call('careers_create_account', {
      fullName: 'Sam Rivera',
      email: 'sam.rivera@example.test',
      location: 'Austin, TX',
    });

    expect(result.isError).toBeUndefined();
    expect(result.structuredContent.status).toBe('awaiting_human_confirmation');
    expect(result.structuredContent.readyToConfirm).toBe(true);
    // The critical assertion: no session appeared.
    expect(useSessionStore.getState().candidate).toBeNull();
  });

  it('fills the same draft the human sign-up form is bound to, and opens it', async () => {
    await call('careers_create_account', { fullName: 'Sam Rivera', email: 'sam.rivera@example.test' });
    expect(getSignUpFields().fullName).toBe('Sam Rivera');
    expect(navigated).toContain('/careers/signup');
  });

  it('reports what is still missing rather than inventing it', async () => {
    const result = await call('careers_create_account', { fullName: 'Sam Rivera', email: 'nope' });
    expect(result.structuredContent.readyToConfirm).toBe(false);
    expect(result.structuredContent.invalidFields.map((f: { field: string }) => f.field)).toContain('email');
  });

  it('requires a name and an email', async () => {
    const result = await call('careers_create_account', { fullName: 'Sam Rivera' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
  });

  it('rejects an unknown field instead of silently dropping it', async () => {
    const result = await call('careers_create_account', {
      fullName: 'Sam Rivera',
      email: 'sam@example.test',
      salaryExpectation: '400000',
    });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
  });

  it('does nothing when someone is already signed in', async () => {
    signIn();
    const result = await call('careers_create_account', { fullName: 'Sam Rivera', email: 'sam@example.test' });
    expect(result.structuredContent.alreadySignedIn).toBe(true);
    expect(useSessionStore.getState().candidate?.id).toBe(DEMO_CANDIDATE.id);
    expect(navigated).toHaveLength(0);
  });

  it('leaves no secret in the staged result', async () => {
    await call('careers_create_account', { fullName: 'Sam Rivera', email: 'sam@example.test' });
    const result = await call('careers_get_context', {});
    expect(JSON.stringify(result)).not.toMatch(/password|token|jwt|cookie|secret/i);
  });
});

describe('careers_create_export', () => {
  it('returns a handle and a preview, never the full row set', async () => {
    const result = await call('careers_create_export', { dataset: 'jobs' });
    const data = result.structuredContent;

    expect(data.exportId).toMatch(/^exp_\d+$/);
    expect(data.rowCount).toBeGreaterThan(0);
    expect(data.columns).toContain('title');
    expect(data.downloadUrl).toBe(`/careers/exports/${data.exportId}`);
    // The point of the handle: rows are not inlined.
    expect(data.rows).toBeUndefined();
    expect(data.preview.length).toBeLessThanOrEqual(3);
  });

  it('offers the export to the human as a download', async () => {
    const result = await call('careers_create_export', {});
    expect(usePresenceStore.getState().offeredExportId).toBe(result.structuredContent.exportId);
  });

  it('narrows the export to the requested columns', async () => {
    const result = await call('careers_create_export', { columns: ['id', 'title'] });
    expect(result.structuredContent.columns).toEqual(['id', 'title']);
    expect(Object.keys(result.structuredContent.preview[0])).toEqual(['id', 'title']);
  });

  it('applies search filters to a jobs export', async () => {
    const all = await call('careers_create_export', {});
    const filtered = await call('careers_create_export', { query: { query: 'Staff Platform' } });
    expect(filtered.structuredContent.rowCount).toBeLessThan(all.structuredContent.rowCount);
  });

  it('requires a session for an applications export', async () => {
    const result = await call('careers_create_export', { dataset: 'applications' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('AUTH_REQUIRED');
  });

  it('exports the signed-in candidate own applications', async () => {
    signIn();
    await call('careers_start_application', { jobId: 'job_staff_platform' });
    const result = await call('careers_create_export', { dataset: 'applications' });
    expect(result.structuredContent.rowCount).toBe(1);
    expect(result.structuredContent.columns).toContain('jobTitle');
  });

  it('rejects an unknown dataset', async () => {
    const result = await call('careers_create_export', { dataset: 'salaries' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
  });
});

describe('careers_read_export', () => {
  it('reads a bounded slice and reports whether more remain', async () => {
    const created = await call('careers_create_export', {});
    const total = created.structuredContent.rowCount;

    const first = await call('careers_read_export', { exportId: created.structuredContent.exportId, limit: 1 });
    expect(first.structuredContent.returnedRows).toBe(1);
    expect(first.structuredContent.rowCount).toBe(total);
    expect(first.structuredContent.hasMore).toBe(total > 1);
  });

  it('projects only the requested columns', async () => {
    const created = await call('careers_create_export', {});
    const slice = await call('careers_read_export', {
      exportId: created.structuredContent.exportId,
      columns: ['title', 'compensationMax'],
    });
    expect(slice.structuredContent.columns).toEqual(['title', 'compensationMax']);
  });

  it('returns EXPORT_NOT_FOUND for an unknown id', async () => {
    const result = await call('careers_read_export', { exportId: 'exp_nope' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('EXPORT_NOT_FOUND');
  });

  it('will not serve one candidate applications export to another session', async () => {
    signIn();
    await call('careers_start_application', { jobId: 'job_staff_platform' });
    const created = await call('careers_create_export', { dataset: 'applications' });

    useSessionStore.setState({ status: 'ready', candidate: null });
    const result = await call('careers_read_export', { exportId: created.structuredContent.exportId });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('AUTH_REQUIRED');
  });

  it('rejects a limit above the read maximum', async () => {
    const created = await call('careers_create_export', {});
    const result = await call('careers_read_export', { exportId: created.structuredContent.exportId, limit: 10_000 });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
  });
});

describe('careers_focus_application_field', () => {
  it('opens the application and asks the page to focus the field', async () => {
    signIn();
    const started = await call('careers_start_application', { jobId: 'job_staff_platform' });

    const result = await call('careers_focus_application_field', {
      applicationId: started.structuredContent.id,
      field: 'phone',
    });

    expect(result.structuredContent.focused).toBe(true);
    expect(usePresenceStore.getState().focusRequest?.key).toBe('phone');
    expect(navigated.at(-1)).toContain('/careers/application/');
  });

  it('rejects a field the form does not have', async () => {
    signIn();
    const started = await call('careers_start_application', { jobId: 'job_staff_platform' });
    const result = await call('careers_focus_application_field', {
      applicationId: started.structuredContent.id,
      field: 'salaryExpectation',
    });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
  });

  it('requires a session', async () => {
    const result = await call('careers_focus_application_field', { field: 'phone' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('AUTH_REQUIRED');
  });
});

describe('careers_set_search_view', () => {
  it('navigates to the jobs page and reports the applied view', async () => {
    const result = await call('careers_set_search_view', { query: 'platform', workplace: 'Remote' });

    expect(result.isError).toBeUndefined();
    expect(result.structuredContent.applied).toBe(true);
    expect(result.structuredContent.view.query).toBe('platform');
    expect(result.structuredContent.view.workplace).toBe('Remote');
    expect(navigated[0]).toContain('/careers/open-positions');
    expect(navigated.at(-1)).toContain('q=platform');
  });

  it('resolves a department name to the id the visible filter uses', async () => {
    const result = await call('careers_set_search_view', { department: 'Engineering' });
    expect(result.structuredContent.view.department).toBe('Engineering');
    expect(navigated[0]).toMatch(/departmentId=/);
  });

  it('rejects an unknown department and says what it knows', async () => {
    const result = await call('careers_set_search_view', { department: 'Wizardry' });
    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toBe('VALIDATION_ERROR');
    expect(result.structuredContent.known).toContain('Engineering');
  });

  it('clears the typing state once the animation finishes', async () => {
    await call('careers_set_search_view', { query: 'ai' });
    // Typing is released shortly after commit; the tool result never waits on it.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(usePresenceStore.getState().typing).toBeNull();
  });

  it('works with no arguments at all, showing the unfiltered board', async () => {
    const result = await call('careers_set_search_view', {});
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent.view.query).toBeNull();
  });
});
