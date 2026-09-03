import { describe, it, expect, beforeEach } from 'vitest';

// The session store persists to a global localStorage; provide one for `node`.
if (typeof globalThis.localStorage === 'undefined') {
  const memory = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => void memory.set(key, value),
    removeItem: (key: string) => void memory.delete(key),
    clear: () => memory.clear(),
    key: (index: number) => Array.from(memory.keys())[index] ?? null,
    get length() {
      return memory.size;
    },
  };
}

const { useSessionStore, candidateIdForEmail } = await import('@/domain/session/session.store');
const {
  useSignUpStore,
  setSignUpFields,
  getSignUpFields,
  clearSignUpDraft,
  completeSignUp,
  validateSignUpFields,
  SignUpError,
  EMPTY_SIGNUP_FIELDS,
} = await import('@/domain/session/signup.store');

const VALID = { fullName: 'Sam Rivera', email: 'sam.rivera@example.test' };

describe('sign-up draft', () => {
  beforeEach(() => {
    clearSignUpDraft();
    useSessionStore.setState({ status: 'ready', candidate: null });
  });

  it('starts empty and human-owned', () => {
    expect(getSignUpFields()).toEqual(EMPTY_SIGNUP_FIELDS);
    expect(useSignUpStore.getState().origin).toBe('human');
  });

  it('merges a partial update without clearing untouched fields', () => {
    setSignUpFields({ fullName: 'Sam Rivera', location: 'Austin, TX' }, 'human');
    setSignUpFields({ email: 'sam.rivera@example.test' }, 'agent');
    const fields = getSignUpFields();
    expect(fields.fullName).toBe('Sam Rivera');
    expect(fields.location).toBe('Austin, TX');
    expect(fields.email).toBe('sam.rivera@example.test');
  });

  it('marks the draft agent-written, and hands it back on a human edit', () => {
    setSignUpFields({ fullName: 'Sam Rivera', email: 'sam@example.test' }, 'agent');
    expect(useSignUpStore.getState().origin).toBe('agent');

    setSignUpFields({ phone: '+1 555 0100' }, 'human');
    expect(useSignUpStore.getState().origin).toBe('human');
  });

  it('preserves yearsExperience as a number and accepts an explicit null', () => {
    setSignUpFields({ yearsExperience: 7 }, 'agent');
    expect(getSignUpFields().yearsExperience).toBe(7);
    setSignUpFields({ yearsExperience: null }, 'human');
    expect(getSignUpFields().yearsExperience).toBeNull();
  });
});

describe('sign-up validation', () => {
  beforeEach(() => clearSignUpDraft());

  it('requires a name and an email', () => {
    const result = validateSignUpFields(getSignUpFields());
    expect(result.valid).toBe(false);
    expect(result.missingRequiredFields).toEqual(['fullName', 'email']);
  });

  it('rejects a malformed email', () => {
    setSignUpFields({ ...VALID, email: 'not-an-email' }, 'agent');
    const result = validateSignUpFields(getSignUpFields());
    expect(result.valid).toBe(false);
    expect(result.invalidFields.map((f) => f.field)).toContain('email');
  });

  it('rejects a non-http URL but allows an empty one', () => {
    setSignUpFields({ ...VALID, portfolioUrl: 'github.com/sam' }, 'agent');
    expect(validateSignUpFields(getSignUpFields()).invalidFields.map((f) => f.field)).toContain('portfolioUrl');

    setSignUpFields({ portfolioUrl: '' }, 'human');
    expect(validateSignUpFields(getSignUpFields()).valid).toBe(true);
  });

  it('rejects an out-of-range years of experience', () => {
    setSignUpFields({ ...VALID, yearsExperience: 200 }, 'agent');
    expect(validateSignUpFields(getSignUpFields()).invalidFields.map((f) => f.field)).toContain('yearsExperience');
  });

  it('treats whitespace-only required values as missing', () => {
    setSignUpFields({ fullName: '   ', email: '  ' }, 'agent');
    expect(validateSignUpFields(getSignUpFields()).missingRequiredFields).toEqual(['fullName', 'email']);
  });
});

describe('completeSignUp', () => {
  beforeEach(() => {
    clearSignUpDraft();
    useSessionStore.setState({ status: 'ready', candidate: null });
  });

  it('creates the session the rest of the site reads', () => {
    setSignUpFields({ ...VALID, location: 'Austin, TX', yearsExperience: 6 }, 'agent');
    const session = completeSignUp();

    expect(useSessionStore.getState().candidate).toEqual(session);
    expect(session.displayName).toBe('Sam Rivera');
    expect(session.profile.location).toBe('Austin, TX');
    expect(session.profile.yearsExperience).toBe(6);
  });

  it('refuses to create a session from an invalid draft', () => {
    setSignUpFields({ fullName: 'Sam Rivera' }, 'agent');
    expect(() => completeSignUp()).toThrow(SignUpError);
    expect(useSessionStore.getState().candidate).toBeNull();
  });

  it('clears the draft once the account exists', () => {
    setSignUpFields(VALID, 'agent');
    completeSignUp();
    expect(getSignUpFields()).toEqual(EMPTY_SIGNUP_FIELDS);
    expect(useSignUpStore.getState().origin).toBe('human');
  });

  it('gives the same candidate id to the same email, so saved work is not orphaned', () => {
    expect(candidateIdForEmail('Sam.Rivera@Example.test')).toBe(candidateIdForEmail('sam.rivera@example.test '));
    expect(candidateIdForEmail('a@example.test')).not.toBe(candidateIdForEmail('b@example.test'));
  });

  it('never puts a secret in the session it creates', () => {
    setSignUpFields(VALID, 'agent');
    const session = completeSignUp();
    expect(JSON.stringify(session)).not.toMatch(/password|token|jwt|cookie|secret/i);
  });
});
