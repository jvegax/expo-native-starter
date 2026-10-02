import type { Id, ISODateString } from '@/shared/types/common.types';

export const MEMBER_ROLES = ['owner', 'admin', 'member'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export type MemberDto = {
  id: string;
  club_id: string;
  display_name: string;
  role: MemberRole;
  joined_at: string;
};

export type Member = {
  id: Id;
  clubId: Id;
  displayName: string;
  role: MemberRole;
  joinedAt: ISODateString;
};

export type InviteMemberInput = {
  clubId: Id;
  email: string;
  role?: Exclude<MemberRole, 'owner'>;
};
