import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobsModule, savedJobsModule, applicationsModule, resetSavedJobsFixture, resetApplicationsFixture } from './fixtures';
import { DEMO_CANDIDATE } from '@/domain/session/session.store';

vi.mock('@/domain/jobs', () => jobsModule);
vi.mock('@/domain/saved-jobs', () => savedJobsModule);
vi.mock('@/domain/applications', () => applicationsModule);

import { tools } from '@/webmcp/tools';
import { useSessionStore } from '@/domain/session/session.store';
import { useUiContextStore } from '@/domain/ui-context/ui-context.store';
import { setNavigator } from '@/webmcp/navigation';

function getTool(name: string) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`missing tool ${name}`);
  return tool;
}

async function call(name: string, input: Record<string, unknown> = {}) {
  const tool = getTool(name);
  const result = (await tool.execute(input, { signal: new AbortController().signal })) as {
    isError?: boolean;
    structuredContent: unknown;
  };
  return result;
}

function signOut() {
  useSessionStore.setState({ status: 'ready', candidate: null });
}

function signIn() {
  useSessionStore.setState({ status: 'ready', candidate: DEMO_CANDIDATE });
}

function resetRoute() {
  useUiContextStore.setState({ pathname: '/', searchParams: {}, currentJobId: null, currentApplicationId: null });
}

