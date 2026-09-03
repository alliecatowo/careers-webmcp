import { describe, it, expect, beforeEach } from 'vitest';
import {
  createExport,
  getExport,
  readExport,
  clearExports,
  toCsv,
  exportFilename,
  jobsToRows,
  JOB_EXPORT_COLUMNS,
  applicationsToRows,
  EXPORT_MAX_ROWS,
  EXPORT_READ_MAX,
} from '@/domain/exports';
import type { CareersJob } from '@/domain/jobs';
import type { ApplicationDraft } from '@/domain/applications';

function makeRows(count: number): Record<string, string>[] {
  return Array.from({ length: count }, (_, i) => ({ id: `row_${i}`, title: `Title ${i}`, level: 'Staff' }));
}

describe('CSV serialization', () => {
  it('writes a header row followed by the data rows', () => {
    const csv = toCsv(['a', 'b'], [{ a: '1', b: '2' }]);
    expect(csv).toBe('a,b\r\n1,2');
  });

  it('quotes cells containing commas, quotes or newlines', () => {
    const csv = toCsv(['note'], [{ note: 'Hello, "world"\nagain' }]);
    expect(csv).toBe('note\r\n"Hello, ""world""\nagain"');
  });

  it('emits an empty cell for a column a row is missing', () => {
    expect(toCsv(['a', 'b'], [{ a: '1' }])).toBe('a,b\r\n1,');
  });

  it('names the file after the dataset and creation date', () => {
    expect(exportFilename({ dataset: 'jobs', format: 'csv', createdAt: '2026-09-02T10:00:00.000Z' })).toBe(
      'northwind-jobs-2026-09-02.csv',
    );
  });
});

describe('export registry', () => {
  beforeEach(() => clearExports());

  it('stores an export and hands back a retrievable id', () => {
    const record = createExport({
      dataset: 'jobs',
      format: 'csv',
      columns: ['id', 'title'],
      rows: makeRows(3),
      label: 'Search results',
      candidateId: null,
    });
    expect(record.id).toMatch(/^exp_\d+$/);
    expect(getExport(record.id)?.rows).toHaveLength(3);
  });

  it('caps stored rows so an export cannot grow without bound', () => {
    const record = createExport({
      dataset: 'jobs',
      format: 'csv',
      columns: ['id'],
      rows: makeRows(EXPORT_MAX_ROWS + 50),
      label: 'All open positions',
      candidateId: null,
    });
    expect(record.rows).toHaveLength(EXPORT_MAX_ROWS);
  });

  it('returns null for an unknown export id', () => {
    expect(getExport('exp_nope')).toBeNull();
    expect(readExport('exp_nope')).toBeNull();
  });
});

describe('readExport', () => {
  beforeEach(() => clearExports());

  function seed(count = 25) {
    return createExport({
      dataset: 'jobs',
      format: 'csv',
      columns: ['id', 'title', 'level'],
      rows: makeRows(count),
      label: 'Search results',
      candidateId: null,
    });
  }

  it('returns a window of rows and reports whether more remain', () => {
    const record = seed();
    const slice = readExport(record.id, { offset: 0, limit: 10 })!;
    expect(slice.returnedRows).toBe(10);
    expect(slice.rowCount).toBe(25);
    expect(slice.hasMore).toBe(true);
    expect(slice.rows[0].id).toBe('row_0');
  });

  it('walks to the end of the export across successive offsets', () => {
    const record = seed();
    const last = readExport(record.id, { offset: 20, limit: 10 })!;
    expect(last.returnedRows).toBe(5);
    expect(last.hasMore).toBe(false);
    expect(last.rows[4].id).toBe('row_24');
  });

  it('projects only the requested columns', () => {
    const record = seed(2);
    const slice = readExport(record.id, { columns: ['id'] })!;
    expect(slice.columns).toEqual(['id']);
    expect(Object.keys(slice.rows[0])).toEqual(['id']);
  });

  it('ignores unknown column names rather than erroring', () => {
    const record = seed(2);
    const slice = readExport(record.id, { columns: ['id', 'salary_in_gold'] })!;
    expect(slice.columns).toEqual(['id']);
  });

  it('falls back to every column when the projection matches nothing', () => {
    const record = seed(2);
    const slice = readExport(record.id, { columns: ['nope'] })!;
    expect(slice.columns).toEqual(['id', 'title', 'level']);
  });

  it('clamps the limit to the read maximum', () => {
    const record = seed(EXPORT_READ_MAX + 20);
    const slice = readExport(record.id, { limit: 5000 })!;
    expect(slice.returnedRows).toBe(EXPORT_READ_MAX);
  });

  it('clamps a negative offset to the start', () => {
    const record = seed(3);
    expect(readExport(record.id, { offset: -10 })!.rows[0].id).toBe('row_0');
  });

  it('returns an empty slice past the end without erroring', () => {
    const record = seed(3);
    const slice = readExport(record.id, { offset: 99 })!;
    expect(slice.returnedRows).toBe(0);
    expect(slice.hasMore).toBe(false);
  });
});

describe('row builders', () => {
  it('flattens a job into the documented export columns', () => {
    const job = {
      id: 'job_x',
      slug: 'x',
      title: 'Staff Platform Engineer',
      department: 'Engineering',
      departmentId: 'dept_eng_it',
      team: 'Infrastructure',
      level: 'Staff',
      location: 'San Francisco',
      countrySlug: 'united-states',
      workplace: 'Hybrid',
      employmentType: 'Full-time',
      compensation: { min: 230000, max: 285000, currency: 'USD' },
      skills: ['TypeScript', 'Kubernetes'],
      summary: 's',
      description: 'd',
      responsibilities: [],
      requirements: [],
      postedAt: '2026-08-14T09:00:00.000Z',
      url: '/careers/countries/united-states/jobs/job_x',
    } as unknown as CareersJob;

    const [row] = jobsToRows([job]);
    expect(Object.keys(row)).toEqual([...JOB_EXPORT_COLUMNS]);
    expect(row.compensationMin).toBe('230000');
    expect(row.skills).toBe('TypeScript; Kubernetes');
  });

  it('leaves compensation cells empty when a job has no published range', () => {
    const job = { skills: [], compensation: null } as unknown as CareersJob;
    const [row] = jobsToRows([job]);
    expect(row.compensationMin).toBe('');
    expect(row.currency).toBe('');
  });

  it('excludes the candidate contact and free-text fields from an applications export', () => {
    const draft = {
      id: 'app_1',
      candidateId: 'candidate-demo',
      jobId: 'job_x',
      jobTitle: 'Staff Platform Engineer',
      countrySlug: 'united-states',
      status: 'draft',
      revision: 3,
      fields: { email: 'avery.chen@example.test', coverNote: 'private note', phone: '+1 555 0100' },
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-02T00:00:00.000Z',
      submittedAt: null,
    } as unknown as ApplicationDraft;

    const [row] = applicationsToRows([draft]);
    const serialized = JSON.stringify(row);
    expect(serialized).not.toMatch(/example\.test|private note|555/);
    expect(row.revision).toBe('3');
    expect(row.submittedAt).toBe('');
  });
});
