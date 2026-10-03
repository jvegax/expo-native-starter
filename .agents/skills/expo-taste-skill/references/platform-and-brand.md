# Platform mode and brand

Detail for SKILL.md Step 2. The platform mode is chosen once per app and stored in the bible (bindings §2). Documented exceptions live in bindings §7. Screens never pick their own mode.

Two rules frame everything below:
- Chrome is configured, never restyled or rebuilt (Hard rule 3). Headers, tab bar, sheets, alerts, switches, pickers, back gesture, status bar and keyboard come from the platform in every mode and at every dial value.
- The mode decides the idioms of the content region: row affordances, where create lives, press feedback, local switching, menus, button hierarchy, symbol style.

## Pick the mode

| Mode | Pick it when | Write in the Design Read |
| --- | --- | --- |
| iOS HIG | The app ships on iOS only, or the brief asks for an iOS-first app and Android is a port | `iOS HIG` |
| Material 3 | The app ships on Android only, or the brief asks for Android-first | `Material 3` |
| Deliberate neutral | One codebase on both platforms with a declared brand (the usual Expo case) | `deliberate neutral` |

Deliberate neutral is not "no decision". It is iOS HIG chrome on iOS, Material chrome on Android, and one written content language between them. Unwritten, it is native-slop #16 Cross-Platform Costume.

## Chrome facts that hold in every mode (Expo SDK 57)

