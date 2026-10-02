import type { Id } from '@/shared/types/common.types';

export const memberKeys = {
  all: ['member'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (clubId: Id) => [...memberKeys.lists(), { clubId }] as const,
};
