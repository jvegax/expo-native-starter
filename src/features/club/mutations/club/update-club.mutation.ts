import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateClub } from '@/features/club/api/club/update-club.api';
import { clubKeys } from '@/features/club/queries/club/club.keys';
import { clubQueryOptions } from '@/features/club/queries/club/get-club.query';

export function useUpdateClubMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClub,
    onSuccess: (club) => {
      // Write the fresh entity into its detail cache and let lists refetch lazily.
      queryClient.setQueryData(clubQueryOptions(club.id).queryKey, club);
      void queryClient.invalidateQueries({ queryKey: clubKeys.lists() });
    },
  });
}
