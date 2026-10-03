# Archetypes (Step 4 detail)

Every screen is exactly one archetype. Name it in the Design Read, then build the anatomy below top to bottom. If a request needs two archetypes, it is two screens or a screen plus a sheet. The containers and components that implement each archetype in this app are in bindings §3, and the default dials per screen are in bindings §4.

## Rules that apply to every archetype

- **Header mode.** "Large title" means the iOS large title on a section root (a tab or drawer stack root). Any archetype pushed onto a stack (a pushed Collection, Detail, Profile, Overview or Settings) uses the standard title. Android has no large title: every screen gets a top app bar title. A large title on Android is #16 Cross-Platform Costume. The header is configured through the navigation skill (bindings §10), never rebuilt (#11).
- **Primary per platform mode.** Each archetype lists placement for iOS HIG, Material 3 and deliberate neutral. In neutral mode the bible decides (bindings §2), and an undocumented choice is #16.
- **No FAB unless bindings §2 declares a FAB component**, and then only on Material-mode or neutral-mode Android list roots. Without one, create is a header item on both platforms.
- **Menus.** "Header menu", "sort in a menu" and "filters in a menu" assume a menu primitive. If bindings §6 lists none, that is a component gap: check the SDK docs, ask, and never fake a menu with a custom popover (#1).
- **Caps** come from dials.md. Precedence is unchanged: quiet constraints still win over any archetype cap.
- **States.** Mechanics of loading and false-empty belong to #19, alerts and confirmations to #10. Each archetype below lists only how the four states look. Copy formulas live in states-and-copy.md.
- **Lists inside scroll screens.** A capped preview (at most 8 rows) is a mapped static group. An unbounded list is the screen's root virtualized list. Never nest a virtualized list inside a scroll container (C11).
- **Assets.** When V allows a media header or an illustration and no real asset exists, build the non-media variant and list the missing asset (ratio + context) in the output contract. Never fake imagery.

---

## Hub

- **When:** a tab root or the first signed-in screen. It answers "what needs me now".
- **Container:** scroll screen.
- **Header:** large title (iOS); top app bar title (Android). The header title is the only title.
- **Focal:** the one module that is most time-relevant (next event, pending action, status that needs the user).
- **Primary:** iOS: a header item, or the focal module's single button. Material: the focal module's single button, or a top app bar action. Neutral: as bindings §2 says.
- **Caps:** frequency cap V<=5 (a tab-root Hub is a tens/day screen, design-read.md input 2). At D4-6, at most 5 sections: 1 primary module + up to 4 secondary modules. First-screen cleanliness at D<=4 (dials.md).
- **Anatomy:**
  1. Optional greeting: at most 1 line, or none. Never an app explanation.
  2. Primary module: at most 3 short lines and 1 action. At V5-6 it may sit on the accent-container surface.
  3. Secondary modules ordered by urgency, each a grouped section or one horizontal rail (rails need V>=3; at most 1 at V3-4, 2 at V5-6).
  4. At most 3 numbers on the screen, each tappable to its source.
- **States:** loading keeps the last modules visible; a slow first load shows static blocks matching the module layout (radius roles, muted surface, no shimmer at M<=2). Empty: first-run replaces all modules with one Empty composition that carries the app explanation. Error: per module, inline, so one failing module never blanks the Hub.
- **Likeliest tells:** T1 The Website Hero (welcome card, explanation paragraph, big CTA, or an auto-advancing promo carousel with page dots on a tab root), T2 The Stat Wall (equal tiles, progress rings or bars on filled tracks used as comparison), T17 Duplicate Intent (an equal grid of quick-action tiles that repeats tabs or drawer items, a button that duplicates a tab), T4 The Double Title, T12 Label Confetti (an eyebrow above every module); #4, #7, #14.
- **Delegated:** module components and extraction to expo-design-system 'When to extract'; any motion on module insert to expo-animation step 1 (the Hub is a tens/day screen; switching to its tab is a 100+/day interaction, so nothing animates on entry, #14).

## Collection

- **When:** a list of homogeneous items the user scans, searches or opens.
- **Container:** the virtualized list as the screen root (pull to refresh included).
- **Header:** large title (iOS) when the Collection is a section root, standard title when it is pushed; top app bar title (Android). Header search when the collection can exceed 20 items, in the native header search bar; until the bindings' header-search check has passed on both platforms (bindings §3), ship without search and list it in the answer as pending.
- **Focal:** the first row and the grouping. Nothing sits between the header and the first row except an active filter summary. A Collection needs no signature block at any V (dials.md V bands); its grouping (sections by date, status or letter) is its structure.
- **Primary (create):** iOS: header '+' item. Material: top app bar action, or a FAB only if bindings §2 declares one. Neutral: bindings §2 (header-right on both unless a FAB is documented).
- **Caps:** M<=3, D>=5, no per-row motion. Frequency (design-read.md input 2): a root Collection is tens/day; a pushed one is tens/day on the user's daily main path, otherwise occasional (the default).
- **Anatomy (row):** fixed-size leading visual (avatar or 1:1 thumb) -> title (body step, or the ramp's weight step for emphasis, bindings §2) -> at most one meta line (smallest step, muted; never a key value, C14) -> trailing value or count (tabular figures) -> at most 1 badge. D5-8: title + at most one meta line. D9-10: strictly single-line, the meta moves to trailing inline values. Chevron only where the bible's platform mode puts it.
- **Group headers:** a header that only navigates (day, letter, category) may use the grouped-list header style when every row carries its own key value (the time, the amount). If the header itself is the key value, promote it into the rows or record a gap (bindings §6) (composition.md C14).
- **Anatomy (screen):**
  1. Peer views: a segmented control (iOS) or segmented buttons (Material) for at most 4 peer views; if no primitive exists, bindings §6.
  2. Filters beyond 4 options: a menu or a filter sheet. Sort: a menu.
  3. Rows. No section header when there is only one section. No "See all" without a destination.
- **Cards:** rows by default. The bible's one sanctioned entity card is allowed only at D<=6 and only when each item has identity media and a description; record the exemption in bindings §2. At D>=7 cards for list items are banned.
- **States:** loading shows skeleton rows filling one viewport (row anatomy, radius roles, muted surface). Empty: first-run vs no-results (echo the query + a recovery sentence; the header search bar's own clear is the clear action, a Clear filters button only for non-search filters) vs nothing now (cleared, caught up, or nothing scheduled), per states-and-copy.md. Error: inline above stale rows when rows exist, screen-level only when nothing loaded.
- **Likeliest tells:** T8 Ornament Without Meaning (avatar stacks, chevrons on rows that do not navigate), T12 Label Confetti (several chips per row), T16 Jane Doe Data (every list exactly 5 items, the same placeholder avatar for everyone), T18 The Dead-End Empty, T17 Duplicate Intent (header '+' plus an empty-state create at once); #7, #13, #14, #19.
- **Delegated:** list virtualization and row recycling to the architecture skill (bindings §10); row component contract to expo-design-system 'The component contract' and touch targets to its references/audit.md section 3; search bar wiring to bindings §3, header items and the route to the navigation skill (bindings §10).

## Detail

- **When:** one entity opened from a list, a link or a notification.
- **Container:** scroll screen.
- **Header:** standard back + a short title. Never repeat the title in the content (T4): either the header carries the name and the identity block leads with media or a key fact, or the header carries the object type and the identity block carries the name.
- **Focal:** the identity block.
- **Primary:** iOS: one button under the identity block, or a header item. Material: one button under the identity block, or a top app bar action. Neutral: bindings §2. Secondary actions go in a header menu (see the menu rule above), never as full-width buttons in the content (T17).
- **Caps:** V up to the screen default + 1 (max 6). Media header needs V>=5 + real imagery.
- **Anatomy:**
  1. Identity block: media 16:9 or 3:2 at V>=5 with real imagery, else avatar or crest + name at the identity-name step (bindings §2) + one meta line, either stacked and centered or with the avatar leading the name (C5). Meaningful images carry an accessibility label; decorative ones are hidden.
  2. The one primary action.
  3. Key facts: label-left / value-right rows in one group, present fields only (T6). The one important missing field becomes an action row.
  4. Related lists: 3-5 rows + "See all N" (plural-aware), as a mapped static group.
  5. Segmented sub-views only when there are 3 or more substantial subsections.
  6. Destructive action last, in its own group.
- **States:** render instantly from the list row's data; the identity block shows the same name, image and count the row showed (state carries forward). Missing sections load as section-level skeletons. Error: section-level if the identity is known, screen-level only when nothing can render. Not found: a screen-level Empty with a way back.
- **Likeliest tells:** T4 The Double Title, T6 The Spec Sheet, T17 Duplicate Intent (Invite, Share or Edit as full-width content buttons), T5 Belt and Braces (reusing a list card as the identity block); #7, #11.
- **Delegated:** prefill from list data to the architecture skill's data layer (bindings §10); push vs in-tab route to the navigation skill; destructive confirmation policy to #10.

## Task/Form

- **When:** the user enters or edits data and submits it.
- **Container:** the keyboard-aware scroll screen of the forms skill (bindings §10).
- **Header:** a title. Pushed screen: standard back. An edit flow that needs Cancel/Save in a header is presented as a modal, not a sheet (a formSheet renders no native header on Android).
- **Focal:** the first field.
- **Primary:** one submit at the end of the content, labeled with the outcome (verb + object). In a modal edit: iOS Save as a header text button with Cancel opposite; Material Save as a top app bar action with a close icon; neutral per bindings §2. Validation runs on submit, so the primary is never disabled-until-valid.
- **Caps:** V<=3, M<=2.
- **Anatomy:**
  1. Single column, labels above fields.
  2. Related fields grouped under section titles; field order follows the user's mental model (who -> what -> when -> how much).
  3. "(optional)" on optional fields instead of asterisks on required ones.
  4. Helper text only where it prevents an error.
  5. The submit.
- **States:** prefilled values load before the form shows (no field flicker). Pending: the submit shows its loading state and the form stays visible. Errors stay on the field; a submit-level error sits above the submit. Success is the UI change (navigate back, the row appears), never an alert (#10).
- **Likeliest tells:** T17 Duplicate Intent (a CTA naming the mechanism: Submit, Continue), T19 The Shrug Error (validation in a banner), T15 The Developer Voice (field names as labels), T3 Centered Everything; #20, #10.
- **Delegated:** inputs, keyboard, focus chain, autofill, validation timing and a button above the keyboard to the forms skill (bindings §10). Taste owns field order, grouping, labels, helper and error wording, and the submit label.

## Auth

- **When:** sign in, sign up, password reset, verification.
- **Container:** the forms skill's keyboard-aware scroll screen.
- **Header:** a title, or none. Large title only on iOS.
- **Focal:** one brand mark (centered allowed) + the form.
- **Primary:** the submit at the end of the form + one secondary text link (switch between sign in and sign up). Same placement in every platform mode.
- **Caps:** V<=4, M<=2.
- **Anatomy:**
  1. Brand mark: the one brand moment of the flow.
  2. Optional one-line subtitle that speaks to the user's task, never about the backend, the demo or how auth works (T15).
  3. Provider buttons, if any, following each provider's own guidelines.
  4. Fields with platform autofill.
  5. Submit, then the secondary link.
- **States:** pending on the submit only. Errors: credentials on the form ("Email or password is incorrect"), network inline above the submit. Success: the session flips and the navigation gate moves the user; no success message.
- **Likeliest tells:** T15 The Developer Voice (mock or backend explanations in subtitles), T14 The Marketing Voice, T19 The Shrug Error. A one-line "Welcome back" title is allowed on Auth: review the T1 grep hit, do not auto-fail it.
- **Delegated:** autofill, keyboard and validation to the forms skill; the auth gate and redirects to the navigation skill (bindings §10). The brand mark asset comes from bindings §2 or is listed as a gap in bindings §6.

## Sheet

- **When:** one secondary task scoped to the parent that returns to it: pick, quick create, filter, share. Never a primary flow.
- **Container:** a formSheet route (navigation skill, bindings §10). No native header renders inside it on Android, and nested stack navigators are not supported, so design the sheet without either on both platforms. No navigation inside the sheet: a step that needs drilling down is a pushed screen or a modal.
- **Header:** none native. The title row is content: a leading-aligned heading-step title at the top, optionally a trailing Done text button in the same row.
- **Focal:** its one control (the picker, the filter group, the short form).
- **Primary:** one, either at the end of the content or as the trailing Done in the title row, never both. Swipe-down is cancel, so no Cancel button and no corner X (#2). Same placement in every platform mode.
- **Detents:** short content (at most 5 options, a confirmation, a share target list) uses `sheetAllowedDetents: 'fitToContents'`, where the content cannot use `flex: 1`. Forms and longer content use numeric detents in ascending order. Android accepts at most 3 detents. `sheetGrabberVisible` is iOS-only, so never rely on the grabber as the only dismiss affordance. Corner radius is chrome config, exempt from C8.
- **Caps:** V<=4. C2 applies: the sheet counts as a screen.
- **Anatomy:**
  1. Title row (title, optional trailing Done).
  2. The control or the short form.
  3. The primary at the end, unless Done carries it.
- **States:** a picker loads its options with a skeleton sized to the expected detent, so the sheet does not jump. Empty: a no-results line with Clear filters when the sheet filters (non-search filters only; a search field's own clear needs no second button). Error: inline in the sheet; the sheet stays open. Success: the sheet dismisses and the parent shows the change.
- **Likeliest tells:** T4 The Double Title (a content title plus header options that render on one platform only), T17 Duplicate Intent (Done plus a bottom primary for the same thing, or a Close button), T3 Centered Everything; #1, #2.
- **Delegated:** presentation, detent and grabber options to the navigation skill; keyboard inside a form sheet to the forms skill (bindings §10); any custom detent motion to expo-animation (normally none: the platform animates the sheet).

## Settings

- **When:** preferences and account configuration the user scans and changes.
- **Container:** grouped list (fill + inner hairlines count as one separation device, C7).
- **Header:** large title (iOS) on a section root, standard title when pushed; top app bar title (Android).
- **Focal:** none. The screen is for scanning.
- **Primary:** none. Rows navigate or toggle. The destructive row sits in the last section.
- **Caps:** V<=2, M<=1, D5-7.
- **Anatomy:**
  1. Sections titled with a noun of at most 3 words.
  2. Row: title + trailing current value (muted), or a switch. A switch only for an immediate boolean; a choice pushes to a picker screen.
  3. Explanations in section footers, never a subtitle on every row.
  4. Leading icons on every row of a group or on none (C9).
  5. Destructive action last, danger color, confirmed natively (#10).
  6. Version and build only in the final footer. Privacy policy and terms as rows in the last section or About (required by store review when the app collects data), next to version and build.
- **States:** values render from local state with no spinner. A failed remote toggle reverts the switch and shows inline at its section.
- **Likeliest tells:** T12 Label Confetti (badges, version labels in rows), T8 Ornament Without Meaning (toggles that persist nothing, a colored icon bubble per row), T9 The Accent Flood; #7, #16.
- **Delegated:** the switch stays the platform control (expo-design-system 'When to extract - and when not to': do not wrap platform components). A missing trailing slot, footer or destructive row tone is a component gap (bindings §6), solved with expo-design-system 'Composition over configuration'.

## Profile

- **When:** the user's own account, or another person.
- **Container:** scroll screen.
- **Header:** large title (iOS) on a section root, standard title when pushed; top app bar title (Android).
- **Focal:** the identity block.
- **Primary:** own profile: Edit as a header item when an edit flow exists (text on iOS, icon action on Material, neutral per bindings §2), never a big content button; with no edit flow, "Primary: none". Never add an Edit with nothing behind it (T8). Another person's profile: one relationship action (follow, message, invite) under the identity block.
- **Caps:** V<=4.
- **Anatomy:**
  1. Identity block: avatar at the large avatar size + name at the identity-name step (bindings §2) + one meta line, stacked and centered or leading (C5). The avatar carries an accessibility label or is hidden when the name is beside it.
  2. Personal rows (the user's content) before account rows.
  3. Account rows.
  4. Sign out in its own final group, with native destructive confirmation (#10).
- **States:** identity renders from the session immediately; sections load below it. Missing avatar: initials fallback with the bible's tint rule.
- **Likeliest tells:** T6 The Spec Sheet, T9 The Accent Flood (an accent-filled avatar), T16 Jane Doe Data, T8 Ornament Without Meaning (stat counters nobody acts on); #7.
- **Delegated:** sign-out flow and session to the navigation skill (bindings §10); avatar extraction to expo-design-system 'When to extract'.

## Overview/stats

- **When:** the user reads a metric and its breakdown to decide something.
- **Container:** scroll screen.
- **Header:** large title (iOS) on a section root, standard title when pushed; top app bar title (Android). A period selector as a header item or a segmented control.
- **Focal:** one primary metric with context.
- **Primary:** none, or one header item (export, change period).
- **Caps:** D>=6. Tabular figures on every number. The display step needs V>=5 or a real hero number.
- **Anatomy:**
  1. Primary metric + a delta sentence ("12 more than last month"), unit and period stated.
  2. A chart only for a real series with unit and period (load the dataviz skill); drawing it needs a chart dependency (bindings §5 says whether one is installed, ask before adding).
  3. Breakdown as rows, each navigating to its source.
- **States:** loading keeps the last values and marks them stale; a first load uses blocks sized like the metric and rows. Empty: what will appear and when ("Totals appear after the first entry"). Partial data: show what exists and say what is missing.
- **Likeliest tells:** T2 The Stat Wall, T11 The Whisper (key values in the smallest muted step), T15 The Developer Voice (hand-built plurals, toFixed money), T16 Jane Doe Data (99.9%, 1,234).
- **Delegated:** chart form and color to the dataviz skill; number and plural formatting to the architecture skill's i18n rules (bindings §8, §10).

## Empty / first-run (state)

- **When:** a data-backed screen with nothing to show. It is a state of the parent, not a route.
- **Container:** the parent's container.
- **Header:** the parent's. While the empty action shows, hide the header create (T17).
- **Focal:** the action.
- **Primary:** one action inside the empty composition: create when the user can, otherwise Refresh (secondary style). Never none: pull to refresh is invisible.
- **Caps:** V and M +2 over the parent (max V7 M6), D<=3. Illustration instead of a symbol only at V>=5, never on frequent screens.
- **Anatomy (centered):**
  1. Platform symbol at the empty-state icon size, muted (optionally in an accent-container circle at V>=3).
  2. Title of at most 6 words saying what goes here.
  3. One sentence on how it gets populated.
  4. The action (verb + object, or Refresh when someone else adds the content).
  The three kinds (first-run, no-results, nothing now) differ as in Step 6 and states-and-copy.md: only first-run carries a create action.
- **States:** never shown while loading or before the first fetch resolves (#19).
- **Likeliest tells:** T18 The Dead-End Empty, T17 Duplicate Intent, T14 The Marketing Voice; #3, #19.
- **Delegated:** the empty slot of the four-state primitive (bindings §3, gap in bindings §6); the illustration dependency to bindings §5.

## Result/success

- **When:** the outcome of a rare, consequential flow (payment done, registration complete, first item created). Routine successes are a UI change, not a screen.
- **Container:** scroll or plain screen.
- **Header:** none, or a Done item.
- **Focal:** the outcome.
- **Primary:** a single Done or Continue, at the end of the content. Same in every platform mode.
- **Caps:** rare tier, so V and M may go +2 (max V7 M6). One exclamation mark is allowed only here.
- **Anatomy (centered):**
  1. Outcome symbol or rare-tier art.
  2. Outcome title (what is now true).
  3. One sentence with the next relevant fact (reference number, date, where to find it).
  4. Done.
- **States:** pending stays on the previous screen's submit; the result appears only after the write commits. Failure returns to the form with an inline error, never a "failed" result screen for a recoverable error.
- **Likeliest tells:** T20 The Applause Toast (a toast on top of the result screen), T14 The Marketing Voice, T8 Ornament Without Meaning (confetti on a routine action).
- **Delegated:** the celebration moment, its haptic and reduced motion to expo-animation (step 1 rare tier, step 8, step 9); haptics are feedback and need the module installed (bindings §5), M does not gate them.

## Onboarding / permission primer

- **When:** only when it collects required setup or primes a permission right before the feature that needs it (#15). Never to tour features.
- **Container:** plain screen, or the forms skill's keyboard-aware screen when a step has input.
- **Header:** none, or a back item between steps.
- **Focal:** one question per screen.
- **Primary:** one per step, at the end of the content or pinned above the bottom safe area on screens without input (#17). Skip as a secondary text button on steps that are not required. A primer pairs the action ("Turn on notifications") with "Not now", then hands off to the system prompt.
- **Caps:** V and M +2 (max V7 M6), D<=4. At most 3 steps; more needs a one-line cost and then "2 of 4" progress in the header. No progress indicator at 3 steps or fewer.
- **Anatomy:**
  1. Verb-phrase title of what the user does ("Pick your interests").
  2. One sentence on why it matters to the user.
  3. The one input or choice.
  4. The primary, then Skip.
  One brand moment per flow, not one per step.
- **Rules:**
  - Each step asks something different. N identical steps that change only an icon and a headline are #15.
  - No rating or review prompt in onboarding or on first run. A store review request comes only after a repeated success moment.
  - Never ask for a permission before the feature needs it.
- **States:** a step that saves shows pending on its primary; a failed save stays on the step with an inline error. A denied permission continues the flow and explains, at the feature, how to enable it later.
- **Likeliest tells:** T12 Label Confetti ("Step 1" eyebrows), T14 The Marketing Voice, T1 The Website Hero (a welcome slide), T3 Centered Everything on input steps; #15, #14.
- **Delegated:** step inputs to the forms skill; where the flow sits relative to the auth gate to the navigation skill (bindings §10); any step transition beyond the platform push to expo-animation step 1.
