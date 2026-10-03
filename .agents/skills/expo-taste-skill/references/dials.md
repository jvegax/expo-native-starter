# Dials: DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY

Step 3 detail. Three dials, 1-10, set once per screen and written on the dials line (SKILL.md Step 3) as `V<n> M<n> D<n>`. They gate what the screen may contain. They never restyle chrome, and they never state a duration, spring or easing (expo-animation owns every motion number).

## Names: kept from taste-skill, redefined for native

| Dial | Short | 1 | 10 | What it measures on native | Web meaning dropped |
| --- | --- | --- | --- | --- | --- |
| DESIGN_VARIANCE | V | stock platform template | signature brand | Distance from stock components INSIDE THE CONTENT REGION. Chrome never changes at any value. | Symmetry vs asymmetry, offsets, masonry. A single-column phone has no asymmetry to vary, so variance becomes how far brand character goes beyond the system idiom. |
| MOTION_INTENSITY | M | static | cinematic | A CEILING handed to expo-animation, never a quota. Its step 1 frequency gate always runs and can cut anything at any M. | Scroll reveals, hover physics, load-in cascades, "the page must move". |
| VISUAL_DENSITY | D | airy | cockpit | Information per viewport, with pt values per band. | `py-*` section padding, `font-mono` for numbers. |

**Short forms are a deliberate alias.** taste-skill 1.C bans dial aliases (`LAYOUT_VARIANCE`, `ANIM_LEVEL`). This skill keeps the three full names and maps them one-to-one to V, M and D, only so the Design Read fits on one line. Never invent other names (EXPRESSION, LAYOUT_VARIANCE, DENSITY_LEVEL, ANIM_LEVEL).

## Native baseline: V3 M2 D5 (preset `native`)

- taste-skill's 8/6/4 is a landing-page baseline. App screens start on the platform template, native transitions already supply motion, and app screens are denser than marketing pages.
- The baseline is the last fallback. This app's default, and its per-screen defaults, are in bindings §4.
- REVIEW, POLISH, PRESERVE: read the existing screen's triple first. That reading is the start value, not the baseline (redesign.md).

## V bands (content region only)

| V | Band | Allowed on top of the band below |
| --- | --- | --- |
| 1-2 | Platform | Header + grouped or virtualized list, single column, leading-aligned. No signature block. Media only inside rows (avatar or thumbnail). Accent only on interactive elements. Symbols only. |
| 3-4 | Branded native | Declared typeface + accent. At most 1 signature block per screen: an identity block, a featured item, or one horizontal rail used as the focal block. A Hub, Detail, Profile or Result screen spends it as its focal block (without one it is the undecided template, SKILL.md failure mode (2)); a Collection needs none, because its focal is its first row and its grouping and nothing sits between the header and the first row (archetypes.md). Entity cards for objects the user acts on as a unit (a team, an event, a product, a place). The empty-state symbol may sit in an accent-container circle. |
| 5-6 | Expressive | One display-size element per screen (hero metric, score, name; needs a display step in the type ramp). A media header on Detail or Hub (16:9 or 3:2, real imagery only). One focal module on the accent-container surface. Illustration in Empty and Onboarding. At most 2 rails. |
| 7-8 | Editorial | Full-bleed media with a scrim (text still 4.5:1 measured on the scrim). Asymmetric Hub (one large module + a compact list). A brand color field behind the identity block. Only on Hub, Detail, Onboarding, Empty and Result, and only on occasional or rare screens. |
| 9-10 | Signature | One-off rare-tier moments (welcome, celebration, year-in-review, share card), only on explicit ask. Never a task screen. |

### V gates

