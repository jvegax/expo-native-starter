import { toMember } from '@/features/club/types/member/member.mappers';
import type { InviteMemberInput, Member, MemberDto } from '@/features/club/types/member/member.types';
import { http } from '@/shared/lib/http/client';

export async function inviteMember({ clubId, ...body }: InviteMemberInput): Promise<Member> {
  const dto = await http.post<MemberDto>(`/clubs/${clubId}/members`, { body });
  return toMember(dto);
}
