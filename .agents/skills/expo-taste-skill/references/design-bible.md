# Design bible

The template for the one bible every app locks before its first screen. The filled instance for this app lives in bindings §2 (brand status in bindings §1, dial defaults in bindings §4, platform-mode exceptions in bindings §7). This file holds no values: only the fields, the rules each field must satisfy, and the procedures that keep screens consistent.

## Why

- The Design Read (Step 1) is per screen. The bible is per app. Screens vary composition, emphasis and tempo; they never vary identity.
- It is the native version of the "app design bible" from imagegen-frontend-mobile (lock palette logic, type rhythm, radius logic, icon style, imagery treatment, nav model, card and list behavior, button styling, shadow language before screen 2, so screen 3 never drifts into another app) and of stitch's DESIGN.md.
- The bible states WHICH role a value plays. expo-design-system ('Adopt Before You Build', 'The Theme') says WHERE the value lives and how it is named. The bible never proposes a parallel theme: a value it needs that the theme lacks becomes a token first.
- A screen that needs something the bible lacks is an overhaul (references/redesign.md), never a local exception.

## Fields (16)

Each field lists what to decide, the rules the decision must satisfy, and what to write. Write every field as short bullets with role -> token -> job. A field with no decision yet says `undecided` and blocks Step 1 for any screen that needs it.

### 1. Product, category and audience
- Decide: the product in one line; the top 3 jobs users open it for; the category, as a row of the category bias table in references/design-read.md (or a derived row in the same columns); the audience in context (who, where, one hand or two, glance or study, age range); the app-wide quiet constraints (accessibility-first, trust-first (regulated money or health), kids, older users, outdoor or glanceable, low-end Android); the shipped locales and the longest one.
- Rule: the audience picks the aesthetic, and quiet constraints override vibe words on every screen (dials.md precedence).
- Write: one bullet each. Example shape: "Members aged 16-70, one-handed, outdoors between sessions, glance use."

### 2. Platform mode
- Decide: exactly one of iOS HIG, Material 3, or deliberate neutral (definitions in references/platform-and-brand.md).
- Rules: in deliberate neutral, write every per-platform affordance: trailing chevrons, press feedback, create placement (header item or FAB), section-header case, destructive confirmation, segmented style, large title vs top app bar. An affordance that is not written down is #16 Cross-Platform Costume. Exceptions to the mode go in bindings §7 before first use.
- Write: the mode, then one line per affordance with its iOS and Android value.

