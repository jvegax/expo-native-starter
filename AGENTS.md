This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Environments are selected with `APP_ENV` (`production` | `preview`, default `preview`) in `app.config.ts`; there is no `app.json`. A `.env` file is optional (`cp .env.example .env` to change defaults locally). `src/config/env.ts` validates what `app.config.ts` exposes through `expoConfig.extra` and is the only place the app reads environment values.

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx expo config --type public             # inspect the resolved config (APP_ENV=production ... for production)
bun run build:dev:android                 # EAS development build (APK, preview backend) on expo.dev
bun run build:local dev-android           # same build on this machine, artifact in build/
```

EAS profiles live in `eas.json` (`dev-android`, `dev-ios`, `preview`, `production`); every `build:*` and `submit:*` script in `package.json` maps to one of them.

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- Before creating or changing anything under `src/` (feature, entity, screen, route, component, hook, API call, query, mutation, store, translation, theme, config, SDK), load the `app-architecture` skill (`.agents/skills/app-architecture/SKILL.md`, symlinked from `.claude/skills/`) and follow it. The `club` domain (`src/features/club`, `src/components/club`, `src/screens/club`) is the reference implementation.
- Every import uses the `@/` alias and points at the declaring file. No relative imports (`./`, `../`), no `index.ts` barrels, no `export * from`. ESLint enforces all three.
- Lists always use `<List>` from `@/shared/ui/list/list` (LegendList). `FlatList`/`SectionList`/`VirtualizedList` are lint errors. Images always use `<Image>` from `@/shared/ui/image/image` (expo-image); `Image`/`ImageBackground` from `react-native` are lint errors.
- The React Compiler is on (`experiments.reactCompiler` in `app.config.ts`). Do not add `useMemo`, `useCallback` or `React.memo` for performance, and never `eslint-disable` a hooks rule (the compiler skips that code). Performance rules, startup path and native-feel patterns: `docs/performance.md`.
- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.config.ts` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a new development build: `bun run ios|android` locally, or `bun run build:dev:ios|android` on EAS. This app never runs in Expo Go (MMKV / Nitro Modules).
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
