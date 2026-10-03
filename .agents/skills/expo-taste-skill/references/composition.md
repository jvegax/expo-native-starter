# Composition (Step 5 detail)

C1-C18 are countable. Each entry gives the rule, why it exists, how to measure it, and the fix. Every repo noun (token, primitive, path, grep variable) resolves in `repo-bindings.md`; export its bindings §0 variables before running a grep here. Greps find candidates, not verdicts: check every hit. A rule owned by a sibling is cited, never restated.

Scope: the content region between the chrome. The navigation bar, tab bar, sheet chrome, alerts and system controls are configured (navigation skill, bindings §10), never composed here.

## C1-C18

### C1 One focal point
- **Rule.** One focal point, named in the read and visible without scrolling.
- **Why.** A phone shows one idea per viewport. Two equal candidates make the eye pick, and the undecided template (a Hub, Detail, Profile or Result with no focal block) makes it pick nothing. Settings is the only archetype with no focal (it is scanned). A Collection's focal is its first row and its grouping: it needs no block above the first row.
- **Measure.** Screenshot the first viewport on the smallest supported phone (a 6.1in class device when unknown) at the default text size, then at the largest accessibility size. Name the focal in one noun phrase. Fail if it is below the fold, if two blocks compete at the same size and color, or if a welcome block holds the spot (T1).
- **Fix.** Demote the competitor one axis (C3). Move app explanations into the first-run empty state. On a Hub, the focal is what needs the user now: the next item, the pending action or the latest change.

### C2 One filled primary
- **Rule.** One filled primary button per screen (a sheet counts as a screen). Everything else is a secondary or ghost button, a row, a header item or a menu item.
- **Why.** The filled button is the strongest mark on the screen. Two of them split the decision and erase the hierarchy that C1 built.
- **Measure.** Count filled-variant buttons per rendered state (each loading/empty/error/content branch counts on its own). Count controls per intent: a header create plus an empty-state create is two (T17).
- **Fix.** Keep the one that completes the screen's task. Demote alternatives to secondary, tertiary actions to ghost or rows, screen-level actions to the header (C17). Hide the header create while the empty state shows its own.

