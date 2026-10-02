import { toClub } from '@/features/club/types/club/club.mappers';
import type { Club, ClubDto } from '@/features/club/types/club/club.types';
import { http } from '@/shared/lib/http/client';
import type { Id } from '@/shared/types/common.types';

export async function getClub(id: Id, signal?: AbortSignal): Promise<Club> {
  const dto = await http.get<ClubDto>(`/clubs/${id}`, { signal });
  return toClub(dto);
}
