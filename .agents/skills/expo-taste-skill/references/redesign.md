# Redesign (Step 0 branch for existing screens)

Read this file whenever Step 0 classifies the job as REVIEW, POLISH, PRESERVE or OVERHAUL, or when the request says "review", "audit", "clean up", "make it look better", "modernize", "redesign" or "it looks generic". Misclassifying the mode is the biggest source of bad redesign output: a preserve job done as an overhaul breaks muscle memory, and an overhaul done as a polish leaves the structural debt in place.

Order, every time: classify the mode -> audit before touching -> report findings -> apply levers in order -> one screen per commit. Report before changing anything unless the user asked for fixes.

## 1. Modes

| Mode | Changes | Never changes | Levers |
| --- | --- | --- | --- |
| REVIEW | nothing (findings only) | everything | none: audit + report |
| POLISH | named findings only (a T or # ID each) that need no layout change: a stacked border, a muted key value, a banned word, a missing press state | block order, archetype, IA, copy voice, the bible | any lever, but only to remove a named finding |
| PRESERVE | how the existing blocks use the bible: ramp roles, tempo, accent roles, press feedback; plus every polish fix | IA, content, archetype, tokens, copy voice, the bible | 1-4 |
| OVERHAUL | composition: separation devices, recomposition, component replacement, the archetype if it was wrong; content and IA preserved | content (demo content excepted, decision-tree branch 3), IA and the never-change list (section 5) unless the user approves each item | 1-8; a bible change needs the bible diff signed off (design-bible.md 'Consistency rules'; report line 'Bible diff', section 6; commit order, section 7) |
| GREENFIELD (rebrand) | the bible itself: palette, typeface, signature component, platform mode | content, IA, the never-change list | run design-bible.md 'Greenfield procedure', then migrate screen by screen as an overhaul |

- Motion is never added in PRESERVE. Removing motion that fails expo-animation step 1 (#13, #14, decorative loops) is a polish fix in every mode.
- Copy and state content are fixed alongside every lever in every mode, because they never change layout. The register and voice stay as the bible states them; strings are rewritten only to remove a T13-T16 or T18-T20 finding. i18n keys keep their names (section 5).
- A fix that would need a new token or a new component is out of scope for POLISH and PRESERVE until the gap is recorded (bindings §6) and the user says yes.

## 2. Decision tree

Walk it top to bottom. The first yes wins.

1. **Is the brand itself changing** (new palette, typeface, logo, signature component or platform mode)? -> GREENFIELD. The current screens are content input, not style input.
2. **Is the debt structural?** Any of these on the screen: wrong archetype or container for the job (a long homogeneous set as stacked cards, a virtualized list nested in a scroll screen, a form without the keyboard-aware container); rebuilt chrome (#1, #2, #5, #11); a Hub whose first viewport is a welcome block or stat wall (T1, T2); no focal point or two filled primaries (C1, C2); navigation shape that contradicts C17 (an action as a tab, a drill-down as a sheet); two archetypes on one screen. -> OVERHAUL with content preserved.
3. **Is the content demo or placeholder** (implementation copy or demo rows, T15, typically a screen recorded as starter debt in bindings §9) with no real task behind it? -> OVERHAUL. The content becomes the archetype's real task (archetypes.md), and demo blocks are retired under the lever 7 reachability rule (section 4). Real content beside the demo is preserved.
4. **Are IA and content sound,** and the screen only reads generic, flat, cramped or loud? -> PRESERVE (levers 1-4).
5. **Did the user name specific defects** ("fix the empty state", "the borders look heavy") or ask only for cleanup? -> POLISH.
6. **"Review", "audit", "what is wrong with"** and no request to change? -> REVIEW.
7. **Still ambiguous** (typically "redesign X" on a screen whose IA is sound)? Ask exactly once: "Preserve the current look, or start visually from scratch?" It counts as the screen's one question (design-read.md 'The one-question rule'). Preserve is the default: if the session cannot wait, run PRESERVE and state the assumption in the report's Mode line.

Several screens in one request get one mode each, and the report lists them. A screen in an overhaul that only needs polish is reported as polish.

## 3. Audit before touching

Do all six before the first edit. The audit is scoped to the screen's files: its route file, its screen file, the components it renders, their style files, and the i18n keys it reads (every locale).

### 3.1 Screenshot matrix of the current screen

| Axis | Values |
| --- | --- |
| Platform | iOS, Android |
| Appearance | light, dark |
| Text size | default, the largest accessibility size (mechanics: expo-design-system Typography 'Dynamic Type') |
| State | content, plus every reachable state: loading (slow first load), empty (each kind), error, pending write |
| Locale | the longest locale named in bindings §8 |

- Minimum before reporting: content state on both platforms x both appearances x both text sizes (8 shots), plus every non-content state on one platform at default size.
- Capture commands (simulator and emulator): `xcrun simctl ui booted appearance dark`, `xcrun simctl ui booted content_size accessibility-extra-extra-extra-large`, `xcrun simctl io booted screenshot <file>.png`; `adb shell cmd uimode night yes`, `adb shell settings put system font_scale 2.0`, `adb exec-out screencap -p > <file>.png`. Reset both devices after the audit.
- Cells you could not capture are listed in the report as "not inspected". Findings that need a screenshot ((S) in preflight.md) are reported as unverified, never assumed clean.

### 3.2 Grep run order

1. Export the bindings §0 variables.
2. expo-design-system references/audit.md section 1 token-coverage greps, with the bindings §0 source, theme and spacing whitelist. For a whole-app audit, also score per audit.md section 2; a category above 2.0 means fix the system (the token or the shared component) before any screen.
3. expo-design-system references/native-slop.md greps (#1-#20, review-each and advisory).
4. The T-grep block in references/tells.md. T13 The Em Dash is binary: one hit is a finding, no review.
5. Dedupe: a hit already reported under a # tell is not reported again under a T tell (preflight.md rule). Cite the # tell and apply its fix.

Commands, flags and the portable form of each grep live in preflight.md and tells.md. Do not retype them here.

### 3.3 Dial reading and current Design Read

- Read V, M and D off the screen as it is, with the bands in dials.md: V from the count of signature blocks, display elements, media headers and brand fields; M from the custom animation code present and the tier each element runs at; D from the measured section gap, row-internal spacing and items per viewport.
- Write the current read with the design-read.md template, prefixed "Current read:", and the measured triple as its own line, prefixed "Current dials:". Leave a slot as `none` when the screen has no answer (for example "Focal: none"); that is itself a finding (C1).
- The reading is the start value for PRESERVE and POLISH, never the baseline or the repo default (dials.md). PRESERVE keeps the triple unless it breaks a cap. OVERHAUL may move V by up to 2 and D to the archetype's band, then re-clamps (dials.md 'Caps', 'Precedence'). M never rises in PRESERVE.
- A current triple above a cap (a Settings screen reading V5, a frequent screen reading V7) is a finding by itself.

### 3.4 Bible check

- Compare the screen with bindings §2 field by field (radius per role, icon size and weight, button variants and placement, tempo row, separation and elevation, accent hue and roles), and with its two nearest sibling screens (C18, T7).
- Known debt already recorded in bindings §9 is reported by ID and marked "baseline". Fix it only when it falls inside this screen's scope or the user asks.

### 3.5 Keep list

Write it before the retire list. Everything here survives every mode except GREENFIELD (where only the brand items change).

- Declared identity: brand tokens, typeface, accent hue, signature component, logo treatment.
- Native chrome that already works: configured headers, native tabs, the native sheet route, platform alerts for destructive confirmation, system switches and pickers.
- Real content and the parts of the copy voice that pass Step 7.
- Accessibility wins: labels, roles, grouped rows, scaling behavior, reduced-motion handling, target sizes.
- Every item on the never-change list (section 5).
- Patterns users have muscle memory for: swipe actions, row order in frequent lists, the position of the primary action.

### 3.6 Retire list

- Every confirmed finding, by ID (T or #), each with its native replacement named (Hard rule 5). Never retire an element without putting its alternative or its task path somewhere.
- Props that look interactive and do nothing (T8), demo and implementation copy (T15), duplicate intents (T17), decoration with no job (Hard rule 4).
- Retiring a whole block or component is OVERHAUL scope. In POLISH and PRESERVE, it moves to "Proposed for overhaul" in the report.

## 4. Lever order

Apply in this order and stop when the brief is satisfied. After each lever, re-screenshot the content state on both platforms and compare with the audit shots; a lever that made any cell worse is reverted, not patched. Typography goes first for the reason audit.md section 5 gives: the biggest visible win that touches the fewest layout decisions.

| # | Lever | What it changes | Rules | Typical findings | Modes |
| --- | --- | --- | --- | --- | --- |
| 1 | Typography | ramp role per string, weights, one-axis demotion, tabular figures, uppercase and tracking removed where the bible does not name them | C3, C13, C14 | T11, T12, T4 (the repeated title text), #6 | preserve, overhaul |
| 2 | Spacing and rhythm | the four tempo steps from the screen's D band row, screen edge, section gaps vs row gaps | C4 | #12, T7 (tempo drift) | preserve, overhaul |
| 3 | Color | accent back to at most 3 roles, text in the two text colors, status only for status, one gray temperature, dark mode designed not inverted | C6, C15, C16 | T9, T10, #18 | preserve, overhaul |
| 4 | Press and ripple feedback | every tappable gets the bible's feedback (bindings §2), never scale on full-width rows (#13); nothing without a handler looks tappable; Pressable only; targets per expo-design-system references/audit.md section 3 | Hard rule 4, bindings §2 and §5 | #13, T8 (dead chevrons, "See all" without a destination), audit.md section 1 unlabeled-tappable grep | preserve, overhaul |
| 5 | Materiality | one separation device per container, at most 2 surface levels, radius by role and nested radius, homogeneous card stacks to grouped rows, the lightest tokened shadow only where something floats | C7, C8, C11 | T5, T7, #7, #8, #9 | overhaul (polish when only a stacked device is removed) |
| 6 | Motion | run expo-animation from step 1 on every existing animation; mostly removal; add a motivated moment only within the M ceiling and only if the read claims M>=5 | Step 8 | #13, #14, decorative loops | overhaul (removal: any mode) |
| 7 | Recomposition | archetype anatomy, focal point, one primary, the structural move, block order, screen-level actions to the header or a menu, navigation shape | C1, C2, C5, C17, C18; archetypes.md; composition.md 'Structural moves' | T1, T2, T3, T6, T17, #4, #15 | overhaul |
| 8 | Replace | a component only when it is unsalvageable: rebuilt chrome to native (#1, #2, #5, #11), a hand-built switch or picker to the platform control (expo-design-system 'When to extract - and when not to': do not wrap platform components), a one-off view to a shared primitive (expo-design-system 'When to extract') | bindings §3, §6 | #1, #2, #5, #11, #16 | overhaul |

Lever notes:

- **1 Typography.** Change one axis at a time (size OR weight OR color). Key values move up to label or body in the text color; sentences never sit in the smallest step. Never add a second family to get "character".
- **2 Spacing.** Pick the D band row from bindings §2 and use its four values; do not invent a fifth. A value outside the scale is an audit.md section 1 hit, fixed with the nearest step or a recorded token.
- **3 Color.** Chrome tint (back button, header items, tab selection) does not count toward C6. Contrast is re-measured in both appearances after any color change (C15).
- **4 Press feedback.** Check every element the screenshot shows as tappable, then every handler in the code: they must match one to one. Icon-only controls get an accessibility label (expo-design-system component contract). Rows navigating with a chevron follow the platform mode (platform-and-brand.md).
- **5 Materiality.** Convert cards to rows only when C11 says so (more than 5 homogeneous items) and the bible's card-vs-row rule does not sanction that card. Keep the one sanctioned card.
- **7 Recomposition.** Content is preserved: every fact, action and task path on the old screen exists on the new one, in a header item, menu or sheet, or stays reachable from another named screen. A demo-only path (T15, bindings §9) may be dropped. List each moved or dropped item under Retire in the report, with where it stays reachable.
- **8 Replace.** A sheet replacing an X-button modal follows archetypes.md 'Sheet': the formSheet route renders no native header, so its title and Done are content, and an edit flow that needs Cancel/Save in a header uses modal presentation. Swapping rebuilt chrome for native configuration goes through the navigation skill (bindings §10).

## 5. Never change silently

Each item changes only with the user's explicit yes, and every change is listed under "Never-change items touched" in the report.

| Item | Why it breaks | Native detail |
| --- | --- | --- |
| Routes and deep links | links in notifications, emails, shared URLs and universal links stop resolving | route file names and folders, dynamic segment and param names, the URL scheme, linking prefixes |
| Tab and drawer labels, order and icons | muscle memory; tab order is spatial memory | trigger names, label strings, icon symbols, the order in the layout file |
| Form field names, order and autofill | autofill and password managers stop matching; analytics break | field names, order, the autofill and content-type props on each input, keyboard type, return-key chain (forms skill, bindings §10) |
| Accessibility labels | screen-reader users lose known targets; UI tests break | labels, hints, roles, testIDs |
| Analytics events | dashboards and funnels go silent | event names, screen names, and the button or row identities events key off |
| i18n keys | other screens and locales lose strings | key names; values may change for a finding, in every locale at once |
| App icon, app name, splash, logo, brand tokens | store identity and recognition | app config values, the icon set, the declared tokens (bindings §1) |
| Legal and consent copy | legal review and store review | terms, privacy, consent and permission-request strings (OS usage descriptions included) |
| Accessibility: no regression | the redesign excludes users it used to serve | contrast in both appearances, behavior at the largest text size, target sizes, labels and roles, reading order, reduced motion |

The accessibility row has no "with approval" exit: a redesign that regresses any of it is not done.

## 6. Report template (findings first)

Write it before any edit unless the user asked for fixes, then wait. With fixes requested, write it first anyway and apply in lever order.

```
Screen: <route or file path>. Mode: <review|polish|preserve|overhaul|greenfield> (<decision-tree branch>[, assumed]).
Current read: <design-read.md template line>.
Current dials: V<n> M<n> D<n> (<preset>).
Findings (by harm):
  1. <ID> <name> at <file:line>: <observed>. Fix: <native fix> (lever <n>).
  2. ...
Keep: <short list>.
Retire: <ID or element> -> <replacement>; ...
Proposed for overhaul: <none | items outside this mode>.
Proposed read: <design-read.md template line>.
Proposed dials: V<n> M<n> D<n> (<preset>[, capped by <rule>]).
Bible diff: <none | field: current -> proposed, screens affected>.
Never-change items touched: <none | item: reason>.
Not inspected: <none | matrix cells>.
Assets needed: <none | ratio + context per missing real image>.
```

Harm order (rank findings by it, highest first):

1. Excludes or blocks: contrast below C15, primary content truncated at large text (C14), unreachable or unlabeled controls, content under the keyboard (#20) or the safe area (#17).
2. Interaction: dead or misleading props (T8), duplicate intent (T17), missing or wrong press feedback (#13), alerts misused (#10), sheet without native dismissal (#2).
3. Trust and comprehension: T13 The Em Dash, T19 The Shrug Error, T18 The Dead-End Empty, T15 The Developer Voice, T16 Jane Doe Data, T20 The Applause Toast.
4. Structure and identity: T1, T2, T4, T5, T7, T9, C1, C2, rebuilt chrome (#5, #11).
5. Polish: tempo (#12), eyebrows and badges (T12), ramp use (T11), icon consistency (C9).

Short example (generic):

```
Screen: hub-screen.tsx. Mode: preserve (IA sound, reads generic).
Current read: Hub for members between sessions in fitness, tens/day screen, deliberate neutral, brand declared. Focal: none. Primary: Browse classes at in-content button. Avoiding: n/a.
Current dials: V4 M3 D5 (branded).
Findings (by harm):
  1. #13 The Squish Reflex at session-row.tsx:18: scale on a full-width row. Fix: bible press feedback (lever 4).
  2. T17 Duplicate Intent at hub-screen.tsx:44: "Browse classes" duplicates the Classes tab. Fix: delete; the tab is the path (lever 7, proposed for overhaul).
  3. T11 The Whisper at next-session.tsx:12: start time in smallest step + muted. Fix: label step, text color, tabular figures (lever 1).
Proposed read: ... Focal: next session. Primary: none (rows navigate).
Proposed dials: V4 M2 D5 (branded).
Never-change items touched: none.
```

## 7. Commit discipline

- Follow expo-design-system audit.md section 5 steps 3-4: convert one worst-offender screen completely and use it as the reference pattern, then go screen by screen, one screen per commit, with the audit greps scoped to that screen.
- A fix that lives in a shared primitive (the grouped-list primitive, the four-state wrapper, the button) is its own commit, made before the screens that depend on it. List every screen that renders it and re-screenshot them all, because the change lands everywhere at once.
- Taste adds to each screen commit:
  1. Re-run the native-slop greps and the full T-grep block (tells.md) scoped to the screen's files; T13 must return zero hits.
  2. Compare with the two nearest sibling screens (C18, T7).
  3. Tick preflight.md, including the [Redesign only] box; report unticked (S) boxes as unverified.
  4. Run lint and typecheck (bindings §10).
  5. Name the finding IDs fixed in the commit message ("fix(hub): T11, #13, T17").
- Leave findings outside the screen untouched, including bindings §9 baseline items, and report them instead.
- For an overhaul with a bible diff: commit the token and bible changes first, then migrate every affected screen before the work is called done. Never ship one screen on a changed identity (design-bible.md 'Consistency rules').
- After each phase of a multi-screen redesign, re-run audit.md sections 1 and 2 on the app; the scores should fall monotonically.