### 3. Palette roles
- Decide, as light/dark pairs (C16; dark-mode mechanics are #18):

  | Role | Job | Never |
  | --- | --- | --- |
  | Canvas | screen background | a second canvas tint per section |
  | Surface | grouped sections, the sanctioned card | a third level (C7) |
  | Muted surface | pressed rows, skeleton blocks, image placeholders | text containers that look disabled |
  | Primary text, muted text | the only two text colors | accent or status as body text |
  | Accent + pressed step + on-accent | primary fill, selection, one highlight (C6) | icons by default, borders, headings |
  | Accent container | selected background, the badge background, the focal module | large fields below V7 |
  | Separator | hairlines inside grouped lists | outlines around shadowed surfaces (T5) |
  | Field boundary | input outlines; reaches 3:1 against its surface (C15) | a decorative border elsewhere |
  | Status (danger, success, optional warning) | status only, always with text or a symbol | brand decoration |
  | Press / ripple | Android ripple color | anything else |
  | Scrim | text over media (field 9) | dimming plain content |

- Brand status: `declared` or `none`. Declared values are fixed input: never rotate them, and T10 fires only on added stock hex values and mixed gray temperature. With `none`, build canvas, text and separators from platform semantic colors (expo-design-system 'The Theme' > Colors) plus ONE accent chosen for the category and audience.
- Accent discipline when no brand is declared: saturation below about 80% (HSL), no neon or fluorescent value, nothing from the stock families T10 lists. The on-accent label reaches 4.5:1 on the accent fill, and the accent reaches 3:1 against the canvas wherever it marks state.
- Accent hue lock (every app): one accent hue on every screen. The dark value is a lighter step of the same hue, never a new hue. A second hue appears only as status. A per-feature accent is a bible change, not a screen choice.
- Status vs accent: if the accent sits near a status hue (a red-orange accent next to danger red), write how they stay distinct (hue step plus text or symbol), or a destructive action reads like the primary one.
- Gray temperature: warm or cool, one family for every neutral. Mixing them fires T10 with or without a brand.
- Chrome tint (back button, header items, tab selection) uses the accent and does not count toward C6's 3 roles. A ghost or text button label counts as the highlight role.
- Write: one bullet per role with token, light/dark value names and job; the brand status line goes to bindings §1. A missing role (scrim, field boundary) is listed as `missing: add before first use`.

### 4. Type ramp
- Decide: the family (the declared brand family or the platform system font), its embedded weights, and the ramp steps, each with ONE job: identity-block name, block heading, body (every sentence), label (buttons, field labels, trailing values), smallest (1-line metadata). Screen titles live in the native header, not in the ramp.
- Display step: exists or not. Without it, a V5+ hero number or name needs the step added as a token first. At most one display element per screen (C3).
- Numeric style: tabular figures through `fontVariant: ['tabular-nums']`. Verify on both platforms that the family exposes them. If it does not, write the fallback (right-aligned numeric columns) and record it as a token decision; never add a second family for numbers.
- Rules: one family; emphasis through the ramp's weight steps or another weight of the same family, one axis at a time (C3); write how a screen applies a weight (a ramp variant, a weight prop) and record a missing one as a component gap; the ramp uses a middle weight, not only regular and bold; letter-spacing and uppercase only where the bible names them (for example a grouped-list header the primitive already styles). Font choice belongs to #6; scaling and truncation belong to expo-design-system Typography 'Dynamic Type'.
- Write: one line per step as "name: size/line-height weight: job", then the display line and the numeric line.

### 5. Spacing tempo
- Decide: the four tempo steps (inline < row-internal < group padding < section gap, C4) for each D band the app uses, mapped to named scale steps, plus the screen edge.

  | D band | inline | row-internal | group padding | section gap |
  | --- | --- | --- | --- | --- |
  | 1-3 | | | | |
  | 4-6 | | | | |
  | 7-8 | | | | |

- Rules: pixel ranges per band come from dials.md; every cell is a scale step name, never a number. A recurring in-between value is added to the scale (expo-design-system 'The Theme' > Spacing), never inlined. Equal gaps at two levels is #12.
- Write: the filled table and the screen-edge step.

### 6. Radius logic
- Decide: one radius step per role: inline (badges, chips, small thumbnails), control (buttons, inputs), group/media (grouped lists, the sanctioned card, media frames), capsule (avatars, pills).
- Rules: nested radius = outer radius - inset (C8); nothing between the named steps; non-capsule radii follow expo-design-system Radius (continuous curve), or the bible records the override. Chrome configuration (sheet corner radius in navigator options, native controls) is exempt and listed by name.
- Write: one line per role, then the exemptions.

### 7. Separation and elevation
- Decide the ONE separation device per container type (C7): grouped list = fill contrast plus its own inner hairlines (the primitive's treatment counts as one device); sanctioned card = fill plus the lightest shadow token, or fill plus hairline, never both (T5, #8, #9); blocks on the canvas = spacing only.
- Elevation: when the lightest shadow is allowed (a pressable card on the canvas, light theme), when the overlay shadow is allowed (only for something floating above content), and the dark rule (elevation is a surface step, not a shadow).
- Rules: shadows are tokens (mechanics: expo-design-system 'The Theme' > Shadows); neutral, low opacity, one light source from above; colored or tinted shadows and glows are T8. Absolute positioning and zIndex only for real layers (overlays, floating controls), never for stacked decoration.
- Write: one line per container type, then the shadow ladder with its allowed uses.

### 8. Icons
- Decide: sizes per context (inline, row leading, empty-state symbol), the weight per context, and the color rules.
- Rules: the family per platform belongs to #3. One weight per context; the filled variant only for selected state; leading icons on every row of a group or on none (C9); icons use text or muted text unless the icon is the control or is selected; literal symbols only, no metaphor icons (T8). Icons are decorative by default and the control carries the accessibility label.
- Write: the size per context with its token, the weight rule, the color rule.

### 9. Imagery
- Decide: one aspect ratio per context (avatar 1:1; cover 16:9 or 3:2; product 1:1 or 4:5; thumbnail), the placeholder treatment (muted surface plus a placeholder image or initials), the people fallback (initials with a deterministic tint from the name, never one generic person symbol for everyone, T16), and the scrim.
- Scrim: a solid scrim token by default, with text on it at 4.5:1 (C10), or the text moves below the media. A gradient scrim through React Native's `experimental_backgroundImage` linear-gradient (New Architecture, no dependency) is possible but experimental: verify both platforms first and record it here.
- Rules: real imagery only, never hotlinked placeholder services. Symbols beat illustration below V5; illustration only for Empty, Onboarding and rare-tier moments at V5+. When V allows media and no real asset exists, the answer lists the assets needed (ratio and context per image) and never fakes them. Meaningful images (photos, crests, avatars) carry an accessibility label; decorative ones are hidden from screen readers.
- Write: ratio per context, placeholder, fallback, scrim token and status (`present` or `missing`).

### 10. Nav model
- Decide: the navigator tree (auth gate, tabs, drawer, stacks), the tab set (3-5 nouns, never actions, C17), where drill-downs push, which tasks are sheets and which are modals, where the create action sits, and where chrome color is configured (one place per navigator).
- Large titles: section roots on iOS only. Android shows the top app bar title; a large title on Android is #16.
- Sheets (formSheet routes): on Android a formSheet renders no native header, title or header buttons and supports no nested navigator (Expo Router modals, 'Android limitations'), so every sheet is designed without them on both platforms. The sheet's title and actions are content (a title row at the top, one primary at the end or a trailing Done text button); swipe-down is cancel. Detents: `fitToContents` for short content, numeric detents for forms, at most 3 on Android. The grabber is iOS-only. An edit flow that needs Cancel/Save in a header is a modal presentation, not a formSheet.
- Menus: record whether a cross-platform overflow or header menu primitive exists. If none does, screens may not assume one; it is a gap (bindings §6).
- Write: the tree, the tab list, the sheet list with detents, the create placement, the chrome-color files, the menu status. Routing mechanics belong to the navigation skill (bindings §10).

### 11. Card vs row
- Decide: rows in grouped lists by default, and the ONE sanctioned card style: an object the user acts on as a unit, with identity media and a description.
- Rules: write the card's D ceiling and its exemption from C11's ">5 homogeneous items become rows" explicitly (for example "allowed as list items at D<=6, rows at D>=7"); without that line, a list of cards is a #7 candidate. Capped previews (at most 8) are mapped rows inside a grouped section; unbounded content is the screen's root virtualized list; a virtualized list is never nested inside a scroll container.
- Write: the default, the sanctioned card with its ceiling, the preview cap rule.

### 12. Buttons
- Decide: the variants as built (read the component's styles and describe the real fill, border and pressed state of each, never the intended one), the hierarchy, the sizes, the icon slot (exists or not), and the destructive pattern.
- Rules: one filled primary per screen, a sheet counts as a screen (C2); secondary for alternatives, ghost or text for tertiary actions and inline links; icon-only actions are header items with an accessibility label. Each size states whether it reaches the touch-target minimum in expo-design-system references/audit.md section 3 (per platform), and how (hitSlop or a min-height token); a size that does not is recorded as a component gap. Destructive: placement last in its own group; confirmation policy per #10, titled "<Verb> <object>?" with the button repeating the verb; record the hook or pattern that raises it.
- Write: one line per variant and size, then the destructive line.

### 13. Press feedback
- Decide per role: rows and cards (background highlight on iOS, foreground ripple on Android, or the mode's single treatment), buttons (pressed fill step), header icon buttons (borderless ripple on Android), and the rule "feedback only when the element has an action".
- Rules: never scale rows (#13); the bible's choice overrides expo-animation step 7 when the repo says so (bindings §5). Haptics are feedback, not motion: they follow expo-animation step 8, need the haptics module installed, and are not gated by the M dial. Record `installed` or `not installed`.
- Write: one line per role, then the haptics line.

### 14. Copy register
- Decide per language: person and pronoun (you; tú or usted; du or Sie), formality, whether the app may say "we", case (sentence case by default), the quote style (curly quotes and apostrophes; ONE quote style per language, for example English curly quotes reused for a language that also has its own marks, written down so no string guesses), the single ellipsis character for in-progress verbs, the exclamation policy, and the expansion factor of the longest locale.
- Rules: one register per language, never mixed across screens. Ranges are i18n strings ("{{from}} to {{to}}"), never a locale range formatter, which prints U+2013 and breaks T13. The per-language banned-phrase list extends the core list in references/states-and-copy.md; its regex lives in bindings §0. Mock data style (locale-plausible, varied names, imperfect numbers, varied dates, labeled as mock in code) is part of the register.
- Write: one block per language, then the banned-phrase pointer and the mock-data line (bindings §8).

### 15. Dials
- Decide: the app default triple with its preset (dials.md), the category preset it came from, and the per-screen overrides with their caps.
- Rules: overrides stay inside the archetype, frequency and quiet-constraint caps of dials.md; a broken cap names its cost in one line.
- Write: the default line, then a table `screen | V M D | preset | cap or reason`, in bindings §4.

### 16. Signature component
- Decide: the ONE signature component of the app (an identity block, a featured module, a schedule row), where it appears, and whether it is `built` or `target`.
- Rules: it is the one signature block a V3-4 screen may spend, at most one per screen (dials.md; a Collection needs none); "taste is subtraction" never removes it where a screen spends it. Describe what exists today honestly; if the target is not built, say so and name the screen that will build it. Extract it to the shared layer on its second use (expo-design-system 'When to extract').
- Write: one line for the target, one for today's state.

## Greenfield procedure

Step 0 classifies the job as GREENFIELD when bindings §2 is missing or empty.

1. Detect before proposing (expo-design-system 'Adopt Before You Build'): read the theme tokens, the embedded fonts, the navigator tree, the i18n files and any existing screens. Everything declared is input, not a proposal. If the bindings file itself is missing, or its §0 paths do not exist in this project (copied from another app), create it from references/repo-bindings.template.md first.
2. Draft all 16 fields in ONE message. Mark each value `declared`, `derived` (from the category row or existing code) or `assumed`.
3. Sign-off: ask for one explicit yes covering four fields: palette (brand status, accent, gray temperature), type (family and ramp), platform mode, and the dial default. Phrase it as a single question with the draft as the default ("Reply yes, or change any of these four"). The other twelve fields ship as stated and may be amended in the same reply.
4. Write: field 3 brand status to bindings §1; fields 1-14 and 16 to bindings §2; field 15 to bindings §4; mode exceptions to bindings §7; the banned-phrase regex and grep variables to bindings §0; copy and i18n locations to bindings §8. Missing tokens (display step, scrim, field boundary, icon sizes) are created per expo-design-system 'The Theme' in the places the architecture skill names (bindings §10).
5. Only then run Step 1 for the first screen.

No screen code before the yes. Only if the user explicitly waives sign-off ("just build it"), build on the draft, state the four assumed fields in the Design Read, and list them as unconfirmed in the output contract.

## Consistency rules

| Locked per app (identity) | Free per screen |
| --- | --- |
| platform mode and its affordances, palette roles and accent hue, gray temperature, type family, ramp jobs and weights, radius per role, separation device and shadow ladder, icon sizes, weight and color rules, image frames and scrim, card-vs-row rule, button variants and placement rules, press feedback, copy register, signature component | composition (archetype anatomy, block order), emphasis (what is focal, which value is highlighted), tempo (which D band row applies, within caps), the dial triple (within caps), which content gets imagery (within field 9) |

- Tempo varies by choosing another row of the field 5 table, never by inventing values.
- Before done, compare the screen with its two nearest siblings (same navigator, or adjacent on the flow path) on six points: radius per role, icon size and weight, button variant and placement, spacing tempo row, separation and elevation, accent hue and roles. Every difference is either archetype-driven (allowed) or drift (T7, fix it). Chrome configuration is exempt.
- Two screens of different archetypes with the same block stack are a C18 review prompt.
- An identity change is an overhaul: show the bible diff, get sign-off, then migrate every affected screen (references/redesign.md). Never ship one screen on a changed identity.

## Flow path rule

Applies whenever a request builds or reviews two or more screens, or one screen that is entered from another.

1. Write the path before the first Design Read, one line: `Flow: <screen> -(<action>, <push|sheet|modal|tab>)-> <screen> -> ...`. Each edge uses C17's navigation shape. A screen with no inbound action is cut or rehomed; a screen with no outbound action is a Result or an end state on purpose. When the only natural entry is a screen recorded as known debt (bindings §9), adding a minimal entry point there (one row or one link) is allowed and is not a redesign of that screen: touch nothing else on it, and report the touch in the answer (output contract line 3).
2. State carries forward. The object tapped on one screen appears on the next with the same name, the same image or initials in the same frame family, the same counts and statuses, the same formatting. The detail's identity block matches the row that opened it, and never shows less about the object than that row did. A sheet names the object it acts on. After a write, the screen the user returns to shows the result (the UI change is the confirmation). Mock data is one shared set across the flow, never regenerated per screen.
3. No cramped/empty swings. The density limit between adjacent screens is composition.md C18's (Empty, Result and Onboarding exempt); a jump past it (a D7 list into a D2 detail with two lines) is allowed only into those three. Content density follows the object, not the screen count: a thin detail is filled with real facts or merged into a sheet, never padded with decoration.
4. Vary along the path, never repeat a template: consecutive steps of the same kind (onboarding, a multi-step form) change composition, not only an icon and a headline (anatomy in references/archetypes.md).
