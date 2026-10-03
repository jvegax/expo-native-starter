# Design Read (Step 1 detail)

The Design Read is one line, written before any JSX. It records what the screen is, who it is for and which defaults it refuses. Everything after it (dials, archetype, composition, states, copy) is checked against it. This file covers the eight inputs, quiet constraints, the anti-default check, the one-question rule, the template with worked examples, and the category bias table.

## The eight inputs

Read all eight before writing the line. If an input is missing, assume the conservative value and say so in the read. Do not ask about it (see the one-question rule).

| # | Input | Where to find it | Decides |
|---|---|---|---|
| 1 | Screen kind -> archetype | The request text, the route it lives on (tab root, pushed detail, sheet, auth group) and the archetype-to-container map in bindings §3. | Container, header, focal and primary placement (archetypes.md). One archetype only. If two fit, it is two screens or a screen plus a sheet. |
| 2 | Screen frequency | Where it sits in navigation, with the expo-animation step 1 tier names (100+/day, tens/day, occasional, rare): a tab root (a tab-root Hub included) or the main list is tens/day; a pushed Collection is tens/day if it is on the user's daily main path, otherwise occasional (default occasional); a pushed detail is usually occasional; onboarding and results are rare. The tier of an interaction on the screen (a tab switch is 100+/day) gates that interaction's motion, not the screen's tier. | The frequency caps on V (dials.md) and the tier in every motion sentence (Step 8). |
| 3 | Audience in context | The request, the bible's audience field (bindings §2), and the domain nouns in the i18n files (bindings §8). Write who, where, one hand or two, glance or study. When the screen serves two audiences (members and admins), pick the most frequent one for the read; name the other only if it changes the primary action. | The aesthetic. The audience picks it, the agent does not. "Users" is not an audience. |
| 4 | App category | The bible's category field, or the domain nouns if the bible has none. Match a row in the category bias table below or derive one. | The preset, focal, number treatment, imagery, register and likeliest tells. |
| 5 | Vibe words and references | The request text only ("calm", "denser", "like Apple's apps", a screenshot). Map style words to presets with the inference table in dials.md. Domain nouns (club, fixtures, order) are not vibe words: they go through input 4. | Moves the dials within the caps. Lowest-ranked style input: quiet constraints, caps and the declared brand all beat it. |
| 6 | Declared brand | The theme files named in bindings §1 and §2: palette, typeface, radius scale. | Fixed input, never re-chosen. Declared means T10 does not fire. None means T10 is live and the accent comes from the category row. |
| 7 | Quiet constraints | Not usually stated. Infer them from audience, category and data (money, health records, children, outdoor use, target devices). | Caps that override vibe words (next section). |
| 8 | Platform mode | The bible (bindings §2): iOS HIG, Material 3 or deliberate neutral. | Chevrons, create placement, header shape and press feedback per platform (platform-and-brand.md). Never chosen per screen. |

Also open the two nearest sibling screens (same archetype or same tab). C18 compares against them at the end. Reading them now prevents Screen Drift (T7) before it starts.

## Quiet constraints

Quiet constraints always win over vibe. They sit first in the dials precedence (dials.md), so neither "playful" nor "bolder" can lift them. A user who insists breaks a cap, and the read then carries the one-line cost (dials.md 'Precedence', step 3).