- Rails: V>=3; at most 1 at V3-4 and 2 at V5-6. A rail counts as the signature block only when it is the focal block; a rail in a secondary module does not. A rail scrolls only under the user's finger: no auto-advance, no page dots on a tab root. In a rail or tile row, shared elements (title, value, action) align across items and actions sit on one baseline.
- Display step: V>=5, or a real hero number on Overview. If the type ramp has no display step, add it first (expo-design-system 'Adopt Before You Build', file in bindings §2).
- Media header: V>=5 + real imagery + Detail or Hub archetype.
- Illustration instead of a symbol: V>=5. Rendering it may need a dependency (status in bindings §5): ask first.
- Brand color field: V>=7. Overlapping elements or custom shapes: V>=8.
- More than 1 signature block per screen fails at every V (a secondary-module rail is not a signature block).
- Scrim: the solid scrim token by default (bindings §2; add it first if missing). A gradient scrim through `experimental_backgroundImage` (RN 0.86, New Architecture, no dependency) is experimental: verify it on both platforms before use.
- Missing assets: when V allows a media header or an illustration and no real asset exists, list what is needed (ratio + context) under "Assets needed" in the output. Never fake it with stock art, a gradient or a placeholder shipped as final. Fall back to the band below.
- Centering is decided by archetype (C5), never by V.
- Chrome (headers, tab bar, sheets, alerts, switches, pickers, transitions) is unchanged at every V.

## M bands (a ceiling for expo-animation)

Every item below still passes expo-animation steps 1-2. Being inside the band only means the gate is allowed to say yes.

