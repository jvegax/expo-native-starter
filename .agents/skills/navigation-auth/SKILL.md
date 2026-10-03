---
name: navigation-auth
description: Navigation and authentication rules for this Expo starter - the route tree, the auth gate (Stack.Protected in the root navigator), the mocked session (features/auth), the drawer, native tabs (expo-router/unstable-native-tabs), per-tab stacks, detail pushes, sheets and sign out. Use this skill whenever you add, move or change a route, a _layout.tsx, a tab, a drawer item, a modal or sheet, a deep link, the sign-in/sign-up/sign-out flow, the session store or anything that should only be visible when signed in (or signed out) - even when the user only says "add a screen", "add a tab", "put X in the menu", "protect this page", "log the user out" or "connect real auth / Firebase / Supabase / Clerk".
---

# Navigation and auth

The app ships a complete native navigation shell with a **mocked** auth backend. Routes, guards, drawer, tabs and the sign-out UI are final; only the bodies of three `api/` functions change when real auth arrives (`references/swap-to-real-auth.md`). Load `app-architecture` too: every file below follows its folder, naming and import rules.

Verified against expo-router 57 (SDK 57). Expo changes navigation APIs every SDK: before changing a navigator, check the installed types in `node_modules/expo-router/build/` or the versioned docs.

## The route tree

```
src/app/
├── _layout.tsx                       bootstrap() + providers + <RootNavigator/>   (root Stack, the auth gate)
├── +not-found.tsx
├── (auth)/                           visible only when signed OUT
│   ├── _layout.tsx                   AuthStackLayout (Stack)          anchor: sign-in
│   ├── sign-in.tsx                   /sign-in
│   └── sign-up.tsx                   /sign-up
└── (app)/                            visible only when signed IN
    ├── _layout.tsx                   AppStackLayout (Stack)           anchor: (drawer)
    ├── details/[id].tsx              /details/[id]   pushed OVER drawer and tabs (no tab bar)
    ├── sheet.tsx                     /sheet          formSheet with detents
    └── (drawer)/
        ├── _layout.tsx               AppDrawerLayout (Drawer)         anchor: (tabs)
        ├── settings/                 /settings       drawer item, own Stack
        └── (tabs)/
            ├── _layout.tsx           AppTabsLayout (NativeTabs)
            ├── (home)/               /               tab, own Stack
            ├── clubs/                /clubs, /clubs/[clubId]  tab, own Stack (push keeps the tab bar)
            └── profile/              /profile        tab, own Stack
```

Navigator components live in `src/screens/navigation/<navigator>/` and every nested `_layout.tsx` is a one-line re-export (plus `unstable_settings`); the root `src/app/_layout.tsx` also runs `bootstrap()` and wraps `<RootNavigator/>` in the providers. Reason: routes may not import `features/` (ESLint), but the root navigator needs the session store. Name them `*-layout.tsx` / `*-navigator.tsx`, never `*-screen.tsx`.

| Navigator | File | Notes |
| --- | --- | --- |
| Root Stack + auth gate | `screens/navigation/root/root-navigator.tsx` | `Stack.Protected` around `(app)` and `(auth)`; fade between them |
| Auth Stack | `screens/navigation/auth/auth-stack-layout.tsx` | large titles |
| App Stack | `screens/navigation/app/app-stack-layout.tsx` | `(drawer)` headerless; full-screen pushes, modals and sheets |
| Drawer | `screens/navigation/drawer/app-drawer-layout.tsx` + `app-drawer-content.tsx` | `headerShown: false`, `drawerType: 'front'`, swipe on Android only, sign out at the bottom |
| Native tabs | `screens/navigation/tabs/app-tabs-layout.tsx` | SF Symbols (`sf`) on iOS, Material Symbols (`md`) on Android |
| Section Stack | `screens/navigation/section/section-stack-layout.tsx` | one per tab and per drawer item; menu button on its `index` only |

Full rationale and the URL map: `references/route-tree.md`.

## The auth gate (rules)

