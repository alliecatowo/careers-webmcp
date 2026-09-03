/**
 * JSON Schema input definitions for every WebMCP tool, plus a tiny runtime
 * validator. Schemas are plain JSON objects (sent to the browser as-is) —
 * not generated from zod at runtime, so they stay literal and inspectable.
 */
import { LIMITS } from './results';
import { WebMCPError } from './errors';
import { APPLICATION_FIELD_NAMES } from '@/domain/applications';
import { SIGNUP_FIELD_NAMES } from '@/domain/session/signup.store';
import { EXPORT_READ_MAX, JOB_EXPORT_COLUMNS, APPLICATION_EXPORT_COLUMNS } from '@/domain/exports';

const stringArray = { type: 'array', items: { type: 'string' } } as const;

export const searchJobsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    query: { type: 'string' },
    departments: stringArray,
    levels: stringArray,
    locations: stringArray,
    workplace: stringArray,
    employmentTypes: stringArray,
    skills: stringArray,
    minCompensation: { type: 'number' },
    maxCompensation: { type: 'number' },
    maxResults: { type: 'number', minimum: 1, maximum: LIMITS.searchMax },
  },
};

export const getJobSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    jobId: { type: 'string' },
  },
};

export const openJobSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['jobId'],
  properties: {
    jobId: { type: 'string' },
  },
};

export const getContextSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {},
};

export const getSavedJobsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {},
};

export const setSavedJobSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['jobId', 'saved'],
  properties: {
    jobId: { type: 'string' },
    saved: { type: 'boolean' },
  },
};

export const getMyApplicationsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {},
};

export const getApplicationSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    applicationId: { type: 'string' },
    jobId: { type: 'string' },
  },
};

export const startApplicationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['jobId'],
  properties: {
    jobId: { type: 'string' },
  },
};

export const updateApplicationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['applicationId', 'expectedRevision', 'fields'],
  properties: {
    applicationId: { type: 'string' },
    expectedRevision: { type: ['number', 'null'] },
    fields: {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(
        APPLICATION_FIELD_NAMES.map((name) => [
          name,
          name === 'yearsExperience' ? { type: ['number', 'null'] } : { type: 'string' },
        ]),
      ),
    },
  },
};

export const submitApplicationSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['applicationId', 'expectedRevision'],
  properties: {
    applicationId: { type: 'string' },
    expectedRevision: { type: ['number', 'null'] },
  },
};


export const setSearchViewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    query: { type: 'string', description: 'Free text typed into the visible search box.' },
    department: { type: 'string', description: 'Department name exactly as the site lists it, e.g. "Engineering".' },
    country: { type: 'string', description: 'Country name or slug, e.g. "United States".' },
    level: { type: 'string' },
    workplace: { type: 'string', enum: ['On-site', 'Hybrid', 'Remote'] },
    employmentType: { type: 'string' },
  },
};

export const focusApplicationFieldSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['field'],
  properties: {
    applicationId: { type: 'string', description: 'Defaults to the application currently open on the page.' },
    field: { type: 'string', enum: [...APPLICATION_FIELD_NAMES] },
  },
};

export const createAccountSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['fullName', 'email'],
  properties: {
    fullName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    location: { type: 'string' },
    linkedinUrl: { type: 'string' },
    portfolioUrl: { type: 'string' },
    yearsExperience: { type: ['number', 'null'] },
  },
};

const EXPORT_COLUMN_NAMES = Array.from(
  new Set<string>([...JOB_EXPORT_COLUMNS, ...APPLICATION_EXPORT_COLUMNS]),
);

export const createExportSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    dataset: { type: 'string', enum: ['jobs', 'applications'], default: 'jobs' },
    query: {
      ...searchJobsSchema,
      description: 'Optional job filters, same shape as careers_search_jobs. Ignored for the applications dataset.',
    },
    columns: {
      type: 'array',
      items: { type: 'string', enum: EXPORT_COLUMN_NAMES },
      description: 'Restrict the export to these columns. Defaults to all columns for the dataset.',
    },
  },
};

export const readExportSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['exportId'],
  properties: {
    exportId: { type: 'string' },
    offset: { type: 'number', minimum: 0, default: 0 },
    limit: { type: 'number', minimum: 1, maximum: EXPORT_READ_MAX, default: EXPORT_READ_MAX },
    columns: { type: 'array', items: { type: 'string', enum: EXPORT_COLUMN_NAMES } },
  },
};

type Validator = (input: Record<string, unknown>) => void;

function requireKeys(input: Record<string, unknown>, keys: string[]): void {
  for (const k of keys) {
    if (input[k] === undefined || input[k] === null) {
      throw new WebMCPError('VALIDATION_ERROR', `Missing required field "${k}".`, { field: k });
    }
  }
}

function checkType(input: Record<string, unknown>, key: string, type: 'string' | 'number' | 'boolean'): void {
  const v = input[key];
  if (v === undefined) return;
  if (typeof v !== type) {
    throw new WebMCPError('VALIDATION_ERROR', `Field "${key}" must be of type ${type}.`, { field: key });
  }
}

