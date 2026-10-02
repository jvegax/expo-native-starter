import { type QueryClient, queryOptions, skipToken, useQuery, useQueryClient } from '@tanstack/react-query';

import { getClub } from '@/features/club/api/club/get-club.api';
import { clubKeys } from '@/features/club/queries/club/club.keys';
import type { Club } from '@/features/club/types/club/club.types';
import type { Paginated } from '@/shared/types/api.types';
import type { Id } from '@/shared/types/common.types';

/** Accepts an undefined id (e.g. while a route param resolves) and skips fetching until it exists. */
export function clubQueryOptions(id: Id | undefined) {
  return queryOptions({
    queryKey: clubKeys.detail(id ?? ''),
    queryFn: id ? ({ signal }) => getClub(id, signal) : skipToken,
  });
}

/** The club as it appears in any cached list page, so the detail screen paints instantly. */
function findClubInLists(queryClient: QueryClient, id: Id | undefined): Club | undefined {
  if (!id) return undefined;
  // `items?.`: a list key holding another shape (e.g. infinite pages) is skipped, not crashed on.
  return queryClient
    .getQueriesData<Paginated<Club>>({ queryKey: clubKeys.lists() })
    .map(([, page]) => page?.items?.find((club) => club.id === id))
    .find((club) => club !== undefined);
}

export function useClubQuery(id: Id | undefined) {
  const queryClient = useQueryClient();
  // placeholderData is shown (isPlaceholderData: true) while the detail request runs and is never
  // written to the cache, so the list's possibly older copy cannot overwrite fresh detail data.
  return useQuery({ ...clubQueryOptions(id), placeholderData: () => findClubInLists(queryClient, id) });
}
