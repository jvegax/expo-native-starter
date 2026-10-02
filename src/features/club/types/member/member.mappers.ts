import type { Member, MemberDto } from '@/features/club/types/member/member.types';

export function toMember(dto: MemberDto): Member {
  return {
    id: dto.id,
    clubId: dto.club_id,
    displayName: dto.display_name,
    role: dto.role,
    joinedAt: dto.joined_at,
  };
}
