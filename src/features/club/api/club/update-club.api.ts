import { toClub } from '@/features/club/types/club/club.mappers';
import type { Club, ClubDto, UpdateClubInput } from '@/features/club/types/club/club.types';
import { http } from '@/shared/lib/http/client';

export async function updateClub({ id, ...body }: UpdateClubInput): Promise<Club> {
  const dto = await http.patch<ClubDto>(`/clubs/${id}`, { body });
  return toClub(dto);
}
