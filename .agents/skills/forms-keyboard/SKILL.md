---
name: forms-keyboard
description: Text input and keyboard rules for this Expo starter - uncontrolled <TextField>, the useUncontrolledForm hook (values in a ref, errors in state, focus chain), <FormScrollScreen> (native keyboard insets on iOS, react-native-keyboard-controller on edge-to-edge Android), autofill props, validation on submit, prefill and reset. Use this skill whenever you add or change a form, an input, a TextField, a search field, a login / sign-up / profile / edit / checkout screen, a chat composer, a button that should sit above the keyboard, or anything the keyboard can cover - even when the user only says "add a form", "add a field", "the keyboard covers X", "typing is laggy / glitchy / drops letters", "the Next button", "validation", "prefill the form" or "mask the phone number".
---

# Forms and keyboard

Typing must feel exactly like a native app: no dropped, duplicated or jumping characters, the return key moves to the next field without the keyboard closing, and the focused field stays visible above the keyboard while it animates. Two decisions make that true, and both are easy to undo by accident:

1. **Inputs are uncontrolled.** The native field owns the text. A controlled input (`value` + `onChangeText` into state) sends every keystroke to JS, re-renders the screen and writes the text back to native. On the New Architecture that write is dropped or lands late when typing fast, and it fights iOS autocorrect, Android IME composition and Android password masking. `references/text-input.md` has the mechanism and the RN source behind it.
2. **The keyboard is handled per platform inside `<FormScrollScreen>`.** iOS uses the native ScrollView keyboard insets. Android (edge-to-edge, so the window never resizes) uses react-native-keyboard-controller. `references/keyboard-controller.md` explains why the library is Android-only.

Load `app-architecture` too: everything below follows its folder, naming and import rules. Verified against Expo SDK 57, react-native 0.86.3 (Fabric), react-native-keyboard-controller 1.22.6. Expo and the keyboard library change often; before changing this setup, read the installed types (`node_modules/react-native-keyboard-controller/lib/typescript/`) and https://docs.expo.dev/guides/keyboard-handling/.

## The pieces

| Piece | File | What it does |
| --- | --- | --- |
| `<TextField>` + `TextFieldHandle` | `src/shared/ui/text-field/text-field.tsx` | Labelled native input with an inline error. Its props omit `value`, so a controlled input is a type error. `TextFieldHandle` types refs (never import `TextInput`). |
| `useUncontrolledForm` | `src/shared/hooks/use-uncontrolled-form.ts` | Values in a ref (never rendered), errors in state, `field(name, { next })` props, `submit`, `focus(name)`. |
| `<FormScrollScreen>` | `src/shared/ui/form-scroll-screen/form-scroll-screen.tsx` (iOS) and `.android.tsx` | The root of every screen with inputs. Keeps the focused caret above the keyboard. |
| `KeyboardProvider` | `src/providers/keyboard-provider.android.tsx` (iOS: `keyboard-provider.tsx`, a passthrough) | Mounted once in `app-providers.tsx`, above every navigator and sheet. |
| iOS unlinking | `react-native.config.js` | `platforms: { ios: null }`: the keyboard-controller pod is not linked on iOS at all. |
| Lint | `eslint.config.js` | Bans `TextInput` / `KeyboardAvoidingView` from react-native, keyboard-controller imports outside the wrappers and providers, `blurOnSubmit`, `setNativeProps`, and `automaticallyAdjustKeyboardInsets` outside FormScrollScreen. |

Reference implementation: `src/screens/auth/session/sign-in-screen.tsx` and `sign-up-screen.tsx`.

## Rules

1. **Never pass `value` to an input.** Prefill with `defaultValue`, which is read once at mount. Read the text with `onChangeText` into a ref, through `field(name)`.
2. **Never transform text while typing** (trim, lowercase, strip, mask) in `onChangeText`. Normalise in `onSubmit` (`normalizeSignIn` in `features/auth/utils/session/validate-credentials.ts`). Constrain with native props instead: `maxLength`, `editable`, `keyboardType`, `autoCapitalize`.
3. **Typing never re-renders the screen.** Values stay in the hook's ref. Only errors, server state and UI derived from the text live in React state. React Compiler rules still apply: no `useMemo` / `useCallback` / `memo`, never read `ref.current` during render.
4. **Validate on submit.** `validate(values)` returns `{ field: errorKey }` or `null`. An invalid submit keeps the keyboard up and focuses the first failing field in `initialValues` key order, so declare `initialValues` in visual order. A field's error clears on its next keystroke.
5. **Chain the return key.** Every field but the last spreads `field(name, { next: 'nextName' })` (return key "next", `submitBehavior="submit"`, focus moves without closing the keyboard). The last spreads `field(name)` (return key "go", submits). Override `returnKeyType` / `submitBehavior` only *after* the spread (`'done'`, `'search'`, multiline below).
6. **`field()` owns `ref`, `onChangeText` and `onSubmitEditing`.** Never pass your own after the spread: the hook would stop seeing the text (submit sends the initial value) or the input (Next and focus-on-error do nothing), and neither tsc nor lint catches it. To also react to the text, wrap it:
   `const bio = field('bio');` then `<TextField {...bio} onChangeText={(text) => { bio.onChangeText?.(text); setCount(text.length); }} />`. To focus a field from a handler, use `focus(name)` from the hook.
