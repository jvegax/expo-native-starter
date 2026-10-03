---
name: app-architecture
description: Architecture rules for this Expo starter (screaming architecture, entity-split features, domain-split components and screens, TanStack Query v5 data layer, Zustand, themed design system, i18next). Use this skill whenever you create or change anything under src/ - a feature, entity, screen, route, component, hook, API call, query, mutation, store, translation, theme token, design-system component, env variable, provider or SDK integration - even when the user only says "add X", "fetch Y", "show a list of Z" or "wire up W" without mentioning architecture. It tells you where every file goes, how it is named, which layers may import which, and which shared code already exists so nothing is written twice.
---

# App architecture

This project is a starter template. Everything you add is a pattern the next app copies, so the structure is strict on purpose: a reader should understand the business from the folder tree ("screaming architecture"), every file should do one thing, and nothing should exist twice. `src/features/club`, `src/components/club` and `src/screens/club` are the reference implementation; when in doubt, open them and mirror them.

## Four principles

1. **The tree screams the domain.** `features/`, `components/` and `screens/` are each split by business domain, and inside a domain by entity: `features/<domain>/<layer>/<entity>/`, `components/<domain>/<entity>/<component>/`, `screens/<domain>/<entity>/`. A new teammate finds "where members are invited" by reading folder names, never by grepping.
2. **Data and views are separate trees.** `features/` holds the domain logic (types, api, queries, mutations, stores). `components/` and `screens/` hold the views that consume it. A view imports a feature; a feature never imports a view.
3. **Small files that grow as a tree.** A component is one `.tsx` of at most ~100-150 lines (ESLint enforces 150). When it grows, extract child components as sibling files in the same folder; the parent becomes composition. Same for the data layer: one API function, one query, one mutation per file.
4. **Explicit imports, zero duplication.** Every import uses the `@/` alias and points at the file that declares the symbol: no relative paths, no `index.ts` barrels, no `export * from`. Global types (`Id`, `Paginated`, `Nullable`...), the http client, the design system, theme tokens and utilities live once in `src/shared`. Before writing a helper, type or component, check `src/shared` and the reference domain.

## Folder map

```
src/
├── app/            Expo Router routes ONLY. Thin files that re-export a screen (or a navigator layout) from @/screens.
├── screens/        One folder per domain, then per entity. A screen is composition: queries + components.
│                   screens/navigation/ holds the navigator layouts (root gate, stacks, drawer, tabs).
├── components/     One folder per domain, then per entity, then per component. Domain UI (ClubCard, MemberRow).
├── features/       One folder per domain. Data and domain logic only, each layer split by entity (below).
├── shared/         Cross-domain code: ui/ (design system), theme/, lib/ (http, storage, perf), hooks/, utils/, types/, constants/, i18n/ (common namespace).
├── config/         Composition root: env, app constants, query client, query persister, query managers, http setup, i18n init, sdks/, bootstrap.
├── providers/      React providers composed once in app-providers.tsx.
└── types/          Ambient .d.ts only (env, i18next, tanstack-query registrations).
```

Read `references/config-and-i18n.md` before touching `config/`, `providers/`, env vars, SDKs or translations. Load the `navigation-auth` skill before touching routes, `_layout.tsx` files, tabs, the drawer or the auth/session flow, and the `forms-keyboard` skill before building a form, an input or anything the keyboard can cover. Before building or restyling a screen or a user-visible component, also load the `expo-taste-skill` skill (Design Read, dials, archetype, taste tells, pre-flight): it owns how a view should look and read, this skill owns where its files go.

## Imports

- **Always `@/`**, from any file to any file, including siblings: `import { createStyles } from '@/components/club/club/club-card/club-card.styles'`. ESLint rejects `./` and `../`.
- **Always the declaring file.** `import { Club } from '@/features/club/types/club/club.types'`, `import { Text } from '@/shared/ui/text/text'`, `import { useStyles } from '@/shared/theme/use-styles'`. The path is the documentation.
- **No barrels.** There is no `index.ts` under `src/` except Expo Router's `index.tsx` route files, and `export * from` is a lint error. Barrels hide dependencies, break tree-shaking and create circular imports; the public surface of a folder is its dependency rules, not a re-export list.
- One module per concern means one import line per module; a screen with ten imports from `@/shared` is normal.

## Domain anatomy

A domain (`club`, `auth`, `payments`) spans three trees. Every layer is subdivided by entity; layers never hold loose files at their root.

