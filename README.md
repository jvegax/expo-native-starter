# Expo Native Starter

Expo starter for iOS and Android apps that open fast and feel native, not like a web page in a wrapper.

- **Native first.** New Architecture, Hermes V1, native stack, native tabs (Liquid Glass on iOS 26, Material on Android), drawer, form sheets, SF Symbols / Material Symbols, Material ripple on Android, large titles on iOS, themed splash, no white flashes in dark mode.
- **Auth shell included.** Sign in, sign up and sign out with a protected stack (`Stack.Protected`): nothing in the app is reachable signed out. The backend is mocked behind three api functions; plugging in real auth stays inside `features/auth` (and `config/` for an SDK), with no change to screens or navigation.
- **Fast by default.** React Compiler, synchronous storage (MMKV) on the first frame, persisted query cache, deferred SDK init, tree shaking and R8 in release builds.
- **Structure that scales.** Folders split by domain and entity, explicit `@/` imports, no barrels, ESLint boundaries that keep it that way.
- **Ready to ship.** Two environments (`preview`, `production`), EAS build and submit profiles, typed i18n in English and Spanish.

The example domain is clubs and their members. Replace it with yours and keep the rules.

Mock credentials: any email with a password of 6+ characters. `error@example.com` fails sign in; `taken@example.com` is already registered.

## Quick start

```bash
bun install
bun run start            # Metro dev server, preview environment
bun run ios              # development build on a simulator (needs Xcode)
bun run android          # development build on an emulator (needs Android Studio)
bun run typecheck && bun run lint
```

The app never runs in Expo Go (MMKV and Nitro Modules are native), always in a development build. No `.env` is needed; copy `.env.example` only to change defaults.

## Stack

| Concern | Choice |
| --- | --- |
| Runtime | Expo SDK 57, React Native 0.86, React 19.2, React Compiler |
| Navigation | Expo Router (typed routes, native stack, `NativeTabs`, drawer, `Stack.Protected` auth gate) |
| Server state | TanStack Query v5 with an opt-in persisted cache |
| Client state | Zustand |
| Storage | MMKV v4 + expo-secure-store for secrets |
| UI | `StyleSheet` + design tokens, light/dark themes, Legend List, expo-image, Reanimated 4 |
| i18n | i18next + expo-localization, typed keys |
| Tooling | bun, ESLint 9, TypeScript strict, EAS |

## Architecture

```
src/
├── app/          Expo Router routes only; each file renders a screen
├── screens/      <domain>/<entity>/ — fetch data and compose components; navigation/ holds the navigators
├── components/   <domain>/<entity>/ — domain UI, pure props in, JSX out
├── features/     <domain>/<layer>/<entity>/ — api, queries, mutations, types, store, i18n
├── shared/       generic code: design system, theme, http, storage, utils
├── config/       composition root: env, query client, http, i18n, SDKs, bootstrap
└── providers/    React providers, composed once
```

Four rules, all enforced by ESLint:

1. **Views and data are separate.** `features/` has no components; `screens/` and `components/` have no `fetch`.
2. **Imports go one way:** `app → screens → components → features → shared`. Screens are the only place two domains meet.
3. **Explicit imports.** Always `@/path/to/file`; no `./`, no `index.ts` barrels.
4. **Small files.** A component grows by extracting sibling files (lint fails at 150 lines).

A read is four small files: `api/` calls the HTTP client, `types/*.mappers.ts` turns the DTO into a domain type, `queries/` wraps it in `queryOptions`, and the screen calls the hook. A write is a mutation hook that calls `api/` and invalidates the affected query keys.

The `club` domain is the reference implementation. Full rules, dependency table and patterns: [docs/architecture.md](docs/architecture.md).

## Navigation and auth

```
Root Stack (auth gate)
├── (auth)  sign-in, sign-up                         signed out only
└── (app)   details/[id], sheet                      signed in only
    └── Drawer: settings
        └── NativeTabs: Home, Clubs, Profile         one native Stack per tab
```

The session is read synchronously at launch, so the app opens straight on home or sign-in. Signing in or out only updates the session store; the protected stack swaps screens by itself. To connect a real backend or an auth SDK, follow `.agents/skills/navigation-auth/references/swap-to-real-auth.md`.

## Performance

The defaults are already tuned; the main rules for new code are:

- No `useMemo`, `useCallback` or `React.memo` for performance (the React Compiler does it), and never `eslint-disable` a hooks rule.
- Lists use `<List>` (`@/shared/ui/list/list`), images use `<Image>` (`@/shared/ui/image/image`).
- Keep `_layout.tsx` files and the startup path light; new SDKs go in `deferredInitializers`.
- Only theme tokens in styles; a raw colour is a white flash in dark mode.
- Measure on a release build before claiming a speedup.

What is configured, why, and how to measure it: [docs/performance.md](docs/performance.md).

## Environments and builds

`APP_ENV` (`preview` by default, or `production`) selects the environment in `app.config.ts`. Both variants install side by side.

| | production | preview (default) |
| --- | --- | --- |
| App name | My App | My App (Preview) |
| Bundle id | `com.jvegax.nativetemplate` | `com.jvegax.nativetemplate.preview` |
| API | `https://api.example.com` | `https://api-preview.example.com` |

`EXPO_PUBLIC_API_URL` in `.env` overrides the API URL. `src/config/env.ts` is the only place the app reads environment values.

EAS profiles in `eas.json`: `dev-android` and `dev-ios` (development clients), `preview` (internal testers), `production` (stores).

```bash
bun run eas:login && bun run eas:init   # first time: paste the project id into app.config.ts
bun run build:dev:android               # development client on EAS
bun run build:local dev-android         # same build on this machine, output in build/
bun run build:production:all            # store builds
bun run submit:production:ios           # upload the latest production build
```

Adding, removing or upgrading a library with native code needs a new development build; a JS reload is not enough. Submit profiles carry placeholder credentials (`appleId`, `ascAppId`, `appleTeamId`, Google service account in `credentials/`).

## Scripts

| Script | What it does |
| --- | --- |
| `start`, `start:production` | Metro dev server |
| `ios`, `android` | Local development build |
| `lint`, `typecheck`, `doctor` | ESLint, `tsc --noEmit`, `expo-doctor` |
| `config`, `config:production` | Print the resolved config |
| `build:<profile>:<platform>` | EAS build |
| `build:local <profile> [platform]` | Build on this machine into `build/` |
| `submit:<profile>:<platform>` | Upload the latest build |

## AI coding agents

`AGENTS.md` is the entry point. `.agents/skills/app-architecture/` (symlinked from `.claude/skills/`) tells an agent where every file goes and which shared code already exists; `.agents/skills/navigation-auth/` covers routes, the auth gate, tabs, the drawer and swapping in real auth; `.agents/skills/forms-keyboard/` covers inputs, forms and the keyboard. Design and motion follow two official Expo skills, `expo-design-system` (tokens, components, the named native-slop tells) and `expo-animation` (made with Emil Kowalski), installed with the `skills` CLI and pinned in `skills-lock.json` (`bunx skills update` to refresh them). `AGENTS.md` lists where this repo overrides them.

## License

[MIT](./LICENSE)
