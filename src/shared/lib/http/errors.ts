import type { ApiErrorBody } from '@/shared/types/api.types';

export type HttpErrorKind = 'network' | 'http' | 'parse';

type HttpErrorInit = {
  kind: HttpErrorKind;
  status: number;
  message: string;
  body?: ApiErrorBody | null;
};

export class HttpError extends Error {
  readonly kind: HttpErrorKind;
  /** HTTP status code; 0 when the request never reached the server. */
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor({ kind, status, message, body = null }: HttpErrorInit) {
    super(message);
    this.name = 'HttpError';
    this.kind = kind;
    this.status = status;
    this.body = body;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