1. **The guard lives in `RootNavigator` only.** `<Stack.Protected guard={isSignedIn}>` wraps `(app)`, `<Stack.Protected guard={!isSignedIn}>` wraps `(auth)`. Never add a second gate deeper in the tree, never call `router.replace('/sign-in')` to "redirect": when the guard flips, React Navigation drops the removed group and its history and shows the first route still allowed. A deep link into `(app)` while signed out lands on sign-in. The one auth-aware `replace` is leaving `+not-found` with no history (`NotFoundScreen`): a `replace` into a group whose guard is false is silently ignored, so it targets `/` or `/sign-in` depending on the session.
2. **The guard reads one boolean:** `useSessionStore(selectIsSignedIn)` from `@/features/auth/store/session/session.store`. That selector is the contract between auth and navigation; keep it when swapping the backend.
3. **The session is known on the first frame.** The store seeds itself synchronously from `storage` (token in SecureStore under `STORAGE_KEYS.authToken`, user in MMKV under `STORAGE_KEYS.authUser`), so there is no loading state, no flash of sign-in and no splash handling. If real auth ever needs an async restore, follow section 3 (Async session restore) of `references/swap-to-real-auth.md`.
4. **Signing in = `setSession(session)`; signing out = `clearSession()`.** The mutations (`useSignInMutation`, `useSignUpMutation`, `useSignOutMutation`) call them; a 401 calls `clearSession()` from `src/config/http.ts`. Never navigate after either: the guard does it. The auth mutations use `networkMode: 'always'`, so offline they fail fast instead of pausing (a paused sign-out would never clear the session).
5. **Cleanup on sign out is centralised** in `src/config/auth.ts` (`setupAuth()`, run by `bootstrap()`): on every signedIn → signedOut transition it clears the query cache and its persisted MMKV copy. Add any other per-user cleanup there (analytics reset, push token unregister), not in buttons.
6. **Protection is client-side only.** It hides UI; the server must authorise every request.
7. **Sign-out UI** uses `useConfirmSignOut()` (`@/features/auth/hooks/session/use-confirm-sign-out`): native destructive confirmation, then the mutation. Used by the drawer and the profile tab.
8. `Stack.Protected` takes only `guard` in SDK 57 (`redirectTo` arrives in SDK 58). A route name may appear in only one place across `Screen`s and `Protected` wrappers.

## Native tabs (rules)

- Import from `expo-router/unstable-native-tabs` (SDK 58 renames it to `expo-router/native-tabs`).
- Only `<NativeTabs.Trigger name="...">` children count; anything else (including `Stack.Protected`) is **silently dropped**. To hide a tab use `hidden` (toggling it remounts the navigator and resets tab state). Never nest NativeTabs in NativeTabs (it throws).
- A trigger `name` must equal the folder (or group) name under `(tabs)/`; it is not type-checked.
- At most **5 visible tabs** on Android (a 6th crashes). More destinations go in the drawer.
- Every tab mounts at start. Defer heavy work in a tab with `useIsFocused` / `useFocusEffect`.
- Tabs have no header: each tab folder has `_layout.tsx` → `SectionStackLayout`.
- Make a `ScrollView` / `<List>` the screen's first native child (`<ScrollScreen>`, `<FormScrollScreen>` for screens with inputs, or `<List>`) so iOS collapses the large title, insets content above the tab bar and minimizes it on iOS 26 (`minimizeBehavior`). Tapping the active tab pops to root and scrolls to top.
- Icons: `sf` (SF Symbol, `{ default, selected }` allowed) and `md` (Material Symbol name). No icon library is needed.

## Drawer (rules)

- `expo-router/drawer` is built into expo-router 57. **Never install `@react-navigation/*`** (drawer, native, elements...): React Navigation is vendored inside expo-router and a second copy breaks its contexts. `DrawerActions` comes from `expo-router/react-navigation`.
- The drawer's own header is off (`headerShown: false`); every drawer screen renders a section Stack with native headers. One header per screen, always.
- The menu button (`HeaderMenuButton`) is set on the section Stack's `index` screen only. In `screenOptions` it would replace the back button of pushed screens.
- `drawerType: 'front'` (the drawer covers the content; `'slide'` would also slide the native tab bar). Swipe-to-open is enabled on Android only, because on iOS the left-edge swipe is the back gesture.
- Drawer + NativeTabs inside it is not an Expo-documented combination: re-test on device after changing either. Fallback if it ever breaks: a view-level `react-native-drawer-layout` `<Drawer>` around `NativeTabs`.