| M | Band | Allowed on top of the band below |
| --- | --- | --- |
| 1-2 | Platform only | Native stack transitions, sheet presentation, RefreshControl, the press feedback pattern in bindings §2, native large-title collapse (iOS only; Android keeps its top app bar, #16). Zero custom animation code. |
| 3-4 | Responsive | Layout animation on insert/remove of non-virtualized content. State transitions on selection, toggles and expanders at whatever expo-animation's tier allows (a settings toggle is 100+/day: nothing). Live-state loops at M>=4. |
| 5-6 | Expressive | ONE spatial moment per flow, or ONE signature gesture per app (swipe actions, drag to reorder). One rare-tier delight (first item created, onboarding finished). A rare-tier illustration (Lottie or similar) only after a dependency decision (bindings §5). |
| 7-10 | Cinematic | Rare-tier screens only (celebration, recap, onboarding moment). Never a screen opened 10+ times a day. |

### M gates

- **Ceiling, never quota.** M allows; the frequency gate decides. Anything above M is cut, and the gate can cut anything below it.
- **Motion claimed = motion shown.** A read that says lively, animated or playful (M>=5) ships at least one motivated occasional- or rare-tier moment, or lowers M to 4 or less on the dials line.
- **One sentence per moving element:** `<element> animates because <purpose word, expo-animation step 2> at <tier, step 1>.` No sentence, no motion.
- **Reduced motion ships with every animation** (expo-animation hard rule 4).
- **Perpetual loops:** only for live state (recording, live score, syncing) and only at M>=4.
- **Entrance animations on routine screens:** banned at every M (#14).
- **Press feedback:** bindings §2 at every M (where the repo may override expo-animation step 7). Never scale full-width rows (#13).
- **Haptics are not gated by M.** They are feedback, not motion: they follow expo-animation step 8 and need the haptics module installed (status in bindings §5; adding it means a new dev build). A Settings screen at M1 may still fire a step 8 haptic.

## D bands (pt values)

Values snap to the spacing scale (4/8/16/24/32/48 on a 4pt scale). bindings §2 maps each band to tokens. Equal spacing at every level is #12; this table only sets the tempo.

| D | Band | Screen edge | Section gap | Group padding | Rows and content |
| --- | --- | --- | --- | --- | --- |
| 1-3 | Airy | 16-24 | 32-48 | 16-24 | Rows >=60. At most 3 sections and 5 rows per group. One idea per viewport. At most 3 short text lines above the first action. The type ramp's smallest step banned except legal. At most one number on screen. Uses: wellness, onboarding, first run, calm. |
| 4-6 | Standard | 16 | 24-32 (24 between consecutive grouped lists) | 16 | Row-internal gap 4-8. Row height from the touch-target minimum to 60, title + at most one meta line. At most 5 sections on a Hub. Up to 3 summary values in one row. Smallest step for 1-line metadata only. |
| 7-8 | Compact | 16 | 16-24 | 8-16 | Rows from the touch-target minimum: title + at most one meta line, trailing inline metadata (at most 1 middle dot). Tabular figures on every number. Rows + hairlines, no cards for list items. Thumbnails <=48. Search and filters visible without a tap. |
| 9-10 | Cockpit | as 7-8 | as 7-8 | as 7-8 | Strictly single-line rows: metadata moves to trailing inline values or columns. Tables of numbers (standings, ledgers, score sheets) for pro or admin tools only. Right-aligned numeric columns. No imagery in rows. Empty states are text + action only. Rows never below the touch-target minimum. Critical numbers wrap, never truncate, at large text sizes. |

Touch-target minimums and Dynamic Type mechanics: expo-design-system references/audit.md section 3 and Typography 'Dynamic Type'. No D band lowers them.

### D gates

- Tabular figures on aligned or updating numbers at every D, on every number at D>=7 (C13; font support in bindings §2).
- Cards for list items banned at D>=7.
- More than 5 homogeneous items become rows at D>=5 (C11). Exception: the bible's one sanctioned entity card style (bindings §2) at D<=6, when every item has identity media and a description. Otherwise it is a #7 candidate.
- The 8-row cap on a static grouped section holds at every D (C11).
- First-screen cleanliness (one focal, <=3 short lines, one action, no stats or chips) is mandatory at D<=4 and on every first run.
- Stat tiles only at D>=5, at most 3, each tappable to its source (T2).
- Imagery in rows banned at D>=9.

## Rules each dial gates

| Dial | Gates | Where the rule lives |
| --- | --- | --- |
| V | Signature block count, rails, display step, media header, illustration, brand color field, overlap and custom shapes, scrim use, assets needed | C1, C3, C10, T1, T8, archetypes.md |
| M | Every candidate in Step 8, live-state loops, the delight budget, motion claimed = motion shown. NOT haptics (expo-animation step 8). NOT press feedback (bindings §2). | Step 8, expo-animation steps 1-2 and 9 |
| D | C4 tempo values, C11 thresholds, cards vs rows, tabular figures, smallest-step use (C14), imagery in rows, search and filter visibility, first-screen cleanliness, stat tiles | C4, C11, C13, C14, T2, T11 |

## Presets (V/M/D)

| Preset | V | M | D | Typical screens |
| --- | --- | --- | --- | --- |
| platform | 2 | 1 | 5 | Utilities, settings, "like Apple's apps" |
| native (baseline) | 3 | 2 | 5 | Any screen with no other signal |
| branded | 4 | 2 | 5 | Premium, polished, on-brand products |
| community | 5 | 3 | 5 | Social, feeds, groups, chat |
| performance | 3 | 2 | 7 | Stats, scores, rosters, ledgers, admin tools |
| trust | 2 | 1 | 5 | Payments, fees, health records, regulated flows |
| calm | 3 | 2 | 3 | Wellness, reading, mindfulness |
| editorial | 6 | 3 | 4 | Magazines, media, stories |
| playful | 6 | 5 | 4 | Games, kids (kids caps M at 4), energetic brands |
| moment | 7 | 5 | 2 | Welcome, celebration, recap. Rare screens only. |

## Inference (vibe word -> preset)

The table takes vibe words only: style and feel words in the request, or a named reference.

| Vibe words in the request | Preset |
| --- | --- |
| clean, simple, native, utilitarian, "like Apple's apps" | platform |
| premium, polished, on-brand | branded |
| warm, social, friendly, conversational | community |
| pro, power-user, data-heavy, scannable, spreadsheet-like | performance |
| trustworthy, serious, exact, official | trust |
| calm, minimal, quiet, mindful, unhurried | calm |
| editorial, magazine-like, story-led | editorial |
| fun, playful, energetic, game-like | playful (a kids audience caps M at 4) |
| celebratory, special moment, cinematic | moment |

- Conflicting signals: take the more conservative V and M, and state the assumption on the dials line.
- Domain nouns (club, team, fixtures, event, member, order, plant, payment) are not vibe words and never enter this table. They select the category row (design-read.md category bias table), money and health nouns also raise the trust quiet constraint (design-read.md), and per-screen defaults for domain screens (a roster, a fixtures list) live in bindings §4.
- Screen kinds (welcome, first run, settings, recap) are not vibe words either: they pick the archetype, whose caps and raises apply (below). The screen's starting preset is its per-screen default (bindings §4), or the presets table's Typical screens column when bindings has none.

## Caps

### Archetype caps (override the global triple)

| Archetype | Cap |
| --- | --- |
| Settings | V<=2, M<=1, D 5-7 |
| Task/Form | V<=3, M<=2 |
| Auth | V<=4, M<=2 |
| Sheet | V<=4 |
| Profile | V<=4 |
| Collection | M<=3 (no per-row motion), D>=5 |
| Overview/stats | D>=6 |
| Detail | V up to the resolved V +1 (max 6) |
| Empty, Result, Onboarding | May raise V and M by +2 (max V7 M6) because they are rare-tier. Empty D<=3, Onboarding D<=4. |
| Hub | No archetype cap; the frequency cap applies. |

Empty, Result and Onboarding as states (not screens) apply their caps to the state's content only. The parent screen keeps its own triple.

### Screen-frequency caps (the screen's own open rate, expo-animation step 1 tier names)

- 100+/day and tens/day screens (tab roots including Hubs, main lists, a pushed Collection on the user's daily main path): V<=5. A pushed Collection off the daily path is occasional (the default; design-read.md input 2).
- V>=7 only on occasional or rare screens.
- M has no screen-level cap: each moving element is gated by its own interaction tier in expo-animation step 1.

### Quiet-constraint caps (they beat every other source, including the user)

| Constraint | Cap |
| --- | --- |
| Trust-first (money, regulated, health records) | V<=3, M<=2 |
| Accessibility-first | V<=3, M<=1, all content text at body or larger |
| Kids | M<=4, targets above the component-contract minimum |
| Low-end Android in the audience | M<=3 |

Older users and outdoor or glanceable use set no dial cap of their own. They act on contrast and text size (design-read.md).

## Precedence

quiet constraints > explicit user override > archetype cap > frequency cap > vibe words > category preset > repo default (bindings §4) > baseline

Resolve in this order and write the result once:

1. Start value per dial: the highest source that sets it among vibe words, category preset, repo default, baseline.
2. Clamp with the frequency cap, then the archetype cap (or apply the Empty, Result, Onboarding raise).
3. Apply an explicit user override. If it breaks an archetype or frequency cap, write one line naming what it costs (back swipe, scan speed, accessibility, a 100+/day screen that now moves), then honor it.
4. Clamp with quiet constraints, always. Say so in one line. Only the user removing the constraint itself ("the audience is not kids") lifts it.
5. Write `Dials: V<n> M<n> D<n> (<preset>[, capped by <rule>])` as its own line, right after the Design Read.

## Conversational overrides

| User says | Change |
| --- | --- |
| denser, fit more, more info | D+2 |
| airier, more breathing room, cleaner | D-2 |
| bolder, more brand, more personality | V+2 |
| calmer, quieter, simpler | V-1 and M-2 |
| more alive, livelier | M+2 |
| more native | V and M reset to the `platform` preset |

- Re-clamp against the caps and restate the triple on the next dials line.
- A word is not a cap break. A cap breaks only when the user insists or names a value above it: then step 3 applies.
- The override applies to that screen unless the user says app-wide. App-wide means updating the default in bindings §4.

## Worked resolutions

| Request | Resolution | Dials line |
| --- | --- | --- |
| "Make the send-money confirmation sheet playful" | playful 6/5/4 from the vibe; Sheet cap V<=4; trust-first clamps V3 M2. "Playful" contradicts the brief, so the one allowed question may be asked, or the assumption is stated. | `V3 M2 D4 (playful, capped by trust-first)` |
| "Make the standings list livelier" | performance 3/2/7 (the screen's default, bindings §4; "livelier" is an override, not a preset signal); M+2 = 4; Collection caps M3. If the user insists on M4, write the cost line first. On a tens/day list the gate still allows no per-row motion. | `V3 M3 D7 (performance, capped by Collection)` |
| "Make settings bolder" | platform 2/1/5; V+2 = 4; Settings caps V2. No insistence, so the cap holds. | `V2 M1 D5 (platform, capped by Settings)` |
| "A year-in-review share card" | moment 7/5/2 (Typical screens: recap); Result, rare tier, so V7 is allowed and M5 sits under the M6 max. Real imagery missing: list it under "Assets needed". | `V7 M5 D2 (moment)` |
