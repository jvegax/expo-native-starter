import { queryOptions, useQuery } from '@tanstack/react-query';

import { getClubs } from '@/features/club/api/club/get-clubs.api';
import { clubKeys } from '@/features/club/queries/club/club.keys';
import type { ClubListParams } from '@/features/club/types/club/club.types';

export function clubsQueryOptions(params: ClubListParams = {}) {
  return queryOptions({
    queryKey: clubKeys.list(params),
    queryFn: ({ signal }) => getClubs(params, signal),
    // Restored from disk on a cold start so the list renders before the network answers.
    meta: { persist: true },
  });
}

export function useClubsQuery(params?: ClubListParams) {
  return useQuery(clubsQueryOptions(params));
}
