import { useQueryClient } from '@tanstack/react-query';

import { membersQueryOptions } from '@/features/club/queries/member/get-members.query';
import type { Id } from '@/shared/types/common.types';

/**
 * Returns a function that starts loading a club's members before its detail screen mounts
 * (call it from a card's onPressIn). Fresh data (within staleTime) is not refetched.
 */
export function usePrefetchClubMembers() {
  const queryClient = useQueryClient();
  return (clubId: Id): void => {
    void queryClient.prefetchQuery(membersQueryOptions(clubId));
  };
}
