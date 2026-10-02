# Components

## The tree rule

A component file holds one component and stays readable on one screen: aim for 100 lines, ESLint fails at 150 (blank lines and comments excluded). When it grows, you do not scroll; you branch:

```
components/club/club/club-card/
├── club-card.tsx            parent: layout + composition, decides what to render
├── club-card-header.tsx     child: one visual block with its own props
└── club-card.styles.ts      createStyles(theme) for the folder
```

No `index.ts`: the screen imports the parent by its path (`@/components/club/club/club-card/club-card`) and children are imported only from inside the folder, also by full `@/` path (`@/components/club/club/club-card/club-card-header`).

Signals that it is time to extract a child:
- A JSX block has its own data needs (`Pick<Club, 'name' | 'membersCount'>`) or its own translation keys.
- You are about to add a second `useState` for an unrelated concern.
- A `map()` body exceeds a few lines → make it a row component.
- A conditional branch renders a different "thing" (empty, error, detail) → separate components.

Children receive exactly the props they use (`Pick<Club, ...>` or specific fields), not the whole entity, so they stay testable and reusable within the folder.

## File pattern

```ts
// club-card.styles.ts
export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, padding: theme.spacing.md, gap: theme.spacing.sm },
  });
```

```tsx
// club-card.tsx
import { Platform, Pressable } from 'react-native';

import { ClubCardHeader } from '@/components/club/club/club-card/club-card-header';
import { createStyles } from '@/components/club/club/club-card/club-card.styles';
import type { Club } from '@/features/club/types/club/club.types';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';

export type ClubCardProps = { club: Club; onPress?: (club: Club) => void; onPressIn?: (club: Club) => void };

const isAndroid = Platform.OS === 'android';

export function ClubCard({ club, onPress, onPressIn }: ClubCardProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress ? () => onPress(club) : undefined}
      onPressIn={onPressIn ? () => onPressIn(club) : undefined}
      android_ripple={onPress ? { color: theme.colors.ripple, foreground: true } : undefined}
      style={isAndroid || !onPress ? styles.card : ({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ClubCardHeader name={club.name} membersCount={club.membersCount} />
    </Pressable>
  );
}
```

- `createStyles` lives at module scope in the `.styles.ts` file: `useStyles` keeps a module-level cache keyed on the function reference and the theme, so every instance of every component shares one style object per theme.
- No `useMemo` / `useCallback` / `React.memo` for performance: the React Compiler memoizes components and inline callbacks (see SKILL.md "Performance rules").
- Styles use tokens only: `theme.colors.*`, `theme.spacing.*` (gaps, padding), `theme.sizes.*` (icons, avatars, touch targets), `theme.radii.*`, `theme.textVariants.*`, `theme.shadows.*`. A raw hex or number in a component is a missing token; add it to `src/shared/theme/tokens` instead of composing spacing values into a dimension.
- A screen's layout styles go in `<name>-screen.styles.ts`, or `<entity>-screens.styles.ts` when the entity's screens share them.
- Text always goes through `<Text variant="..." color="...">`; it carries typography and semantic colors so dark mode works for free.
- Interactive elements set `accessibilityRole` and, when relevant, `accessibilityState`.
- **Press feedback** follows `Button` and `ClubCard`: Android gets `android_ripple={{ color: theme.colors.ripple, foreground: true }}` and a static `style` (no re-render on press), iOS gets the `({ pressed }) => [...]` style. Both only when there is an `onPress`; a non-pressable card shows no pressed state. `overflow: 'hidden'` (clips the ripple to the radius) goes in the styles for Android only (`Platform.select`), because on iOS overflow plus a shadow costs an extra native view.
- `onPressIn` is the moment to prefetch what the next screen needs (`usePrefetchClubMembers`); the screen wires it, the component only forwards the event.
- Props type is exported next to the component and named `<Component>Props`.

## Feature component vs design system

