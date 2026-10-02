import type { ClubListParams } from '@/features/club/types/club/club.types';
import type { Id } from '@/shared/types/common.types';

/** Hierarchical keys: invalidating `lists()` hits every list regardless of params. */
export const clubKeys = {
  all: ['club'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (params: ClubListParams) => [...clubKeys.lists(), params] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: Id) => [...clubKeys.details(), id] as const,
};
