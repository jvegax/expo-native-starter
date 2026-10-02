import { queryOptions, useQuery } from '@tanstack/react-query';

import { getMembers } from '@/features/club/api/member/get-members.api';
import { memberKeys } from '@/features/club/queries/member/member.keys';
import type { Id } from '@/shared/types/common.types';

export function membersQueryOptions(clubId: Id) {
  return queryOptions({
    queryKey: memberKeys.list(clubId),
    queryFn: ({ signal }) => getMembers(clubId, signal),
  });
}

export function useMembersQuery(clubId: Id) {
  return useQuery(membersQueryOptions(clubId));
}
