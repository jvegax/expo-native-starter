import { toClub } from '@/features/club/types/club/club.mappers';
import type { Club, ClubDto, ClubListParams } from '@/features/club/types/club/club.types';
import { http } from '@/shared/lib/http/client';
import type { Paginated } from '@/shared/types/api.types';
import { mapPaginated } from '@/shared/utils/pagination';

export async function getClubs(params: ClubListParams, signal?: AbortSignal): Promise<Paginated<Club>> {
  const page = await http.get<Paginated<ClubDto>>('/clubs', { params, signal });
  return mapPaginated(page, toClub);
}