## Where does a new screen go?

| You want | Put the route in | Example |
| --- | --- | --- |
| A detail that keeps the tab bar (in-tab history) | the tab folder: `(tabs)/<tab>/<name>.tsx` | `clubs/[clubId].tsx` |
| A full-screen flow that hides the tab bar | `(app)/<name>.tsx` (App Stack) | `details/[id].tsx` |
| A modal or sheet | `(app)/<name>.tsx` + `<Stack.Screen name options={{ presentation }}>` in `AppStackLayout` | `sheet.tsx` (`formSheet`) |
| A new tab (max 5) | `(tabs)/<tab>/{_layout.tsx,index.tsx}` + a Trigger in `AppTabsLayout` | `profile/` |
| A new drawer item | `(drawer)/<item>/{_layout.tsx,index.tsx}` + `<Drawer.Screen>` in `AppDrawerLayout` | `settings/` |
| A screen reachable while signed out | `(auth)/<name>.tsx` | `sign-up.tsx` |
| A screen for both states (terms, onboarding) | the root, outside both groups, plus a `<Stack.Screen>` in `RootNavigator` | — |

Then:
1. The screen component goes in `screens/<domain>/<entity>/<name>-screen.tsx` and sets its title with `<Stack.Screen options={{ title }} />`; the route file only re-exports it (or reads `useLocalSearchParams` and passes props).
2. Section folders (`_layout.tsx` → `SectionStackLayout`) export `unstable_settings = { anchor: 'index' }` so a deep link to a child has the section root underneath.
3. Navigate with typed hrefs: `router.push({ pathname: '/details/[id]', params: { id } })`. Group names are not part of URLs. New paths are typed only after `bunx expo start` regenerates `.expo/types/router.d.ts` (start it in the background, poll the file, stop it).
4. Labels go in the `common` namespace under `navigation.*` (tabs, drawer) or in the domain namespace (screen titles).

## Reuse before writing

| Need | Use |
| --- | --- |
| Is the user signed in / who is it | `useSessionStore(selectIsSignedIn)`, `useSessionStore(selectUser)` |
| Sign in / up / out | `useSignInMutation`, `useSignUpMutation`, `useSignOutMutation` (`features/auth/mutations/session/`) |
| Sign out with confirmation | `useConfirmSignOut` |
| Client-side form validation | `validateSignIn`, `validateSignUp`, `authErrorCode` (`features/auth/utils/session/validate-credentials.ts`) |
| Avatar + name + email | `<UserSummary>` (`components/account/user/user-summary`) |
| Text input with label and error | `<TextField>` (`shared/ui/text-field`), uncontrolled; forms use `useUncontrolledForm` (forms-keyboard skill) |
| Screen with inputs (sign-in, sign-up, edit forms) | `<FormScrollScreen>` (`shared/ui/form-scroll-screen`) |
| Platform icon | `<Icon ios="..." android="..." />` (`shared/ui/icon`, expo-symbols) |
| Settings-style menu | `<ListSection>` + `<ListRow>` (`shared/ui/list-section`, `shared/ui/list-row`) |
| Static scrollable screen in a tab or stack | `<ScrollScreen>` (`shared/ui/scroll-screen`); data lists use `<List>` |

## Done criteria

- `bunx tsc --noEmit` and `bunx expo lint` pass.
- Only `RootNavigator` decides signed in vs signed out; no `router.replace` to sign-in or home after auth changes.
- One header per screen; at most 5 visible tabs; trigger names match folders.
- Manually checked in a development build: cold start signed out → sign-in; sign in → tabs; push detail → back gesture; drawer opens from the menu button; sign out → sign-in; relaunch keeps the state; a deep link into `(app)` while signed out shows sign-in.

## References

- `references/route-tree.md` — URL map, why each navigator is where it is, anchors, deep links, header and gesture decisions.
- `references/swap-to-real-auth.md` — replacing the mock with a real backend or an auth SDK, async restore with the splash screen.
