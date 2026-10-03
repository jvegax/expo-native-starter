# Feature recipe

Ordered steps for the two most common tasks. Mirror the `club` domain (`src/features/club`, `src/components/club`, `src/screens/club`) for every file. Every import uses `@/` and points at the declaring file; no `index.ts` is created at any step.

## A. New entity inside an existing domain

Example: add `event` to `club` (list the events of a club, create an event).

1. **Types** — `features/club/types/event/event.types.ts` with `ClubEventDto` (wire), `ClubEvent` (domain; prefixed because `Event` is a DOM global), `CreateClubEventInput`, list params if any. `features/club/types/event/event.mappers.ts` with `toClubEvent(dto)` and, when input keys differ from wire keys, `toCreateClubEventBody(input)`.
2. **API** — `features/club/api/event/get-events.api.ts` (`getEvents(clubId, signal?)`), `features/club/api/event/create-event.api.ts` (`createEvent(input)`, body built by the mapper).
3. **Queries** — `features/club/queries/event/event.keys.ts` (`eventKeys.all / lists() / list(clubId)`), `features/club/queries/event/get-events.query.ts` (`eventsQueryOptions(clubId)` + `useEventsQuery(clubId)`).
4. **Mutations** — `features/club/mutations/event/create-event.mutation.ts` (`useCreateEventMutation`, invalidates `eventKeys.list(clubId)`).
5. **Components** — `components/club/event/event-row/{event-row.tsx, event-row.styles.ts}`.
6. **Screens / sections** — either a new screen in `screens/club/event/` (plus a route in `src/app`) or a section component used by an existing screen (`components/club/event/club-events-section/`) that owns the `useEventsQuery` call and its action buttons, so the parent screen only composes.
7. **i18n** — add an `event` group to `features/club/i18n/en.json` and `es.json`. Nothing to register in `config/i18n`: the namespace already exists, and the typed keys update automatically.
8. Run `bunx tsc --noEmit && bunx expo lint`.

## B. New domain

Example: `profile` with a `user` entity (GET /me, update display name).

1. Create the trees. Only the layers you need, but always with the entity level:
   ```
   src/features/profile/
   ├── api/user/{get-me.api.ts, update-me.api.ts}
   ├── queries/user/{user.keys.ts, get-me.query.ts}
   ├── mutations/user/{update-me.mutation.ts}
   ├── types/user/{user.types.ts, user.mappers.ts}
   └── i18n/{en.json, es.json, resources.ts}

   src/components/profile/
   └── user/<component>/{<component>.tsx, <component>.styles.ts}

   src/screens/profile/
   └── user/{profile-screen.tsx, profile-screen.styles.ts}
   ```
2. Fill it following section A, in the same order (types → api → queries → mutations → components → screens).
3. **Register the namespace**: `features/profile/i18n/resources.ts` exports `profileResources = { en, es } as const`; add `profile: profileResources.<lang>` under every language in `src/config/i18n/resources.ts`. Typed `t()` keys come from that file.
4. **Route** (pick the folder with the `navigation-auth` skill: inside a tab, over the tabs, a drawer item, signed-out only): e.g. `src/app/profile.tsx` → `export { ProfileScreen as default } from '@/screens/profile/user/profile-screen';`. For a param route, `src/app/profile/[userId].tsx` reads `useLocalSearchParams` and passes props. Typed hrefs come from `.expo/types/router.d.ts`, which only the dev server regenerates: start `bunx expo start` in the background, wait until that file lists the new path, then stop it (there is no `timeout` on macOS; poll the file in a loop). Until then `router.push('/profile')` fails `tsc`.
5. **Navigation entry**: call `router.push('/profile')` from wherever the user reaches it. Links between domains go through screens and routes, not through imports of each other's internals.
6. `bunx tsc --noEmit && bunx expo lint`. ESLint discovers domains by listing `src/features` and `src/components`, so the new folders get their boundary rules automatically.

## Mocking an endpoint before the backend exists

`features/auth` shows the pattern. The `api/` function keeps its final signature and its body delegates to a mock in `utils/<entity>/mock-<thing>.ts` (simulated latency, deterministic failures to exercise the error UI). A `REAL <X>:` comment in the api file shows the replacement call. Everything above `api/` (mutations, queries, stores, screens) is real code and does not change when the mock goes away. Keep a single mock file per domain so deleting it is the whole cleanup.

## C. Promoting code to shared

When a second domain needs a component, hook, util or type that lives in a domain:

1. Move it to `src/shared/<ui|hooks|utils|types>/<name>/` and strip any domain knowledge (a `ClubCard` does not move; a generic `Card` is extracted from it).
2. Update the original domain to consume the shared version.
3. Shared code never imports from `features/`, `components/` or `screens/`, so pass domain data in through props and callbacks.

## D. Removing an entity or domain

Delete its folders in every tree (`features/<d>`, `components/<d>`, `screens/<d>`), its i18n group (or namespace in `resources.ts`) and its route files. Typecheck tells you what else referenced it; with no barrels, every reference is an explicit import of a deleted path.