### C3 Type steps and emphasis
- **Rule.** Content region: at most 3 text steps (the nav title is excluded) and at most 2 per row. At most 1 display element per screen (V>=5). Emphasis uses the ramp's weight steps or another weight of the same family, changing one axis at a time (size OR weight OR color). How weight is applied in this app (a variant, a prop) is in bindings §2; a missing weight is a component gap (bindings §6), never an inline style.
- **Why.** Each extra size is a new level the reader must rank. Three steps carry focal, body and metadata; more reads as noise, and a second family "for character" breaks identity (#6, T11).
- **Measure.** List the distinct ramp steps used by reading content in the screen and its child components. Control text set by a component (button label, field label, tab label) is excluded, like the nav title. Per row: the title step plus one other; a trailing value takes the title's step or the meta line's step, never a third. Inline font sizes and families are audit.md section 1 hits.
- **Fix.** Merge adjacent roles on the ladder below by weight. A display step needs a display token first (bindings §2, via expo-design-system 'Adopt Before You Build').

### C4 Spacing tempo
- **Rule.** Spacing tempo has 4 distinct scale steps: inline < row-internal < group < section, with values from the D band (#12 owns the defect).
- **Why.** Proximity is the only grouping signal that costs nothing. When the section gap equals the row gap, the reader cannot tell where a group ends.
- **Measure.** List every gap, padding and margin in the screen's styles. Map each to one of the four roles and check the order is strictly increasing with the D band values in bindings §2. Values off the scale are audit.md section 1 hits (spacing whitelist in bindings §0). Exception: at D 7-8, inline and row-internal may share the smallest step.
- **Fix.** Re-map to the band's table. Never add an in-between value; a recurring one becomes a scale step through expo-design-system 'The Theme' / 'Spacing'.

### C5 Leading alignment
- **Rule.** Leading alignment. Centering only in Empty, Result, Onboarding, the auth brand mark and single-action confirmations.
- **Why.** Reading content scans down one leading edge. A centered column is the web hero reflex (T3): ragged on both sides, slower to read, and it fights the leading-aligned native header.
- **Measure.** T3 grep (tells.md), ignoring files of the exempt archetypes. Screenshot: every text block, row and button in a non-exempt screen shares the screen-edge axis. Numbers in rows and columns align to the trailing edge.
- **Fix.** Remove center alignment, put the content on the screen edge padding, right-align numeric columns. Centering is decided by archetype, never by V.

### C6 Accent budget
- **Rule.** One accent, in at most 3 roles per screen: the primary action, selection/active state, and one highlight (a key value or one inline link). Count roles in the content region only: chrome tint (back button, header items, tab selection) is exempt. A ghost button label counts as the highlight role. Never body text, every icon, borders or headings. Status colors only for status, and never as the only signal.
- **Why.** The accent means "act here" or "this is selected". Spread over headings, icons and borders it stops meaning anything (T9), and the primary loses its pull.
- **Measure.** Screenshot and count accent regions by role, ignoring the chrome. Advisory grep: T9 (tells.md, `$ACCENT_RE` from bindings §0). Example: filled primary + selected segment + one inline link = 3, pass. Add accent row icons = 4, fail. Status: every status color is paired with a word or a symbol.
- **Fix.** Headings to the text color, row icons to text or muted, borders to the separator color. A second hue becomes a categorical color only for real categories with a stable legend. The accent hue never changes per screen (C18).

### C7 Surface levels and one separation device
- **Rule.** At most 2 surface levels (canvas -> group/card). Each container uses ONE separation device: fill contrast OR hairline OR the lightest tokened shadow. A grouped list (fill + inner hairlines + outline hairline) is ONE device. Absolute positioning and z-index only for real layers.
- **Why.** Every device says "this is separate". Two on one edge say it twice and read as nervous (T5); a third framing level turns a screen into nested boxes (#7). Overlap without a reason reads as decoration and breaks reading and focus order.
- **Measure.** For each container, list its edge cues: a fill that differs from its parent (counted only when nothing else marks the edge), a hairline stroke, a shadow. More than one fails; its own surface fill under a shadow or hairline does not count as a second cue, but hairline + shadow, a tinted fill under an edge, or a framed box inside a card does. Framing depth: count boxes from the canvas to the deepest element (max 2; media inside a card is exempt). T5 grep (tells.md). Layers: `grep -rEn "zIndex|position: *'absolute'" $SRC --include='*.ts' --include='*.tsx'`, each hit must be an overlay, a scrim on media, or an indicator pinned to its owner.
- **Fix.** Pick one device from the budget table below. Hierarchy then comes from type and spacing. Overlapping decorative cards, negative margins and stacked offsets are cut (T8; overlaps need V>=8). Shadows are black low-opacity tokens from one light source, never colored glows.

### C8 Radius by role
- **Rule.** Radius by role from the scale. Nested radius = outer radius - inset. Chrome config (sheet corner radius) is exempt.
- **Why.** Corners are identity. Mixed radii on one screen (radius soup), or an inner corner equal to the outer one, make the screen look assembled from different apps (T7).
- **Measure.** List every radius on the screen, map each to a role (inline, control, group/media, capsule) from bindings §2. For each nested pair, check inner = outer - inset (snap to the nearest step, or 0). T7 grep and audit.md radius grep. Corner smoothing follows expo-design-system 'Radius', or the override in bindings §5.
- **Fix.** Replace by role. A child inside a padded group uses 0 or the smallest step. Nothing above the group radius except the capsule.

### C9 Icons
- **Rule.** One icon family per platform (#3 owns the family rule), one weight per context, literal symbols. In a group, leading icons on all rows or on none. Icons use the text or muted color unless the icon is the control.
- **Why.** Icons are read as a set. Mixed weights, a lone iconed row in a plain group, or a rainbow of tinted bubbles break the set and spend the accent (C6). Metaphor icons (rocket, sparkles, trophy, crown) need decoding; literal symbols do not (T8).
- **Measure.** Per group: icons on all rows or none. Per context (row, header, inline, empty state): one size token and one weight. Color: grep icon color props for the accent outside selected states and icon-only controls. Advisory: T8 metaphor grep (tells.md). Filled variants appear only for selected state.
- **Fix.** Match the symbol to the object, size from the icon tokens (bindings §2), weight matched to the adjacent text, color text or muted. Drop the icons from a group rather than inventing one per row.

### C10 Media frames
- **Rule.** Media in a fixed aspect ratio per context (1:1, 4:3, 3:2, 4:5, 16:9), with a placeholder and one ratio per list. Text over media sits on a scrim at 4.5:1 or goes below the media.
- **Why.** A frame whose size depends on the loaded file shifts the layout on load and makes a list look broken. Text over an unknown photo has unknown contrast.
- **Measure.** Every image has an aspect ratio or a size token, a placeholder, and in virtualized lists a recycling key. Slow first load on device: nothing moves when images arrive. Contrast of text on media is measured on the scrim over the lightest region of a real photo, both themes.
- **Fix.** See "Media frames and scrims" below. Missing real imagery is reported, never faked.

### C11 Groups and lists
- **Rule.** A static grouped section holds at most 8 rows. Dynamic content or more than 8 rows goes in the virtualized list. More than 5 homogeneous items become rows, not stacked cards. No per-row top and bottom borders.
- **Why.** Beyond 8 rows a static group stops being scannable and renders everything at once. Stacked cards for homogeneous items waste a third of each viewport on frames (#7).
- **Measure.** Count rows per static group. Unbounded data: the virtualized list is the screen's root scroll container, and is never nested inside another scroll container (open each screen that renders a scroll container and check). Capped previews (at most 8, plus a "See all N" row with a real destination) are mapped rows inside the grouped-list primitive. Count homogeneous cards. Check row separators come from the group, not each row.
- **Fix.** Split a long static group into sections named by nouns, or move it to the virtualized list. Cards become rows. Exception: the bible's one sanctioned entity card (an entity with identity media and a description) may stand for items at D<=6, only when bindings §2 records it; otherwise it is a #7 candidate.

### C12 Badges and eyebrows
- **Rule.** At most 1 badge per row and 3 per viewport, only for state the user acts on or filters by. At most 1 custom eyebrow per screen; the grouped-list header is exempt.
- **Why.** Small labels compete with each other. Once everything carries a pill or an uppercase tag, none of them is read (T12).
- **Measure.** Screenshot count of badges per row and per viewport; each answers "would the user act on or filter by this?". Count uppercase or tracked labels outside the grouped-list header (T12 grep). Each badge is paired with a word or symbol, never color alone.
- **Fix.** Delete decorative badges and eyebrows. Real step progress reads "2 of 4" in the header. A version label lives only in the About or Settings footer.

### C13 Numbers
- **Rule.** Numbers are real or labeled mock, use the locale formatter and i18n plurals, and use tabular figures when they align or update (every number at D>=7).
- **Why.** Invented precision (99.9%, 4.8 stars on everything) reads as fake, hand-built plurals break in the first non-English locale, and proportional digits make columns and live counters jitter.
- **Measure.** T15 and T16 greps (tells.md). Every count goes through a plural key, every date and number through the formatter in bindings §3, money through Intl currency. Aligned or updating numbers carry the tabular style (bindings §2 names it and its fallback).
- **Fix.** Use the formatter and plural keys. Ranges are i18n strings ("{{from}} to {{to}}"), never Intl formatRange: it prints U+2013 and fails T13 at runtime. Right-align numeric columns.

### C14 Text size roles
- **Rule.** Sentences use the body step or larger. The smallest step is for 1-line metadata only. Key values are never smallest + muted. Nothing primary truncates at the largest accessibility size (mechanics: expo-design-system Typography 'Dynamic Type').
- **Group headers vs key values.** A group header that only navigates (a day, a letter, a category) may use the grouped-list header style, muted and small, when every row carries its own key value (the time, the amount, the status). The whisper rule (T11) applies to values the user acts on, not to navigation. If the header itself is the key value (the date is what the user reads to decide) and the grouped-list primitive only offers a muted header, promote the value into the rows, or record the header emphasis as a gap (bindings §6).
- **Why.** The smallest step is for what the user can skip. A date, fee or status the user needs, set small and muted, is demoted twice and disappears outdoors and for older eyes (T11).
- **Measure.** Find every sentence and every key value and check its step and color. For each group header, ask whether it only navigates (rows carry the key value) or is the key value. Advisory: T11 grep, with the question "is this hit a key value or a sentence?". Screenshot at the largest accessibility size. `grep -rn 'allowFontScaling={false}' $SRC --include='*.tsx'` must return nothing.
- **Fix.** Key values to body or label size in the text color. Let rows grow and reflow per 'Dynamic Type'. If text feels small, the screen is not finished.

### C15 Contrast and accessible structure
- **Rule.** Text and button labels at least 4.5:1; large text, meaningful icons and meaningful borders at least 3:1; in both themes.
- **Why.** Contrast is the first thing lost outdoors, at low brightness and with age. A boundary that is the only cue identifying a control is part of that control.
- **Measure.** Measure token pairs, not screenshots of one state: text on canvas, surface and muted surface; labels on the primary; muted text on every surface; icon on its background. A border is meaningful when it is the only cue that identifies a control or its state (text field outline, unselected checkbox, an outlined selected chip). Decorative hairlines and surface edges are exempt, and then cannot be the only cue. Companion checks: meaningful images (photo, crest, avatar) carry an accessibility label and decorative ones are hidden; section titles have `accessibilityRole="header"`; a row is one accessible element with its selected or disabled state announced; reading order follows the visual order (component contract in expo-design-system 'Reusable Components').
- **Fix.** Darken the token pair, never one screen's color. If a declared token fails (a field border, a muted text), record it as a token gap (bindings §6) or known debt (bindings §9) and report it instead of passing silently.

### C16 Dark mode in the same pass
- **Rule.** Dark mode is designed in the same pass, not inverted (color mechanics: #18).
- **Why.** An inverted light design keeps shadows that vanish on dark canvases, accents too dark to read, and white-background images glaring on black.
- **Measure.** Screenshot every state in both themes. Check: elevation reads by surface step, not shadow; the accent's dark value passes C15; images with white backgrounds sit in a frame on the muted surface; the scrim and status colors have dark pairs; every color comes from a token (audit.md section 1 hex grep).
- **Fix.** Add the missing dark value as a light/dark token pair (expo-design-system 'Adopt Before You Build'), never a screen-level override.

### C17 Navigation shape
- **Rule.** Peers switched often -> tabs (3-5 nouns, never actions); drill-down -> push; a secondary task that returns -> sheet; 2-4 views of the same data -> segmented control (not in RN core; if the app has none, bindings §6); screen-level actions -> header item or menu, never a full-width in-content button.
- **Why.** The shape tells the user where they are and how to get back. A tab that is an action, a sheet with pages inside, or an Add button in the content all break the back gesture's promise.
- **Measure.** Count tab triggers (3-5, nouns; bindings §0 `$TABS_LAYOUT`). For each new route, name its row in the table below. Count full-width buttons whose action is screen-level (T17).
- **Fix.** Pick the shape from "Navigation shape" below. Wiring (route files, presentation, detents) belongs to the navigation skill (bindings §10).

### C18 Composition varies, identity stays
- **Rule.** Across screens, composition varies by archetype and identity stays fixed. Compare with the two nearest sibling screens before done.
- **Why.** Users learn an app's identity once and read every screen through it. Drift makes a screen feel foreign (T7); identical block stacks on different archetypes make the app feel templated.
- **Measure.** Open the two siblings one tap away. Identity must match: type family and ramp roles, accent hue and roles, radius logic, elevation language, icon family and weight, button style, press feedback, spacing tempo for the band. Composition should differ by archetype: same block stack on a Hub and a Detail is a prompt. Flow check, when building more than one screen: write the path (design-bible.md 'Flow path rule' format, for example `Flow: list -(tap row, push)-> detail -(Invite, sheet)-> sheet`), check that state carries forward (the same name string, image, count and status on the list row and on the detail identity block, and back), and that adjacent screens differ by at most 2 D steps (Empty, Result and Onboarding exempt), so the flow does not swing from cramped to empty.
- **Fix.** Revert identity to the bible (bindings §2). An identity change is an overhaul (redesign.md). Change composition through a different structural move, not new tokens.

## Hierarchy ladder

| Rung | Role | Step | Notes |
| --- | --- | --- | --- |
| 0 | Screen title | native header | Excluded from C3. Never repeated in content (T4, #11). Large titles are iOS-only; Android shows the top app bar title (#16). |
| 1 | Focal | the identity-name step for an identity block, the block-heading step for a module, or display at V>=5 (steps resolve in bindings §2) | One per screen. Display needs a display token. |
| 2 | Block heading, row title | subtitle, or body at a heavier ramp weight step | Nouns, sentence case. |
| 3 | Body | body | Every sentence. |
| 4 | Label, key value | label or body | Text color, never muted + smallest. |
| 5 | Metadata | smallest step, muted | One line. Skippable by definition. |

Rungs are roles, not steps: merge adjacent rungs by weight to stay within 3 steps. Demote one axis at a time: a secondary heading drops weight OR size OR color, never all three. Promote the same way: a key value goes up in weight before it goes up in size or picks up the accent.

## Separation-device budget

| Situation | Device | Not |
| --- | --- | --- |
| A surface on the canvas (section, static block) | fill contrast | fill + border, fill + shadow |
| Rows in a group | the grouped-list primitive's device (fill + inner hairlines + outline hairline = one) | a shadow or extra border around it, per-row borders |
| An overlay floating above content | the medium tokened shadow | a border as well |
| A pressable entity card or media card on the canvas | the lightest tokened shadow on the surface fill (light theme) | a border, a heavier shadow, a tinted fill |
| A focal module at V>=5 | the accent-container fill | any edge |
| Anything inside a card | spacing only (media exempt) | a second framed box |

Dark mode: elevation is the next surface step, not a shadow. A light-theme shadow card becomes a lighter surface on the dark canvas with no edge.

## Navigation shape

| Situation | Shape | Example | Not |
| --- | --- | --- | --- |
| 3-5 peer destinations switched often | tabs: nouns, platform tab bar, 5 at most (the Android limit) | Inbox, Calendar, Profile | an action tab ("Create"), a 6th tab, a custom tab bar (#5) |
| Rare top-level destinations beyond the tabs | a drawer item, or a row in Profile or Settings | Settings, Help | a 6th tab, a Hub tile grid duplicating tabs (T17) |
| Drill into one item | push on the current stack | row -> detail | a sheet for an item with sub-pages |
| Secondary task that returns to the parent | sheet route | pick, filter, quick create, share | a centered custom dialog (#1), a full push |
| Edit flow needing Cancel/Save in a header, or multi-step create | full modal presentation | edit profile | a sheet (it renders no native header) |
| 2-4 views of the same data | segmented control (native; if none is installed, bindings §5-6) | Upcoming / Past | tabs, a second tab bar |
| More than 4 filters | header search + a filter sheet | | rows of chips |
| Screen-level actions (add, edit, share, filter, invite) | one header item; 2+ go in a header menu | | a full-width in-content button (T17) |
| Item-level actions | the row itself, swipe or context menu per platform mode, or an action row at the end of its group | | a button inside every row |
| Consequential irreversible confirmation | native alert (#10 owns the policy) | | a custom dialog |

Sheet facts (SDK 57): On Android a formSheet renders no native header, title or header buttons and supports no nested navigator (Expo Router modals, 'Android limitations'), so every sheet is designed without them on both platforms: title and actions are content. A title at the top, one primary at the end or a trailing Done text button. Swipe-down is cancel (#2). Use `sheetAllowedDetents: 'fitToContents'` for short content and numeric detents for forms; Android accepts at most 3 detents; `sheetGrabberVisible` is iOS-only. Menus: `Link.Menu` is iOS-only (expo-animation step 3); the cross-platform menu decision is in bindings §6.

## Media frames and scrims

| Context | Ratio |
| --- | --- |
| Avatar, crest, logo, row thumbnail | 1:1 |
| Product tile | 1:1 or 4:5 |
| Person or portrait feature | 4:5 |
| Photo in content | 4:3 |
| Media header on Detail or Hub (V>=5, real imagery only) | 16:9 or 3:2 |
| Editorial story card | 3:2 |

- One ratio per list. Frames never size from the loaded file.
- Placeholder: the muted surface fill, plus a blurhash or thumbhash when the API provides one (expo-image `placeholder`). Missing image: initials or the entity's symbol on the muted surface, never a shared generic person glyph for everyone (T16).
- Lists: expo-image `recyclingKey` set to the item id, so recycled cells never flash the previous image.
- Faces and subjects: `contentFit="cover"` with `contentPosition` set so heads are not cropped (top for portraits).
- Scrim: the solid scrim color token (bindings §2; add it before first use) over the text area, text measured at 4.5:1 on the scrim over the lightest region. A gradient scrim via `experimental_backgroundImage` linear-gradient (RN 0.86, New Architecture, no dependency) only after checking it on both platforms in both themes, because the API is experimental. Never add a gradient library for a scrim without asking. At V<=6, text below the media is the default.
- Imagery is content. No stock decoration, no blur or glass panels on flat backgrounds (T8). When V allows a media header or illustration and no real asset exists, report "Assets needed" with ratio and context and ship the frame with its placeholder.

## Structural moves

Name exactly one per screen (output contract line 3):

| Move | Typical archetypes | Block stack |
| --- | --- | --- |
| Grouped list | Settings, a capped Collection (8 rows or fewer) | sections of rows |
| Virtualized list | Collection (dynamic or more than 8 items) | the virtualized list as the screen root, optional date or status sections with grouped-list headers, single-line or two-line rows, pull to refresh |
| Media header + content | Detail or Hub at V>=5 | framed media, title block, grouped facts |
| Identity block + grouped rows | Profile, Detail | identity, one action, grouped rows |
| Primary module + secondary modules | Hub | 1 urgent module, up to 4 secondary |
| Single-column form | Task/Form, Auth | grouped fields, one submit at the end |
| Hero metric + breakdown | Overview | one metric + delta sentence, rows to sources |
| Segmented content | Detail with 3+ substantial subsections, Collection with 2-4 peer views | segmented control, one view |

Never stack 3+ different block types above the fold (for example greeting + stat tiles + carousel + list). Measure: list the block types in the first viewport. Fix: keep the move's blocks, move the rest below the fold or delete them.
