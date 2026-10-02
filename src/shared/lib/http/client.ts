import { HttpError } from '@/shared/lib/http/errors';
import type { HttpConfig, HttpMethod, HttpRequestOptions, QueryParams } from '@/shared/lib/http/http.types';
import type { ApiErrorBody } from '@/shared/types/api.types';

let config: HttpConfig = { baseUrl: '' };

/** Called once at bootstrap (src/config/http.ts). Features never call this. */
export function configureHttp(next: HttpConfig): void {
  config = next;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(path, config.baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function buildHeaders(extra?: Record<string, string>): Promise<Headers> {
  const headers = new Headers({ Accept: 'application/json', ...extra });
  const token = await config.getToken?.();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  try {
    return (await response.json()) as T;
  } catch {
    throw new HttpError({ kind: 'parse', status: response.status, message: 'Invalid JSON response' });
  }
}

async function toHttpError(response: Response): Promise<HttpError> {
  const body = await response.json().then((json: ApiErrorBody) => json).catch(() => null);
  if (response.status === 401) config.onUnauthorized?.();
  return new HttpError({
    kind: 'http',
    status: response.status,
    message: body?.message ?? `Request failed with status ${response.status}`,
    body,
  });
}

async function request<T>(method: HttpMethod, path: string, options: HttpRequestOptions = {}): Promise<T> {
  const headers = await buildHeaders(options.headers);
  const hasBody = options.body !== undefined;
  if (hasBody) headers.set('Content-Type', 'application/json');

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new HttpError({ kind: 'network', status: 0, message: 'Network request failed' });
  }

  if (!response.ok) throw await toHttpError(response);
  return parseBody<T>(response);
}

type BodylessOptions = Omit<HttpRequestOptions, 'body'>;

export const http = {
  get: <T>(path: string, options?: BodylessOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: HttpRequestOptions) => request<T>('POST', path, options),
  put: <T>(path: string, options?: HttpRequestOptions) => request<T>('PUT', path, options),
  patch: <T>(path: string, options?: HttpRequestOptions) => request<T>('PATCH', path, options),
  delete: <T>(path: string, options?: BodylessOptions) => request<T>('DELETE', path, options),
};