7. **One submit at a time.** Pass `isSubmitting: mutation.isPending`, because the return key can fire submit again while the button shows its spinner.
8. **`<FormScrollScreen>` is the screen's root.** Never wrap it in a View: on iOS the scroll view must stay the screen's first native child or the large title stops collapsing. Never add `KeyboardAvoidingView`, `automaticallyAdjustKeyboardInsets`, `keyboardVerticalOffset` or `useHeaderHeight` for the keyboard. Each one adds a second inset, which double-pads and jumps.
9. **One autofill prop per field:** `autoComplete`, never also `textContentType`. RN maps `autoComplete` to iOS `textContentType` itself. Use the props table below.
10. **Reset and prefill by remounting.** Put the form in its own component and remount it with a `key` (the hook resets with it). Edit screens render the form only after the query has data, with `initialValues` from it. Never use a changing `defaultValue`, `ref.clear()` (it fires no `onChangeText`, so the hook's values go stale) or `setNativeProps`.
    Prefilled forms (non-empty `defaultValue`) also key on the colour scheme: `` <ProfileForm key={`${user.id}-${colorScheme}`} user={user} /> `` with `useColorScheme()` from react-native. On RN 0.86, when a text attribute of a field changes while it is mounted (TextField's colour follows the theme; font scale too), Fabric rebuilds the native text from `defaultValue` without firing `onChangeText`. The edit is lost on screen while the hook still holds it, so submit would send text the user no longer sees. Remounting resets both together. Empty forms (sign-in, sign-up) are not affected, because empty text compares equal. Not yet verified on a device.
11. **Keyboard UI goes through shared wrappers.** react-native-keyboard-controller is imported only in `src/shared/ui/<wrapper>/` and `src/providers/`, and only from `.android.tsx` files: the library is not linked on iOS (`react-native.config.js`), so importing it from an iOS file fails at runtime. A new keyboard UI (sticky footer, toolbar) means a new `shared/ui` folder with an `.android.tsx` using the library and a `.tsx` with a native iOS equivalent (for example `InputAccessoryView`), plus a lint exception block in `eslint.config.js` next to `form-scroll-screen`. To use the library on iOS too, follow "Revisit when" in `references/keyboard-controller.md` first.
12. **Don't `autoFocus`** a field on a screen that is pushed right after another focused screen. Focus on purpose from a handler (`focus(name)`).

## Form recipe

1. Input type in `features/<d>/types/<entity>/<entity>.types.ts` (`UpdateProfileInput`). The hook takes only string fields (`T extends Record<string, string>`), declared with `type`, not `interface`, which has no index signature. If the API input has numbers, booleans or null, declare a separate string-only `<X>FormValues` type for the form and convert in `normalize<X>`.
2. In `features/<d>/utils/<entity>/`: `validate<X>(values) => errors | null` returning translation keys, and `normalize<X>(values)` (trim, parse numbers and so on) mapping form values to the API input.
3. Mutation in `features/<d>/mutations/<entity>/` (app-architecture data layer).
4. Screen (or a form component when it prefills, rule 10):

```tsx
const INITIAL_VALUES: UpdateProfileInput = { name: '', email: '' }; // visual order

export function EditProfileScreen() {
  const { t } = useTranslation('account');
  const update = useUpdateProfileMutation();
  const { field, errors, submit } = useUncontrolledForm({
    initialValues: INITIAL_VALUES,
    validate: validateProfile,
    onSubmit: (input) => update.mutate(normalizeProfile(input)),
    isSubmitting: update.isPending,
  });
  const fieldError = (name: keyof UpdateProfileInput) => (errors[name] ? t(`validation.${errors[name]}`) : null);

  return (
    <FormScrollScreen>
      <Stack.Screen options={{ title: t('profile.edit') }} />
      <TextField label={t('fields.name')} {...field('name', { next: 'email' })} error={fieldError('name')} autoComplete="name" autoCapitalize="words" autoCorrect={false} />
      <TextField label={t('fields.email')} {...field('email')} error={fieldError('email')} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} spellCheck={false} autoComplete="email" />
      <Button label={t('profile.save')} loading={update.isPending} onPress={submit} />
    </FormScrollScreen>
  );
}
```

5. Strings in every language file. Run the done checks.

## Which container?

| Screen | Use |
| --- | --- |
| Any scrollable form, any number of fields | `<FormScrollScreen>` |
| A button or composer that rides on top of the keyboard | A new shared wrapper (rule 11): `KeyboardStickyView` on Android, `InputAccessoryView` or a native pattern on iOS |
| Chat (inverted list + composer) | A new wrapper in `shared/ui/list` (rule 11): `KeyboardChatScrollView` (keyboard-controller) or `KeyboardAwareLegendList` (`@legendapp/list/keyboard`, which uses keyboard-controller) on Android. iOS needs its own native strategy, or the library linked on iOS (`references/keyboard-controller.md`). |
| Inputs inside a `presentation: 'formSheet'` route | No keyboard wrapper: the native sheet moves for the keyboard. Keep the content scrollable. Not yet verified on device in this app. |
| Non-scrolling layout that must make room | Prefer making it a `<FormScrollScreen>`. Otherwise use `KeyboardStickyView` (transform only) on Android in a shared wrapper. Do not use keyboard-controller's `KeyboardAvoidingView`: every behaviour it offers (`height`, `padding`, `position`, `translate-with-padding`) changes layout and trips a Yoga assert in Debug on RN 0.86 (keyboard-controller #1531, fixed in RN 0.87). |
| Search in a header | `headerSearchBarOptions` on the native Stack, not a TextField |

## Controlled or not?

| Need | Use |
| --- | --- |
| Read on submit or blur (almost every form) | Uncontrolled with `useUncontrolledForm` |
| Live validation, a character counter, a button enabled while text is present | Still uncontrolled: wrap the hook's `onChangeText` (rule 6) and set state only for the derived UI (`setCanSubmit(text.length > 0)`). Never feed the text back as `value`. |
| Max length / read-only | Native `maxLength` / `editable` |
| Live mask (phone, card, date) | `@expo/ui` TextInput with `useNativeState` and a worklet `onChangeText`, or react-native-mask-input. Ask before adding the dependency. Never a controlled TextInput. |
| Search as you type | Uncontrolled; `onChangeText` sets a query string and `useDebouncedValue` (`@/shared/hooks/use-debounced-value`) feeds the query |

## Input props

| Field | Props |
| --- | --- |
| Sign-in email | `keyboardType="email-address" autoCapitalize="none" autoCorrect={false} spellCheck={false} autoComplete="username"` (Password AutoFill pairs `username` with the password field) |
| Sign-up email | Same props with `autoComplete="username"`, so iOS saves the strong password to that account |
| Other email | Same props with `autoComplete="email"` |
| Current password | `secureTextEntry autoComplete="current-password"` |
| New password | `secureTextEntry autoComplete="new-password"` (iOS suggests a strong password) |
| Name | `autoComplete="name" autoCapitalize="words" autoCorrect={false}` |
| Phone | `keyboardType="phone-pad" autoComplete="tel"`. The pad has no return key: end the chain with a button, or add a keyboard toolbar wrapper. |
| One-time code | `keyboardType="number-pad" autoComplete="one-time-code" maxLength={6}` |
| Search | `returnKeyType="search" autoCorrect={false}`, read in `onSubmitEditing` (`event.nativeEvent.text`) |
| Multiline | `{...field('bio')}` first, then `multiline submitBehavior="newline" returnKeyType="default"`. After the spread, return inserts a newline instead of submitting. Never chain it with `next`, and submit with the button. |

## Don't

- `value=` on any input, or `setForm((prev) => ({ ...prev, x }))` on every keystroke.
- react-hook-form `Controller` or TanStack Form fields. Both are controlled under the hood, RHF `watch` is incompatible with the React Compiler, and TanStack Form has an open React Compiler + Expo issue. Expo's controlled-components guide mentions RHF; this template deliberately does not use it.
- `KeyboardAvoidingView` from react-native, `softwareKeyboardLayoutMode: 'pan'` or `tabBarHideOnKeyboard`. Expo's keyboard guide still shows them, but they assume a window that resizes (not true on edge-to-edge Android) or the JS tab bar (we use NativeTabs).
- keyboard-controller on iOS (it is not linked there), `KeyboardToolbar` on short forms, `mode="layout"`, `useAnimatedKeyboard` (deprecated in Reanimated 4). Reasons in `references/keyboard-controller.md`.
- `lineHeight` or error-dependent text colour in an input's style. Signal errors with the border and the message (and see rule 10 for prefilled forms).

## Done criteria

- `bunx tsc --noEmit` and `bunx expo lint` pass.
- `grep -rn "value={" src/screens src/components` finds no input.
- A new native dependency (for example a mask library) was installed with `bunx expo install`, and the user was told a development build is required.
- Tell the user what to check on a device (the agent does not drive the app):
  - Type very fast with iOS autocorrect and predictive text on, and with Gboard on Android: no lost, doubled or jumping characters.
  - Next goes through every field with the keyboard up, and the last field submits.
  - An invalid submit focuses the first error, and the error clears on the next keystroke.
  - The focused field stays above the keyboard while it opens and closes (Android 15+ edge-to-edge too).
  - The iOS large title still collapses, and AutoFill from the Keychain fills both fields.

## References

- `references/text-input.md`: why controlled inputs break (the RN 0.86 source), what "zero re-renders" means precisely, known platform input bugs, sources.
- `references/keyboard-controller.md`: why the library is Android-only, the version pin, provider and KeyboardAwareScrollView props, open issues and workarounds, when to add a toolbar or sticky view, what to revisit on upgrades.
