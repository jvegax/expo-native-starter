export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** Standard error body returned by the API. */
export type ApiErrorBody = {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};
