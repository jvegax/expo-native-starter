# Data layer (TanStack Query v5)

Four files per read, three per write, each in its entity folder. The examples are from `src/features/club`. Every file imports its neighbours by full path (`@/features/club/types/club/club.types`), never relatively and never through a barrel.

## 1. Types and mappers (`types/<entity>/`)

```ts
// club.types.ts
export type ClubDto = { id: string; name: string; members_count: number; created_at: string };   // wire
export type Club = { id: Id; name: string; membersCount: number; createdAt: ISODateString };     // domain
export type ClubListParams = PaginationParams & { search?: string };
export type UpdateClubInput = { id: Id; name?: string };

// club.mappers.ts
export function toClub(dto: ClubDto): Club { ... }
```

Why two shapes: the API's naming and nullability are not the app's. Components and screens only ever see the domain type, so an API change touches one mapper. If the wire format already matches the domain, skip the Dto and the mapper; do not create empty indirection.

Mappers go both ways. Reads map Dto → domain (`toClub`). Writes whose input keys differ from the wire keys (`startsAt` → `starts_at`) get a `to<Verb><Entity>Body(input)` function in the same `<entity>.mappers.ts`, so the api function stays a one-liner and the wire naming lives in one file per entity. When input and wire keys already match, spread the input as the body (see `inviteMember`).

## 2. API functions (`api/<entity>/<verb>-<entity>.api.ts`)

```ts
export async function getClubs(params: ClubListParams, signal?: AbortSignal): Promise<Paginated<Club>> {
  const page = await http.get<Paginated<ClubDto>>('/clubs', { params, signal });
  return mapPaginated(page, toClub);
}
```

- One exported function per file, named after the HTTP intent (`getX`, `createX`, `updateX`, `deleteX`, `inviteX`).
- Always accept and forward `signal` on reads so TanStack cancels stale requests.
- Only `http` from `@/shared/lib/http/client` talks to the network. Never call `fetch` directly.
- No React, no `queryClient`, no try/catch: `http` already throws `HttpError`.

## 3. Key factory (`queries/<entity>/<entity>.keys.ts`)

```ts
export const clubKeys = {
  all: ['club'] as const,
  lists: () => [...clubKeys.all, 'list'] as const,
  list: (params: ClubListParams) => [...clubKeys.lists(), params] as const,
  details: () => [...clubKeys.all, 'detail'] as const,
  detail: (id: Id) => [...clubKeys.details(), id] as const,
};
```

Hierarchical keys let a mutation invalidate "every club list" with `clubKeys.lists()` without knowing the params in use. Child entities embed the parent id as an object (`memberKeys.list(clubId)` → `['member', 'list', { clubId }]`). A singleton resource (`/me`, `/settings`) keeps `all` and adds one named key per resource: `userKeys = { all: ['user'] as const, me: () => [...userKeys.all, 'me'] as const }`; no `lists`/`details` if there is nothing to list.

## 4. Query files (`queries/<entity>/get-<x>.query.ts`)

```ts
export function clubsQueryOptions(params: ClubListParams = {}) {
  return queryOptions({ queryKey: clubKeys.list(params), queryFn: ({ signal }) => getClubs(params, signal) });
}
export function useClubsQuery(params?: ClubListParams) {
  return useQuery(clubsQueryOptions(params));
}
```

`queryOptions()` is the unit of reuse: the same object feeds `useQuery`, `useSuspenseQuery`, `queryClient.prefetchQuery`, `setQueryData` and `getQueryData`, all fully typed. Hooks are thin wrappers so screens never assemble options.

**Optional inputs** use `skipToken` (keeps types honest, no `enabled: !!id` boilerplate):

```ts
export function clubQueryOptions(id: Id | undefined) {
  return queryOptions({ queryKey: clubKeys.detail(id ?? ''), queryFn: id ? ({ signal }) => getClub(id, signal) : skipToken });
}
```

**Derived data** (reshaping, filtering, picking fields) stays out of components: pass `select` through the hook. Locale-dependent presentation (dates, numbers, currency) is not derived data: format at render time with `Intl` and `i18n.language`, through the wrappers in `@/shared/utils/format` so options are not repeated.

```ts
export function useClubNamesQuery() {
  return useQuery({ ...clubsQueryOptions(), select: (page) => page.items.map((club) => club.name) });
}
```

**Infinite lists** use `infiniteQueryOptions` with the shared `Paginated` shape:

```ts
export function clubsInfiniteQueryOptions(params: Omit<ClubListParams, 'page'> = {}) {
  return infiniteQueryOptions({
    queryKey: [...clubKeys.lists(), 'infinite', params] as const,
    queryFn: ({ pageParam, signal }) => getClubs({ ...params, page: pageParam, pageSize: appConfig.defaultPageSize }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.pageSize < last.total ? last.page + 1 : undefined),
  });
}
```

## 5. Mutation files (`mutations/<entity>/<verb>-<entity>.mutation.ts`)

```ts
export function useUpdateClubMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClub,
    onSuccess: (club) => {
      queryClient.setQueryData(clubQueryOptions(club.id).queryKey, club);   // we have the fresh entity: write it
      void queryClient.invalidateQueries({ queryKey: clubKeys.lists() });    // lists may be sorted/filtered: refetch
    },
  });
}
```

