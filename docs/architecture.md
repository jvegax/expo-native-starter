# Architecture

## Dependency rules

ESLint (`eslint.config.js`) turns these into errors, so a wrong import fails `bun run lint`.

| From | May import | Never |
| --- | --- | --- |
| `app/` | `screens/` (screens and `screens/navigation` layouts), `providers/`, `config/`, `shared/` | `features/`, `components/` |
| `screens/` | `components/` and `features/` of any domain, `shared/`, `config/env`, `config/app` | `app/`, `providers/`, other screens |
| `components/X` | `components/X` (own domain), `features/`, `shared/`, `config/env`, `config/app` | `screens/`, other domains' components |
| `features/X` | `features/X`, other features' `types/` and `store/`, `shared/`, `config/env`, `config/app` | views, other features' api/queries/mutations |
| `shared/` | `shared/`, `config/env`, `config/app` | everything else |
| `config/` | what it composes, plus `features/*/i18n` and `features/*/store` | `app/`, views |

Screens are the only place where domains meet. A component needed by two domains means its generic part belongs in `shared/ui`.

## A domain across three trees

```
features/club/
├── api/club/get-clubs.api.ts
├── api/member/invite-member.api.ts
├── queries/club/club.keys.ts
├── queries/club/get-clubs.query.ts
├── mutations/member/invite-member.mutation.ts
├── types/club/club.types.ts          ClubDto (wire), Club (domain)
├── types/club/club.mappers.ts        toClub(dto)
└── i18n/en.json, es.json             keys grouped by entity

components/club/
├── club/club-card/club-card.tsx
└── member/member-row/member-row.tsx

screens/club/club/
├── club-list-screen.tsx
└── club-detail-screen.tsx
```

Every layer is split by entity, so an entity can be found, grown or deleted as a unit.

## Data flow

**Reading.** The screen calls `useClubsQuery(params)`. The hook uses `clubsQueryOptions(params)`, whose `queryFn` calls `getClubs` in `api/`, which calls the shared `http` client and maps each `ClubDto` to a `Club` with `toClub`. The screen renders the result through `<AsyncState>` (loading, error with retry, empty, data) and never knows there is an HTTP call.

- `queryOptions()` is the unit of reuse: the same object feeds `useQuery`, `prefetchQuery`, `setQueryData` and `getQueryData`.
- Hierarchical key factories (`clubKeys.lists()`, `clubKeys.detail(id)`) let a mutation invalidate every club list without knowing its params.
- DTOs stay in `api/` and the mappers. Screens and components only see domain types, so an API change touches one mapper.
- Every read forwards `signal`, so stale requests are cancelled.

**Writing.** `InviteMemberButton` calls `mutate({ clubId, email })` on `useInviteMemberMutation`. The hook calls `inviteMember` in `api/` and, on success, invalidates `memberKeys.list(clubId)` and `clubKeys.detail(clubId)`. Components never touch the query client; UI reactions (toast, navigation) go in `mutate(input, { onSuccess })`.

## Startup and providers

`app/_layout.tsx` calls `bootstrap()` (`config/bootstrap.ts`) at module scope, before any screen mounts. It initialises i18n (language read synchronously from MMKV), critical SDKs, the HTTP client (token from the session store, 401 → sign out), the auth cleanup subscription (`setupAuth`), the TanStack focus and online managers, and schedules deferred SDKs. It then renders `<RootNavigator />` inside the providers.

Providers are composed once in `providers/app-providers.tsx`, outermost first: `GestureHandlerRootView` → `KeyboardProvider` (react-native-keyboard-controller on Android; a passthrough on iOS) → `PersistQueryClientProvider` → `ThemeProvider` (tokens, navigation theme, system UI) → `I18nextProvider`. Expo Router already renders the `SafeAreaProvider`.

## Navigation and auth

```
Root Stack (screens/navigation/root/root-navigator.tsx)   ← the only auth gate
├── Stack.Protected guard={!isSignedIn}
│   └── (auth) Stack: sign-in, sign-up
└── Stack.Protected guard={isSignedIn}
    └── (app) Stack: details/[id], sheet (formSheet)        ← covers drawer and tabs
        └── (drawer) Drawer: settings
            └── (tabs) NativeTabs: (home), clubs, profile    ← each tab is its own native Stack
```

- `useSessionStore` (`features/auth/store/session`) is seeded synchronously from SecureStore/MMKV, so the guard is right on the first frame; no splash handling or loading state.
- Signing in or out only changes the store. `Stack.Protected` then swaps the groups and drops their history; nothing calls `router.replace`.
- Auth is mocked behind `features/auth/api/session/*.api.ts`; swapping in a real backend changes only those bodies.
- Navigator layouts live in `screens/navigation/` and `_layout.tsx` files re-export them, because routes may not import features.

Full rules (where a new screen goes, tabs and drawer limits, swapping in real auth): `.agents/skills/navigation-auth/`. Forms, inputs and the keyboard: `.agents/skills/forms-keyboard/`.

## Design system and theming

- `shared/ui` (`Screen`, `Text`, `Button`, `AsyncState`, `List`, `Image`) knows nothing about the domain.
- Styles live in a sibling `.styles.ts` as `createStyles = (theme) => StyleSheet.create(...)`, consumed with `useStyles(createStyles)`, which caches one style object per factory and theme.
- Styles use only tokens: `theme.colors.*` (semantic names), `spacing`, `sizes`, `radii`, `textVariants`, `shadows`. Light and dark themes map the same names to different values.
- The same tokens drive the navigation theme, the native root view colour and the splash colours.

## Internationalization

One namespace per domain (`features/<domain>/i18n/{en,es}.json`) plus `common` in `shared/i18n`, registered in `config/i18n/resources.ts`. `src/types/i18next.d.ts` types every key, so a typo fails `tsc`. Dates and numbers go through the `Intl` wrappers in `shared/utils/format.ts`.

## Patterns

| Pattern | Where |
| --- | --- |
| [Screaming architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html), [vertical slices](https://www.jimmybogard.com/vertical-slice-architecture/) | `features/`, `components/`, `screens/` split by domain and entity |
| [Composition root](https://blog.ploeh.dk/2011/07/28/CompositionRoot/) | `config/bootstrap.ts`, `providers/app-providers.tsx` |
| [Container / presentational](https://www.patterns.dev/react/presentational-container-pattern/) | `screens/` fetch and compose, `components/` render props |
| [Facade](https://refactoring.guru/design-patterns/facade) | `shared/lib/http/client.ts` wraps `fetch` |
| [Adapter](https://refactoring.guru/design-patterns/adapter), [DTO](https://martinfowler.com/eaaCatalog/dataTransferObject.html) | `types/*.mappers.ts`, `shared/lib/storage/storage.ts` |
| [Factory](https://refactoring.guru/design-patterns/factory-method) | Query key factories, `clubsQueryOptions(params)`, `createStyles(theme)` |
| [Strategy](https://refactoring.guru/design-patterns/strategy) | Storage engine per key (MMKV or SecureStore), light / dark theme |
| [Command](https://refactoring.guru/design-patterns/command) | Mutation hooks |
| [Observer](https://refactoring.guru/design-patterns/observer) | `config/auth.ts` subscribes to the session store; `Stack.Protected` re-renders from it |
| [Seam](https://martinfowler.com/bliki/LegacySeam.html) | `features/auth/api/session/*.api.ts` call the mock today, the real backend tomorrow |
| [No barrel files](https://tkdodo.eu/blog/please-stop-using-barrel-files) | No `index.ts` under `src/`, lint-enforced |
