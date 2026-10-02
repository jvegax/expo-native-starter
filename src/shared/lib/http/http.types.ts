export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export type HttpRequestOptions = {
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type HttpConfig = {
  baseUrl: string;
  getToken?: () => Promise<string | null> | string | null;
  onUnauthorized?: () => void;
};
