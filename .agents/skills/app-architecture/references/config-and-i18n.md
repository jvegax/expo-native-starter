# Config, bootstrap, providers and i18n

## `src/config/` (composition root)

| File | Purpose |
| --- | --- |
| `env.ts` | Reads `expoConfig.extra` (filled by `app.config.ts` from `APP_ENV`) and `expoConfig.version`, validates with zod, exports `env` (`APP_ENV`, `API_URL`, `APP_VERSION`, `isProduction`). Fails fast on a bad config. |
| `app.ts` | Non-environment constants (`appConfig.name`, `defaultPageSize`). |
| `query-client.ts` | The single `QueryClient` and its defaults (staleTime, retry policy, `gcTime` = `QUERY_CACHE_MAX_AGE` so persisted queries are not collected first). |
| `query-persister.ts` | `queryPersister` (TanStack async-storage persister over `persistStorage`, i.e. MMKV, key `STORAGE_KEYS.queryCache`, throttled to 1 s) and `QUERY_CACHE_MAX_AGE` (24 h). |
| `query-managers.ts` | `setupQueryManagers()`: `focusManager` follows `AppState`, `onlineManager` follows `expo-network`, so queries refetch on foreground and pause offline. |
| `http.ts` | `setupHttp()` wires `baseUrl`, the token getter and the 401 handler into the shared http client. |
| `i18n/` | `languages.ts` (supported list), `resources.ts` (namespace registry), `i18n.ts` (i18next instance). |
| `sdks/` | One file per third-party SDK + `initialize-sdks.ts` registry. See `src/config/sdks/README.md`. |
| `bootstrap.ts` | Runs once from `src/app/_layout.tsx` at module scope, between `performance.mark('bootstrap:start')` and `'bootstrap:end'`: i18n import, `initializeCriticalSdks()` (first, so crash reporting observes the rest), `setupHttp()`, `setupQueryManagers()`, `scheduleDeferredSdks()`. Synchronous and on the startup path: keep it short. |

`config/` may import a feature's `i18n/` and `store/` folders (it composes them) but features, components and screens never import `config/` beyond `env` and `app`.

### Environments

`app.config.ts` (root; there is no `app.json`) is the only Expo config: plugins (splash screen, build properties, secure store, image, localization), `experiments` (typed routes, React Compiler), the root `backgroundColor` and the environment map. Native settings go there or in a config plugin, never in `ios/` or `android/`. It owns the environment map: `production` and `preview`, selected by `APP_ENV` (default `preview`). Each entry sets `name`, `scheme`, `appId` (bundle id / package) and `apiUrl`; the resolved values are exposed under `extra` and `src/config/env.ts` validates them. `eas.json` sets `APP_ENV` per build profile.

### Adding an environment-dependent value

1. `app.config.ts`: add the field to `EnvironmentConfig` and to both entries of `environments`, then expose it under `extra` (public values only; they ship inside the bundle).
2. `src/config/env.ts`: add it to the zod schema and to the parsed object.
3. Consume `env.<NAME>` from `config/` or `shared/`; features, components and screens read `env` (`@/config/env`) only when there is no better home.

### Adding a machine-level override or an EAS-hosted variable

1. `.env.example` (committed) documents it; developers set it in `.env` / `.env.local` (git-ignored). On EAS, create it with `bunx eas-cli env:create` in the matching environment (`preview` / `production`) and pull it with `bun run env:pull:<env>`.
2. `src/types/env.d.ts`: add it to `ProcessEnv`.
3. Read it in `app.config.ts` (`process.env.X`) and pass it through `extra`, or, for `EXPO_PUBLIC_*` values, read it with static dot access where needed. Config-time variables (`APP_ENV`, `EAS_PROJECT_ID`) never need the `EXPO_PUBLIC_` prefix.

### Adding an SDK

Follow `src/config/sdks/README.md`: install with `bunx expo install`, one `init<Sdk>()` file, register in `sdks/initialize-sdks.ts` in `deferredInitializers` (run in `requestIdleCallback`, the default) or, only for crash reporting, `criticalInitializers` (synchronous, before the first render), wrap the tree in `src/providers/` if needed, expose to features through a `src/shared/lib/<sdk>/` wrapper. Tell the user when a native module requires a development build.

## `src/providers/`

`app-providers.tsx` is the only place the provider stack is assembled: `GestureHandlerRootView` (`flex: 1`, outermost: every `GestureDetector` must sit below it, and Expo Router's native Stack does not render one) → `QueryProvider` (`PersistQueryClientProvider`: restores and writes the opt-in persisted cache) → `ThemeProvider` → `I18nextProvider`. There is no `SafeAreaProvider`: Expo Router's `ExpoRoot` already renders one above the root layout. Add new providers there, outermost first, each in its own file. Providers may use `config/` and `shared/`, never `features/`.

The theme provider picks `lightTheme`/`darkTheme` from `useColorScheme()`, wraps the tree in expo-router's `ThemeProvider` with the matching `lightNavigationTheme`/`darkNavigationTheme` (`@/shared/theme/navigation-theme`, so native headers follow the tokens) and calls `SystemUI.setBackgroundColorAsync` with the theme background so the native root view never flashes the wrong colour. If the app later lets users override the appearance, that preference is generic app state, not a feature: put the store in `src/shared/` (for example `shared/stores/appearance.store.ts`) so the provider can read it without importing a feature.

## i18n

- Library: i18next + react-i18next. Language on startup: the one saved under `STORAGE_KEYS.language` (read synchronously, so the first frame is already in that language), else the device language from `expo-localization`, else `en`.
- One namespace per domain (`features/<d>/i18n/{en,es}.json`) plus `common` (`shared/i18n`). Keys inside a domain namespace are grouped by entity (`club.listTitle`, `member.invite`). Components and screens use the namespace of their domain.
- Keys are typed from `resources.ts` through `src/types/i18next.d.ts`: a misspelled key fails `tsc`.

### Using translations

```tsx
const { t } = useTranslation('club');
t('club.membersCount', { count: club.membersCount });      // plural: membersCount_one / membersCount_other
t('welcome.title', { appName: appConfig.name });           // interpolation
const { t: tCommon } = useTranslation('common');           // second namespace in the same component
```

Shared UI (`AsyncState`, future dialogs) uses only the `common` namespace.

### Adding a namespace (new domain)

1. `features/<d>/i18n/en.json`, `es.json`, `resources.ts` exporting `<d>Resources = { en, es } as const` (JSON imported as `@/features/<d>/i18n/en.json`).
2. Register in `src/config/i18n/resources.ts` under every language.

### Adding a language

1. `src/config/i18n/languages.ts`: extend `SUPPORTED_LANGUAGES`.
2. Add `<lang>.json` to `shared/i18n` and to every feature `i18n/` folder, and wire it in each `resources.ts` and in `src/config/i18n/resources.ts`.
3. `app.config.ts` → `expo-localization` plugin `supportedLocales` for iOS and Android (per-app language settings). This changes native config: make a new development build.
4. Dates and numbers use the `Intl` API with `i18n.language` through the small wrappers in `src/shared/utils` (`formatDate`, `formatNumber`); no hand-written formatting logic.

### Switching language at runtime

`i18n.changeLanguage(lang)` from `@/config/i18n/i18n`; persist the choice with `storage.set(STORAGE_KEYS.language, lang)` if the app offers a picker; `detectLanguage()` in `config/i18n/i18n.ts` already reads it on the next start.
