import type { PaginationParams } from '@/shared/types/api.types';
import type { Id, ISODateString, Nullable } from '@/shared/types/common.types';

/** Wire format as returned by the API. Never leaves the api/ layer. */
export type ClubDto = {
  id: string;
  name: string;
  description: string | null;
  members_count: number;
  created_at: string;
};

/** Domain model used by queries, components and screens. */
export type Club = {
  id: Id;
  name: string;
  description: Nullable<string>;
  membersCount: number;
  createdAt: ISODateString;
};

export type ClubListParams = PaginationParams & {
  search?: string;
};

export type UpdateClubInput = {
  id: Id;
  name?: string;
  description?: Nullable<string>;
};
