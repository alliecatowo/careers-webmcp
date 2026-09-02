import { beforeEach, describe, expect, it } from 'vitest';
import {
  ApplicationError,
  applicationUrl,
  findApplicationByJob,
  getApplication,
  listApplications,
  startApplication,
  submitApplication,
  updateApplication,
  useApplicationsStore,
  validateApplicationFields,
} from '@/domain/applications';
import type { CandidateSession } from '@/domain/session/session.store';

const candidate: CandidateSession = {
  id: 'candidate-1',
  displayName: 'Avery Chen',
  email: 'avery@example.test',
  profile: {
    fullName: 'Avery Chen',
    email: 'avery@example.test',
    phone: '',
    location: 'Oakland, CA',
    linkedinUrl: 'https://www.linkedin.com/in/avery-chen-demo',
    portfolioUrl: '',
    yearsExperience: 7,
  },
};

const otherCandidate: CandidateSession = {
  ...candidate,
  id: 'candidate-2',
};

const job = { id: 'job-1', title: 'Staff Platform Engineer', countrySlug: 'us' };

function seedValidDraft() {
  const draft = startApplication(candidate, job);
  return updateApplication(candidate.id, draft.id, null, {
    phone: '5105551234',
    availability: 'Available in 2 weeks',
  });
}

