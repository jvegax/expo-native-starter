# Route tree: URLs, decisions and deep links

## URL map

Group folders (`(app)`, `(auth)`, `(drawer)`, `(tabs)`, `(home)`) are not part of URLs.

| URL | File | Navigator chain (outermost first) | Visible when |
| --- | --- | --- | --- |
| `/sign-in` | `(auth)/sign-in.tsx` | Root Stack → Auth Stack | signed out |
| `/sign-up` | `(auth)/sign-up.tsx` | Root Stack → Auth Stack | signed out |
| `/` | `(app)/(drawer)/(tabs)/(home)/index.tsx` | Root → App Stack → Drawer → NativeTabs → Home Stack | signed in |
| `/clubs` | `(app)/(drawer)/(tabs)/clubs/index.tsx` | … → NativeTabs → Clubs Stack | signed in |
| `/clubs/[clubId]` | `(app)/(drawer)/(tabs)/clubs/[clubId].tsx` | … → Clubs Stack (tab bar stays) | signed in |
| `/profile` | `(app)/(drawer)/(tabs)/profile/index.tsx` | … → NativeTabs → Profile Stack | signed in |
| `/settings` | `(app)/(drawer)/settings/index.tsx` | … → Drawer → Settings Stack | signed in |
| `/details/[id]` | `(app)/details/[id].tsx` | Root → App Stack (covers drawer and tabs) | signed in |
| `/sheet` | `(app)/sheet.tsx` | Root → App Stack, `presentation: 'formSheet'` | signed in |
| anything else | `+not-found.tsx` | Root Stack | always |

## Why this nesting

- **Root Stack holds the gate.** `Stack.Protected` works on Stack and Drawer, not on NativeTabs (which keeps only `Trigger` children). Gating the two top-level groups means the rest of the tree never thinks about auth.
- **App Stack above the drawer.** Screens pushed here cover the drawer and the tab bar: the native equivalent of iOS `hidesBottomBarWhenPushed`, which react-native-screens does not expose. It is also where modals and sheets go, and its back swipe never competes with the drawer gesture.
- **Drawer around the tabs.** The drawer is the place for destinations that do not deserve a tab (settings, help, legal) and for the account/sign-out panel. Its JS header is off; it is a container only.
- **NativeTabs.** The real platform tab bar: UITabBarController (Liquid Glass and minimize-on-scroll on iOS 26) and Material bottom navigation on Android. No JS tab bar, no custom tab bar.
- **One native Stack per section** (each tab and each drawer item, all through `SectionStackLayout`). Each section keeps its own history, gets native headers (large titles, blur, back gesture) and pops to root when its tab is tapped again.

## Headers

Exactly one header per screen, always a native-stack header:
- Root Stack: `headerShown: false` (except `+not-found`).
- App Stack: `(drawer)` headerless; `details/[id]` uses the App Stack header; `sheet` headerless.
- Drawer: `headerShown: false` for every screen.
- NativeTabs: no header by design.
- Section Stacks: the visible headers. The root `index` gets a large title and the menu button.

Screens set their own title with `<Stack.Screen options={{ title }} />`. Header colours come from the navigation theme (`shared/theme/navigation-theme.ts`); never set them per screen.

## Gestures

- iOS back swipe belongs to stacks. The drawer does not swipe open on iOS (`swipeEnabled` on Android only); it opens from the menu button.
- Android: the drawer swipes open from the left edge; the system back closes an open drawer first.
- `drawerType: 'front'` keeps the native tab bar still while the drawer animates.

## Anchors (`unstable_settings`)

Exported from the route `_layout.tsx` files (not from the screens/navigation components):
- `(auth)/_layout.tsx` → `anchor: 'sign-in'`: `/sign-up` opened directly still has sign-in behind it.
- `(app)/_layout.tsx` → `anchor: '(drawer)'`: `/details/3` opened from a link has the drawer and tabs behind it, so back goes home.
- `(app)/(drawer)/_layout.tsx` → `anchor: '(tabs)'`.
- Every section `_layout.tsx` → `anchor: 'index'`: `/clubs/1` opened from a link has the club list behind it.

## Deep links

The scheme comes from `app.config.ts` (`myapp` in production, `myapp-preview` in preview).

```bash
xcrun simctl openurl booted myapp-preview://details/3
adb shell am start -a android.intent.action.VIEW -d myapp-preview://details/3
```

Signed in: the detail opens with the tabs underneath. Signed out: the `(app)` group is not registered, so the link resolves to sign-in. Resuming the blocked link after sign-in is not wired; React Navigation has an unstable `UNSTABLE_routeNamesChangeBehavior="lastUnhandled"` navigator prop for that, untested with expo-router 57.

## Startup

`RootNavigator` reads `selectIsSignedIn` on its first render, and the session store has already read storage synchronously at import time. Expo Router hides the splash after the first navigation render, so the user sees either sign-in or home directly, never one then the other.