export const validators: Record<string, Validator> = {
  careers_get_context: () => {},
  careers_search_jobs: (input) => {
    checkType(input, 'query', 'string');
    checkType(input, 'minCompensation', 'number');
    checkType(input, 'maxCompensation', 'number');
    if (input.maxResults !== undefined) {
      checkType(input, 'maxResults', 'number');
      const n = input.maxResults as number;
      if (n > LIMITS.searchMax) {
        throw new WebMCPError('SEARCH_LIMIT_EXCEEDED', `maxResults may not exceed ${LIMITS.searchMax}.`, {
          maxResults: n,
          limit: LIMITS.searchMax,
        });
      }
      if (n < 1) {
        throw new WebMCPError('VALIDATION_ERROR', 'maxResults must be at least 1.', { field: 'maxResults' });
      }
    }
  },
  careers_get_job: () => {},
  careers_open_job: (input) => requireKeys(input, ['jobId']),
  careers_get_saved_jobs: () => {},
  careers_set_saved_job: (input) => {
    requireKeys(input, ['jobId', 'saved']);
    checkType(input, 'saved', 'boolean');
  },
  careers_get_my_applications: () => {},
  careers_get_application: () => {},
  careers_start_application: (input) => requireKeys(input, ['jobId']),
  careers_update_application: (input) => {
    requireKeys(input, ['applicationId']);
    if (!('expectedRevision' in input)) {
      throw new WebMCPError('VALIDATION_ERROR', 'Missing required field "expectedRevision".', {
        field: 'expectedRevision',
      });
    }
    const fields = input.fields;
    if (fields === undefined || typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
      throw new WebMCPError('VALIDATION_ERROR', 'Field "fields" must be an object.', { field: 'fields' });
    }
    for (const key of Object.keys(fields as Record<string, unknown>)) {
      if (!APPLICATION_FIELD_NAMES.includes(key as (typeof APPLICATION_FIELD_NAMES)[number])) {
        throw new WebMCPError('VALIDATION_ERROR', `Unknown application field "${key}".`, { field: key });
      }
    }
  },
  careers_set_search_view: (input) => {
    checkType(input, 'query', 'string');
    checkType(input, 'department', 'string');
    checkType(input, 'country', 'string');
    checkType(input, 'level', 'string');
    checkType(input, 'workplace', 'string');
    checkType(input, 'employmentType', 'string');
  },
  careers_focus_application_field: (input) => {
    requireKeys(input, ['field']);
    checkType(input, 'field', 'string');
    if (!APPLICATION_FIELD_NAMES.includes(input.field as (typeof APPLICATION_FIELD_NAMES)[number])) {
      throw new WebMCPError('VALIDATION_ERROR', `Unknown application field "${String(input.field)}".`, {
        field: 'field',
        known: APPLICATION_FIELD_NAMES,
      });
    }
  },
  careers_create_account: (input) => {
    requireKeys(input, ['fullName', 'email']);
    for (const name of SIGNUP_FIELD_NAMES) {
      if (input[name] === undefined) continue;
      if (name === 'yearsExperience') {
        if (input[name] !== null) checkType(input, name, 'number');
      } else {
        checkType(input, name, 'string');
      }
    }
    for (const key of Object.keys(input)) {
      if (!SIGNUP_FIELD_NAMES.includes(key as (typeof SIGNUP_FIELD_NAMES)[number])) {
        throw new WebMCPError('VALIDATION_ERROR', `Unknown account field "${key}".`, { field: key });
      }
    }
  },
  careers_create_export: (input) => {
    if (input.dataset !== undefined) {
      checkType(input, 'dataset', 'string');
      if (input.dataset !== 'jobs' && input.dataset !== 'applications') {
        throw new WebMCPError('VALIDATION_ERROR', 'dataset must be "jobs" or "applications".', { field: 'dataset' });
      }
    }
    if (input.query !== undefined) {
      if (typeof input.query !== 'object' || input.query === null || Array.isArray(input.query)) {
        throw new WebMCPError('VALIDATION_ERROR', 'Field "query" must be an object.', { field: 'query' });
      }
      // Reuse the search validator so export filters obey the same rules.
      validators.careers_search_jobs(input.query as Record<string, unknown>);
    }
  },
  careers_read_export: (input) => {
    requireKeys(input, ['exportId']);
    checkType(input, 'exportId', 'string');
    checkType(input, 'offset', 'number');
    if (input.limit !== undefined) {
      checkType(input, 'limit', 'number');
      if ((input.limit as number) > EXPORT_READ_MAX) {
        throw new WebMCPError('VALIDATION_ERROR', `limit may not exceed ${EXPORT_READ_MAX}.`, {
          field: 'limit',
          limit: EXPORT_READ_MAX,
        });
      }
    }
  },
  careers_submit_application: (input) => {
    requireKeys(input, ['applicationId']);
    if (!('expectedRevision' in input)) {
      throw new WebMCPError('VALIDATION_ERROR', 'Missing required field "expectedRevision".', {
        field: 'expectedRevision',
      });
    }
  },
};

export function validateInput(toolName: string, input: unknown): Record<string, unknown> {
  const obj = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const validator = validators[toolName];
  if (validator) validator(obj);
  return obj;
}