describe('careers webmcp tools', () => {
  const navigated: string[] = [];

  beforeEach(() => {
    signOut();
    resetRoute();
    resetSavedJobsFixture();
    resetApplicationsFixture();
    navigated.length = 0;
    setNavigator((path) => navigated.push(path));
  });

  describe('careers_search_jobs', () => {
    it('returns catalog matches', async () => {
      const result = await call('careers_search_jobs', { query: 'platform' });
      const data = result.structuredContent as { totalMatches: number };
      expect(data.totalMatches).toBeGreaterThan(0);
      expect(result.isError).toBeUndefined();
    });
  });

  describe('careers_get_job', () => {
    it('returns job details with application state for signed-out user', async () => {
      const result = await call('careers_get_job', { jobId: 'job_staff_platform' });
      const data = result.structuredContent as { id: string; application: { alreadyApplied: boolean; saved: boolean } };
      expect(data.id).toBe('job_staff_platform');
      expect(data.application).toEqual({ alreadyApplied: false, applicationId: null, status: null, saved: false });
    });

    it('returns JOB_NOT_FOUND for an unknown job id', async () => {
      const result = await call('careers_get_job', { jobId: 'nope' });
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('JOB_NOT_FOUND');
    });

    it('falls back to the current job from context when jobId omitted', async () => {
      useUiContextStore.setState({ currentJobId: 'job_senior_backend' });
      const result = await call('careers_get_job', {});
      expect((result.structuredContent as { id: string }).id).toBe('job_senior_backend');
    });
  });

  describe('careers_open_job', () => {
    it('navigates to the job url and returns a summary', async () => {
      const result = await call('careers_open_job', { jobId: 'job_staff_platform' });
      expect(navigated).toContain('/careers/countries/united-states/jobs/job_staff_platform');
      expect((result.structuredContent as { opened: boolean }).opened).toBe(true);
    });

    it('returns JOB_NOT_FOUND for a missing job', async () => {
      const result = await call('careers_open_job', { jobId: 'nope' });
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('JOB_NOT_FOUND');
    });
  });

  describe('auth-required tools when signed out', () => {
    const cases: [string, Record<string, unknown>][] = [
      ['careers_get_saved_jobs', {}],
      ['careers_set_saved_job', { jobId: 'job_staff_platform', saved: true }],
      ['careers_get_my_applications', {}],
      ['careers_start_application', { jobId: 'job_staff_platform' }],
      ['careers_update_application', { applicationId: 'app_1', expectedRevision: 1, fields: {} }],
    ];

    it.each(cases)('%s returns AUTH_REQUIRED', async (name, input) => {
      const result = await call(name, input);
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('AUTH_REQUIRED');
    });

    it('careers_get_application returns AUTH_REQUIRED', async () => {
      const result = await call('careers_get_application', {});
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('AUTH_REQUIRED');
    });

    it('careers_submit_application returns AUTH_REQUIRED', async () => {
      const result = await call('careers_submit_application', { applicationId: 'app_1', expectedRevision: 1 });
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('AUTH_REQUIRED');
    });
  });

  describe('saved jobs when signed in', () => {
    beforeEach(signIn);

    it('save then list then unsave', async () => {
      const saveResult = await call('careers_set_saved_job', { jobId: 'job_staff_platform', saved: true });
      expect((saveResult.structuredContent as { saved: boolean }).saved).toBe(true);

      const listResult = await call('careers_get_saved_jobs', {});
      const data = listResult.structuredContent as { savedJobs: { id: string }[] };
      expect(data.savedJobs.map((j) => j.id)).toContain('job_staff_platform');

      const unsaveResult = await call('careers_set_saved_job', { jobId: 'job_staff_platform', saved: false });
      expect((unsaveResult.structuredContent as { saved: boolean }).saved).toBe(false);
    });

    it('returns JOB_NOT_FOUND when saving an unknown job', async () => {
      const result = await call('careers_set_saved_job', { jobId: 'nope', saved: true });
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('JOB_NOT_FOUND');
    });
  });

  describe('applications when signed in', () => {
    beforeEach(signIn);

    it('starts an application, prefilled, navigates to the application page', async () => {
      const result = await call('careers_start_application', { jobId: 'job_staff_platform' });
      const data = result.structuredContent as { id: string; jobId: string; created: boolean; url: string };
      expect(data.jobId).toBe('job_staff_platform');
      expect(data.created).toBe(true);
      expect(navigated).toContain(data.url);
    });

    it('starting twice for the same job returns the same draft (idempotent)', async () => {
      const first = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
      };
      const second = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
        created: boolean;
      };
      expect(second.id).toBe(first.id);
      expect(second.created).toBe(false);
    });

    it('careers_get_application returns fields and missingRequiredFields', async () => {
      const started = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
      };
      const result = await call('careers_get_application', { applicationId: started.id });
      const data = result.structuredContent as { fields: Record<string, unknown>; missingRequiredFields: string[] };
      expect(data.fields.fullName).toBe(DEMO_CANDIDATE.profile.fullName);
      expect(data.missingRequiredFields).toContain('phone');
    });

    it('careers_update_application updates only supplied fields and bumps revision', async () => {
      const started = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
        revision: number;
      };
      const result = await call('careers_update_application', {
        applicationId: started.id,
        expectedRevision: started.revision,
        fields: { phone: '+1 555 0100' },
      });
      const data = result.structuredContent as { revision: number; fields: { phone: string; fullName: string } };
      expect(data.revision).toBe(started.revision + 1);
      expect(data.fields.phone).toBe('+1 555 0100');
      expect(data.fields.fullName).toBe(DEMO_CANDIDATE.profile.fullName); // unrelated fields preserved
    });

    it('careers_update_application with a stale revision returns STALE_APPLICATION with both revisions', async () => {
      const started = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
        revision: number;
      };
      await call('careers_update_application', {
        applicationId: started.id,
        expectedRevision: started.revision,
        fields: { phone: '+1 555 0100' },
      });
      const stale = await call('careers_update_application', {
        applicationId: started.id,
        expectedRevision: started.revision, // now stale
        fields: { coverNote: 'hi' },
      });
      expect(stale.isError).toBe(true);
      const err = stale.structuredContent as { error: string; expectedRevision: number; currentRevision: number };
      expect(err.error).toBe('STALE_APPLICATION');
      expect(err.expectedRevision).toBe(started.revision);
      expect(err.currentRevision).toBe(started.revision + 1);
    });

    it('careers_update_application rejects unknown fields with VALIDATION_ERROR', async () => {
      const started = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
        revision: number;
      };
      const result = await call('careers_update_application', {
        applicationId: started.id,
        expectedRevision: started.revision,
        fields: { ssn: '123-45-6789' },
      });
      expect(result.isError).toBe(true);
      expect((result.structuredContent as { error: string }).error).toBe('VALIDATION_ERROR');
    });

    it('careers_submit_application requires the required fields and then succeeds once filled', async () => {
      const started = (await call('careers_start_application', { jobId: 'job_staff_platform' })).structuredContent as {
        id: string;
        revision: number;
      };
      const incomplete = await call('careers_submit_application', {
        applicationId: started.id,
        expectedRevision: started.revision,
      });
      expect(incomplete.isError).toBe(true);
      expect((incomplete.structuredContent as { error: string }).error).toBe('VALIDATION_ERROR');

      const updated = (await call('careers_update_application', {
        applicationId: started.id,
        expectedRevision: started.revision,
        fields: { phone: '+1 555 0100', availability: '2 weeks notice' },
      })).structuredContent as { revision: number };

      const submitted = await call('careers_submit_application', {
        applicationId: started.id,
        expectedRevision: updated.revision,
      });
      expect(submitted.isError).toBeUndefined();
      const data = submitted.structuredContent as { status: string };
      expect(data.status).toBe('submitted');
    });
  });

  describe('security: no secrets ever leak', () => {
    it('a full signed-in session produces no email/token/password/secret strings anywhere in tool output', async () => {
      signIn();
      await call('careers_start_application', { jobId: 'job_staff_platform' });
      const context = await call('careers_get_context', {});
      const savedJobs = await call('careers_get_saved_jobs', {});
      const myApps = await call('careers_get_my_applications', {});

      const blob = JSON.stringify([context, savedJobs, myApps]);
      expect(blob).not.toMatch(/password|token|jwt|cookie|secret|apiKey|AIza/i);
      expect(blob).not.toMatch(new RegExp(DEMO_CANDIDATE.email.replace('.', '\\.'), 'i'));
    });
  });
});