```
features/club/                                   data + domain logic (no React components)
├── api/        club/ member/     one pure async function per endpoint (`get-clubs.api.ts`)
├── queries/    club/ member/     `<entity>.keys.ts` + `get-<x>.query.ts` (queryOptions + hook)
├── mutations/  club/ member/     `<verb>-<entity>.mutation.ts` (hook that invalidates/updates cache)
├── types/      club/ member/     `<entity>.types.ts` (Dto + domain + inputs) + `<entity>.mappers.ts`
├── hooks/ store/ utils/          created on demand, same entity split
└── i18n/       en.json es.json resources.ts    one namespace per domain, keys grouped by entity

components/club/                                 domain UI
├── club/       club-card/{club-card.tsx, club-card-header.tsx, club-card.styles.ts}
└── member/     club-members-section/{club-members-section.tsx, .styles.ts}  member-row/{member-row.tsx, member-row.styles.ts}  invite-member-button/{invite-member-button.tsx}

screens/club/                                    composition only
└── club/       club-list-screen.tsx  club-detail-screen.tsx  club-screens.styles.ts
```

A domain may exist in only one tree (`features/home` and `features/account` have just `i18n/`; `screens/navigation` has no other tree at all).

`features/auth` is the second reference: a session store (`store/session/`), mutations without queries, a hook (`hooks/session/use-confirm-sign-out.ts`), validation utils, and the mock seam (`api/session/*.api.ts` call `utils/session/mock-auth.ts`).

`references/feature-recipe.md` has the ordered file list for a new domain and for a new entity.

## Dependency rules (ESLint enforces them)

