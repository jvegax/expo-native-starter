# Text input on the New Architecture

Why `<TextField>` has no `value` prop, and what to know before touching it. Verified against react-native 0.86.3 (paths are under `node_modules/react-native/`).

## The controlled round trip

With `value` + `onChangeText` into state, every keystroke does this:

1. The native field shows the new text and bumps its event counter.
2. `onChange` reaches JS (`Libraries/Components/TextInput/TextInput.js`, `_onChange` ~L503) with `nativeEvent.eventCount`.
3. `onChangeText` sets state and the whole screen re-renders (translations, queries, every field).
4. TextInput's layout effect sends the value back to native when it differs from the last native text (`TextInput.js` ~L203: `if (lastNativeText !== props.value && typeof props.value === 'string')` → `setTextAndSelection(eventCount, ...)`).
5. Native accepts that write only if its counter still matches:
   - iOS: `React/Fabric/Mounting/ComponentViews/TextInput/RCTTextInputComponentView.mm`, `setTextAndSelection`: `if (_mostRecentEventCount != eventCount) return;`
   - Android: `ReactAndroid/.../views/textinput/ReactEditText.kt`, `canUpdateWithEventCount`.

Expo's guide describes it this way: "between steps 2 and 5, the field shows text your state doesn't hold yet" (https://docs.expo.dev/guides/controlled-components/). The heavier step 3 is, the more writes are stale: they are either dropped or land late and restore the caret in the wrong place. That is what users see as letters lost, doubled or moved when typing fast. The echo also collides with:

- iOS autocorrect and inline predictions, which edit the field in two steps; a JS write landing between them moves the caret (RN #44157). RN 0.77 (commit 40093d96) only mitigated it for an echo of identical text, and that check is defeated by attribute differences (paragraph style from a `lineHeight`, shadows), which is why the TextField style has no `lineHeight`.
- Android IME composition (Gboard, Samsung): re-applying the Editable under an active composition duplicates or garbles words (RN #30503, #28010, #26013).
- Android `secureTextEntry`: in 0.86 the "same text" guard compares an Editable with a Spanned and is never equal, so every echo replaces the text and masks the last character at once (RN #53696, fixed in 0.87 by 08731165f5).

## Why uncontrolled fixes it

Without `value`, step 4 never runs: TextInput only writes text to native when `typeof props.value === 'string'`. `defaultValue` becomes the initial native text (`TextInput.js` ~L384) and, as long as it stays constant, the shadow node never pushes new text. With `useUncontrolledForm` the screen does not re-render while typing either.

What still happens per keystroke, and is harmless: RN's own TextInput component re-renders itself (`setMostRecentEventCount`, ~L519) and the hook writes the text to a ref. So the precise claim is: zero screen renders and zero JS→native text writes.

Consequences that the rules in SKILL.md encode:

- A `defaultValue` that changes after mount does write to native (the shadow node sees new props text) and overwrites what the user typed, without firing `onChangeText`. That is why the hook freezes `initialValues` at mount and prefill or reset is done with a `key` remount.
- `ref.clear()` is also a JS→native write. It fires no `onChangeText` (iOS ignores changes while `_comingFromJS`; Android skips its watchers while setting text from JS), so the hook's values would keep the old text.
- Changing a text attribute while a field holds edits makes the native text rebuild from `defaultValue`. `BaseTextInputShadowNode::updateStateIfNeeded` rebuilds the text from `props.text` (the `defaultValue`) plus the current text attributes, and `Fragment::isContentEqual` compares attributes too, so the new state wins once the event counts match. Nothing fires `onChangeText`. TextField's colour follows the theme and the font scale is a text attribute, so an appearance or Dynamic Type change does this to any **prefilled** field. An empty `defaultValue` is safe (empty fragments are dropped, so the strings compare equal). The skill's answer is rule 10: key prefilled forms on the colour scheme. This was traced in the RN 0.86 source, not reproduced on a device. Errors still change only the border, so validation never triggers it.

## Known platform input bugs (not fixed by uncontrolled inputs)

- iOS CJK composition on Fabric is broken with or without `value`, and `maxLength` cuts compositions short (RN #56463, open).
- iOS Strong Password can turn a field yellow or non-editable in some setups (RN #53050). Check sign-up on a device when touching password fields.
- Android KeyboardAvoidingView on edge-to-edge had a render loop that RN 0.86 fixed (PR #55855). It still reacts only after the keyboard animation, which is why FormScrollScreen does not use it.

## Sources

- Expo, controlled components: https://docs.expo.dev/guides/controlled-components/
- Expo, keyboard handling: https://docs.expo.dev/guides/keyboard-handling/
- Margelo, deep dive in keyboard handling: https://margelo.com/blog/deep-dive-in-keyboard-handling
- RN issues: https://github.com/facebook/react-native/issues/44157, https://github.com/facebook/react-native/issues/53696, https://github.com/facebook/react-native/issues/30503, https://github.com/facebook/react-native/issues/53050, https://github.com/facebook/react-native/issues/56463
- RN fix for secure echo (0.87): https://github.com/facebook/react-native/commit/08731165f583e6dae344ea80ae4f9051aac0ff48
- Discussion on discouraging controlled inputs: https://github.com/facebook/react-native-website/pull/4247
- React Compiler and react-hook-form: https://github.com/react-hook-form/react-hook-form/issues/12298; TanStack Form: https://github.com/TanStack/form/issues/1501
