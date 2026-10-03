---
name: expo-taste-skill
description: 'Native taste and anti-slop decision procedure for every view in an Expo / React Native app, and the entry point for building, restyling, redesigning or reviewing any screen, tab, sheet, form, empty state, onboarding step or user-visible component, and for writing UI copy. Writes a one-line Design Read, sets three native dials (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY), picks a platform mode and one screen archetype, applies countable composition, color, type, copy and four-state rules, checks 20 taste tells (T1-T20, such as The Website Hero, Belt and Braces, The Accent Flood, The Em Dash, The Dead-End Empty) and runs a binary pre-flight. Use it first even if the request only says "add a screen", "make it look better" or "it looks generic, AI-made or like a website". It loads expo-design-system (tokens, component contract, native-slop 1-20) and expo-animation (all motion) at the steps where they apply. Not for web pages. Repo specifics are in references/repo-bindings.md.'
---

# Expo taste

A screen is done when it looks like THIS app's screen, on THIS platform, for THIS person's task, and nothing on it is there by default. It is neither a website in a phone nor the bare platform template with a logo on it.

- **Scope.** The platform owns the chrome: navigation bar, tab bar, sheets, alerts, switches, pickers, keyboard, transitions. Taste applies to the content region between them.
- **This skill owns** direction, composition, density, color and type roles, copy, the content of each state, the T tells and the pre-flight. It does not own token storage, component structure, motion physics, routing or input mechanics (see "Who owns what").
- **Portability.** Nothing in this file or in `references/` names a repo token, component or path. Every such noun resolves in [references/repo-bindings.md](references/repo-bindings.md), cited as "bindings §N".
- **FIRST ACTION, every time:** read [references/repo-bindings.md](references/repo-bindings.md) and check it belongs to this project: the paths in its §0 exist here. If it is missing, or was copied from another app, create it from [references/repo-bindings.template.md](references/repo-bindings.template.md) following [references/design-bible.md](references/design-bible.md) ('Greenfield procedure') before building anything. Never apply another app's bindings.
- **Platform facts** marked with an SDK version (sheets, large titles, menus) were verified for the SDK named in the bindings header. If the project's `expo` major differs, re-check them in that SDK's docs and record the result in bindings §2.
- **Editing this skill or the bindings:** read [references/maintenance.md](references/maintenance.md) first. Its effectiveness is not measured yet, so its rules come before any new rule.

## Light path and full path

The skill is big on purpose for reviews and small on purpose for building. Load only what the job needs; the rest of the context belongs to the code.