| Chrome | iOS | Android | Never |
| --- | --- | --- | --- |
| Screen title | Large title on section roots (`headerLargeTitleEnabled`, iOS-only), standard title on pushed screens | Top app bar title on every screen; the large-title option has no effect | A content-region headline imitating either one (T4, #11). A large-title look on Android is #16 |
| Tab bar | `NativeTabs`, SF Symbols, system materials | `NativeTabs` as the Material navigation bar, at most 5 tabs, Material Symbols | A custom or floating tab bar (#5), an action as a tab (C17) |
| Sheet | `formSheet` route, grabber available (`sheetGrabberVisible` is iOS-only), any number of detents | Platform bottom sheet, at most 3 detents | A native header, title or header buttons inside a `formSheet` (on Android they do not render, Expo Router modals 'Android limitations', so no sheet uses them on either platform), navigation nested inside a sheet, an X-only close (#2) |
| Confirmation | Native alert or action sheet | Native dialog | A custom centered modal (#1); when to confirm at all is #10 |
| Back | Edge swipe + back button | System back + top app bar up arrow | `headerShown: false` with a hand-made back (#11) |

Sheet content follows from the missing header: the sheet's title row and its actions are content (a title at the top, one primary at the end, or a trailing Done text button in the content), swipe-down is Cancel, and `sheetAllowedDetents: 'fitToContents'` sizes short content (it needs explicit content height, `flex: 1` is not supported). An edit flow that needs Cancel and Save in a header uses `presentation: 'modal'`, not `formSheet`. Wiring belongs to the navigation skill (bindings §10).

## iOS HIG mode

| Idiom | Do | Not |
| --- | --- | --- |
| Titles | Large title on section roots; short standard title on pushed Detail | A big title-step text repeating the header (T4) |
| Lists | Inset grouped lists through the grouped-list primitive; short noun section headers | A card per row (#7), per-row borders (C11) |
| Row affordance | Trailing chevron only on rows that push a screen | Chevrons on rows that toggle, open a menu, open a sheet or do nothing (T8) |
| Trailing content | A muted current value, a count, a switch for an immediate boolean, or the chevron | Two trailing accessories on one row |
| Header buttons | Text buttons where the platform puts them (Edit, Done, Cancel), icon items for screen actions; at most 2 trailing items, the rest in a menu | A full-width in-content button for a screen-level action (C17, T17) |
| Create | `+` as a header-right item on the Collection or Hub that owns the object | A FAB (#16), a duplicate create button in content (T17) |
| Local switching | Native segmented control for 2-4 peer views of the same data (C17; a dependency in RN, a missing primitive is a gap, bindings §6) | Tabs inside a screen, a custom pill switcher |
| Row actions | Swipe actions (destructive trailing) and context menus (`Link.Menu`, iOS-only, expo-animation step 3); every swipe or menu action also reachable from the detail or a visible control | Actions that exist only behind a swipe (invisible to many users and to VoiceOver discovery) |
| Filters and sort | A header menu (pull-down) for filters and sort; for 2-4 scopes, a segmented control below the header (a dependency, bindings §6). SDK 57's header search bar has no scope bar | A row of filter chips copied from Material |
| Destructive | The danger role as text, last, in its own group; confirmation per #10 | A red filled button, destructive in the middle of a group |
| Symbols | SF Symbols, weight matched to the adjacent text weight; filled variant only for the selected state | Mixed outline and fill at rest, emoji (#3), metaphor icons (T8) |
| Press feedback | Pressed background highlight on rows and cards, a dimmed or darker fill on buttons (bindings §2) | Ripple (#16), scale on full-width rows (#13) |
| Search | Header search bar when the collection can exceed 20 items (until the bindings' header-search check passes on both platforms, ship without it and list it as pending) | A search field drawn in content above the list |

## Material 3 mode

| Idiom | Do | Not |
| --- | --- | --- |
| Titles | Top app bar title on every screen; the identity block adds information below it | Any large-title imitation, a centered title by default |
| Lists | Full-width rows or rows on a surface container; section headers in sentence case (no uppercase by default) | Chevrons on rows (#16), a card per row (#7) |
| Header actions | Icon actions trailing in the top app bar, at most 2, the rest in the overflow menu | iOS text buttons styled as links in the bar |
| Create | One FAB for the primary create on a list root, extended with a label when the icon is ambiguous, only if the bible declares a FAB component; otherwise a top app bar action | More than one FAB, a FAB on Detail, Form, Settings or a sheet, a FAB with no declared component |
| Button hierarchy | filled > tonal > outlined > text, mapped to the declared button variants (bindings §2); a missing variant is a component gap (bindings §6) | An inline-styled tonal button |
| Local switching | Segmented buttons for 2-4 peer views; filter chips for filters; sort in a menu | The iOS segmented look (#16) |
| Row actions | Long-press or the row's overflow menu; swipe only to dismiss or archive, with Undo | iOS-style trailing swipe stacks |
| Undo | Snackbar with Undo for reversible actions, only if a snackbar component exists; otherwise it needs a design decision first (bindings §6) | A snackbar or toast that only reports success (T20, #10) |
| Destructive | Danger-role text button, last, in its own group; confirmation per #10 | A red filled button as the screen's primary |
| Symbols | Material Symbols outlined; filled only for the selected state | SF Symbols rendered on Android, mixed families (#3, C9) |
| Press feedback | Ripple: foreground on rows, cards and buttons, borderless on header icon buttons (bindings §2) | A pressed-highlight background copied from iOS, scale on rows (#13) |
| Search | Search in the top app bar or a search action that opens it | A search field drawn in content above the list |

## Deliberate neutral mode

Shared on both platforms (the content language, locked in the bible):
- Typeface and type ramp, the accent and its roles (C6), gray temperature.
- Radius logic, separation device, elevation language (C7, C8).
- Button variants and hierarchy, the grouped-list style, the one sanctioned card style, the signature component.
- Spacing tempo per D band, imagery ratios and treatment (C10), copy register.

Native per platform (never shared):
- All chrome in the table above: title style, tab bar, sheets, alerts, switches, pickers, back.
- Symbol family: SF Symbols on iOS, Material Symbols on Android, the same literal metaphor on both (C9; the family rule is #3).

What neutral must write in the bible before the first screen. Each line is a decision with both platforms named:

| Decision | Write | Example |
| --- | --- | --- |
| Chevrons | Which platform shows them, on which rows | "Trailing chevron on navigating rows, iOS only" |
| Press feedback | The iOS treatment and the Android treatment, per role | "iOS pressed background on rows and cards; Android foreground ripple, borderless on header icons" |
| Create placement | Where create lives on each platform, and whether a FAB exists | "Header-right item on both; no FAB component" |
| Section-header case | One case for both platforms | "Sentence case on both" |
| Destructive confirmation | The confirmation surface on each platform | "Native alert on both, title '<Verb> <object>?'" |

When the app uses them, also write: local switching (native segmented control on iOS, segmented buttons on Android), the header or overflow menu primitive, Undo surface, swipe actions. A missing primitive goes to bindings §6 as a gap, not into an inline build.

Neutral is valid only when written down. A per-platform choice that a screen needs and the bible lacks is either added to the bible before building or recorded in bindings §7 with one reason. Silently doing it is #16.

## Boundary with #16 Cross-Platform Costume

Test each per-platform element: is it chrome or content? Chrome is always the platform's own. Content may be shared only when the bible says so.

| Costume (#16, fix it) | Fine in neutral (when written in the bible) |
| --- | --- |
| A FAB on iOS | Create as a header-right item on both platforms |
| Chevrons on Android rows | Chevrons on iOS only, nothing on Android |
| A large title or large-title-like headline on Android | Large title on iOS roots, top app bar title on Android |
| The iOS segmented look on Android, Material segmented buttons on iOS | Each platform's native segmented control behind one shared role |
| Ripple on iOS, pressed-background highlight as the only Android feedback | iOS highlight and Android ripple, both written |
| An iOS-drawn switch or picker on Android, or a redrawn switch anywhere | The platform switch with tokened tint colors |
| A snackbar on iOS for routine success | An in-place Undo affordance written once for both |
| SF Symbols on Android, Material Symbols on iOS | One metaphor, each platform's family |
| A "< Back" text header on Android | The platform back on each |
| Uppercase section headers on one platform only | One section-header case on both |
| A shared custom tab bar or header | A shared card style, grouped-list style, button set and accent |

A deviation the user explicitly wants (for example a FAB on Android list roots in neutral mode) is fine once it is written in bindings §7 first and named in output contract item 3.

## Brand inside native constraints

Brand lives in exactly six channels. Everything else is the platform.

| # | Channel | One example | Limit |
| --- | --- | --- | --- |
| 1 | The accent | Primary button fill, the selected segment, one key value on the screen | C6: at most 3 roles in the content region. Chrome tint configured once (back button, header items, tab selection) does not count; a ghost button label counts as the highlight role. Same hue on every screen (T7, T9) |
| 2 | The declared typeface | Content region text plus nav titles set through the navigation theme's font config | Weights and scaling verified (#6, expo-design-system Typography 'Dynamic Type'); never a rebuilt header to get the font in |
| 3 | Imagery treatment | A 16:9 media header with a scrim on Detail at V>=5 | V-gated (dials.md); fixed ratios and one treatment per context (C10); real assets only, missing ones listed in the output as assets needed |
| 4 | Voice | Sentence case, second person, verb + object CTAs in the bible's register | Step 7 and states-and-copy.md; one register per app |
| 5 | One signature component | An identity block (avatar or crest + name + one meta line) on the list row and the Detail | One per app, identical everywhere it appears; at most 1 signature block per screen at V3-4 (a Collection needs none); extract on second use (expo-design-system 'When to extract') |
| 6 | Rare-tier art | A muted symbol in an accent-container circle on a first-run empty state, an onboarding or celebration illustration | Occasional and rare screens only (expo-animation step 1 tiers), never on 100+/day screens; any motion goes through Step 8 |

Brand never lives in these. Each row names what may be configured instead:

| Chrome | Brand may configure | Never |
| --- | --- | --- |
| Nav bar | Title font, tint, background color through the navigation theme | A custom header component, `headerShown: false` + a text title (#11), gradients or logos drawn in the bar |
| Tab bar | Icons per platform, labels, tint and indicator colors through the native tabs options | Bar shape, floating or inset bars (#5), a center action tab |
| Sheet chrome | Detents, corner radius (chrome config, exempt from C8), grabber on iOS | A custom handle, a drawn header inside the sheet chrome, an X-only close (#2) |
| Alerts | Title, message and button copy | A branded custom dialog (#1, #10) |
| Switches and pickers | Track and tint colors from tokens | A redrawn control (expo-design-system 'When to extract': do not wrap platform components) |
| Scroll physics | Content insets, refresh control tint | Custom overscroll, snapping without a reason, scroll-jacking |
| Transitions | The route's presentation type (navigation skill, bindings §10) | Custom screen-to-screen animation (expo-animation step 3) |
| Status bar | Style that follows the active theme | Hiding it on content screens, a colored band behind it |
| Keyboard | Keyboard type, return key, autofill (forms skill, bindings §10) | A custom keyboard or brand UI riding the keyboard outside the shared wrapper |

### Name what it costs

When a request touches chrome ("a curved tab bar in our color", "our logo in the nav bar", "a branded bottom sheet", "a custom switch"):

1. Name the native control it would replace and what is lost: back swipe, large-title collapse, scroll-to-top, system dismissal, VoiceOver and TalkBack semantics, Dynamic Type, keyboard avoidance, free platform updates (new materials, tab bar minimize on iOS 26).
2. Name the channel version that gets the brand in without the loss: tint and font through configuration, the signature component, rare-tier art.
3. Write one line before any code: "<request> would replace <native control> and lose <behaviors>. Brand alternative: <channel>." Build the alternative.
4. If the user still wants the replacement, record it in bindings §7 with its cost, report it under output contract item 3, and hand the mechanics to the owning skill (navigation skill for chrome, expo-animation for motion).

| Request | It costs | Channel instead |
| --- | --- | --- |
| Custom curved or floating tab bar | System placement, materials, accessibility, iOS 26 minimize (#5) | Tab icons and tint, the signature component on the Hub |
| Logo or gradient in the nav bar | Large-title collapse, back swipe, scroll-to-top (#11) | Header font and tint; the logo on Auth or a rare-tier screen |
| Branded bottom sheet with its own close button | Swipe-down dismiss, detents, platform sheet behavior (#2) | `formSheet` with tokened content and the declared button set |
| Custom animated switch | Platform semantics, the expected look on each OS | Tokened tint colors on the platform switch |
| Signature page transition | Native stack transition and gesture back | One rare-tier moment inside content, through expo-animation |
