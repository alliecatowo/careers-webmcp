/**
 * JSON Schema input definitions for every WebMCP tool, plus a tiny runtime
 * validator. Schemas are plain JSON objects (sent to the browser as-is) —
 * not generated from zod at runtime, so they stay literal and inspectable.
 */
import { LIMITS } from './results';
import { WebMCPError } from './errors';
import { APPLICATION_FIELD_NAMES } from '@/domain/applications';

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
