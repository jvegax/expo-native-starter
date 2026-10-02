import { QueryClient } from '@tanstack/react-query';

import { QUERY_CACHE_MAX_AGE } from '@/config/query-persister';
import { HttpError } from '@/shared/lib/http/errors';

const ONE_MINUTE = 60 * 1000;

function shouldRetry(failureCount: number, error: Error): boolean {
  // Client errors (4xx) will not succeed on retry; network/5xx errors get two more attempts.
  if (error instanceof HttpError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      // Matches the persister's maxAge: a query garbage-collected earlier would drop out of the persisted cache.
      gcTime: QUERY_CACHE_MAX_AGE,
      retry: shouldRetry,
    },
    mutations: {
      retry: 0,
    },
  },
});
