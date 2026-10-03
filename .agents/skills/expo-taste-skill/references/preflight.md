# Pre-flight (Step 9)

If one box cannot be honestly ticked, the screen is not done. (S) boxes need a screenshot or device: report them as unverified instead of ticking.

Order: section 1 greps -> section 3 matrix -> expo-design-system 'Self-Critique Pass' on a rendered screen -> section 4 boxes -> lint and typecheck (commands in bindings §10) -> section 5 report. Every repo noun resolves in repo-bindings.md.

## 1. Grep sequence

Greps find candidates, not verdicts. Classes follow native-slop.md: **review-each** (check every hit) and **advisory** (confirm on a screenshot). T13 is the only binary grep. Every hit is fixed, or justified in one line: `file:line ID reason`.

### 1.0 Export and scope

```bash
# Run in bash. zsh does not word-split unquoted variables, so multi-path values ($COMPONENTS) break there.
# 1. Paste the bindings §0 block: SRC, THEME, SCREENS, COMPONENTS, I18N_GLOB, I18N_FILES, SPACING_WHITELIST, BRAND, the *_RE and *_TAG variables.
# 2. Scope: files this change added or modified.
TOUCHED=$( { git diff --name-only HEAD -- $SRC; git ls-files --others --exclude-standard -- $SRC; } | sort -u )
touched() { [ -n "$TOUCHED" ] || { cat >/dev/null; return 1; }; grep -F -f <(printf '%s\n' "$TOUCHED"); }   # append "| touched" for a scoped report; an empty scope prints nothing
```

