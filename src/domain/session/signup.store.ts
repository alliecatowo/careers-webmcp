'use client';
/**
 * Staged account creation, shared by the human signup form and the WebMCP
 * `careers_create_account` tool.
 *
 * The agent NEVER creates a session by itself (BUILD_CONTRACT #25: "Do not
 * silently create session"). It fills this draft; the human confirms it on the
 * real /careers/signup form by clicking the normal Create account button, which
 * is the only thing that calls `completeSignUp`.
 */
import { create } from 'zustand';
import { useSessionStore, type CandidateSession } from './session.store';

export interface SignUpFields {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearsExperience: number | null;
}

export const SIGNUP_FIELD_NAMES: (keyof SignUpFields)[] = [
  'fullName',
  'email',
  'phone',
  'location',
  'linkedinUrl',
  'portfolioUrl',
  'yearsExperience',
];

export const REQUIRED_SIGNUP_FIELDS: (keyof SignUpFields)[] = ['fullName', 'email'];

export const EMPTY_SIGNUP_FIELDS: SignUpFields = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  portfolioUrl: '',
  yearsExperience: null,
};

export type SignUpOrigin = 'human' | 'agent';

interface SignUpState {
  fields: SignUpFields;
  /**
   * Who last wrote the draft. The sign-up page shows the "these were filled in
   * for you" notice only while this is 'agent'; a human edit takes it back.
   */
  origin: SignUpOrigin;
}

export const useSignUpStore = create<SignUpState>(() => ({
  fields: { ...EMPTY_SIGNUP_FIELDS },
  origin: 'human',
}));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/;

export interface SignUpValidation {
  missingRequiredFields: (keyof SignUpFields)[];
  invalidFields: { field: keyof SignUpFields; reason: string }[];
  valid: boolean;
}

export function validateSignUpFields(fields: SignUpFields): SignUpValidation {
  const missingRequiredFields = REQUIRED_SIGNUP_FIELDS.filter((name) => {
    const value = fields[name];
    return value === null || value === undefined || String(value).trim() === '';
  });

  const invalidFields: SignUpValidation['invalidFields'] = [];
  if (fields.email.trim() !== '' && !EMAIL_RE.test(fields.email.trim())) {
    invalidFields.push({ field: 'email', reason: 'Must be a valid email address.' });
  }
  for (const urlField of ['linkedinUrl', 'portfolioUrl'] as const) {
    const value = fields[urlField].trim();
    if (value !== '' && !URL_RE.test(value)) {
      invalidFields.push({ field: urlField, reason: 'Must be an http(s) URL.' });
    }
  }
  if (fields.yearsExperience !== null && (fields.yearsExperience < 0 || fields.yearsExperience > 60)) {
    invalidFields.push({ field: 'yearsExperience', reason: 'Must be between 0 and 60.' });
  }

  return {
    missingRequiredFields,
    invalidFields,
    valid: missingRequiredFields.length === 0 && invalidFields.length === 0,
  };
}

/** Merge a partial update into the signup draft. Unspecified fields are preserved. */
export function setSignUpFields(partial: Partial<SignUpFields>, origin: SignUpOrigin): SignUpFields {
  const fields: SignUpFields = { ...useSignUpStore.getState().fields };

  for (const name of SIGNUP_FIELD_NAMES) {
    if (partial[name] === undefined) continue;
    // Narrowing per-field keeps yearsExperience's number|null type intact.
    if (name === 'yearsExperience') {
      fields.yearsExperience = (partial.yearsExperience ?? null) as number | null;
    } else {
      fields[name] = String(partial[name] ?? '');
    }
  }

  useSignUpStore.setState({ fields, origin });
  return fields;
}

export function getSignUpFields(): SignUpFields {
  return useSignUpStore.getState().fields;
}

export function clearSignUpDraft(): void {
  useSignUpStore.setState({ fields: { ...EMPTY_SIGNUP_FIELDS }, origin: 'human' });
}

export class SignUpError extends Error {
  constructor(
    public readonly code: 'VALIDATION_ERROR' | 'SESSION_ALREADY_ACTIVE',
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'SignUpError';
  }
}

/**
 * Create the real candidate session from the current draft. Called ONLY from
 * the human-clicked Create account button.
 */
export function completeSignUp(): CandidateSession {
  const fields = getSignUpFields();
  const validation = validateSignUpFields(fields);
  if (!validation.valid) {
    throw new SignUpError('VALIDATION_ERROR', 'The account details are incomplete or invalid.', {
      missingRequiredFields: validation.missingRequiredFields,
      invalidFields: validation.invalidFields,
    });
  }
  const session = useSessionStore.getState().signUp(fields);
  clearSignUpDraft();
  return session;
}