| Constraint | Signals | Caps and rules |
|---|---|---|
| Accessibility-first | Assistive-tech users, public sector, health access, the user says so | V<=3, M<=1. All content text at the body step or larger, metadata included. |
| Trust-first (regulated money or health) | Payments, balances, fees, invoices, prescriptions, test results, health records | V<=3, M<=2. Exact numbers with unit, currency and sign. No decorative charts or rings. Plain register. |
| Kids | Under-13 audience, education for children (parent-facing flows excluded) | M<=4. Touch targets one step above the minimum in expo-design-system references/audit.md section 3. Type one step larger. No dark patterns, streak pressure or fake urgency. |
| Older users | 60+ audience, care, retirement, community services | The body step is the minimum for every string. High contrast in both themes. One task per screen, no gesture-only actions. |
| Outdoor or glanceable | Sports, delivery, field work, transit, anything used walking or in sunlight | Key values at 7:1 contrast (the only place this skill asks for more than C15's 4.5:1). Key values one step larger. The focal readable in one glance. |
| Low-end Android | Emerging markets, budget-device audiences, the bible says so | M<=3. No blur. No per-row images larger than 48pt. Media lazy and fixed-ratio (C10). |

Several can apply at once. Take the strictest cap per dial and name each one in the dials line's "capped by" slot.

## Anti-default check

The first layout that comes to mind is usually the average of every app and website in training data. Run this before writing the read:

1. Name the first layout that came to mind, in one clause.
2. Compare it with the table below and with the T and # tells (tells.md; expo-design-system references/native-slop.md).
3. If it matches, discard it and write the default in the read's "Avoiding:" slot. Say why in one clause ("a welcome card, T1, pushes the user's content below the fold").
4. If nothing matched, still name the most likely default for this archetype in "Avoiding:". The slot is never empty.

| Default reflex | Tell | Native move instead |
|---|---|---|
| Welcome card with app explanation and a big CTA on a tab root | T1 | The Hub answers "what needs me now". The explanation moves to the first-run empty state. |
| Three stat tiles under the title | T2 | Each number goes where it is acted on: trailing row value, section-header count, or one metric with a delta sentence on an Overview. |
| A card per row | #7 | Rows in the grouped-list or virtualized-list primitive. Cards only for entities acted on as a unit, one card style per app. |
| A centered column (title, text, button) | T3 | Leading alignment. Centering only in Empty, Result, Onboarding, the auth brand mark, single-action confirmations and a Detail or Profile identity block (C5). |
| Header "+" and an in-content "Create" button | T17 | One control per intent. Header item for the screen-level create, hidden while the empty-state action shows. |
| Uppercase eyebrow above every block | T12 | The grouped-list section header is the sanctioned one. At most one other eyebrow per screen. |
| Equal grid of icon quick-action tiles that duplicate tabs or drawer items | T17 | Delete the grid. Navigation already lives in the tabs and the drawer. Keep only an action the user takes now, as the focal block's one button. |
| Auto-advancing promo carousel with page dots on a tab root | T1 (T8 for the dots) | One static focal block, or nothing. Onboarding carousels are #15. |
| Progress bars or rings with filled tracks used to compare things | T2 | A number in text with its unit and period. A chart only for a real series (load the dataviz skill). |
| A Hub, Detail, Profile or Result screen with no focal block (a title plus a plain list) at V>=3 | Failure mode (2), the undecided template | Give it its focal block (at most 1 signature block at V3-4) and the real imagery the dials allow. Subtraction never removes those. A Collection is exempt: its focal is the first row and its grouping, and nothing sits between the header and the first row. |

## The one-question rule

Ask at most ONE clarifying question per screen, and only in these cases:

- The read contradicts the brief, and the contradiction changes the build (for example "playful" on a payment step, "dense dashboard" for an accessibility-first audience).
- No brand is declared AND the archetype or the audience cannot be decided from the request, the routes and the domain.
- Redesign work where the mode is ambiguous: redesign.md owns that question ("Preserve the current look, or start visually from scratch?"), and it counts as this screen's one question.

How to ask:

- One binary choice, with the default named and the cost of the other option in a few words: "This step moves money, so I am keeping it calm and exact. Keep that (default), or make it playful at the cost of trust cues?"
- Never a menu of aesthetics, never an open "what style do you want?", never a question the bible, the theme or the request already answers.
- If the session cannot wait for an answer, build with the default and write the assumption into the read.

Everything else is an assumption written into the read, so the user can override it later ("denser", "calmer", "more native"; dials.md conversational overrides).

## The template

Write exactly one line per screen, then the dials on their own line (SKILL.md Step 3, dials.md 'Precedence'):

```
Reading this as: <archetype> for <audience in context> in <category>, <frequency> screen, <platform mode>, brand <declared|none>. Focal: <one thing>. Primary: <verb + object> at <placement>. Avoiding: <the default>.
Dials: V<n> M<n> D<n> (<preset>[, capped by <rule>]).
```

| Slot | Fill with | Fails when |
|---|---|---|
| archetype | One of the 12 names in archetypes.md. A state (Empty) names its parent: "Hub (first-run empty)". | Two archetypes, or a made-up one ("dashboard"). |
| audience in context | Who, where, hands, glance or study. | "Users", "members", "everyone". |
| category | A row of the bias table, or a derived row. | "App", "general". |
| frequency | 100+/day, tens/day, occasional or rare. | Missing. Step 8 and the V caps need it. |
| platform mode | The bible's mode, verbatim. | A per-screen choice. |
| brand | declared or none (input 6). | "default", "kind of". |
| Focal | One noun phrase, visible without scrolling (C1). Settings may say "none (scan)". | Two things, or "the content". |
| Primary | Verb + object, at most 3 words, plus its placement from archetypes.md. "none (rows navigate)" where the archetype allows. | "Submit", "Continue" without an object, or no placement. |
| Avoiding | The default from the anti-default check, with its tell ID. | Empty. |
| Dials line (own line) | The triple after precedence and caps (dials.md). The preset it started from. Each cap that moved a value after "capped by". | Folded into the read, a triple that ignores a cap, or no preset named. |

Rules:

- The read goes in the reply. Put it in a code comment only if the user asks.
- Several screens in one task: one read per screen, preceded by the flow path on one line in the design-bible.md 'Flow path rule' format (`Flow: list -(tap row, push)-> detail -(Invite, sheet)-> sheet`). The same name, image and count must carry forward between screens.
- The read is per screen, and the bible is per app. If the read needs something the bible lacks (a new accent role, a second typeface, a different radius logic), that is an overhaul (redesign.md), not a local exception.
- When signals conflict, take the more conservative V and M and say so on the dials line.

## Worked examples

### (a) Collection, utility-leaning

Brief: "Show the open work orders." Productivity app for small maintenance teams. Bible: iOS HIG, brand declared, default V4.

- First default: a card per order with a status badge, a date eyebrow and a "View" button. Matches #7, C12 and T17. Discarded.
- Signals: no vibe words in the brief. "Orders" is a domain noun, so the preset comes from the category row (productivity, performance 3/2/7), which outranks the repo default V4. It is the team's main list on a tab root, so tens/day. Collection cap (M<=3, D>=5) and tens/day cap (V<=5) are both met.

```
Reading this as: Collection for an operations lead at a desk scanning the day's open orders, two hands, in productivity, tens/day screen, iOS HIG, brand declared. Focal: the first overdue order row. Primary: Add order at the nav-bar "+". Avoiding: a card per order with a badge and a View button (#7).
Dials: V3 M2 D7 (performance).
```

- Structural move: Virtualized list (the list as the screen root, sections by due date with the grouped-list headers as the only eyebrows, single-line rows with a trailing due time in tabular figures, status as text plus color with at most one badge per row, C12, C13). Each row carries its own due time, so the due-date section headers only navigate and may keep the grouped-list header style (C14). No signature block: a Collection is exempt, and nothing sits between the header and the first row. Header: large title on iOS because this list is a tab root (pushed, it would use the standard title; Android: top app bar title, #16). Header search, because the collection can exceed 20 items.

### (b) Detail with a photo, V5

Brief: "Give the restaurant page more brand, it looks like a form right now." Table-booking app. Bible: deliberate neutral, brand declared, default V4.

- First default: the restaurant name as a big title under the header, then label/value rows for every field, including "Phone: -". Matches T4 and T6. Discarded.
- Signals: "more brand" is a conversational override, V+2 (dials.md), so V6 from the branded V4; the Detail cap (the resolved V + 1, max 6) clamps it to V5. A word is not a cap break, so no cost line. V5 unlocks the media header, but only with real imagery.

```
Reading this as: Detail for someone choosing where to eat tonight, one hand, deciding in under a minute, in commerce, occasional screen, deliberate neutral, brand declared. Focal: the venue photo with the next free slot. Primary: Book table at the identity block. Avoiding: a spec sheet of label/value rows with empty fields (T6).
Dials: V5 M2 D5 (branded, capped by Detail).
```

- Structural move: a 16:9 media header, an identity block below it (cuisine, area, price level, next free slot) that does not repeat the header title, one group of present facts only, the missing phone as an "Add phone number" action row only if the user can edit it. Any text over the photo sits on a scrim token at 4.5:1, or goes below the photo (C10).
- Assets needed: one real 16:9 photo per venue. A venue without a photo falls back to the V4 identity block. Never stock or generated art.

### (c) Payment confirmation, trust overrides "playful"

Brief: "Make the send-money step playful like the rest of the app." Peer-to-peer payments app. Bible: iOS HIG, brand declared, default playful 6/5/4.

- First default: confetti, a mascot and "Almost there!" over the amount. Matches T8, T14 and Step 7 rule 5 (exclamation marks). Discarded.
- Signals: playful 6/5/4 from the brief; Sheet cap V<=4; trust-first clamps V<=3 M<=2, exact numbers. The read contradicts the brief, so ask the one question: "This step moves money, so I am keeping it calm and exact. Keep that (default), or make it playful at the cost of trust cues?" Build with the default.
- Archetype: confirm-before-send is a Sheet (cap V<=4). The success screen after it is a Result, a separate screen under the same trust caps.

```
Reading this as: Sheet for a person about to send money to a friend, one hand, checking before committing, in fintech, occasional screen, iOS HIG, brand declared. Focal: the amount and the recipient. Primary: Send €40.00 at the end of the sheet content. Avoiding: celebration art and exclamations on a money step (T8, T14).
Dials: V3 M2 D4 (playful, capped by trust-first).
```

- Structural move: a native sheet route with a content-sized detent ('fitToContents'). A sheet route renders no native header, so its title row ("Review payment") and its single primary are content. Swipe-down is the cancel. The grabber option (sheetGrabberVisible) is iOS-only, and Android accepts at most 3 detents. Amount, fee and arrival time as exact values with currency, in tabular figures. No motion beyond the platform's.
- The playful voice stays on the app's other screens. One register per app (Step 7) means "plain" here, not a second voice.

### (d) First-run empty Hub

Brief: "Home screen for a new user." Plant-care app, no category row in the table (derived below). Bible: Material 3, brand none (system font, platform colors, one accent).

- First default: "Welcome to <App>" with three feature bullets and "Get started", or a 3-slide intro carousel. Matches T1 and #15. Discarded.
- A tab-root Hub is a tens/day screen, and this empty is a rare-tier state of it: Empty allows V and M +2 (max V7 M6) with D<=3, and the Hub's tens/day frequency cap (V<=5) still holds, so V5 is the ceiling.
- No brand and a new category, but the archetype and the audience are clear, so no question: the derived row goes into the read and the bible.

```
Reading this as: Hub (first-run empty) for someone who just installed the app with two plants on the windowsill, one hand, curious but impatient, in home plant care (derived, calm), tens/day screen (tab-root Hub; the empty is a rare-tier state), Material 3, brand none. Focal: the add action. Primary: Add plant at the center of the empty block. Avoiding: a welcome card with feature bullets (T1).
Dials: V5 M4 D3 (calm, Empty +2).
```

- Structural move: top app bar title (no large title on Android), one centered empty composition: muted platform symbol (a literal leaf, not sparkles), "Your plants will show up here", one sentence ("Add a plant to get its watering schedule."), the Add plant button. The header create stays hidden until the first plant exists (T17). A FAB appears later only if the bible declares one.
- M4 is a ceiling, not a quota. The read claims no liveliness, so nothing has to move. The first plant added is the one rare-tier candidate, decided by expo-animation step 1.
- Assets needed: an illustration is allowed at V5, but only a real one in the bible's style. Until it exists, ship the symbol.

## Category bias table

Pick one row per app and record it in the bible. Presets are V/M/D (dials.md). The row biases choices; caps and quiet constraints still apply on top.

| Category | Preset V/M/D | Focal | Numbers | Imagery | Register | Signature | Likeliest tells | Hard don'ts |
|---|---|---|---|---|---|---|---|---|
| Fintech | trust 2/1/5 | Balance or amount | Tabular, signed, locale currency | None decorative | Calm, exact | Transaction row | T2, T10, T19 | No chart without a real series |
| Health and wellness | calm 3/2/3 | One metric with context | Tabular, with a delta sentence | Soft real photos | Encouraging, no guilt | Progress block | T2, T14 | No streak shaming |
| Productivity | performance 3/2/7 | The list | Inline, tabular | None | Terse | Dense row with swipe actions | T8, T12 | No cards for items |
| Social and community | community 5/3/5 | People and media | Counts in text | Fixed-ratio media | Warm | Person row | T8 (avatar stacks), T12 | No fake presence dots |
| Commerce | community 5/3/5 | Product and price | Price prominent, locale currency | 1:1 or 4:5 product frames | Clear | Product tile | T17, T12 | One CTA per product |
| Media and editorial | editorial 6/3/4 | The image | Minimal | Imagery leads, chrome recedes | Editorial | Media header | T1 | No text on photos without a scrim |
| Sports and clubs | branded 4/2/5 for members; performance 3/2/7 for admin, rosters, fixtures | Next fixture or session, membership status | Scores, times and counts tabular; results as text plus color | Real club photos, crests | Direct, energetic without hype | Club identity block | T2, T8 (trophies), T14 | Color never the only result signal; celebration rare-tier only |
| Utilities and settings | platform 2/1/5 | None (scan) | n/a | None | Plain | None | T3, T12 | Zero decoration |
| Kids and education | playful 6/5/4, M capped at 4 | The one task | Large | Illustration allowed at V>=5 | Simple | Progress | T8 | No dark patterns |

Notes that apply to every row:

- Ranges (times, prices, dates) come from i18n strings ("{{from}} to {{to}}"), never from Intl formatRange, which prints U+2013 and breaks T13 at runtime.
- Quiet constraints stack on top: kids and older users can live in any category, and outdoor applies to most sports and delivery apps.
- A row with two presets (Sports and clubs: members vs admin) applies per screen: the read picks the screen's most frequent audience (input 3), and the per-screen default in the bindings (§4) records the result.
- A row's signature is one component per app (platform-and-brand.md, brand channels). Building it is expo-design-system "When to extract".

## Deriving a new category

When no row fits:

1. Fill the same nine columns. Start the preset from the nearest existing row or the dials.md presets table's Typical screens column. If two presets fit, take the more conservative V and M.
2. Name the focal by asking "what does this user check first, every time?" Name the likeliest tells by asking "which default would a generic app in this space ship?"
3. With no declared brand, the register column picks the accent (one hue, one gray temperature, T10).
4. Write the row into the bible (design-bible.md category field; this app: bindings §2) and cite it in every read as "<name> (derived, <preset>)".

Example row from (d): Home plant care | calm 3/2/3 | the next watering | days in text ("Water in 2 days"), tabular when they update | the user's own 1:1 photos | calm, practical | care-schedule row | T8 (sparkles, decorative foliage), T14 | no guilt copy about missed waterings.
