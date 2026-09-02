/**
 * Shared validation rules for the human application form and
 * `careers_update_application` / `careers_submit_application`.
 */
import { z } from 'zod';
import { REQUIRED_APPLICATION_FIELDS, type ApplicationFields, type ApplicationValidation } from './index';

const urlOrEmpty = z.union([z.literal(''), z.string().url('Enter a valid URL (https://...)')]);

export const applicationFieldsSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[0-9+\-() ]+$/, 'Phone number may only contain digits, spaces, +, -, ( and )'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  linkedinUrl: urlOrEmpty,
  portfolioUrl: urlOrEmpty,
  yearsExperience: z
    .number()
    .min(0, 'Years of experience must be 0 or more')
    .max(60, 'Years of experience must be 60 or less')
    .nullable(),
  coverNote: z.string().max(2000, 'Cover note must be 2000 characters or fewer'),
  availability: z.string().min(2, 'Describe your availability (e.g. "2 weeks notice")'),
});

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/** Full-form validation, used by careers_submit_application and the human submit button. */
export function validateApplicationFields(fields: ApplicationFields): ApplicationValidation {
  const result = applicationFieldsSchema.safeParse(fields);
  const errors: Partial<Record<keyof ApplicationFields, string>> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ApplicationFields | undefined;
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
  }

  const missingRequiredFields = REQUIRED_APPLICATION_FIELDS.filter((field) => isEmptyValue(fields[field]));

  return {
    valid: Object.keys(errors).length === 0 && missingRequiredFields.length === 0,
    errors,
    missingRequiredFields,
  };
}

/** Per-field validation for partial updates (careers_update_application, live form edits). */
export function validateApplicationField<K extends keyof ApplicationFields>(
  field: K,
  value: ApplicationFields[K],
): string | null {
  const shape = applicationFieldsSchema.shape as Record<string, z.ZodTypeAny>;
  const fieldSchema = shape[field as string];
  if (!fieldSchema) return null;
  const result = fieldSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? 'Invalid value';
}
