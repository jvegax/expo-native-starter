import {
  LegendList,
  type LegendListProps,
  type LegendListRef,
  type LegendListRenderItemProps,
  useRecyclingState,
} from '@legendapp/list/react-native';
import type { Ref } from 'react';

// Rows that need local state under recycling use this instead of useState. Re-exported here because
// this folder is the only one allowed to import @legendapp/list (ESLint).
export { useRecyclingState };

export type ListRef = LegendListRef;
export type ListRenderItemProps<T> = LegendListRenderItemProps<T>;

export type ListProps<T> = Omit<LegendListProps<T>, 'keyExtractor' | 'estimatedItemSize'> & {
  /** Stable identity per item (the entity id). Required: it drives recycling and scroll anchoring. */
  keyExtractor: (item: T, index: number) => string;
  /** Average row height in px. An estimate is enough; it only sizes the initial render. */
  estimatedItemSize: number;
  ref?: Ref<ListRef>;
};

/**
 * The list component of the app (LegendList: pure TS, faster than FlatList, dynamic item sizes).
 *
 * Defaults to `recycleItems`, so a row must be a pure function of its props: keep local state out of
 * rows, or hold it with `useRecyclingState` (exported below), or pass
 * `recycleItems={false}` for that list. Pull-to-refresh: `refreshing` + `onRefresh`.
 * Infinite scroll: `onEndReached` → `fetchNextPage()`. Spacing between rows: `contentContainerStyle.gap`.
 *
 * `contentInsetAdjustmentBehavior="automatic"` (iOS) lets a large-title header collapse on scroll and
 * insets the content under translucent bars; pass `"never"` for a list that is not the screen's scroll view.
 */
export function List<T>({ recycleItems = true, contentInsetAdjustmentBehavior = 'automatic', ...props }: ListProps<T>) {
  return (
    <LegendList<T>
      recycleItems={recycleItems}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      {...props}
    />
  );
}
