# react-native-keyboard-controller in this template

## Why Android only

Android 15+ edge-to-edge (forced since SDK 54) stops the window from resizing for the IME. RN's `KeyboardAvoidingView` reacts to `keyboardDidShow`, after the animation, so content jumps. keyboard-controller follows the IME frame by frame through `WindowInsetsAnimationCallback`, and its `KeyboardAwareScrollView` keeps the focused caret `bottomOffset` above the keyboard (Margelo's deep dive, Expo's keyboard guide).

iOS does not need it, and adding it there costs something:

- RN's native ScrollView with `automaticallyAdjustKeyboardInsets` animates its inset on the keyboard's own curve and scrolls the caret of the first responder into view (`RCTScrollViewComponentView.mm`, `_keyboardWillChangeFrame`).
- On iOS, `KeyboardProvider` replaces the delegate of every focused UITextField with a composite delegate, which puts the library on the typing path. Open issues on that path: #1588 (keystrokes forwarded to another input when focus moves quickly, which is exactly the Next chain) and #1463 (`autoCapitalize` ignored on devices).
- `KeyboardAwareScrollView` with `contentInsetAdjustmentBehavior="automatic"` under a native header jumps when the keyboard hides (#856, open). Every auth screen has a large title. The only reported workaround, `mode="layout"`, changes layout on every frame (Yoga assert risk, #1531).

So the library is off iOS completely:

- **JS:** `src/providers/keyboard-provider.tsx` and `src/shared/ui/form-scroll-screen/form-scroll-screen.tsx` (the iOS files) never import it, and Metro platform extensions keep it out of the iOS bundle. To check, run `bunx expo export --platform ios` and grep the bundle for `KeyboardAwareScrollView`.
- **Native:** the root `react-native.config.js` sets `platforms: { ios: null }`, so autolinking and codegen skip the pod. Without that, the pod's load-time code would still swizzle `UIResponder` become/resign first responder on every focus change, even with no JS using it. To check, run `bunx expo-modules-autolinking react-native-config --platform ios --json`; the library must not be listed with iOS platform data.

## Version

- Installed: 1.22.6 (peer `react-native-reanimated >=3`). SDK 57 pins 1.21.9. Releases since then fix the switching-inputs scroll animation (1.21.10), stale values when autofill or password-manager windows open (1.21.12), delegate recursion (1.21.13), an iOS SIGSEGV with emoji (1.22.3), cleanup on unmount (1.22.5) and a wrong scroll when the keyboard height changes while open (1.22.6).
- `package.json` has `"expo": { "install": { "exclude": ["react-native-keyboard-controller"] } }`, so `expo install --check` and expo-doctor accept the newer version. Upgrade with `bunx expo install react-native-keyboard-controller@<version>`, read the release notes, and remember it needs a new development build.
- On a new SDK whose pin is at or above the installed version, remove the exclude and let `expo install --fix` take the pin.

## Props in use

- `KeyboardProvider` (`src/providers/keyboard-provider.android.tsx`): no props. Edge-to-edge forces `statusBarTranslucent`, `navigationBarTranslucent` and `preserveEdgeToEdge`. `preload` is iOS-only (a no-op on Android). If the provider ever mounts on iOS, set `preload={false}`: the cold-start screen does not autofocus, and preloading can flash the keyboard on launch (#1077).
- `KeyboardAwareScrollView` (`form-scroll-screen.android.tsx`): mode `insets` (the default, no layout reflow), `bottomOffset={theme.spacing.lg}`, `keyboardDismissMode="on-drag"` (`interactive` is iOS only), `keyboardShouldPersistTaps="handled"`.
- Inside the bottom SafeAreaView the inset counts the full IME height, so while the keyboard is open there is extra scroll room equal to the navigation bar. This is harmless.
- Other props: `disableScrollOnKeyboardHide`, `extraKeyboardSpace`, `enabled`, and the ref method `assureFocusedInputVisible()`, for a field that grows or moves while focused.

## When to add more

- `KeyboardStickyView`: a footer button or composer that must ride on the keyboard. Make it a shared wrapper with the library in its `.android.tsx` and `InputAccessoryView` or a native pattern in the iOS `.tsx`. The alternative is bringing the library to iOS (see "Revisit when").
- `KeyboardToolbar` (previous / next / done): only for fields with no return key (number or phone pads) or long forms. It needs the provider, and has open issues (#1411 an orphaned toolbar after a modal is dismissed, #1082 back-swipe desync). Strings go in the `common` namespace.
- `KeyboardChatScrollView` or `KeyboardAwareLegendList` (`@legendapp/list/keyboard`): chats, inside `shared/ui/list`.
- `KeyboardController.dismiss()` returns a promise. Use it in a wrapper that must wait for the keyboard to hide. Screens use `Keyboard.dismiss()` (the hook does).

## Revisit when

- **RN 0.87:** the Yoga fix (facebook/react-native#57197) unblocks `mode="layout"` and padding behaviours. The secure-field echo fix also lands there.
- **#856, #1588 and #1463 closed:** consider the library on iOS for one consistent implementation. Steps:
  1. Remove the iOS exclusion from `react-native.config.js`.
  2. Turn `keyboard-provider.tsx` / `form-scroll-screen.tsx` into single-file versions.
  3. Set `preload={false}`.
  4. Make a new dev build.
  5. Device-test the large title, fast Next chains and `autoCapitalize="words"`.

## Sources

- https://docs.expo.dev/guides/keyboard-handling/ and https://docs.expo.dev/versions/v57.0.0/sdk/keyboard-controller/
- https://margelo.com/blog/deep-dive-in-keyboard-handling
- https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view and https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-provider
- https://github.com/kirillzyusko/react-native-keyboard-controller/releases
- Issues: https://github.com/kirillzyusko/react-native-keyboard-controller/issues/856, /1588, /1463, /1531, /1077, /1411, /1082