describe('applications store', () => {
  beforeEach(() => {
    useApplicationsStore.setState({ applications: {}, nextId: 1 });
  });

  it('prefills fields from the candidate profile on start', () => {
    const draft = startApplication(candidate, job);
    expect(draft.status).toBe('draft');
    expect(draft.revision).toBe(1);
    expect(draft.fields.fullName).toBe('Avery Chen');
    expect(draft.fields.location).toBe('Oakland, CA');
    expect(draft.fields.yearsExperience).toBe(7);
    expect(draft.fields.coverNote).toBe('');
  });

  it('is idempotent: starting twice for the same job returns the same application', () => {
    const first = startApplication(candidate, job);
    const second = startApplication(candidate, job);
    expect(second.id).toBe(first.id);
    expect(Object.keys(useApplicationsStore.getState().applications)).toHaveLength(1);
  });

  it('findApplicationByJob finds the draft by candidate + job', () => {
    const draft = startApplication(candidate, job);
    expect(findApplicationByJob(candidate.id, job.id)?.id).toBe(draft.id);
    expect(findApplicationByJob(otherCandidate.id, job.id)).toBeNull();
  });

  it('getApplication only returns the owning candidate application', () => {
    const draft = startApplication(candidate, job);
    expect(getApplication(candidate.id, draft.id)?.id).toBe(draft.id);
    expect(getApplication(otherCandidate.id, draft.id)).toBeNull();
    expect(getApplication(candidate.id, 'app_missing')).toBeNull();
  });

  it('partial update keeps other fields untouched', () => {
    const draft = startApplication(candidate, job);
    const updated = updateApplication(candidate.id, draft.id, draft.revision, {
      phone: '5105551234',
    });
    expect(updated.fields.phone).toBe('5105551234');
    expect(updated.fields.fullName).toBe(draft.fields.fullName);
    expect(updated.fields.location).toBe(draft.fields.location);
  });

  it('bumps revision on a real change', () => {
    const draft = startApplication(candidate, job);
    const updated = updateApplication(candidate.id, draft.id, draft.revision, {
      phone: '5105551234',
    });
    expect(updated.revision).toBe(draft.revision + 1);
  });

  it('does not bump revision on a no-op update', () => {
    const draft = startApplication(candidate, job);
    const updated = updateApplication(candidate.id, draft.id, draft.revision, {
      fullName: draft.fields.fullName,
    });
    expect(updated.revision).toBe(draft.revision);
  });

  it('rejects stale updates with expectedRevision/currentRevision', () => {
    const draft = startApplication(candidate, job);
    updateApplication(candidate.id, draft.id, draft.revision, { phone: '5105551234' });

    try {
      updateApplication(candidate.id, draft.id, draft.revision, { location: 'Denver, CO' });
      throw new Error('expected STALE_APPLICATION');
    } catch (err) {
      expect(err).toBeInstanceOf(ApplicationError);
      const appErr = err as ApplicationError;
      expect(appErr.code).toBe('STALE_APPLICATION');
      expect(appErr.details.expectedRevision).toBe(draft.revision);
      expect(appErr.details.currentRevision).toBe(draft.revision + 1);
    }
  });

  it('rejects invalid field values with VALIDATION_ERROR per field', () => {
    const draft = startApplication(candidate, job);
    try {
      updateApplication(candidate.id, draft.id, draft.revision, { email: 'not-an-email' });
      throw new Error('expected VALIDATION_ERROR');
    } catch (err) {
      expect(err).toBeInstanceOf(ApplicationError);
      const appErr = err as ApplicationError;
      expect(appErr.code).toBe('VALIDATION_ERROR');
      expect(appErr.details.errors).toHaveProperty('email');
    }
  });

  it('submit fails validation and lists missing required fields', () => {
    const draft = startApplication(candidate, job); // phone + availability still blank
    try {
      submitApplication(candidate.id, draft.id, draft.revision);
      throw new Error('expected VALIDATION_ERROR');
    } catch (err) {
      expect(err).toBeInstanceOf(ApplicationError);
      const appErr = err as ApplicationError;
      expect(appErr.code).toBe('VALIDATION_ERROR');
      expect(appErr.details.missingRequiredFields).toEqual(
        expect.arrayContaining(['phone', 'availability']),
      );
    }
  });

  it('submit succeeds and sets status/submittedAt', () => {
    const draft = seedValidDraft();
    const submitted = submitApplication(candidate.id, draft.id, draft.revision);
    expect(submitted.status).toBe('submitted');
    expect(submitted.submittedAt).not.toBeNull();
    expect(submitted.revision).toBe(draft.revision + 1);
  });

  it('cannot update or submit an already-submitted application', () => {
    const draft = seedValidDraft();
    const submitted = submitApplication(candidate.id, draft.id, draft.revision);

    let updateErr: unknown;
    try {
      updateApplication(candidate.id, submitted.id, submitted.revision, { phone: '5105559999' });
    } catch (err) {
      updateErr = err;
    }
    expect(updateErr).toBeInstanceOf(ApplicationError);
    expect((updateErr as ApplicationError).code).toBe('APPLICATION_ALREADY_SUBMITTED');

    let submitErr: unknown;
    try {
      submitApplication(candidate.id, submitted.id, submitted.revision);
    } catch (err) {
      submitErr = err;
    }
    expect(submitErr).toBeInstanceOf(ApplicationError);
    expect((submitErr as ApplicationError).code).toBe('APPLICATION_ALREADY_SUBMITTED');
  });

  it('validateApplicationFields reports missing required fields regardless of other errors', () => {
    const draft = startApplication(candidate, job);
    const result = validateApplicationFields(draft.fields);
    expect(result.valid).toBe(false);
    expect(result.missingRequiredFields).toEqual(expect.arrayContaining(['phone', 'availability']));
  });

  it('applicationUrl matches the human application route format', () => {
    const draft = startApplication(candidate, job);
    expect(applicationUrl(draft)).toBe(`/careers/application/us?jobId=${job.id}`);
  });

  it('listApplications returns only the candidate own applications, newest updated first', () => {
    const draftA = startApplication(candidate, { id: 'job-a', title: 'A', countrySlug: 'us' });
    const draftB = startApplication(candidate, { id: 'job-b', title: 'B', countrySlug: 'us' });
    startApplication(otherCandidate, { id: 'job-c', title: 'C', countrySlug: 'us' });

    updateApplication(candidate.id, draftA.id, draftA.revision, { phone: '5105551234' });

    const list = listApplications(candidate.id);
    expect(list.map((d) => d.id).sort()).toEqual([draftA.id, draftB.id].sort());
    expect(list[0].id).toBe(draftA.id);
  });
});
