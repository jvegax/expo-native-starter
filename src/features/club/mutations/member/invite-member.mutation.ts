import { useMutation, useQueryClient } from '@tanstack/react-query';

import { inviteMember } from '@/features/club/api/member/invite-member.api';
import { clubKeys } from '@/features/club/queries/club/club.keys';
import { memberKeys } from '@/features/club/queries/member/member.keys';

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteMember,
    onSuccess: (member) => {
      void queryClient.invalidateQueries({ queryKey: memberKeys.list(member.clubId) });
      // membersCount lives on the club entity, so its detail cache is stale too.
      void queryClient.invalidateQueries({ queryKey: clubKeys.detail(member.clubId) });
    },
  });
}
