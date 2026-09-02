import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jobsModule, applicationsModule, resetApplicationsFixture, type FakeApplication } from './fixtures';
import { DEMO_CANDIDATE } from '@/domain/session/session.store';

vi.mock('@/domain/jobs', () => jobsModule);
vi.mock('@/domain/applications', () => applicationsModule);

import { getContext } from '@/webmcp/context';
import { useSessionStore } from '@/domain/session/session.store';
import { useUiContextStore } from '@/domain/ui-context/ui-context.store';

function resetStores() {
  useSessionStore.setState({ status: 'ready', candidate: null });
  useUiContextStore.setState({
    pathname: '/',
    searchParams: {},
    currentJobId: null,
    currentApplicationId: null,
  });
  resetApplicationsFixture();
}

describe('careers_get_context', () => {
  beforeEach(() => {
    resetStores();
  });

  it('reports signed-out session', async () => {
    const ctx = await getContext();
    expect(ctx.session).toEqual({ signedIn: false, candidate: null });
  });

  it('reports signed-in session with only id + displayName (no email)', async () => {
    useSessionStore.setState({ status: 'ready', candidate: DEMO_CANDIDATE });
    const ctx = await getContext();
    expect(ctx.session).toEqual({
      signedIn: true,
      candidate: { id: DEMO_CANDIDATE.id, displayName: DEMO_CANDIDATE.displayName },
    });
    expect(JSON.stringify(ctx)).not.toMatch(/@/); // no email leaked anywhere in context
  });

  it('classifies the jobs index page', async () => {
    useUiContextStore.setState({ pathname: '/careers/open-positions', searchParams: {} });
    const ctx = await getContext();
    expect(ctx.page.kind).toBe('jobs_index');
    expect(ctx.currentJob).toBeNull();
  });

  it('reports current job on a job detail page via the bridge-published currentJobId', async () => {
    useUiContextStore.setState({
      pathname: '/careers/countries/united-states/jobs/job_staff_platform',
      searchParams: {},
      currentJobId: 'job_staff_platform',
    });
    const ctx = await getContext();
    expect(ctx.page.kind).toBe('job_detail');
    expect(ctx.currentJob).toEqual({ id: 'job_staff_platform', title: 'Staff Platform Engineer' });
  });

  it('falls back to parsing the job id from the pathname if currentJobId is not yet published', async () => {
    useUiContextStore.setState({
      pathname: '/careers/countries/united-states/jobs/job_senior_backend',
      searchParams: {},
      currentJobId: null,
    });
    const ctx = await getContext();
    expect(ctx.currentJob).toEqual({ id: 'job_senior_backend', title: 'Senior Backend Engineer' });
  });

  it('reports the current application when on the application route and signed in', async () => {
    useSessionStore.setState({ status: 'ready', candidate: DEMO_CANDIDATE });
    const draft = applicationsModule.startApplication(DEMO_CANDIDATE, {
      id: 'job_staff_platform',
      title: 'Staff Platform Engineer',
      countrySlug: 'united-states',
    }) as FakeApplication;

    useUiContextStore.setState({
      pathname: '/careers/application/united-states',
      searchParams: { jobId: 'job_staff_platform' },
      currentApplicationId: draft.id,
    });

    const ctx = await getContext();
    expect(ctx.page.kind).toBe('application');
    expect(ctx.application).toEqual({
      id: draft.id,
      jobId: 'job_staff_platform',
      status: 'draft',
      revision: draft.revision,
    });
  });

  it('does not report another candidate application when signed out', async () => {
    const draft = applicationsModule.startApplication(DEMO_CANDIDATE, {
      id: 'job_staff_platform',
      title: 'Staff Platform Engineer',
      countrySlug: 'united-states',
    }) as FakeApplication;

    useUiContextStore.setState({
      pathname: '/careers/application/united-states',
      searchParams: { jobId: 'job_staff_platform' },
      currentApplicationId: draft.id,
    });

    const ctx = await getContext();
    expect(ctx.application).toBeNull();
  });
});
