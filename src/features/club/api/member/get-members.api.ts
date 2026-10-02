import { toMember } from '@/features/club/types/member/member.mappers';
import type { Member, MemberDto } from '@/features/club/types/member/member.types';
import { http } from '@/shared/lib/http/client';
import type { Id } from '@/shared/types/common.types';

export async function getMembers(clubId: Id, signal?: AbortSignal): Promise<Member[]> {
  const dtos = await http.get<MemberDto[]>(`/clubs/${clubId}/members`, { signal });
  return dtos.map(toMember);
}
