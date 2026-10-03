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
- The app ships a full native shell. Before touching routes, layouts, tabs, the drawer or auth, load the `navigation-auth` skill (`.agents/skills/navigation-auth/SKILL.md`, symlinked from `.claude/skills/`).

```
src/app/_layout.tsx                 root Stack = the auth gate (RootNavigator)
├── (auth)/  sign-in, sign-up       Stack.Protected guard={!isSignedIn}
└── (app)/                          Stack.Protected guard={isSignedIn}; App Stack
    ├── details/[id], sheet         pushed over drawer + tabs; modals and sheets
    └── (drawer)/                   Drawer (expo-router/drawer)
        ├── settings/               drawer item, own Stack
        └── (tabs)/                 NativeTabs: (home), clubs, profile — each its own Stack
```

- **Auth gate:** only `src/screens/navigation/root/root-navigator.tsx` decides signed in vs out, with `Stack.Protected` reading `useSessionStore(selectIsSignedIn)`. Never redirect with `router.replace` after sign in/out; flipping the session does it. Auth is **mocked** behind `src/features/auth/api/session/*.api.ts`: plugging in a real backend stays inside `src/features/auth` (api bodies, a DTO/mapper, deleting the mock) plus `src/config` for an SDK; screens, navigators and the store contract do not change (`.agents/skills/navigation-auth/references/swap-to-real-auth.md`).
- **Layouts that need app state** live in `src/screens/navigation/<navigator>/*-layout.tsx` and are re-exported by `_layout.tsx` (routes may not import `features/`).
- **Native tabs:** `NativeTabs` from `expo-router/unstable-native-tabs` (SDK 57). Only `NativeTabs.Trigger` children count (never `Stack.Protected` inside), trigger `name` = folder name, at most 5 visible tabs on Android, every tab mounts at start.
- **Drawer:** `expo-router/drawer` is built in. Never install `@react-navigation/*` packages: React Navigation is vendored inside expo-router 57.
- Docs: https://docs.expo.dev/router/introduction.md, https://docs.expo.dev/router/advanced/native-tabs/, https://docs.expo.dev/router/advanced/protected/

## Design & motion (anti native-slop)

Two official Expo skills, vendored from `expo/skills` and pinned in `skills-lock.json`, are the design guide. Load them alongside `app-architecture`:

- `expo-design-system` (`.agents/skills/expo-design-system/SKILL.md`) before building or reviewing any screen or `src/shared/ui` component, and whenever a screen looks generic or AI-generated. Check every new screen against its 20 named tells (`references/native-slop.md`: The Web Modal, Everything's a Card, The Hand-Rolled Header, The Spinner Blink, ...).
- `expo-animation` (`.agents/skills/expo-animation/SKILL.md`, recipes in `RECIPES.md`) before adding any animation, gesture, transition, press feedback or haptic. Run its frequency gate first: most things should not animate.

Do not install other design or "taste" skills; the web ones (taste-skill, impeccable, frontend-design) contradict native idiom. Update the two with `bunx skills update`, never by hand-editing their files.

They are generic Expo skills. Where they disagree with this repo, the repo wins:

- **Tokens:** the theme in `src/shared/theme/tokens/*` (consumed with `useStyles` / `useTheme`) is the declared system ("Adopt Before You Build"). Never create `src/theme/`, a `theme/index.ts` barrel, `ThemedText`, or a `Color`/`PlatformColor` palette; use `<Text variant color>`, `<Button>` and the existing `radii`, `spacing`, `shadows` scales. A missing token goes into those files.
- **Sibling skills that are not installed:** `expo-native-ui` → `docs/performance.md` and the native-feel rules in `app-architecture`; `expo-data-fetching` (four-state screens) → `<AsyncState>` and `app-architecture/references/data-layer.md`; `expo-project-structure` → `app-architecture`. Grouped lists → `<ListSection>` + `<ListRow>`; icons → `<Icon>` (expo-symbols); sheets → a `formSheet` route (`navigation-auth`), not `@expo/ui`.
- **Press feedback:** pressables keep the repo pattern (`android_ripple` with `theme.colors.ripple` on Android, a `pressed` style on iOS), not the skill's scale-on-both-platforms default.
- **Recipes:** keep the motion decisions but not the scaffolding. No `useMemo` around gestures or layout-animation builders (the React Compiler memoizes them), `<List>` instead of `Animated.FlatList`, `<ScrollScreen>` with `headerLargeTitleEnabled` instead of a hand-rolled collapsing header, and the `forms-keyboard` skill for anything keyboard-synced (native Keyboard Blindness, the keyboard recipe): react-native-keyboard-controller is Android-only here, so never import it from an iOS file.
- **Audit greps** (`expo-design-system/references/audit.md`): run with `SRC=src THEME=src/shared/theme` and the repo's spacing whitelist `0|4|8|16|24|32|48`.
- **Haptics:** `expo-haptics` is not installed yet; add it with `bunx expo install expo-haptics` (native module, needs a new dev build).
- Never run the skills' `submit-expo-feedback` command unless the user asks: it sends data to Expo.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- Before creating or changing anything under `src/` (feature, entity, screen, route, component, hook, API call, query, mutation, store, translation, theme, config, SDK), load the `app-architecture` skill (`.agents/skills/app-architecture/SKILL.md`, symlinked from `.claude/skills/`) and follow it. The `club` domain (`src/features/club`, `src/components/club`, `src/screens/club`) is the reference implementation.
- Before adding or changing a route, `_layout.tsx`, tab, drawer item, modal/sheet, deep link, or anything in the sign-in / sign-up / sign-out flow or the session store, also load the `navigation-auth` skill (`.agents/skills/navigation-auth/SKILL.md`).
- Before adding or changing a form, a text input, validation, or anything the keyboard can cover, also load the `forms-keyboard` skill (`.agents/skills/forms-keyboard/SKILL.md`). Inputs are uncontrolled (`<TextField>` has no `value` prop; forms use `useUncontrolledForm`) and screens with inputs use `<FormScrollScreen>`.
- Every import uses the `@/` alias and points at the declaring file. No relative imports (`./`, `../`), no `index.ts` barrels, no `export * from`. ESLint enforces all three.
- Lists always use `<List>` from `@/shared/ui/list/list` (LegendList). `FlatList`/`SectionList`/`VirtualizedList` are lint errors. Images always use `<Image>` from `@/shared/ui/image/image` (expo-image); `Image`/`ImageBackground` from `react-native` are lint errors. So are `TextInput` and `KeyboardAvoidingView` from `react-native` (use `<TextField>` and `<FormScrollScreen>`) and importing `react-native-keyboard-controller` outside its shared wrappers and `src/providers`.
- The React Compiler is on (`experiments.reactCompiler` in `app.config.ts`). Do not add `useMemo`, `useCallback` or `React.memo` for performance, and never `eslint-disable` a hooks rule (the compiler skips that code). Performance rules, startup path and native-feel patterns: `docs/performance.md`.
- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.config.ts` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a new development build: `bun run ios|android` locally, or `bun run build:dev:ios|android` on EAS. This app never runs in Expo Go (MMKV / Nitro Modules).
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
