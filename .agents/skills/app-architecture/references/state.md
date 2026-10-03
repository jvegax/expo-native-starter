# Client state (Zustand)

## Decide first

| Question | Answer |
| --- | --- |
| Does it come from the API? | TanStack Query. Never copy server data into a store. |
| Does only one component or screen use it? | `useState` / `useReducer`. |
| Must it survive navigation between screens, or be read by several features? | Zustand store. |
| Must it survive app restarts? | Zustand store + `persist` backed by `@/shared/lib/storage`. |

Typical legitimate stores: session (`auth`), onboarding progress, draft forms spanning several screens, list filters the user expects to keep, UI preferences (theme override, language).

## Store template

`features/<d>/store/<entity>/<entity>.store.ts`

```ts
import { create } from 'zustand';

type ClubFiltersState = {
  search: string;
  onlyMine: boolean;
};

type ClubFiltersActions = {
  setSearch: (search: string) => void;
  toggleOnlyMine: () => void;
  reset: () => void;
};

const initialState: ClubFiltersState = { search: '', onlyMine: false };

export const useClubFiltersStore = create<ClubFiltersState & ClubFiltersActions>()((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  toggleOnlyMine: () => set((state) => ({ onlyMine: !state.onlyMine })),
  reset: () => set(initialState),
}));

// Selectors keep re-renders scoped to what a component reads. This one builds a new object on every
// call, so it must be wrapped in useShallow (see Usage).
export const selectClubFilters = (state: ClubFiltersState) => ({ search: state.search, onlyMine: state.onlyMine });
```

Usage:

```ts
const search = useClubFiltersStore((state) => state.search);     // subscribe to one slice
const setSearch = useClubFiltersStore((state) => state.setSearch);
const filters = useClubFiltersStore(useShallow(selectClubFilters)); // object/array selector: useShallow from 'zustand/react/shallow'
```

Rules:
- State and actions are typed separately and merged in `create`; `initialState` makes `reset` trivial.
- Components select slices; calling `useClubFiltersStore()` with no selector re-renders on every change.
- A selector that returns a new object or array needs `useShallow` (`zustand/react/shallow`); without it every store change re-renders the component, and zustand 5 can loop. The React Compiler does not change this: selector results come from the store, not from render.
- Reading a store outside React (an API function, the http token getter) uses `useClubFiltersStore.getState()`.
- Filters that feed a query become part of the query key: `useClubsQuery({ search })`.

## Persistence

```ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/shared/constants/storage-keys';
import { persistStorage } from '@/shared/lib/storage/storage';

export const useClubFiltersStore = create<ClubFiltersState & ClubFiltersActions>()(
  persist(
    (set) => ({ ...initialState, setSearch: (search) => set({ search }), /* ... */ }),
    {
      name: STORAGE_KEYS.clubFilters,                       // add the key to STORAGE_KEYS first
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => ({ onlyMine: state.onlyMine }), // persist only what must survive a restart
      version: 1,                                           // bump (with `migrate`) when the shape changes
    },
  ),
);
```

- `persistStorage` (`@/shared/lib/storage/storage`) is the MMKV-only, string-keyed adapter with the `getItem/setItem/removeItem` shape zustand expects. It is **synchronous**, so `persist` hydrates while `create` runs: the persisted state is there on the first render, `useClubFiltersStore.persist.hasHydrated()` is already `true`, and no "hydrating" flag or splash delay is needed.
- Add every persisted key to `STORAGE_KEYS` in `src/shared/constants/storage-keys.ts`; never pass a literal string as `name`.
- **Never persist secrets through `persistStorage`** (it writes to MMKV, not the keychain). A token is stored with `storage.set(STORAGE_KEYS.authToken, token)` / `storage.get(...)`: keys in `SECRET_KEYS` go to expo-secure-store. A store that holds a secret does not use `persist` at all; see "Reference store: the session" below.
- Engines are swapped inside `src/shared/lib/storage/storage.ts` only; stores and features never import MMKV or SecureStore.

## Reference store: the session

`features/auth/store/session/session.store.ts` (`useSessionStore`) is the real example of a persisted store that holds a secret, so it does **not** use `persist`:

- `session.storage.ts` next to it reads and writes through `storage` by hand: the token under `STORAGE_KEYS.authToken` (a `SECRET_KEY`, so SecureStore) and the user as JSON under `STORAGE_KEYS.authUser` (MMKV). Unreadable or half-missing data counts as signed out.
- `create` seeds the state from `readStoredSession()`, synchronously, so the first render already knows the session.
- Actions write storage and state together (`setSession`, `clearSession`); nothing else touches those keys.
- Exported selectors (`selectIsSignedIn`, `selectUser`, `selectToken`) are the public contract; the root navigator, `config/http.ts` and `config/auth.ts` read state through them, not through the state shape.
- Code outside React subscribes with `useSessionStore.subscribe((state, previous) => ...)` (see `src/config/auth.ts`).

## Exposure

`store/` is one of the two folders another domain or `config/` may import from a feature (the other is `types/`): `import { useSessionStore } from '@/features/auth/store/session/session.store'` is valid from `src/config/http.ts` or from `features/club`. The rest of a feature (api, queries, mutations) stays private to its own domain's features, components and screens.