- **Light path (default for NEW and EXTEND):** this file + bindings §1-§4 (§0 only to run the greps, §6 or §9 only when the screen touches a gap or a debt screen) + the section of [references/archetypes.md](references/archetypes.md) for the chosen archetype. Run Steps 0-9 from this file: its lines are enough to decide. Step 9 on the light path = the grep sequence on the touched files, lint and typecheck, and the list of matrix cells not inspected; the full checklist in preflight.md is not ticked box by box. Open expo-design-system only for a token or component gap, expo-animation only if something moves or gives feedback.
- **Full path:** GREENFIELD; REVIEW, POLISH, PRESERVE or OVERHAUL; a user saying it looks generic, AI-made or like a website; a Hub, Detail, Overview, Result or Onboarding screen at V>=5; or a light-path decision this file cannot settle (a cap conflict, a copy case, an unclear archetype). Then open the reference the step names, and only that one.
- **Upgrade, never skip.** When the light path finds something it cannot resolve, open the one reference that owns it and say so in the answer. The three output lines (Hard rule 1) and the greps are never skipped on either path.
- **One ID per defect.** Report each defect once, under its owner in the tells.md "Not here" table (a # tell wins over a T tell for the same element). C rules are how a fix is measured, not separate findings.

## Operating posture

- Make the call. Write the Design Read and the dials in one line each, then plan or build. Never present a menu of aesthetics.
- Ask at most ONE clarifying question, and only when (a) the read contradicts the brief ("playful" on a payment confirmation), (b) no brand is declared AND the archetype or audience cannot be decided, or (c) a redesign mode is ambiguous ("Preserve the current look, or start visually from scratch?", [references/redesign.md](references/redesign.md)). Otherwise state the assumption in the read and continue.
- Three failure modes, worst first: (1) web idioms in a phone (hero, stat strip, centered marketing copy, toasts, cards for everything); (2) the undecided template (a Hub, Detail, Profile or Result screen with no focal block, default copy); (3) decoration posing as design (blobs, glows, badges, fake charts).
- Taste is subtraction. Most fixes remove an element, a color or a word. Before keeping an element, ask "would a native app in this category ship this?" If the only reason is "apps usually have one", delete it.
- Subtraction has a floor. It never removes the focal block (at V3-4 at most one signature block) or the real imagery that V allows. A Hub, Detail, Profile or Result screen at V>=3 with no focal block is failure mode (2), not restraint. A Collection is exempt: its focal is its first row and its grouping, and nothing sits between the header and the first row.
- Boring and clear beats clever.

## Hard rules

1. Run Steps 0-9 in order. Steps 1, 3 and 4 each write one line, in this order: the Design Read (Step 1), the dials line (Step 3), and the platform mode + archetype + structural move line (Steps 2, 4, 5). They are lines 1-3 of both output-contract variants. No JSX before all three.
2. The declared system wins. A palette, font or scale declared in the theme overrides every taste default here, including T10 The Borrowed Palette. A missing value becomes a token (expo-design-system 'Adopt Before You Build'), never an inline literal. A missing component follows expo-design-system 'When to extract'.
3. Chrome is configured, never restyled or rebuilt, at every dial value.
4. Every element has a job: focal, support, action, status or navigation. If you cannot name the job, delete the element.
5. Every ban names a native alternative. When you remove something, put the alternative in its place. Never just delete a task path.
6. Delegate, do not duplicate. Do not restate token scales, the component contract, touch-target minimums (expo-design-system references/audit.md section 3), Dynamic Type mechanics, native-slop #1-#20, durations, springs, easings, haptic tables or keyboard handling. Name the sibling skill and section.
7. Rules are countable and the pre-flight is binary. If one box cannot be ticked honestly, the screen is not done, and the answer names that box.
8. Design with real content shape: long names, 0, 1 and 500 items, missing images, the longest locale.

## Who owns what (load order)

| Decision | Owner | Open |
| --- | --- | --- |
| Design Read, dials, archetype, composition C1-C18, color and type roles, density, copy, state content, T1-T20, pre-flight, redesign protocol | this skill | the step below, then its reference |
| Token storage and creation, Dynamic Type mechanics, the component contract (variants, sizes, states, style-last, accessibility), touch-target minimums (references/audit.md section 3), 'Composition over configuration', 'When to extract', not wrapping platform components, Self-Critique Pass, native-slop #1-#20 and their greps, token-drift greps and scoring | expo-design-system | SKILL.md 'Adopt Before You Build', 'The Theme', 'Reusable Components', 'Self-Critique Pass'; references/native-slop.md; references/audit.md |
| Whether and how anything moves: frequency gate, purpose word, tool, properties, timing and springs, threading, press feedback, haptics, reduced motion | expo-animation | Build Sequence steps 1-9, RECIPES.md |
| File placement, shared UI inventory, styles pattern, i18n files | the architecture skill | bindings §10 |
| Inputs, keyboard, validation, a button above the keyboard | the forms skill | bindings §10 |
| Routes, headers, tabs, drawer, sheets, auth | the navigation skill | bindings §10 |

- **Placement is a proposal.** File placement and routes named in a plan are proposals until the bindings §10 skills (architecture, navigation) confirm them, before any code.
- **Load order:** this skill -> repo-bindings.md -> the architecture skill -> expo-design-system -> expo-animation (only if something moves or gives feedback) -> the forms and navigation skills (when the archetype is Task/Form, Auth, Sheet or Onboarding, or a route changes).
- **Conflicts:** a sibling wins on its own topic. repo-bindings wins over everything, including this file. When a T tell and a # tell describe the same element, cite the # tell and apply its fix.
- Never load web design or taste skills (taste-skill, impeccable, frontend-design) for native views.

## Step 0: Classify the job

Pick exactly one and state it in the answer:

- **GREENFIELD:** no bible exists. Fill [references/design-bible.md](references/design-bible.md) into bindings §2 and get the user's yes on palette, type, platform mode and dial default BEFORE the first screen.
- **NEW:** a new screen in an app with a bible. Run Steps 1-9. Identity is locked.
- **EXTEND:** add an element to a passing screen. Infer its Design Read in one line, keep its dials and archetype, and run Steps 5-9 on the delta.
- **REVIEW / POLISH / PRESERVE / OVERHAUL:** read [references/redesign.md](references/redesign.md) first and walk its decision tree. Audit before touching, and report findings before changing anything unless the user asked for fixes. An overhaul that changes the bible shows the bible diff and gets sign-off.

Never change silently: routes and deep links; tab and drawer labels, order and icons; form field names, order and autofill; accessibility labels; analytics events; i18n keys; logo, app name and brand tokens; legal and consent copy. No accessibility regression ever (contrast, Dynamic Type behavior, target sizes, labels), with or without approval.

## Step 1: Design Read

Read eight inputs (detail in [references/design-read.md](references/design-read.md)):

1. Screen kind -> archetype.
2. Screen frequency, in expo-animation step 1 tier names: 100+/day, tens/day, occasional, rare. A tab root (Hub included) is tens/day; a pushed Collection is tens/day only on the user's daily main path, otherwise occasional (the default).
3. Audience in context: who, where, one hand or two, glance or study. The audience picks the aesthetic. A screen serving two audiences reads for the most frequent one; name the other only if it changes the primary action.
4. App category (the category bias table).
5. Vibe words and named references (style words only; domain nouns go through input 4).
6. Declared brand (palette, font, radius in the theme). Fixed input.
7. Quiet constraints: accessibility-first, trust-first (regulated money or health), kids, older users, outdoor or glanceable, low-end Android. They override vibe.
8. Platform mode, from the bible.

Anti-default check: name the first layout that came to mind. If it matches a T or # tell (welcome card, three stat tiles, a card per row, a centered column), discard it and say why in one clause. The "Avoiding" slot is never empty.

Write exactly one line (the dials get their own line in Step 3):

```
Reading this as: <archetype> for <audience in context> in <category>, <frequency> screen, <platform mode>, brand <declared|none>. Focal: <one thing>. Primary: <verb + object> at <placement>. Avoiding: <the default>.
```

- Two or more screens, or a screen entered from another: write the flow path first (design-bible.md 'Flow path rule'). State carries forward: same name, image, count and status on the row and on the detail.
- The read is per screen and the bible is per app. If the read needs something the bible lacks, that is an overhaul, not a local exception.

## Step 2: Platform mode, bible, brand channels

Platform mode is one per app, stored in the bible (detail in [references/platform-and-brand.md](references/platform-and-brand.md)):

- **iOS HIG:** large titles on section roots, inset grouped lists, trailing chevrons on navigating rows, text buttons in the nav bar, create = nav-bar "+", context menus and swipe actions.
- **Material 3:** top app bar title on every screen, no chevrons, ripple, one FAB for the primary create on list roots only if the bible declares a FAB component, filled > tonal > outlined > text.
- **Deliberate neutral:** chrome native per platform, ONE shared content language, and per-platform affordances (chevron, press feedback, create placement, section-header case, destructive confirmation) written in the bible. Undocumented neutral is #16 Cross-Platform Costume.

Large titles are iOS-only in every mode: Android shows the top app bar title, and a large title on Android is #16.

Every screen inherits the filled bible (bindings §2). Screens vary composition, emphasis and tempo, never identity (type, accent hue and roles, radius logic, elevation, icon family, button style, press feedback).

Brand lives in exactly six channels: the accent (within C6), the declared typeface (content region, and nav titles through the navigation theme), imagery treatment (V-gated), voice, ONE signature component per app, and rare-tier art (empty, onboarding, celebration). Brand never lives in the tab or nav bar shape, sheet chrome, alerts, switches, pickers, scroll physics, transitions, status bar or keyboard. If a request needs one of those, write one line naming the native behavior it costs (back swipe, large-title collapse, system dismissal, accessibility) and build the channel alternative.

## Step 3: Dials

Three dials, 1-10, taste-skill's names redefined for native (bands, gates, presets and worked resolutions in [references/dials.md](references/dials.md)):

- **V = DESIGN_VARIANCE:** distance from the stock platform template, in the content region only. 1-2 platform; 3-4 branded native (at most 1 signature block per screen; a Collection needs none); 5-6 expressive (one display element, a media header on Detail or Hub with real imagery, one focal module on the accent-container surface); 7-8 editorial (full-bleed media with a scrim, asymmetric Hub), occasional or rare screens only; 9-10 rare-tier moments on explicit ask.
- **M = MOTION_INTENSITY:** a CEILING handed to expo-animation, never a quota. Its frequency gate always wins. 1-2 platform motion only, zero custom animation code; 3-4 responsive (layout animation on insert and remove, state transitions, live-state loops at M>=4); 5-6 expressive (one spatial moment or signature gesture, one rare-tier delight); 7-10 rare-tier screens only. M does not gate haptics or press feedback (Step 8).
- **D = VISUAL_DENSITY:** 1-3 airy (section gap 32-48pt, at most 3 sections); 4-6 standard (section gap 24-32pt); 7-8 compact (16-24pt, rows not cards, title + at most one meta line, tabular figures on every number); 9-10 cockpit (strictly single-line rows, pro or admin tables only).

Generic native baseline: V3 M2 D5 (preset `native`). The repo default and per-screen defaults are in bindings §4. Write the result as its own line, right after the Design Read:

```
Dials: V<n> M<n> D<n> (<preset>[, capped by <rule>]).
```

**Precedence:** quiet constraints > explicit user override > archetype cap > frequency cap > vibe words > category preset > repo default > baseline.

**Caps:**
- Archetype: Settings V<=2 M<=1; Task/Form V<=3 M<=2; Auth V<=4 M<=2; Sheet and Profile V<=4; Collection M<=3 D>=5; Overview D>=6; Detail up to default +1 (max V6); Empty, Result and Onboarding may raise V and M by 2 (max V7 M6).
- Frequency: screens opened 100+ or tens of times a day (tab roots, main lists, a pushed Collection on the daily main path) stay at V<=5. V>=7 only on occasional or rare screens.
- Quiet constraints: trust-first V<=3 M<=2; accessibility-first V<=3 M<=1; kids M<=4; low-end Android M<=3.

**Overrides:** "denser" D+2, "airier" D-2, "bolder" or "more brand" V+2, "calmer" V-1 and M-2, "more alive" M+2, "more native" resets to the `platform` preset. Re-clamp and restate the triple. To break a cap, write one line naming the cost first. Quiet constraints are never lifted by vibe.

## Step 4: Archetype

Exactly one per screen (anatomy, states and likeliest tells in [references/archetypes.md](references/archetypes.md); this app's containers in bindings §3). "Large title" below means the iOS large title on a section root (a tab or drawer stack root). The same archetype pushed onto a stack (a pushed Collection, Detail, Profile, Overview or Settings) uses the standard title. Android always shows the top app bar title (#16).

| Archetype | Container | Header | Focal | Primary action |
| --- | --- | --- | --- | --- |
| Hub (tab root) | scroll | large title (iOS) | what needs the user now | header item, or the focal block's single button |
| Collection | virtualized list as root | large title (iOS) on a section root, standard title when pushed; header search when the collection can exceed 20 items | first row and its grouping; no signature block | create = header item; FAB only in a mode whose bible declares one |
| Detail | scroll | standard back, short title | identity block | one button under the identity block, or a header item; destructive last, in its own group |
| Task/Form | keyboard-aware scroll (forms skill) | title; a modal edit puts Cancel/Save in the header | first field | one submit at the end of the content |
| Auth | keyboard-aware scroll | title or none | brand mark + form | submit + one secondary link |
| Sheet | formSheet route (navigation skill) | none native: title row and actions are content | its one control | one, at the end of the content or a trailing Done in the title row; swipe-down cancels (#2) |
| Settings | grouped list | large title (iOS) | none (scan) | none; rows navigate or toggle; destructive row in the last section |
| Profile | scroll | large title (iOS) | identity block | Edit as a header item when an edit flow exists, else none |
| Overview/stats | scroll | large title (iOS) | one metric with context | none, or one header item |
| Empty / first-run (state) | the parent's | the parent's | the action | the create action once; hide the header create meanwhile |
| Result/success | scroll or plain | none, or Done | the outcome | single Done or Continue |
| Onboarding / permission primer | plain or keyboard-aware | none | one question | one per step, at most 3 steps, Skip allowed; only when it collects setup (#15) |

- **Sheet facts (SDK 57):** On Android a formSheet renders no native header, title or header buttons and supports no nested navigator (Expo Router modals, 'Android limitations'), so every sheet is designed without them on both platforms: title and actions are content. Use `sheetAllowedDetents: 'fitToContents'` for short content (no `flex: 1` inside), ascending numeric detents for forms, at most 3 on Android. `sheetGrabberVisible` is iOS-only, never the only dismiss affordance. An edit flow that needs Cancel/Save in a header is a modal, not a sheet.
- Header search: until the bindings' header-search check has passed on both platforms, ship without search and list it in the answer as pending.
- A button that must ride above the keyboard goes through the forms skill's shared keyboard wrapper. Otherwise the primary sits at the end of the content.
- If a request needs two archetypes, it is two screens or a screen plus a sheet.

## Step 5: Composition (countable)

Check the shared UI inventory (bindings §3) before composing. Rationale, measurement and fixes in [references/composition.md](references/composition.md).

- **C1 One focal point,** named in the read and visible without scrolling.
- **C2 One filled primary** per screen (a sheet counts as a screen), counted per state branch. Everything else is a secondary or ghost button, a row, a header item or a menu item.
- **C3 Type steps and emphasis:** at most 3 text steps in the content region (nav title excluded), at most 2 per row, at most 1 display element (V>=5, or a real hero number on Overview). Emphasis uses the ramp's weight steps or another weight of the same family, one axis at a time (size OR weight OR color); how this app expresses weight is in bindings §2.
- **C4 Spacing tempo:** 4 distinct scale steps, inline < row-internal < group < section, values from the D band (#12 owns the defect).
- **C5 Leading alignment.** Centering only in Empty, Result, Onboarding, the auth brand mark and single-action confirmations.
- **C6 Accent budget:** one accent, in at most 3 roles in the content region: the primary action, selection/active state, one highlight (a key value or one inline link). Chrome tint (back button, header items, tab selection) is exempt; a ghost button label counts as the highlight. Never body text, every icon, borders or headings. Status colors only for status, never as the only signal.
- **C7 Surface levels and one separation device:** at most 2 surface levels (canvas -> group/card). One separation device per container: fill contrast OR hairline OR the lightest tokened shadow. A grouped list (fill + inner hairlines + outline hairline) is one device. Absolute position and z-index only for real layers.
- **C8 Radius by role** from the scale; nested radius = outer - inset; corner smoothing per expo-design-system 'Radius' or the bindings §5 override. Chrome config (sheet corner radius) is exempt.
- **C9 Icons:** family per #3; one size and weight per context; literal symbols; filled variants only for selected state. In a group, leading icons on all rows or none. Text or muted color unless the icon is the control.
- **C10 Media frames:** media in a fixed aspect ratio per context (1:1, 4:3, 3:2, 4:5, 16:9), one ratio per list, with a placeholder. Text over media sits on the solid scrim token at 4.5:1 or goes below the media. Missing real imagery is listed under "Assets needed", never faked.
- **C11 Groups and lists:** a static grouped section holds at most 8 rows. A capped preview is mapped rows in a group; unbounded content is the screen's root virtualized list, never nested in a scroll container. More than 5 homogeneous items become rows, except the bible's one sanctioned entity card at D<=6 (bindings §2). No per-row top and bottom borders.
- **C12 Badges and eyebrows:** at most 1 badge per row and 3 per viewport, only for state the user acts on or filters by, paired with a word or symbol. At most 1 custom eyebrow per screen; the grouped-list header is exempt.
- **C13 Numbers** are real or labeled mock, use the locale formatter and i18n plurals, and use tabular figures when they align or update (every number at D>=7). Ranges are i18n strings, never Intl `formatRange`.
- **C14 Text size roles:** sentences at the body step or larger; the smallest step only for 1-line metadata; key values never smallest + muted. A group header that only navigates (day, letter, category) may keep the grouped-list header style when every row carries its own key value; a header that is itself the key value is promoted into the rows or recorded as a gap (bindings §6). Scaling and truncation: expo-design-system Typography 'Dynamic Type'.
- **C15 Contrast and accessible structure:** text and button labels at least 4.5:1; large text, meaningful icons and meaningful borders (input boundaries) at least 3:1; both themes. Meaningful images carry an accessibility label and decorative ones are hidden; section titles expose the header role; a row is one accessible element with its state announced; reading order follows visual order.
- **C16 Dark mode in the same pass:** designed, not inverted (color mechanics: #18).
- **C17 Navigation shape:** peers switched often -> tabs (3-5 nouns, never actions); drill-down -> push; a secondary task that returns -> sheet; 2-4 views of the same data -> segmented control (not in RN core; if the app has none, bindings §6); screen-level actions -> header item or menu (if no menu primitive exists, bindings §6), never a full-width in-content button.
- **C18 Composition varies, identity stays.** Compare with the two nearest sibling screens before done. Across a flow, state carries forward and density never swings from cramped to empty (composition.md C18).

Name exactly one structural move per screen (composition.md 'Structural moves'). Never stack 3+ different block types above the fold.

## Step 6: States

Every data-backed screen designs loading, empty, error and content (plus pending for writes) before content polish. Mechanics belong to #19 and the data layer (bindings §10); confirmation and alert policy belong to #10. This skill owns only how each state looks and reads ([references/states-and-copy.md](references/states-and-copy.md)).

- **Loading:** mechanics per #19. Taste adds: skeleton blocks on the muted surface with the radius role of what they stand in for, geometry matching the first viewport, no shimmer at M<=2, no "Loading…" next to a skeleton.
- **Empty, three kinds.** First-run: muted literal symbol + title of at most 6 words saying what goes here + 1 sentence on how it gets populated + the create action when the user can create. No-results: echo the query + one recovery sentence (broaden the terms, check the spelling); the native header search bar's own clear/cancel is the clear action, so no duplicate Clear button, and a Clear filters button only for non-search filters. Nothing now (cleared, caught up, or nothing current or scheduled): one plain line stating the fact, optionally when content returns, no create action. Never "No data" and never one string for all three.
- **Error:** inline at its scope (field, section, screen), naming what failed and one next step: "Could not <verb> <object>. <Next step>." Stale content stays: a failed refresh with data on screen is an inline line, never a full-screen error. Full-screen only when nothing can render. Never raw server or exception text.
- **Success:** policy per #10. The UI change is the confirmation; a transient message only for Undo or an off-screen result (T20).
- **Destructive:** whether to confirm is #10. When confirming natively, title it "<Verb> <object>?" and repeat the verb on the destructive button.

## Step 7: Copy

Re-read every visible string in every locale before Step 9 (formulas, banned words and the Copy Self-Audit in [references/states-and-copy.md](references/states-and-copy.md)):

1. Zero em dashes (U+2014) and en dashes (U+2013) in any visible string, mock data, JSX literal or comment, in every locale. Binary. Use a period, comma, colon, parentheses or two strings. Ranges are i18n strings ("{{from}} to {{to}}").
2. Sentence case for titles, buttons, tabs, rows and section headers. Capitals only for proper nouns.
3. CTA = verb + object, at most 3 words, one line at default size in the longest locale, naming the outcome ("Join event", never "Submit").
4. One register per app and language, locked in the bible: person, formality, pronoun. The app does not call itself "we" unless the bible says so. Active voice with the real actor.
5. Zero exclamation marks, except one in a rare-tier celebration. No Oops, Whoops, Yay or "successfully".
6. No filler (elevate, seamless, unleash, unlock, supercharge, effortless, next-gen, revolutionize, empower, game-changer, journey, delve, tapestry) plus the bible's per-language list. No web idioms (click, hover, scroll down, "learn more ->", read more).
7. Typography: curly quotes and apostrophes, the single ellipsis character (…) only for an in-progress verb.
8. No implementation or placeholder copy (T15). Mock data is plausible, varied (names, lengths, dates, 0 and 1 counts, a missing image) and labeled as mock in code (T16).
9. Copy Self-Audit: read each string as the user would and rewrite anything broken, vague, cute-but-wrong, trying to sound thoughtful, naming the mechanism, or with an unclear referent.

## Step 8: Motion handoff

For each candidate motion, write one sentence: `<element> animates because <purpose word, expo-animation step 2> at <frequency tier, step 1>.` Then run expo-animation from step 1. This skill states no duration, spring or easing.

- Anything above the M ceiling is cut. The frequency gate can cut anything at any M.
- Motion claimed = motion shown. A read that says lively, animated or playful (M>=5) ships at least one motivated occasional- or rare-tier moment, or lowers M to 4 or less.
- Perpetual loops only for live state (recording, live score, syncing), and only at M>=4.
- No entrance animation on routine screens (#14).
- Press feedback follows bindings §2 at every M (where the repo may override expo-animation step 7). Never scale full-width rows (#13).
- Haptics are feedback, not motion: they follow expo-animation step 8, are not gated by M, need the haptics module installed (status in bindings §5) and are never the only feedback.
- Reduced motion ships with every animation (expo-animation hard rule 4).

## Step 9: Pre-flight and verify

1. Run the grep sequence in [references/preflight.md](references/preflight.md) in bash, with the bindings §0 variables, on the touched files (`scripts/taste-greps.sh` runs the T block and diffs it against the baseline; `scripts/contrast.ts` after any color change): expo-design-system references/audit.md section 1 -> native-slop greps -> the T-grep block in [references/tells.md](references/tells.md). T13 runs over the whole source tree. Every hit is fixed or justified in one line; a hit reported under a # tell is not reported again as a T tell.
2. Inspect the matrix: iOS and Android x light and dark x default and largest accessibility text size x loading, empty, error and content x the longest locale (minimum pass in preflight.md section 3). List the cells you could not inspect.
3. Run expo-design-system's Self-Critique Pass on a rendered screen.
4. Full path: tick every box in preflight.md. Boxes marked (S) that you could not verify are reported, never ticked. Light path: the reduced Step 9 in 'Light path and full path'.
5. Run lint and typecheck (commands in bindings §10).

## Taste tells T1-T20 (index)

Review prompts with a named native fix, like native-slop. Numbered T so they never collide with native-slop #1-#20. T13 The Em Dash is binary; every other tell is judged hit by hit. Full entries, Detect classes, the grep block and the "Not here" ownership table are in [references/tells.md](references/tells.md). Known hits in this app are in bindings §9.

| ID | Name | Observable tell | Native fix | Related |
| --- | --- | --- | --- | --- |
| T1 | The Website Hero | Tab root opens with "Welcome to <App>", an explainer and a big CTA, or an auto-advancing promo carousel | Hub: the user's most time-relevant content first; explanation moves to the first-run empty | #4, #15 |
| T2 | The Stat Wall | Equal tiles of big numbers with tiny labels, decorative rings or filled tracks, no unit or period | Each number where it is acted on: row value, section count, one metric with a delta sentence | C13 |
| T3 | Centered Everything | Centered titles, body and buttons on Hub, Detail, Collection, Profile, Settings or Form | Leading alignment; centering only in the C5 exemptions | C5 |
| T4 | The Double Title | Content repeats the header title at the title step | Native header title only; Detail identity block adds information instead | #11, #16 |
| T5 | Belt and Braces | Fill + border + shadow on one container, or framing depth 3+ | One separation device per container, depth at most 2 | #7, #8, #9 |
| T6 | The Spec Sheet | Detail as label/value rows for every field, empty ones included | Identity block, present fields only, the key missing field as an action row | #9 |
| T7 | Screen Drift | Radius, icon weight, button style, tempo, shadow or accent hue differs from siblings; the entity differs between row and detail | Bible values by role; compare with two siblings (C18) | #16 |
| T8 | Ornament Without Meaning | Blobs, glows, glass, metaphor icons, props that look interactive and do nothing | Delete it; literal symbols; every interactive-looking element works | #3, #4 |
| T9 | The Accent Flood | Accent in more than 3 content roles, a second accent hue, rainbow icon bubbles | C6 budget; headings and icons in text colors | C6 |
| T10 | The Borrowed Palette | Stock indigo, AI purple or premium beige palettes with no declared brand; added stock hex; mixed gray temperatures | One accent for the category, below about 80% saturation, one gray temperature, as tokens; a declared brand always wins | #18 |
| T11 | The Whisper | Key value in the smallest step + muted; sentences in the smallest step; broken ramp | Demote one axis at a time; key values at body or label in the text color | #6 |
| T12 | Label Confetti | Uppercase eyebrows, section numbering, New/BETA pills, several chips per row, color-only status | C12 budget; progress as "2 of 4" in the header | C12 |
| T13 | The Em Dash | Any U+2014 or U+2013 in strings, mocks or comments, or Intl `formatRange` output | Period, comma, colon, parentheses; ranges as i18n strings | none |
| T14 | The Marketing Voice | Filler, hype, exclamation marks, Title Case, web idioms, straight quotes | Plain verb + domain noun, sentence case, the bible's register | T1 |
| T15 | The Developer Voice | Copy about the implementation, placeholders, raw error text, hand-built plurals | Write for the task; errors mapped by kind; plurals and formatters | T19, C13 |
| T16 | Jane Doe Data | Stock names, fake precision, the same avatar and date for everyone, lists of exactly 5 | Varied, locale-realistic mocks with 0, 1, long and missing cases | C13 |
| T17 | Duplicate Intent | Two controls for one intent, tiles repeating tabs, screen actions as full-width content buttons, a Clear button repeating the header search bar's own clear, CTAs over 3 words | One control per intent; screen actions in the header; one primary | C2, C17 |
| T18 | The Dead-End Empty | A muted centered "No items yet" with no reason or action, one string for every empty kind | The three empty kinds of Step 6 | #19, #3 |
| T19 | The Shrug Error | "Something went wrong" full screen over readable content, raw server text, validation in a banner | Name what failed and the next step, inline at its scope | #10, T15 |
| T20 | The Applause Toast | Toast announcing a success the UI already shows, or carrying an actionable error | The UI change confirms; transient only for Undo or off-screen results | #10 |

## Output contract

Open with the job class (Step 0) and, for 2+ screens, the flow path line. Then, per screen, one of two variants. Lines 1-3 are the same in both and are the Hard rule 1 lines.

**PLAN (before code):**

1. The Design Read line (Step 1).
2. The dials line: `Dials: V<n> M<n> D<n> (<preset>[, capped by <rule>])` (Step 3).
3. Platform mode + archetype + structural move (Steps 2, 4, 5), then deviations from the bible, a cap or a platform-mode rule with a one-sentence reason each, any debt screen touched for an entry point (design-bible.md 'Flow path rule'), and pending items (for example header search awaiting its bindings check), or "none".
4. Anatomy, top to bottom: each block with its job, focal and primary marked; proposed files and routes are marked as proposals (Who owns what).
5. States the screen can reach (loading, each empty kind, error, content, pending), each with its copy in every locale.
6. Motion handoff: one Step 8 sentence per candidate, or "No motion: <tier>".
7. Assets needed: none, or one line per missing real image (ratio + context + where it goes).
8. Tells to watch: the T and # IDs most likely on this archetype (archetypes.md), each with the guard planned against it.

**BUILD / REVIEW (after code):**

1-3. As in PLAN.
4. Pre-flight: boxes failed, fixed or justified (unverified (S) boxes reported, never ticked), grep hits found and how each was fixed or justified, matrix cells not inspected, and any token or component gap with the sibling skill that owns it.
5. Assets needed, as in PLAN.

A review of an existing screen with no changes requested uses the report template in [references/redesign.md](references/redesign.md): findings by ID ordered by user harm (accessibility and interaction first), each with its native fix and file:line, then "Assets needed". No design essays.

## References

| File | Open it for |
| --- | --- |
| [references/repo-bindings.md](references/repo-bindings.md) | READ FIRST. This app's tokens, components, paths, grep variables, filled bible, defaults, gaps and known debt |
| [references/design-read.md](references/design-read.md) | Step 1: inputs, quiet constraints, anti-default check, one-question rule, template, worked examples, category bias |
| [references/platform-and-brand.md](references/platform-and-brand.md) | Step 2: the three modes, SDK 57 chrome facts, the #16 boundary, the six brand channels |
| [references/repo-bindings.template.md](references/repo-bindings.template.md) | Blank §0-§10 skeleton for a project without bindings (or with another app's copy) |
| [references/design-bible.md](references/design-bible.md) | The 16-field bible template, greenfield procedure, consistency and flow path rules |
| [references/dials.md](references/dials.md) | Step 3: bands, gates, presets, inference, caps, precedence, overrides |
| [references/archetypes.md](references/archetypes.md) | Step 4: the 12 anatomies with states, likeliest tells and delegation |
| [references/composition.md](references/composition.md) | Step 5: C1-C18 measured, hierarchy ladder, separation budget, navigation shape, media frames, structural moves |
| [references/states-and-copy.md](references/states-and-copy.md) | Steps 6-7: state matrix, empty and error anatomy, Undo, copy rules, banned words, mock data, Copy Self-Audit |
| [references/tells.md](references/tells.md) | T1-T20 in full, the grep block, the "Not here" table |
| [references/redesign.md](references/redesign.md) | Step 0 branch: modes, decision tree, audit, lever order, never-change list, report template |
| [references/preflight.md](references/preflight.md) | Step 9: grep sequence, dedupe, verification matrix, the checklist |
| [references/maintenance.md](references/maintenance.md) | Before editing the skill or the bindings: no new rules until the with/without eval, size budget, bindings that do not rot |