| Put it in `components/<domain>/<entity>/` when | Put it in `shared/ui/` when |
| --- | --- |
| It renders a domain entity (`ClubCard`, `MemberRow`) | It knows nothing about the domain (`Button`, `Card`, `Avatar`, `ListSeparator`) |
| Its copy comes from the domain namespace | Its copy comes from `common` or from props |
| Only this domain uses it (ESLint blocks imports from another domain's `components/`) | A second domain needs it, or it is obviously generic |

Shared components accept data through props and never import `features/`, `components/` or `screens/` code. Inside `shared/ui`, a component imports another by path (`@/shared/ui/text/text`). Extract the generic part when promoting (a `Card` from `ClubCard`), do not move the domain component.

## Section components (child entities inside a screen)

A screen owns the queries of its primary entity. A child entity shown on the same screen (members of a club, events of a club) gets a **section component** in the child's folder, `components/<domain>/<child>/<parent>-<child>-section/`, that owns its own query hook and mutation buttons. `ClubMembersSection` is the reference: it calls `useMembersQuery`, renders the rows with `<List>` inside `<AsyncState>` and contains `InviteMemberButton`. The screen then stays a short composition (`<ClubCard>`, `<ClubMembersSection clubId>`, `<ClubEventsSection clubId>`), and a section can be dropped into another screen without copying fetching code.

## Naming collisions

Domain types shadow globals from the DOM lib when they share a name (`Event`, `Request`, `Response`, `Location`, `Notification`, `Image`). A forgotten import then silently resolves to the DOM type. Prefix such entities with the domain: `ClubEvent`, `PushNotification`.

## Screens

- Live in `screens/<domain>/<entity>/<name>-screen.tsx` and are composition: call the primary entity's query hooks (`@/features/<d>/queries/...`), hand data to components (`@/components/<d>/...`) and sections, decide navigation. No fetching logic, no styling beyond layout containers.
- May compose across domains: a dashboard screen in `screens/home` can render `ClubCard` and call `useClubsQuery`. Components cannot; only screens cross domain lines.
- Receive route params as typed props; the route file in `src/app` reads `useLocalSearchParams` and passes them.
- Set their own header with `<Stack.Screen options={{ title }} />` so the route file stays a re-export. Header colours come from the navigation theme (`@/shared/theme/navigation-theme`), never per screen. A top-level list screen may use the iOS large title (`headerLargeTitleEnabled: true`, `headerLargeTitleShadowVisible: false`, see `club-list-screen.tsx`).
- Wrap content in `<Screen>` (safe area + background + horizontal padding; pass `padded={false}` for full-bleed lists).
- Use `<AsyncState>` for pending/error/empty; do not hand-roll spinners.

## Lists

- Every list uses `<List>` from `@/shared/ui/list/list` (a thin wrapper over LegendList, `@legendapp/list`: pure TypeScript, faster than `FlatList`/`FlashList`, dynamic row heights). `FlatList`, `SectionList`, `VirtualizedList` and direct `@legendapp/list` imports are ESLint errors everywhere except inside `shared/ui/list/`.
- Required props: `data`, `renderItem`, a stable `keyExtractor` (entity `id`) and `estimatedItemSize` (average row height in px, declare it as a named constant next to the screen).
- Rows are recycled by default (`recycleItems`), so a row component is a pure function of its props. Local state inside a row goes through `useRecyclingState` from `@/shared/ui/list/list`, or the list opts out with `recycleItems={false}`.
- Pull-to-refresh: a local `isPullRefreshing` state set in the `onRefresh` handler and cleared in `query.refetch().finally(...)`, passed as `refreshing` (see `club-list-screen.tsx`). Never `refreshing={query.isRefetching}`: it would show the spinner on every background refetch (focus, reconnect). Infinite scroll: `onEndReached={() => void query.fetchNextPage()}` from an infinite query (see `data-layer.md`).
- Spacing between rows comes from `contentContainerStyle.gap` or an `ItemSeparatorComponent`, not from row margins.
- `<List>` defaults to `contentInsetAdjustmentBehavior="automatic"` (iOS), so a large-title header collapses as it scrolls. Pass `"never"` for a list that is not the screen's main scroll view.
- Grouped data uses `numColumns`; a sectioned list needs a `SectionList` wrapper added to `shared/ui/list/` (from `@legendapp/list/section-list`), never the React Native one. Chat-like UIs use `alignItemsAtEnd` + `maintainScrollAtEnd` instead of `inverted`.

## Images

- Every image uses `<Image>` from `@/shared/ui/image/image` (expo-image with `cachePolicy="memory-disk"` and a 150 ms transition). `Image` and `ImageBackground` from `react-native` are ESLint errors.
- Inside a recycled `<List>` row, pass `recyclingKey={item.id}` so a reused row never flashes the previous item's image, and a `placeholder` (blurhash, thumbhash or a local asset) so the box is never empty.
- `prefetchImages(urls)` from the same file warms the cache for images the user is about to see (next screen, next page). Give the image explicit dimensions in the styles.

## Hooks

- Domain-specific non-data hooks: `features/<d>/hooks/<entity>/use-<name>.ts`.
- Generic hooks: `shared/hooks/use-<name>.ts` (see `useDebouncedValue`), imported as `@/shared/hooks/use-<name>`.
- A hook that only wraps `useQuery` belongs in `queries/`, not in `hooks/`.