- Tools: audit.md, native-slop.md (except #3) and the tells.md block use `grep -rEn` and `find` only. Only native-slop's #3 emoji grep uses `rg` (with `\p{}`, which BSD grep cannot run). Where `rg` is not a binary on PATH (only an agent shell function, for example), run #3 with the replacement in bindings §0.
- Baseline: a hit in an untouched file that bindings §9 lists is reported by ID as baseline and not fixed unless asked. A baseline hit inside a touched file is fixed when the change touches that element, otherwise reported as baseline.

### 1.1 Run, in this order

| # | Run | Source | Scope | Done when |
| --- | --- | --- | --- | --- |
| 1 | Token coverage greps, including the custom-tappable accessibility check | expo-design-system references/audit.md section 1, with `$SRC` / `$THEME`, and the spacing whitelist replaced by `($SPACING_WHITELIST)` | touched | every hit fixed or justified (a one-off with a comment, per expo-design-system) |
| 2 | Greppable native-slop tells, review-each then advisory | native-slop.md 'Grep the greppable tells' | touched | every hit fixed or justified |
| 3 | The T-grep block, after the bindings §0 variables | tells.md 'Grep block' | touched; T13 over all of `$SRC`, comments included | T13 returns nothing; every other hit fixed or justified |
| 4 | Taste extras | C7 layer grep (composition.md C7); the accessibility candidate grep below | touched | every hit answered |
| 5 | Screenshot-only native-slop tells: #2, #7, #9, #15, #16, #17. Running-app tells: #14 (re-enter the screen), #19 (first load and a refetch), #20 (keyboard open) | native-slop.md, last paragraph of the grep section | section 3 cells | checked, or listed as uninspected |

```bash
# A11y (advisory): touched views with no accessibility prop at all. Each needs a reason: no image, no heading, no custom control.
printf '%s\n' "$TOUCHED" | grep '\.tsx$' | while read -r f; do
  grep -qE 'accessib(ility[A-Z][A-Za-z]*|le=)|importantForAccessibility' "$f" || echo "$f"
done
```

## 2. One hit, one report

A hit already reported under a # tell is not reported again as a T tell (SKILL.md 'Who owns what': cite the # tell, apply its fix). Ownership order: native-slop # -> audit.md category -> T tell -> C rule. A T tell is reported only for what it adds beyond the # tell.

| Hit | Report as | Not as | The other ID still fires when |
| --- | --- | --- | --- |
| `LinearGradient`, `experimental_backgroundImage` | #4 | T8 | the gradient is a text effect, glow or blob (T8); a scrim on media under text is not a tell: justify it as C10 |
| Emoji glyph as icon | #3 | T8 | never (metaphor SF/Material symbols are T8) |
| Card around every row, heavy shadow, 1px outline | #7, #8, #9 | T5 | 2+ devices stack on ONE container, or framing depth reaches 3: report T5 once, citing the devices |
| Rebuilt header with a content title | #11 | T4 | the native header stays and content repeats its title |
| Alert for success or validation | #10 | T20 | a toast, snackbar or banner (no # owner) |
| Spinner blink, false empty during load | #19 | T18 | the real empty state has no reason or action |
| Downloaded font, second family | #6 | T11 | the ramp is misused within the declared family |
| Platform costume | #16 | T7 | drift between screens of the same platform |
| Equal gaps everywhere | #12 | C4 | the four tempo steps exist but break the D band |
| Raw hex outside the theme | audit.md colors, #18 | T10 | `BRAND` is not declared and the hex is a stock one, or grays mix temperature |
| Raw radius literal | audit.md radius | T7 | values are tokens but the role, nesting or sibling match is wrong |
| `TouchableOpacity`, scale on rows | #13 | Motion box | never |

Report line: `ID file:line: fix (also: ID)`.

## 3. Verification matrix

| Axis | Values | What fails here |
| --- | --- | --- |
| Platform | iOS, Android | #16; large title and sheet grabber are iOS-only, ripple Android-only (bindings §2) |
| Theme | light, dark | C15 measured in each theme, C16, #18 |
| Text size | default, largest accessibility size (iOS Larger Text at max, Android font size at max) | C1 focal still above the fold, C14 truncation, C3 rows reflow, CTAs wrap |
| State | loading (slow first load, refetch with content), empty (each kind the screen can reach), error (offline and server), content, pending on writes | #19, T18, T19, T20, C10 layout shift |
| Content shape | a long name that wraps, 0, 1 and many items, a missing image, imperfect numbers | Hard rule 8, C10, C13, T16 |
| Locale | the longest locale (bindings §8) | Copy CTA box, T17 wrapping |

The full product runs past 100 cells. The minimum pass covers every pair of axes:

1. Content: iOS light default, iOS dark largest, Android light largest, Android dark default. Each in the longest locale once.
2. Loading, empty and error: once per platform in light at default size. Slow the first load (network throttling, or a delay in the data layer's mock): nothing shifts when data lands, nothing blinks. Then a refetch with content on screen: the content stays.
3. Longest locale at default size on both platforms, on every screen with a CTA.
4. Running app: re-enter the screen (#14), keyboard open on Form, Auth and Sheet (#20), one screen-reader pass per platform (VoiceOver, TalkBack) for the [A11y] boxes.

A failure in a cell widens the pass around it. List every cell of the minimum pass you could not inspect as `<platform> <theme> <text size> <state> [<locale>]`.

## 4. Checklist

### Read (Steps 0-1)

- [ ] [Read] The Design Read line was written before any code, with archetype, audience in context (the most frequent audience when two share the screen), category, frequency (a pushed Collection: tens/day only on the daily main path, else occasional), platform mode, brand status, focal, primary and the avoided default. The anti-default check named the first layout that came to mind and discarded it if it matched a T or # tell.
- [ ] [Read] At most one clarifying question was asked, and only for a contradicted brief, an undecidable archetype or audience with no brand, or an ambiguous redesign mode ("Preserve the current look, or start visually from scratch?").
- [ ] [Read] Quiet constraints were checked and override vibe words where they apply.
- [ ] [Read] repo-bindings.md was read. The screen uses the bible's palette roles, type ramp, radius logic, elevation, icon rules and button hierarchy, and introduces no new identity.
- [ ] [Read] Two or more screens, or a screen entered from another: the flow path line was written (design-bible.md 'Flow path rule'). The object carries forward with the same name, image frame, counts and formatting, and adjacent screens do not swing from cramped to empty. (S)

### Mode and dials (Steps 0, 2, 3)

- [ ] [Mode] The job class is stated (greenfield / new / extend / review / polish / preserve / overhaul). Greenfield: palette, type, platform mode and dial default approved before the first screen. Overhaul: the bible diff was approved.
- [ ] [Mode] The platform mode from the bible is followed: chevrons, press feedback and create placement are per mode, large titles are iOS-only (Android: top app bar title, #16), and no chrome was restyled or rebuilt.
- [ ] [Dials] The dials line was written on its own line after the read, with preset and caps. The triple follows the precedence order (vibe words only in the inference; domain nouns through the category row and bindings §4), with archetype, frequency and quiet-constraint caps applied. Any override was restated, and any broken cap names its cost.
- [ ] [Dials] No element exceeds its gate in dials.md: at most 1 signature block (none required on a Collection), rails V>=3 (at most 1 at V3-4, 2 at V5-6), display step V>=5 or a real hero number on Overview, media header V>=5, brand color field V>=7, overlap and custom shapes V>=8, cards for list items only at D<7, strictly single-line rows only at D9-10 (D7-8 allows one meta line), loops M>=4, stat tiles D>=5.

### Archetype (Step 4)

- [ ] [Archetype] Exactly one archetype. Container, header mode (iOS large title only on a section root, standard title when pushed), focal and primary placement match archetypes.md. Header search on a Collection that can exceed 20 items, or listed as pending while its bindings check is open.
- [ ] [Archetype] Sheet: a formSheet route (navigation skill, bindings §10), one task, no native header and no navigation inside. Title and actions are content: a title row at the top, one primary at the end or a trailing Done text button. Swipe-down cancels (#2). Short content uses the `fitToContents` detent, forms use ascending numeric detents (Android: at most 3). The grabber is iOS-only and never the only dismiss affordance. An edit that needs Cancel/Save in a header is a modal, not a sheet.
- [ ] [Archetype] A button that rides above the keyboard uses the forms skill's shared keyboard wrapper (bindings §10). Otherwise the primary sits at the end of the content.
- [ ] [Archetype] Onboarding: it collects setup (#15), has at most 3 steps with Skip, and consecutive steps change composition, not only an icon and a headline. No rating or review prompt in onboarding or on first run; a store review request comes only after a repeated success moment.

### Composition (Step 5)

- [ ] [C1] One focal point, named, visible without scrolling. The first viewport of a Hub shows user content or the next action, not a welcome block, a promo carousel or a quick-action tile grid that duplicates tabs (T1, T17). (S)
- [ ] [C2] Exactly one filled primary per screen or sheet, counted per state branch. One control per intent: the header create hides while the empty-state create shows. Screen-level actions are header or menu items (T17).
- [ ] [C4] Four distinct spacing steps (inline < row-internal < group < section) from the D band in bindings §2. No spacing literal outside the whitelist. (S)
- [ ] [C5] Reading content is leading-aligned; numeric columns trail-align. Centering only in exempt archetypes (T3).
- [ ] [C7] At most 2 surface levels and framing depth 2. Each container uses one separation device; a grouped list (fill + inner hairlines + outline hairline) counts as one. Absolute position and z-index only for real layers (T5).
- [ ] [C8] Radii come from the scale by role, nested = outer - inset, corner smoothing per expo-design-system 'Radius' or the bindings §5 override. Chrome config is exempt (T7). (S)
- [ ] [C10] Every image has a fixed aspect ratio per context (one per list), a placeholder and a recycling key in lists. Text over media sits on the solid scrim token at 4.5:1 (a gradient scrim only after checking it on both platforms) or below the media. Nothing shifts on load. (S)
- [ ] [C11] Static groups hold at most 8 rows. A capped preview is mapped rows in a group; an unbounded list is the screen's root virtualized list, never nested in a scroll container. More than 5 homogeneous items are rows, except the bible's sanctioned entity card at D<=6. No per-row top and bottom borders.
- [ ] [C12] At most 1 badge per row and 3 per viewport, each paired with a word or symbol. No eyebrows beyond the grouped-list header plus at most 1 informative one. No section numbering or version labels in content (T12).
- [ ] [C17] Navigation shape fits the decision table. Tabs are 3-5 nouns with no action tabs. Switches are the platform switch; segmented controls and pickers are platform controls from a dependency (bindings §5, §6), never hand-built (expo-design-system 'When to extract - and when not to': do not wrap platform components).
- [ ] [C18] The block stack differs from sibling screens by archetype, while identity (accent hue included) matches the bible and the two nearest siblings (design-bible.md 'Consistency rules'). (S)

### Type, color and icons (Step 5)

- [ ] [C3] At most 3 text steps in the content region, at most 2 per row, at most 1 display element (and only if the ramp declares it). No inline fontSize or fontFamily. The content does not repeat the nav title (T4).
- [ ] [C6] The accent appears in at most 3 roles in the content region (chrome tint exempt, a ghost button label counts as the highlight). The hue is the same on every screen. Status colors only for status and never color-only (T9). (S)
- [ ] [C9] Icon family per #3, one size and weight per context, literal symbols, filled variants only for selected state. Leading icons on all rows of a group or none. Icons use the text or muted color unless the icon is the control (T8).
- [ ] [C13] Numbers are real or labeled mock, use the locale formatters and plurals, and use tabular figures where they align or update (T15).
- [ ] [C14] Sentences use the body step or larger; the smallest step is 1-line metadata only. Key values are never smallest + muted (T11); a group header that only navigates may keep the grouped-list header style when every row carries its key value (composition.md C14). At the largest accessibility size nothing primary truncates (mechanics: expo-design-system Typography 'Dynamic Type'). (S)
- [ ] [C15] Text and button labels at least 4.5:1; large text, meaningful icons and meaningful borders (input boundaries included) at least 3:1; in light AND dark. A shared primitive that fails and is listed in bindings §9 is reported as known debt, not ticked. (S)
- [ ] [C16] Dark mode was inspected as a design, not an inversion. Every color comes from a token (#18). (S)

### Touch and accessibility (Step 5)

- [ ] [Touch] Every touch target meets the minimum in expo-design-system references/audit.md section 3, per platform (hitSlop counts). A primitive size that cannot reach it is a component gap (bindings §6), never shipped silently. Every icon-only control has an accessibility label.
- [ ] [A11y] Meaningful images (photo, logo or crest, avatar, chart) carry an accessibility label saying what they show. Decorative images and symbols are hidden from the screen reader.
- [ ] [A11y] Section and block titles expose the header role (`accessibilityRole="header"`), grouped-list headers included; a shared primitive that lacks it is a gap (bindings §6, §9).
- [ ] [A11y] A row or card is one accessible element: title, value and state are read in one announcement, and selected, checked, disabled and expanded are exposed as accessibility state, not only as color or a symbol.
- [ ] [A11y] Screen-reader order follows the visual order, top to bottom and leading to trailing. Nothing off-screen or hidden takes focus. (S)

### States (Step 6)

- [ ] [States] Loading, empty, error and content (plus pending for writes) were each designed. Loading mechanics per #19; taste adds skeleton blocks on the muted surface with radius roles, no shimmer at M<=2, and the loading copy rule (states-and-copy.md section 2). (S)
- [ ] [States] Empty copy distinguishes first-run, no-results and nothing now. First-run says what goes here and how it gets populated, and offers the action. No-results echoes the query and offers a recovery step; with native header search its own clear is the clear action (no duplicate Clear button), Clear filters only for non-search filters. Nothing now states the fact with no create action (T17, T18).
- [ ] [States] Errors name what failed and one next step, inline at their scope, with stale content kept (a failed refresh over data never blanks it) and no raw messages. Field errors stay on the field (forms skill, bindings §10) (T19).
- [ ] [States] Success is shown by the UI change. Any transient message exists only for Undo or an off-screen result. No alert for success; destructive confirmation follows #10's policy, titled "<Verb> <object>?" with the button repeating the verb (T20, #10).

### Copy (Step 7)

- [ ] [Copy] Zero em/en dashes in every locale file and JSX literal, with the T13 grep run over all of `$SRC` and returning nothing. Ranges are i18n strings ("{{from}} to {{to}}"), never Intl formatRange, which prints U+2013 (T13).
- [ ] [Copy] Zero filler words (core list + the bible's per-language list, states-and-copy.md section 8), zero exclamation marks outside rare celebrations, no Oops or 'successfully', no web idioms. Active voice with the real actor (T14).
- [ ] [Copy] Sentence case everywhere. One register per language, matching the bible. Curly quotes and apostrophes and the single ellipsis character, per states-and-copy.md section 7.
- [ ] [Copy] Every CTA is verb + object, at most 3 words, one line at default size in the longest locale. (S)
- [ ] [Copy] No implementation, placeholder or raw-server copy (T15). Mock data is plausible and varied (name lengths and cultures, dates, 0 and 1 counts, a missing image, distinct initials instead of one generic person placeholder), with no stock names or fake precision, and is labeled as mock in code (T16).
- [ ] [Copy] The Copy Self-Audit was done: every visible string re-read in every locale (states-and-copy.md section 11).

### Motion (Step 8)

- [ ] [Motion] Each moving element has its one-sentence purpose + tier and passed expo-animation steps 1-2. Nothing exceeds the M ceiling. A read claiming M>=5 ships a motivated moment, or M was lowered.
- [ ] [Motion] No entrance animation on routine screens (#14). No decorative loop. Every tappable has the bible's press feedback and nothing looks tappable without it (bindings §2, #13). Reduced motion ships with every animation (expo-animation hard rule 4).
- [ ] [Motion] Haptics follow expo-animation step 8, not M, fire only if the module is installed (bindings §5), and are never the only feedback.

### Tells, system and verify (Step 9)

- [ ] [Tells] The T-grep block ran with the bindings §0 variables. Every hit is fixed or justified in one line. T10 is skipped only because `BRAND=declared` (gray temperature still reviewed). T11 hits are answered with "key value or 1-line metadata?".
- [ ] [Tells] native-slop #1-#20 were reviewed with their greps, the screenshot-only and running-app ones were checked on both platforms, and section 2 dedupe was applied. (S)
- [ ] [System] audit.md section 1 greps are clean for the touched files, or each hit carries a one-line justification.
- [ ] [System] No new component duplicates the shared inventory (bindings §3). Any new shared component passed expo-design-system 'When to extract' and its contract and sits where the architecture skill says. Any new value became a token.
- [ ] [System] The Self-Critique Pass (hierarchy, proximity, repetition, alignment) was done on a rendered screen. (S)
- [ ] [Verify] Section 3 minimum pass inspected. Uninspected cells are listed in the answer. (S)
- [ ] [Verify] Lint and typecheck pass (bindings §10).
- [ ] [Output] The answer follows the SKILL.md output contract (the BUILD / REVIEW variant after code), with the read, dials and archetype lines first, pending items listed, and includes "Assets needed: none", or one line per missing real image (ratio, context, where it goes). Nothing is faked with stock art, a gradient or a placeholder shipped as final.

### Redesign only

- [ ] [Redesign] Nothing on the Step 0 never-change list changed silently, and nothing regressed in accessibility (contrast, Dynamic Type behavior, target sizes, labels).
- [ ] [Redesign] Findings were reported before changes unless fixes were requested. One screen per commit (audit.md section 5 steps 3-4), re-running that screen's audit, native-slop and T greps.

## 5. Report

Output contract BUILD / REVIEW lines 4-5 (SKILL.md), one line each:

```text
Pre-flight: grep hits fixed T17 file:line, #9 file:line (also: T5); justified T3 file:line (Empty archetype); baseline T18 (bindings §9). Failed [C15] input boundary (bindings §9 debt). Unverified (S): [C14], [A11y] screen-reader order. Not inspected: Android dark largest error; iOS light default content longest-locale. Gaps: row trailing-value slot (expo-design-system 'Composition over configuration').
Assets needed: none.
```