| From            | May import                                                                                             | Never                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `app/`          | `@/screens/*`, `@/providers/*`, `@/config/*`, `@/shared/*`                                             | `features/`, `components/`                             |
| `screens/`      | `@/components/*` (any domain), `@/features/*` (any domain), `@/shared/*`, `@/config/env`, `@/config/app` | `app/`, `providers/`, rest of `config/`, other screens (any `*-screen` file, anything under another domain's `screens/`; own-domain `.styles` are fine) |
| `components/X`  | `@/components/X/*` (own domain only), `@/features/*` (any domain), `@/shared/*`, `@/config/env`, `@/config/app` | `app/`, `providers/`, `screens/`, other domains' components, rest of `config/` |
| `features/X`    | `@/features/X/*`, other features' `types/*` and `store/*`, `@/shared/*`, `@/config/env`, `@/config/app` | `app/`, `providers/`, `screens/`, `components/`, rest of `config/`, other features' api/queries/mutations |
| `shared/`       | `@/shared/*`, `@/config/env`, `@/config/app`                                                           | everything else                                        |
| `providers/`    | `@/config/*`, `@/shared/*`                                                                             | `features/`, `components/`, `screens/`, `app/`         |
| `config/`       | everything it composes, plus `@/features/*/i18n/*` and `@/features/*/store/*` (the only feature imports) | `app/`, `screens/`, `components/`                    |

Screens compose across domains (a home screen may render `ClubCard` and call `useClubsQuery`); components stay inside their domain. A navigator layout that needs app state (the auth gate reads the session store) lives in `screens/navigation/<navigator>/*-layout.tsx` (never `*-screen.tsx`) and the route `_layout.tsx` re-exports it, because `app/` may not import `features/`. Two domains needing the same component means the generic part belongs in `shared/ui`. Needing any other exception is a signal the code is in the wrong folder, not a reason to disable the rule.

## Checklists

**New API call / query / mutation** (full patterns in `references/data-layer.md`)
1. Types first: `features/<d>/types/<entity>/<entity>.types.ts` (Dto = wire shape, domain = what the app uses, `*Input` for writes). Add `<entity>.mappers.ts` only when Dto differs from the domain.
2. `features/<d>/api/<entity>/<verb>-<entity>.api.ts`: `async function`, takes `(params, signal?)`, calls `http.<method>`, maps Dto to domain, returns the domain type. No React, no query client.
3. Reads: `features/<d>/queries/<entity>/<entity>.keys.ts` (key factory) and `get-<x>.query.ts` exporting `<x>QueryOptions()` built with `queryOptions()` and `use<X>Query()`.
4. Writes: `features/<d>/mutations/<entity>/<verb>-<entity>.mutation.ts` exporting `use<Verb><Entity>Mutation()`, which invalidates or `setQueryData`s the affected keys in `onSuccess`.

**New component**
1. Decide the owner: renders a domain entity → `components/<d>/<entity>/<name>/`; generic and used (or clearly reusable) by two domains → `shared/ui/<name>/`.
2. Folder per component: `<name>.tsx`, `<name>.styles.ts` (`createStyles = (theme: Theme) => StyleSheet.create(...)` consumed with `useStyles`). No `index.ts`.
3. Props as `type <Name>Props = {...}` next to the component. Reuse domain types (`Club`, `Pick<Club, 'name'>`) from `@/features/<d>/types/...`, never redeclare them.
4. Only tokens from `theme` in styles: no raw hex, no magic paddings. Text through `<Text variant color>`, buttons through `<Button>`, loading/error/empty through `<AsyncState>`.
5. Above ~100 lines or a second responsibility: extract children as sibling files (`club-card-header.tsx`). See `references/components.md`.

**New screen + route**
1. Screen in `screens/<d>/<entity>/<name>-screen.tsx`: calls query hooks, composes components, picks its container (step 4), sets `<Stack.Screen options={{ title }} />`. Route params arrive as props.
2. Route file in `src/app/...`: `export { XScreen as default } from '@/screens/<d>/<entity>/<name>-screen'`, or a 5-line component that reads `useLocalSearchParams` and passes props. Nothing else lives in `src/app`. Which folder (inside a tab, over the tabs, a sheet, signed-out only) is decided by the `navigation-auth` skill's "Where does a new screen go?" table.
3. Navigate with typed hrefs: `router.push({ pathname: '/clubs/[clubId]', params: { clubId } })`. Group folders like `(app)` are not part of the URL.
4. Container: a screen with text inputs in `<FormScrollScreen>` (forms-keyboard skill); static content in `<ScrollScreen>` (first native child, so large titles collapse and tab bars inset); a data list in `<List>` (inside `<Screen edges={['left', 'right']}>` when it needs loading/error states, as `ClubListScreen` does, so the list scrolls under the tab bar); non-scrolling content in `<Screen>` (its bottom safe-area edge clears the tab bar).

**New translation**
Add the key to every language file of the domain namespace (`features/<d>/i18n/*.json`), grouped under the entity. Use `useTranslation('<domain>')`; strings shared across domains go to `shared/i18n` (`common` namespace). Keys are typed: `bunx tsc --noEmit` fails on typos.

**New domain** → follow `references/feature-recipe.md` (creates the three trees, registers the i18n namespace in `config/i18n/resources.ts`, adds the route).

**Shared client state** (filters that survive navigation, session, UI prefs) → `references/state.md`. Server data never goes into a store.

**Env var / SDK / provider** → `references/config-and-i18n.md` and `src/config/sdks/README.md`.

## Naming

| Thing                 | File                                   | Export                          |
| --------------------- | -------------------------------------- | ------------------------------- |
| API function          | `get-clubs.api.ts`                     | `getClubs`                      |
| Query keys            | `club.keys.ts`                         | `clubKeys`                      |
| Query                 | `get-clubs.query.ts`                   | `clubsQueryOptions`, `useClubsQuery` |
| Mutation              | `update-club.mutation.ts`              | `useUpdateClubMutation`         |
| Types / mappers       | `club.types.ts` / `club.mappers.ts`    | `Club`, `ClubDto`, `UpdateClubInput` / `toClub` |
| Component             | `club-card/club-card.tsx`              | `ClubCard`, `ClubCardProps`     |
| Styles                | `club-card.styles.ts`                  | `createStyles`                  |
| Screen                | `club-list-screen.tsx`                 | `ClubListScreen`                |
| Store                 | `club-filters.store.ts`                | `useClubFiltersStore`           |
| Hook                  | `use-club-permissions.ts`              | `useClubPermissions`            |
| i18n namespace        | `i18n/resources.ts`                    | `clubResources`                 |

Files are kebab-case with a layer suffix; exports are PascalCase for components/types and camelCase otherwise. Named exports everywhere; `default` only in `src/app` routes because Expo Router requires it. A file is named after what it exports, never `index`. Functions, hooks and `*Input` types are named after the endpoint intent (`getMe`, `useMeQuery`, `UpdateMeInput`), entities after the domain (`User`); if a domain name collides with a DOM global (`Event`), prefix it (`ClubEvent`).

## Where does state live?

| State                                              | Home                                   |
| -------------------------------------------------- | -------------------------------------- |
| Anything fetched from the API                      | TanStack Query cache (queries/mutations) |
| Local UI state of one component/screen             | `useState` / `useReducer`              |
| Client state shared across screens (session, filters, drafts, prefs) | Zustand store in `features/<d>/store/<entity>/` (reference: `features/auth/store/session/session.store.ts`) |
| Derived from server data                           | `select` in the query, or compute in render |
| Form state                                         | `useUncontrolledForm` (`@/shared/hooks/use-uncontrolled-form`): values in a ref, errors in state. No form library, never controlled inputs (forms-keyboard skill) |

## Reuse before writing

| Need                                  | Already exists                                           |
| ------------------------------------- | -------------------------------------------------------- |
| HTTP call with auth, params, JSON, errors | `http.get/post/patch/put/delete` in `@/shared/lib/http/client` |
| Typed errors                          | `HttpError` (`kind`, `status`, `body`, `isUnauthorized`) in `@/shared/lib/http/errors`, registered as TanStack's default error |
| Page mapping                          | `mapPaginated` in `@/shared/utils/pagination`            |
| Pagination / API error body           | `Paginated`, `PaginationParams`, `ApiErrorBody` in `@/shared/types/api.types` |
| Ids / dates / nullable                | `Id`, `ISODateString`, `Nullable`, `Maybe` in `@/shared/types/common.types` |
| Loading / error / empty rendering     | `<AsyncState>` in `@/shared/ui/async-state/async-state`  |
| Screen container, text, button        | `<Screen>`, `<Text>`, `<Button>` in `@/shared/ui/<name>/<name>` |
| Scrollable static screen              | `<ScrollScreen>` in `@/shared/ui/scroll-screen/scroll-screen` (`contentInsetAdjustmentBehavior="automatic"`: large titles collapse, content clears the tab bar) |
| Text input with label and error       | `<TextField>` in `@/shared/ui/text-field/text-field`: uncontrolled (no `value` prop), refs typed `TextFieldHandle`. `TextInput` from `react-native` is a lint error. |
| Form values, errors, Next chain, submit | `useUncontrolledForm` in `@/shared/hooks/use-uncontrolled-form` (forms-keyboard skill) |
| Screen with inputs (keyboard-aware)   | `<FormScrollScreen>` in `@/shared/ui/form-scroll-screen/form-scroll-screen` (native keyboard insets on iOS, react-native-keyboard-controller on Android). `KeyboardAvoidingView` is a lint error. |
| Platform icon                         | `<Icon ios="<SF Symbol>" android="<Material Symbol>" />` in `@/shared/ui/icon/icon` (expo-symbols). No icon font library. |
| Settings-style menu rows              | `<ListSection>` + `<ListRow>` in `@/shared/ui/list-section/list-section`, `@/shared/ui/list-row/list-row` (short static menus; data lists use `<List>`) |
| Session (signed in?, user, sign out)  | `useSessionStore` + `selectIsSignedIn` / `selectUser` in `@/features/auth/store/session/session.store`, `useConfirmSignOut` in `@/features/auth/hooks/session/use-confirm-sign-out`. See the `navigation-auth` skill. |
| Any list of rows                      | `<List>` in `@/shared/ui/list/list` (LegendList; `keyExtractor` + `estimatedItemSize` required; `contentInsetAdjustmentBehavior="automatic"` by default). `FlatList` is a lint error. |
| Any image                             | `<Image>` and `prefetchImages` in `@/shared/ui/image/image` (expo-image, memory + disk cache). `Image` from `react-native` is a lint error. |
| Theme-aware styles                    | `useStyles` in `@/shared/theme/use-styles` (module cache: one style object per factory and theme), `useTheme` in `@/shared/theme/use-theme`, `Theme` type in `@/shared/theme/theme.types` |
| Navigation (header) colours           | `lightNavigationTheme` / `darkNavigationTheme` in `@/shared/theme/navigation-theme`, applied by `src/providers/theme-provider.tsx`. Never set header colours per screen. |
| Press feedback colour                 | `theme.colors.ripple` (Android `android_ripple`), see `Button` and `ClubCard` |
| Tokens                                | `theme.colors.*`, `theme.spacing.*`, `theme.sizes.*`, `theme.radii.*`, `theme.textVariants.*`, `theme.shadows.*` (defined in `@/shared/theme/tokens/<token>`) |
| Debounce                              | `useDebouncedValue` in `@/shared/hooks/use-debounced-value` |
| Locale-aware dates and numbers        | `formatDate`, `formatNumber` in `@/shared/utils/format` (pass `i18n.language`; formatters are cached) |
| Persistence contract                  | `storage` (synchronous `get/set/remove`; MMKV, SecureStore for `SECRET_KEYS`) and `persistStorage` (MMKV-only adapter for zustand `persist` and TanStack) in `@/shared/lib/storage/storage` |
| Storage keys                          | `STORAGE_KEYS`, `SECRET_KEYS` in `@/shared/constants/storage-keys` (`authToken` is secret; `authUser` is MMKV) |
| Startup / responsiveness marks        | `markScreenInteractive`, `observeLongTasks` in `@/shared/lib/perf/startup-metrics` |
| Persisting a query to disk            | `meta: { persist: true }` on its `queryOptions` (non-personal data only), see `references/data-layer.md` |
| Default page size, app name           | `appConfig` in `@/config/app`                            |

## Performance rules

The full rationale is in `docs/performance.md`. The short version:

- **The React Compiler is on.** Write plain components; no `useMemo` / `useCallback` / `React.memo` for performance. Keep them only to pin an effect dependency. Never `eslint-disable` a hooks rule (`react-hooks/rule-suppression` is an error): the compiler skips that code. `'use no memo'` only to bisect a compiler bug.
- **Share across instances at module scope**, not with hooks: `createStyles` at module scope in `.styles.ts`, expensive objects (formatters) in module caches.
- **Zustand:** select slices; a selector returning a new object or array uses `useShallow` from `zustand/react/shallow`.
- **Startup:** nothing heavy in `_layout.tsx` (every layout is evaluated at startup). New SDKs go to `deferredInitializers` unless they must observe startup (crash reporting). No async read on the startup path: `storage` is synchronous.
- **Data:** detail queries start from list data (`placeholderData`), the next screen's data is prefetched on `onPressIn`, pull-to-refresh uses local `isPullRefreshing` state (never `refreshing={query.isRefetching}`). Persist only non-personal queries.
- **Lists and images:** `<List>` and `<Image>` only; rows are pure, images in rows get `recyclingKey={item.id}`.
- **Native feel:** colours only from tokens (the navigation theme and system UI follow them). Pressables use `android_ripple` with `theme.colors.ripple` and a static style on Android, a `pressed` style on iOS, and only when they have `onPress`. Animations prefer Reanimated 4 (CSS transitions, or worklets with `.get()` / `.set()` on shared values).
- **Native code:** any new native dependency means `bunx expo install`, a new development build, and telling the user. Never upgrade `react-native-nitro-modules` on its own (it is pinned exactly).

## Done criteria

Work is finished when all of these hold:

- `bunx tsc --noEmit` and `bunx expo lint` pass (lint covers the 150-line cap, the `@/`-only imports, the barrel ban and the import boundaries).
- No `index.ts` was created under `src/` (route `index.tsx` files in `src/app` are the only exception), every layer file sits under an entity folder, every import points at the declaring file.
- No new type, helper or component duplicates something in `src/shared` or in the reference domain.
- New strings exist in every language file; new env vars are validated in `src/config/env.ts` and typed in `src/types/env.d.ts`.
- Any new native dependency was installed with `bunx expo install` and the user was told a development build is required.

## References

- `references/feature-recipe.md` — ordered steps for a new domain or a new entity, with the file list.
- `references/data-layer.md` — api functions, key factories, `queryOptions`, `skipToken`, infinite queries, mutations, cache updates, optimistic updates, prefetching, `placeholderData`, the persisted cache and the query managers.
- `references/components.md` — the component tree, splitting heuristics, styles pattern, press feedback, lists, images, design-system usage.
- `references/state.md` — when Zustand is justified, the store template and persistence with `persistStorage`.
- `references/config-and-i18n.md` — env, `app.config.ts`, bootstrap, providers, SDK registration (critical or deferred), adding languages and namespaces.
- `.agents/skills/navigation-auth/SKILL.md` (separate skill) — route tree, auth gate, mocked session, drawer, native tabs, where a new screen goes.
- `.agents/skills/expo-taste-skill/SKILL.md` (separate skill) — native taste: Design Read, dials, screen archetypes, composition and copy rules, taste tells T1-T20, pre-flight; `references/repo-bindings.md` maps it to this repo.
