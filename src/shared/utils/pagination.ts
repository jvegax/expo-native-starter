import type { Paginated } from '@/shared/types/api.types';

/** Maps the items of a page while preserving pagination metadata. */
export function mapPaginated<From, To>(page: Paginated<From>, map: (item: From) => To): Paginated<To> {
  return { ...page, items: page.items.map(map) };
}
