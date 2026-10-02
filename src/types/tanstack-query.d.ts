import type { HttpError } from '@/shared/lib/http/errors';

// Every queryFn/mutationFn in the app goes through the http client, which only throws HttpError.
// Registering it here types `error` in useQuery/useMutation without per-call generics.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: HttpError;
    queryMeta: {
      /** Opt-in to the on-disk cache (src/providers/query-provider.tsx). Never set it on personal data. */
      persist?: boolean;
    };
  }
}
