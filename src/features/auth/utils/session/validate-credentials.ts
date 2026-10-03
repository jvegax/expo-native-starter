import { AuthError } from '@/features/auth/types/session/auth-error';
import type { AuthErrorCode, SignInInput, SignUpInput } from '@/features/auth/types/session/session.types';

export const PASSWORD_MIN_LENGTH = 6;

/** Keys of the `auth:validation.*` messages. */
export type ValidationErrorKey = 'required' | 'invalidEmail' | 'passwordTooShort';

export type CredentialErrors<T> = Partial<Record<keyof T, ValidationErrorKey>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): ValidationErrorKey | undefined {
  if (!email.trim()) return 'required';
  return EMAIL_PATTERN.test(email.trim()) ? undefined : 'invalidEmail';
}

function validatePassword(password: string): ValidationErrorKey | undefined {
  if (!password) return 'required';
  return password.length < PASSWORD_MIN_LENGTH ? 'passwordTooShort' : undefined;
}

function compact<T>(errors: CredentialErrors<T>): CredentialErrors<T> | null {
  return Object.values(errors).some(Boolean) ? errors : null;
}

/** Client-side checks before calling the api. Null when the form is valid. */
export function validateSignIn(input: SignInInput): CredentialErrors<SignInInput> | null {
  return compact({ email: validateEmail(input.email), password: validatePassword(input.password) });
}

export function validateSignUp(input: SignUpInput): CredentialErrors<SignUpInput> | null {
  return compact({
    name: input.name.trim() ? undefined : 'required',
    email: validateEmail(input.email),
    password: validatePassword(input.password),
  });
}

/** What the api receives: surrounding spaces removed. Passwords are sent exactly as typed. */
export function normalizeSignIn(input: SignInInput): SignInInput {
  return { email: input.email.trim(), password: input.password };
}

export function normalizeSignUp(input: SignUpInput): SignUpInput {
  return { name: input.name.trim(), email: input.email.trim(), password: input.password };
}

/** The AuthError code to translate (`auth:errors.<code>`), or null for unexpected errors (generic message). */
export function authErrorCode(error: unknown): AuthErrorCode | null {
  return error instanceof AuthError ? error.code : null;
}