Rules of thumb:
- The mutation hook owns cache consistency. Components call `mutate`/`mutateAsync` and never touch the query client.
- Invalidate the parent entity when a child changes something the parent shows (inviting a member changes `membersCount` → invalidate `clubKeys.detail(clubId)`).
- Keep `onSuccess` for cache work. UI reactions (toast, navigation) go in the component's `mutate(input, { onSuccess })` so the hook stays reusable.

**Optimistic update** template (only when the UI must react before the server answers):

```ts
onMutate: async (input) => {
  const key = clubQueryOptions(input.id).queryKey;
  await queryClient.cancelQueries({ queryKey: key });
  const previous = queryClient.getQueryData(key);
  queryClient.setQueryData(key, (current) => (current ? { ...current, ...input } : current));
  return { previous, key };
},
onError: (_error, _input, context) => {
  if (context?.previous) queryClient.setQueryData(context.key, context.previous);
},
onSettled: (_data, _error, input) => void queryClient.invalidateQueries({ queryKey: clubKeys.detail(input.id) }),
```

## 6. Consuming in screens and components

```tsx
const clubs = useClubsQuery();
<AsyncState isPending={clubs.isPending} isError={clubs.isError} error={clubs.error}
            isEmpty={clubs.data?.items.length === 0} onRetry={() => void clubs.refetch()}>
  <List data={clubs.data?.items ?? []} keyExtractor={(club) => club.id} estimatedItemSize={96} renderItem={...} />
</AsyncState>
```

- `error` is typed as `HttpError` (`@/shared/lib/http/errors`) app-wide (`src/types/tanstack-query.d.ts`); branch on `error.status` or `error.kind`, never on message text.
- Prefetch before navigation when it helps (section 7): on `onPressIn`, not after `router.push`.
- Pull-to-refresh shows a spinner only for a pull: local `isPullRefreshing` state, never `refreshing={query.isRefetching}` (see `club-list-screen.tsx`).
- Query defaults (staleTime, retries, `gcTime`) live in `src/config/query-client.ts`. Override per query only with a reason in a comment.

## 7. Instant screens, persisted cache and offline

**Detail from list (`placeholderData`).** A detail query starts from the copy of the entity already in a cached list, so the screen paints immediately while the detail request runs:

```ts
function findClubInLists(queryClient: QueryClient, id: Id | undefined): Club | undefined {
  if (!id) return undefined;
  return queryClient
    .getQueriesData<Paginated<Club>>({ queryKey: clubKeys.lists() })
    .map(([, page]) => page?.items?.find((club) => club.id === id))   // `items?.`: skip other shapes (infinite pages)
    .find((club) => club !== undefined);
}

export function useClubQuery(id: Id | undefined) {
  const queryClient = useQueryClient();
  return useQuery({ ...clubQueryOptions(id), placeholderData: () => findClubInLists(queryClient, id) });
}
```

Use `placeholderData`, not `initialData`: it is never written to the cache (`isPlaceholderData` is `true`), so the list's possibly older copy cannot replace fresh detail data or block the fetch.

**Prefetch on touch down.** Data the next screen needs, but the current one does not have, is requested on `onPressIn`, which fires on touch down, before `onPress` and the navigation. The hook lives next to the query it prefetches and returns a plain function:

```ts
// queries/member/prefetch-club-members.query.ts
export function usePrefetchClubMembers() {
  const queryClient = useQueryClient();
  return (clubId: Id): void => {
    void queryClient.prefetchQuery(membersQueryOptions(clubId));   // no-op while the data is fresh (staleTime)
  };
}
```

The screen wires it (`<ClubCard onPressIn={(club) => prefetchMembers(club.id)} />`); components only forward the event.

**Persisted cache (opt-in).** `src/providers/query-provider.tsx` uses `PersistQueryClientProvider` with `queryPersister` (`src/config/query-persister.ts`, MMKV through `persistStorage`). On a cold start the persisted queries are restored before the first fetch, so lists render before the network answers. Only queries that opt in are written:

```ts
export function clubsQueryOptions(params: ClubListParams = {}) {
  return queryOptions({
    queryKey: clubKeys.list(params),
    queryFn: ({ signal }) => getClubs(params, signal),
    meta: { persist: true },   // typed in src/types/tanstack-query.d.ts
  });
}
```

- Mark only **non-personal** data that is useful on a cold start (catalogues, list screens without personal data). Members, emails, anything sensitive: never. Tokens never go through the query cache.
- Only successful queries are written; mutations are never persisted. The cache is discarded after `QUERY_CACHE_MAX_AGE` (24 h) and whenever the app version (`env.APP_VERSION`, the `buster`) changes, so a shape change ships with a version bump.
- `gcTime` equals `QUERY_CACHE_MAX_AGE`; do not lower it per query for a persisted query, or it drops out of the persisted cache.

**Focus and online.** `setupQueryManagers()` (`src/config/query-managers.ts`, called from `bootstrap`) connects TanStack's `focusManager` to `AppState` and `onlineManager` to `expo-network`. Stale queries refetch when the app returns to the foreground, and fetches and mutations pause while offline and resume on reconnect. Do not add `AppState` or network listeners per screen to refetch; the managers already do it.
