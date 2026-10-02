import type { Club, ClubDto } from '@/features/club/types/club/club.types';

export function toClub(dto: ClubDto): Club {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    membersCount: dto.members_count,
    createdAt: dto.created_at,
  };
}
