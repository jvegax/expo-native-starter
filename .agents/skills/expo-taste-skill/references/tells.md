# Taste tells T1-T20

Named taste failures in the content region of a native screen, each with the native fix. They sit next to expo-design-system's native-slop #1-#20 (references/native-slop.md) and never redefine one of them: the "Not here" table at the end maps every overlap.

## How to use

- These are review prompts, like native-slop. The brief and the declared system (bindings §1, bindings §2) win over a tell. A tell that harms interaction or accessibility (a task path below the fold, an unreadable key value, a control that does nothing) is always fixed.
- T13 The Em Dash is binary: one hit fails the pre-flight. Every other tell is judged hit by hit.
- Detect classes. **review-each**: legitimate uses exist, check every hit against the tell. **advisory**: hits only suggest the tell, confirm on a screenshot. **screenshot (S)**: no grep is precise enough; needs a rendered screen. An (S) check you could not run is reported, never ticked.
- One report per element. When a T tell and a # tell describe the same element, report the # tell and apply its fix. A hit already reported under a # tell is not reported again here.
- Known hits in the current codebase are listed in bindings §9. In a review, report them by ID; fix them only when asked or when the screen is being rebuilt.
- Report findings in the preflight.md section 2 format (`ID file:line: fix (also: ID)`), or in the redesign.md report template when reviewing, ordered by user harm (interaction and accessibility first).

## Composition

### T1 The Website Hero
- **Tell:** a tab root or the first signed-in screen opens with a landing-page block: "Welcome to <App>", a paragraph explaining the app and a big CTA, often boxed in a card, sometimes with stats. Or an auto-advancing promo or banner carousel with page dots. The user's own content sits below the fold.
- **Why it hurts:** the most-opened screen spends its first viewport on text the user read once. The real task needs a scroll on every visit, and an auto-advancing carousel moves content while it is being read.
- **Native fix:** Hub archetype. The native header title is the only title (large title on iOS, top app bar title on Android, #16). The first viewport shows the user's most time-relevant content or the next action: at most 1 focal block of at most 3 short lines and 1 action, no stats or chips. The app explanation moves into the first-run empty state (T18). Nothing on a tab root advances by itself: a promo becomes one row in the focal block or goes. Leading alignment.
- **Detect:** review-each (grep T1, English and the Spanish pattern from bindings §0; the Auth archetype's one-line greeting is exempt) + screenshot (S): on a 6.1in device, does the first viewport show user content or the next action?
- **Related:** #4 (gradient variant), #15 (onboarding carousel), T14. **Source:** imagegen-frontend-mobile "not a website hero inside a phone"; taste-skill hero, marquee and carousel rules.

### T2 The Stat Wall
- **Tell:** a row or grid of 2-6 equal tiles with a big number and a tiny label (Members / Events / Wins), trend arrows, sparklines, rings or charts drawn from invented or too few points, without unit or period. Progress bars or rings with a filled background track used to compare things that are not progress toward a goal. The numbers drive no decision and repeat across screens.
- **Why it hurts:** tiles dress the screen as an analytics product. A number without unit, period or next step cannot be acted on, and a decorative track reads as a measurement that is not there.
- **Native fix:** put each number where it is acted on: a trailing row value, a count in a section header, or one primary metric with a delta sentence on an Overview (D>=6). At most 3 tiles, each tappable to its source. A comparison is a sentence or a list sorted by value. A bar or ring only for real progress toward a goal. A chart only for a real series with unit and period (load the dataviz skill); drawing it needs a chart dependency (bindings §5 says whether one is installed, ask before adding).
- **Detect:** advisory (grep T2, file names) + screenshot (S): 2+ same-size tiles with a number and a label each, or a filled track that is not progress.
- **Related:** C13, T16. **Source:** taste-skill "three equal cards" and filled-track bars (9.F); imagegen-frontend-mobile "repeated stat cards", "fake chart dashboards".

### T3 Centered Everything
- **Tell:** titles, body text and buttons center-aligned on Hub, Detail, Collection, Profile, Settings or Form screens, or centered content inside rows. The web hero reflex.
- **Why it hurts:** centered lines have no shared leading edge, so the eye re-finds the start of every line. Rows and headers are leading-aligned, so centered content looks pasted in.
- **Native fix:** leading alignment for all reading content. Centering only in Empty, Result, Onboarding, the auth brand mark and single-action confirmations (C5).
- **Detect:** review-each (grep T3), ignoring hits in empty, result, onboarding and auth brand-mark files.
- **Related:** C5. **Source:** taste-skill anti-center bias.

### T4 The Double Title
- **Tell:** the navigation header already shows the title and the first content element repeats it at the title step, or a hand-made headline sits above or below a large title.
- **Why it hurts:** the same string twice costs the top of the screen and hides which one is the navigation title. VoiceOver and TalkBack read it twice.
- **Native fix:** section roots use the native header title only (large title on iOS, top app bar title on Android, #16). Detail screens use a short header title plus an identity block that adds information (media, key fact) without repeating the string.
- **Detect:** screenshot (S): the same string twice in the top 200pt. Advisory grep T4 finds files that set a header title and render the title step; it misses a header title set from an entity expression that a child component repeats at a smaller step, so compare the header's title expression with the identity block's text by hand.
- **Related:** #11, #16. **Source:** new-native.

## Surface and identity

### T5 Belt and Braces
- **Tell:** one container framed by two or three separation devices at once: a tinted surface + a 1px border + a drop shadow. Or framing depth of 3+ (screen > section box > card > bordered chip). Each device alone is #7, #8 or #9; stacking them is this tell.
- **Why it hurts:** every extra frame adds an edge the eye must parse, so content loses to chrome. It reads as a web card, not a native surface.
- **Native fix:** one device per container: fill contrast on the canvas (default), OR a hairline from the group, OR the lightest tokened shadow for a floating or media card. Framing depth at most 2 (C7). A grouped list (fill + inner hairlines + its outline hairline) counts as one device. A control's own outline (an outlined button, an input boundary) is its shape, not a container device, and answers to C15 contrast. Hierarchy comes from type and spacing.
- **Detect:** review-each (grep T5: files with a border AND a shadow) + screenshot (S) for depth.
- **Related:** #7, #8, #9. **Source:** new-native; imagegen-frontend-mobile anti box-in-box.

### T6 The Spec Sheet
- **Tell:** a detail screen rendered as one bordered label/value row per field, including empty ones ("Phone: -", "Website: N/A", "Bio: Not provided").
- **Why it hurts:** the user scans every row to find the 3 facts that matter, and dashes read as broken data.
- **Native fix:** lead with an identity block. Show only fields that have values, grouped in one section. Turn the one important missing field into an action row ("Add phone number").
- **Detect:** review-each (grep T6) + screenshot (S): more than 6 label/value rows.
- **Related:** #9, C11. **Source:** taste-skill per-row border spec-sheet ban.

### T7 Screen Drift
- **Tell:** the screen uses a different radius, icon weight, button style, spacing tempo, shadow language or accent hue than its siblings. Radius soup in content (12/20/24 next to 8/16, an inner corner equal to the outer corner, 24+ on rows and buttons). The same entity shows a different name, image or count on the list row and on its detail. It reads as from another app even when every value is a token.
- **Why it hurts:** identity is what makes screens feel like one product. Drift makes the user re-learn each screen, and a changed entity looks like a different record.
- **Native fix:** radius by role from the scale; nested = outer - inset (C8). Compare against the bible (bindings §2) and the two nearest sibling screens before done (C18). Vary composition, never identity: an identity change is an overhaul (redesign.md). Chrome config (the sheet corner radius in navigator options) is exempt.
- **Detect:** advisory (grep T7: radius inventory, one value per role expected; raw literals are audit.md section 1) + screenshot (S): side by side with two siblings, and the list row next to its detail.
- **Related:** #16 (the cross-platform version). **Source:** imagegen-frontend-mobile app design bible; taste-skill shape and color consistency locks.

### T8 Ornament Without Meaning
- **Tell:** decoration posing as meaning: blobs, glow halos, colored shadows, gradient text, glass or blur panels on flat backgrounds, noise, decorative hairlines or grid lines that organize no content, rotated text. Metaphor icons (rocket for start, sparkles for smart or new, shield for security, crown for admin, trophy on everything sporty). Props that look interactive but do nothing: toggles that persist nothing, "+12" avatar stacks that go nowhere, presence dots without presence data, "See all" without a destination, chevrons on rows that do not navigate. Drawn device chrome.
- **Why it hurts:** ornament competes with content for the same attention, and a dead prop is a broken promise the user taps and learns to distrust.
- **Native fix:** delete it. Atmosphere comes from the canvas, real photos with a scrim, and type. Blur and material appear only where the platform puts them (bars, sheets). A scrim is meaning, not ornament: the solid scrim token by default; a gradient scrim through `experimental_backgroundImage` (RN 0.86, New Architecture) only after checking it on both platforms. Use the literal symbol for the object. Every interactive-looking element works. Replace an avatar stack with a count in text.
- **Detect:** review-each (grep T8; a gradient on a hero block is #4 and is reported there) + screenshot (S): tap every interactive-looking element.
- **Related:** #3 (emoji), #4 (gradient hero). **Source:** imagegen-frontend-mobile glass cards, blobs, decorative toggles, avatar rows, fake system markers; redesign-skill cliche icons; taste-skill glows, gradient text, hairline grids and rotated text (9.F). imagegen-frontend-mobile sections 16-20 and 22 (creative assets, texture, custom icon character, style engine) are reversed for native: imagery is content only and V-gated (C10), decoration is T8, the icon family is the platform's (#3), and variation is by archetype (C18), never by a style roll.

## Color, type and labels

### T9 The Accent Flood
- **Tell:** the accent appears in more than 3 roles on one screen: headings, every row icon, borders, backgrounds, body links, badges and the primary button. Or a second accent hue, a rainbow of colored icon bubbles, or status colors used as decoration.
- **Why it hurts:** when everything is the accent, nothing is: the primary action stops standing out, and status colors lose their meaning.
- **Native fix:** C6 budget, counted in the content region: primary action, selection/active state, one highlight. Chrome tint (back button, header items, tab selection) is exempt; a ghost or link button label counts as the highlight. Headings use the text color, row icons text or muted, borders the separator color. Categorical colors only for real categories with a stable legend.
- **Detect:** advisory (grep T9: files with more than 3 accent uses) + screenshot (S): count accent regions in the content.
- **Related:** C6. **Source:** taste-skill one accent + color consistency lock.

### T10 The Borrowed Palette
- **Tell:** fires on the stock-palette branch only when the theme declares no brand palette. The agent reached for stock colors: Tailwind indigo/gray (#6366F1, #4F46E5, #E5E7EB, #6B7280, #111827), AI purple-to-blue with glow, or the "premium consumer" beige canvas (#F5F1EA, #FAF7F1) with brass/oxblood/terracotta accents. Fires with or without a brand when a stock hex is added outside the theme, or when warm and cool grays are mixed.
- **Why it hurts:** the app looks like every generated app, and the color says nothing about its category or audience. Mixed gray temperatures look dirty next to each other.
- **Native fix:** platform semantic colors for canvas, text and separators, plus ONE accent chosen for the category and audience (design-read.md category bias), saturation below about 80% and never neon, the same hue on every screen, one gray temperature, all added as light/dark token pairs via expo-design-system "Adopt Before You Build". A declared brand always wins, even when it resembles these defaults.
- **Detect:** review-each (grep T10; with BRAND=declared, hits inside the theme are the brand and pass) + gray-temperature review of the theme.
- **Related:** #18. **Source:** taste-skill LILA rule, premium-consumer palette ban, accent saturation (4.2), one gray temperature.

### T11 The Whisper
- **Tell:** key information (date, time, fee, count, a status that needs action) demoted on two or more axes at once: the smallest step + muted (+ a light weight where the ramp has one). Sentences or button labels in the smallest step, more than half the text muted. Or a broken ramp: every text the same size, only 400 and 700 weights, 2+ display elements, a second family added for "character".
- **Why it hurts:** the datum the user opened the screen for is the hardest one to read, outdoors and at large text sizes most of all.
- **Native fix:** demote one axis at a time. Key values use body or label size in the text color. The smallest step is for 1-line metadata only. At most 3 steps in the content region, emphasis through the ramp's weight steps or another weight of the same family (C3, C14). The whisper applies to values the user acts on: a group header that only navigates (day, letter, category) may keep the muted grouped-list header style when every row carries its own key value; a header that is itself the key value is promoted into the rows, or its emphasis is recorded as a gap (bindings §6) (composition.md C14). Truncation and scaling mechanics: expo-design-system Typography "Dynamic Type". If text feels small, the screen is not finished.
- **Detect:** advisory (grep T11; the sanctioned 1-line metadata in shared list primitives is excluded by bindings §0). Ask of each hit: is it a key value or a sentence? Then it fires. A navigating group header over rows that carry the key value does not. Plus screenshot (S) at default and the largest accessibility size.
- **Related:** #6 (font choice). **Source:** imagegen-frontend-mobile "if text feels small the design is not finished"; taste-skill weight discipline; redesign-skill "only 400/700".

### T12 Label Confetti
- **Tell:** tiny labels everywhere: uppercase tracked eyebrows above blocks ("OVERVIEW", "RECENT ORDERS"), section numbering ("01 /", "Step 1"), "New"/"Pro"/"BETA" pills, version labels, several chips per row, pills over images, decorative status dots, color-only status.
- **Why it hurts:** labels that label nothing add a reading pass to every block, and color-only status fails color-blind users.
- **Native fix:** the grouped-list section header is the one sanctioned small header; its case follows the list component. At most 1 other eyebrow per screen, and only if it carries information. Real multi-step progress reads "2 of 4" in the header. At most 1 badge per row and 3 per viewport, only for actionable or filterable state, always paired with a word or symbol (C12). Version only in the About/Settings footer.
- **Detect:** review-each (grep T12) + advisory (badge/chip/pill/tag file names).
- **Related:** C12. **Source:** taste-skill eyebrow restraint, section-number eyebrows, version labels, pills over images, status dots; imagegen-frontend-mobile "too many pills".

## Copy and data

### T13 The Em Dash
- **Tell:** any em dash (U+2014) or en dash (U+2013) in a visible string, mock data, JSX literal or comment, in any locale. Also " -- " used as a dash, and ranges built with Intl `formatRange`, which prints U+2013 at runtime where no file grep can see it. BINARY: one hit fails the pre-flight.
- **Why it hurts:** it is the most recognizable generated-text tic, and it does not belong to the app's own voice in any locale.
- **Native fix:** period, comma, colon, parentheses or two strings. Ranges are i18n strings ("{{from}} to {{to}}" / "de {{from}} a {{to}}"), never `formatRange` (it prints U+2013 and may be missing in Hermes). A hyphen only inside compound words and single-value formatter output (dates, times).
- **Detect:** review-each, zero hits required (grep T13 across every file under the source root, comments included).
- **Related:** none. **Source:** taste-skill em-dash ban.

### T14 The Marketing Voice
- **Tell:** landing-page voice inside an app: filler (elevate, seamless, unleash, unlock, supercharge, effortless, next-gen, revolutionize, empower, journey, dive in, delve, tapestry, "in the world of", "smarter than ever", "transform your day"), performative labels ("Field notes", "Quietly trusted by"), "Welcome to X!" as content, exclamation marks, Oops/Whoops/Yay/Awesome, "successfully", Title Case buttons, headers and tabs, web idioms (click, hover, scroll down, "learn more ->", read more, underlined links), straight quotes and three dots where the typographic characters belong, or mixed registers in one language.
- **Why it hurts:** the user is mid-task, not being sold to. Hype words carry no information, and web idioms describe an input the phone does not have.
- **Native fix:** say what happens with a plain verb and the domain's nouns, active voice, second person, sentence case, zero exclamation marks (one allowed in a rare-tier celebration). Use "Tap" only when needed. A link is accent text without underline, or a row. Curly quotes and apostrophes, the single ellipsis character. One register per language, from the bible (bindings §2). Full rules: states-and-copy.md.
- **Detect:** review-each (grep T14, plus the per-language list in bindings §0) + advisory (Title Case values, where proper nouns are false positives; straight quotes and three dots).
- **Related:** T1. **Source:** taste-skill filler verbs and punctuation (4.10, 9.F); redesign-skill (no Oops, sentence case, active voice, banned phrases); imagegen-frontend-mobile copy cliches.

### T15 The Developer Voice
- **Tell:** UI copy that describes the implementation or is a placeholder: "This starter ships with...", "Item 1", "Opens a detail screen with no data", "Pushed over the tabs", "Mocked", "No data", "Test". Raw error.message, exception or server text on screen. Numbers and plurals assembled by hand: `${count} members`, "1 members", toFixed(2) money, toLocaleDateString() without the app locale.
- **Why it hurts:** the user learns how the app was built instead of what to do, and raw server text is unreadable, untranslated and sometimes leaks internals.
- **Native fix:** write for the user's task. Demo content is replaced, or labeled as sample in the UI. Server errors map to translation keys by error kind in the data layer. Counts use i18n plurals (_one/_other), dates and numbers the app's locale-aware formatters, money Intl currency, and aligned or updating numbers tabular figures (C13).
- **Detect:** review-each (grep T15, plus the per-app jargon pattern from bindings §0).
- **Related:** T19, C13. **Source:** redesign-skill "no Lorem"; taste-skill Copy Self-Audit and tabular numbers; new-native (i18n).

### T16 Jane Doe Data
- **Tell:** mock, seed or i18n data with stock identities and fake precision: John/Jane Doe, Acme, Nexus, SmartFlow, NovaCore, Flowbit, Quantix, VeloPay, Lorem, user@example.com, the same placeholder avatar (person.circle) or initials color for everyone, every name the same length, every date the same day or "today", 99.9%, 1,234, 4.8 stars on everything, every list exactly 5 items.
- **Why it hurts:** perfect data hides the layouts that break on real data (long names, 0 and 1, missing images), and stock names make a demo look generated.
- **Native fix:** plausible, varied, locale-realistic fixtures: names of different lengths and cultures (one long compound name that wraps), an empty description, 0 and 1 counts, a missing image, imperfect numbers, dates spread over past and future weeks with one far in the past. Initials avatars with distinct initials and a deterministic tint. Mocks live in the mock seam and are labeled in code (bindings §8).
- **Detect:** review-each (grep T16; addresses that document a test path of the mock seam pass) + advisory (one placeholder symbol for every person).
- **Related:** C13. **Source:** taste-skill Jane Doe effect and generic avatars (9.D); redesign-skill "randomize dates"; imagegen-frontend-mobile fake brands.

## Actions and states

### T17 Duplicate Intent
- **Tell:** two visible controls with the same intent: a header "+", a "New event" button and an empty-state "Add your first event" at once; a card CTA and a row to the same place; a button or an equal grid of icon quick-action tiles that repeats visible tabs or drawer items; "Join" next to "Become a member"; a Clear button in a no-results state next to the native header search bar, whose own clear/cancel already clears the query. Screen-level actions (Add, Edit, Share, Filter, Invite) as full-width buttons inside the content. CTAs over 3 words, wrapping in the longest locale, or naming the mechanism ("Submit", "Continue to next step").
- **Why it hurts:** the user has to work out whether two controls differ. Duplicates push content down, and a wrapped CTA reads as two actions.
- **Native fix:** one control per intent per screen; hide the header create while the empty-state action shows. With native header search, the search bar's own clear/cancel is the clear action: the no-results state offers a different recovery (broaden the terms, check the spelling), and a Clear filters button exists only for non-search filters. The tab bar is the shortcut grid: delete tiles that repeat it. Screen-level actions go in a header item or menu (if the app has no cross-platform menu primitive, see bindings §6 first), item-level actions inline (a section-scoped action as a row at the end of its group). One primary (C2). CTA = verb + object, at most 3 words, one line in the longest locale, one verb per intent app-wide.
- **Detect:** advisory (grep T17: files with 2+ buttons, then check each variant; bindings §0 says which variant is the filled default) + review of action labels in i18n for synonyms + screenshot (S): the longest locale at default text size.
- **Related:** C2, C17. **Source:** taste-skill no duplicate CTA intent, CTA wrap ban, hub tiles (9.C); imagegen-frontend-mobile navigation intent.

### T18 The Dead-End Empty
- **Tell:** an empty state that is only a muted centered line ("No items yet", "Nothing here yet", "No data"), with no reason, no action, and the same copy for first-run, no-results and nothing now. (#19 covers the empty state flashing during load; this tell covers the content of a real empty state.)
- **Why it hurts:** the first thing a new user sees is a dead end with no way forward.
- **Native fix:** three kinds. First-run: muted symbol + title of at most 6 words saying what goes here + 1 sentence on how it gets populated + the create action when the user can create. No-results: echo the query + a recovery sentence (the header search bar's own clear is the clear action; Clear filters only for non-search filters, T17). Nothing now (cleared, caught up, or nothing current or scheduled): one plain line stating the fact, optionally when content returns, no create action. No emoji (#3), no giant illustration on frequent screens. Anatomy: states-and-copy.md.
- **Detect:** review-each (grep T18, English and the Spanish pattern from bindings §0) + check that the empty-state component has an action slot.
- **Related:** #19, #3. **Source:** taste-skill composed empty states.

### T19 The Shrug Error
- **Tell:** every failure reads "Something went wrong" + Retry, full screen, replacing content the user could still read. Or the raw server text is shown. Or validation errors appear in a banner instead of on the field.
- **Why it hurts:** the user cannot tell whether to retry, fix input or give up, and loses content that was still valid.
- **Native fix:** name what failed and the one next step ("Could not load members. Check your connection." + Retry). Keep stale content and show the error inline at its scope. Field errors stay on the field (the forms skill, bindings §10). Full-screen only when nothing can render.
- **Detect:** review-each (grep T19, English and the Spanish pattern from bindings §0, plus the error.message line in T15).
- **Related:** #10 (validation alerts), T15. **Source:** taste-skill inline errors; redesign-skill error copy.

### T20 The Applause Toast
- **Tell:** a toast, snackbar or banner announcing a success the UI already shows ("Saved successfully", "Member added"), a toast carrying an error that needs action, or stacked toasts. (#10 covers alerts.)
- **Why it hurts:** it repeats what the user just watched happen, covers content, and an actionable error vanishes before it can be acted on.
- **Native fix:** the UI change is the confirmation (the row appears, the value updates, the sheet dismisses). A transient message only to offer Undo or report an off-screen result. Where no snackbar component exists, Undo needs a design decision first (bindings §6). Actionable errors go inline.
- **Detect:** review-each (grep T20; "successfully" is caught by T14).
- **Related:** #10. **Source:** taste-skill "toasts only transient"; redesign-skill "no exclamation in success".

## Grep block

Run in bash (zsh does not word-split `$COMPONENTS`) with a UTF-8 locale, from the repo root, after pasting bindings §0. Plain `grep -rEn --include` and `find`, no ripgrep and no xargs, like audit.md. Variables read from bindings §0: `SRC THEME SCREENS COMPONENTS TABS_LAYOUT BRAND`; `I18N_GLOB` (a `find -path` glob); the EREs `ACCENT_RE WHISPER_RE TITLE_TEXT_RE BUTTON_TAG EXTRA_BANNED_RE DEV_COPY_RE HERO_RE_ES EMPTY_RE_ES ERROR_RE_ES`; the path EREs `CHROME_RE UPPERCASE_ALLOW_RE WHISPER_ALLOW_RE` (unset means nothing is excluded). To scope to touched files, point `SRC`, `SCREENS` and `COMPONENTS` at them.

```bash
[ -n "$I18N_GLOB" ] || { echo 'paste bindings §0 first' >&2; return 1 2>/dev/null || exit 1; }
src_grep()  { grep -rEn --include='*.ts' --include='*.tsx' "$@"; }        # src_grep [-i] ERE DIR...
i18n_grep() { find $SRC -path "$I18N_GLOB" -exec grep -EnH "$@" {} +; }   # i18n_grep [-i] ERE
drop()      { grep -vE "${1:-^$}"; }                                     # drop lines whose path matches an ERE
V=':\s*"[^"]*'                                                           # anchors a pattern to an i18n value

# T1 (the Auth archetype's one-line greeting is exempt)
i18n_grep -i "$V(welcome( to|,| back)|get started|discover)"
[ -n "$HERO_RE_ES" ] && i18n_grep -i "$HERO_RE_ES"
# T2 (advisory: file names)
find $SRC -type f -name '*.tsx' | grep -Ei '(^|[/-])(stats?|kpi|metric|chart|sparkline|widget|gauge|ring)[-./]'
# T3 (skip Empty, Result, Onboarding and auth brand-mark files)
src_grep "align=\"center\"|textAlign: *'center'" $SCREENS $COMPONENTS
# T4 (advisory; misses a header title repeated by a child component)
grep -rlE --include='*.tsx' 'title:' $SCREENS | while read -r f; do grep -nHE "$TITLE_TEXT_RE" "$f"; done
# T5 (files that frame with a border AND a shadow)
grep -rlE --include='*.ts' --include='*.tsx' 'borderWidth' $SRC | while read -r f; do grep -lE '[sS]hadows?\.|boxShadow|elevation' "$f"; done
# T6
src_grep "\?\? *['\"](-|N/A|n/a|Not provided|Unknown)['\"]" $SRC
i18n_grep -i ':\s*"(-|n/a|not provided|unknown)"'
# T7 (advisory: radius inventory, one value per role expected)
src_grep -o 'borderRadius: *[^,}]+' $SCREENS $COMPONENTS | drop "$CHROME_RE" | sed 's/^[^:]*:[0-9]*://' | sort | uniq -c | sort -rn
# T8 (LinearGradient and experimental_backgroundImage belong to the #4 grep)
src_grep 'BlurView|MaskedView|textShadow|margin(Left|Start): *-' $SRC
src_grep "['\"](sparkles|wand[.a-z]*|rocket[._a-z]*|crown[.a-z]*|trophy[.a-z]*|flame[.a-z]*|bolt[.a-z]*|auto_awesome|workspace_premium|emoji_events)['\"]" $SRC
src_grep 'boxShadow' $SRC | drop "^$THEME/"
# T9 (advisory: files with more than 3 accent uses)
grep -rcE --include='*.tsx' "$ACCENT_RE" $SCREENS $COMPONENTS | awk -F: '$2>3'
# T10 (with a declared brand, hits inside the theme pass)
T10_SKIP='^$'; [ "$BRAND" = declared ] && T10_SKIP="^$THEME/"
src_grep -i '#(6366f1|4f46e5|7c3aed|8b5cf6|3b82f6|2563eb|e5e7eb|f3f4f6|d1d5db|9ca3af|6b7280|374151|111827|f5f1ea|faf7f1|b08947|b6553a|9a2436)\b' $SRC | drop "$T10_SKIP"
# T11 (advisory: a key value or a sentence? then it fires)
grep -rEn --include='*.tsx' "$WHISPER_RE" $SRC | drop "$WHISPER_ALLOW_RE"
# T12
src_grep "toUpperCase\(\)|textTransform: *'uppercase'|letterSpacing" $SRC | drop "$UPPERCASE_ALLOW_RE"
i18n_grep -i ':\s*"(new|beta|pro|hot)"|:\s*"(step|paso) [0-9]|:\s*"0[0-9] |v[0-9]+\.[0-9]'
find $SRC -type f -name '*.tsx' | grep -Ei '(badge|chip|pill|tag)'                 # advisory
# T13 (binary: zero hits, comments included)
DASH=$(printf '\342\200\224|\342\200\223')
grep -rEn "$DASH" $SRC
i18n_grep ' -- '
src_grep 'formatRange' $SRC
# T14
i18n_grep -i "$V\b(elevate|seamless|unleash|unlock|supercharge|effortless|next[- ]gen|revolutioni[sz]e|empower|game[- ]chang|cutting[- ]edge|journey|dive in|delve|tapestry|in the world of|smarter than ever|transform your|field notes|quietly trusted|oops|whoops|yay|awesome|successfully|click|hover|scroll down|learn more|read more)\b"
i18n_grep "$V(!|->|→)"
[ -n "$EXTRA_BANNED_RE" ] && i18n_grep -i "$V($EXTRA_BANNED_RE)"
src_grep "textDecorationLine: *'underline'" $SRC
i18n_grep ':\s*"([A-Z][a-z]+ )+[A-Z][a-z]+"'                                      # advisory: Title Case
i18n_grep "$V(\\\\\"|\\.\\.\\.|[A-Za-z]'[A-Za-z])"                                # advisory: straight quotes, three dots
# T15
i18n_grep -i "$V(lorem|ipsum|starter|template|mock|placeholder|\btest\b|no data|item \{\{)"
[ -n "$DEV_COPY_RE" ] && i18n_grep -i "$V($DEV_COPY_RE)"                          # navigation and implementation jargon (bindings §0)
src_grep 'error\.message|err\.message|String\(error' $SCREENS $COMPONENTS
src_grep 'toFixed\(|toLocale(Date|Time)?String\(\)|\$\{[^}]*(count|total|length)[^}]*\} [a-z]' $SRC
# T16
grep -rEin --include='*.ts' --include='*.tsx' --include='*.json' 'john doe|jane (doe|smith)|acme|nexus|smartflow|flowbit|quantix|novacore|velopay|@example\.com|test@test|99\.9|1,?234' $SRC
src_grep 'person\.circle|account_circle' $SRC                                    # advisory
# T17 (advisory: then check each hit's variant)
grep -rcE --include='*.tsx' "$BUTTON_TAG" $SCREENS $COMPONENTS | awk -F: '$2>1'
# T18
i18n_grep -i ':\s*"(no [a-z]+( yet)?|nothing (here|to show)( yet)?|no results|no data)"'
[ -n "$EMPTY_RE_ES" ] && i18n_grep -i "$EMPTY_RE_ES"
# T19 (plus the error.message line in T15)
i18n_grep -i "$V(something went wrong|an error (has )?occurred|unknown error|try again later)"
[ -n "$ERROR_RE_ES" ] && i18n_grep -i "$ERROR_RE_ES"
# T20
src_grep -i 'toast|snackbar|showMessage' $SRC
# C17 nav shape: expect 3-5
grep -c 'Trigger name=' "$TABS_LAYOUT"
```

## Not here

Concerns another entry owns. Report them under the owner, never as a T tell.

| Concern | Owner | What the T list adds |
| --- | --- | --- |
| Custom centered dialog for picking or composing | #1 | none |
| Sheet closed only by an X | #2 (in SDK 57 a formSheet route renders no native header, so sheet actions are content: archetypes.md Sheet) | none |
| Emoji as icons | #3 | T8: metaphor symbols |
| Gradient hero, LinearGradient | #4 | T1: the marketing stack without a gradient |
| Custom tab bar | #5 | C17: tab count and nouns |
| Downloaded font | #6 | T11: how the ramp is used |
| Cards for every row | #7 | T5: stacked devices; C11: rows over cards |
| Heavy shadow | #8 | T5 |
| 1px borders on every container | #9 | T5, T6 |
| Alerts for success or validation | #10 | T20: toasts; T19: inline errors |
| Hand-rolled header | #11 | T4: the repeated title |
| Equal gaps everywhere | #12 | C4: the tempo per D band |
| Scale press feedback | #13 | the press pattern in bindings §2 |
| Entrance animation on routine screens | #14 | Step 8 motion handoff |
| Onboarding carousel | #15 | T1: a promo carousel on a tab root |
| One platform in the other's uniform | #16 | T7: drift inside one app; T1 and T4: Android title |
| Content under the notch or home indicator | #17 | none |
| Hardcoded colors, broken dark mode | #18 | T10: stock hexes; C16 |
| Spinner blink, false empty during load | #19 | T18: the content of a real empty state |
| Keyboard covering input | #20 | the forms skill (bindings §10) |
| Hand-built switch, picker or segmented control | expo-design-system 'When to extract - and when not to' (do not wrap platform components) | T8: toggles that do nothing |
| Hover, cursor | expo-animation step 7 | T14: web words in copy |
| Raw hex, fontSize, spacing, radius literals | audit.md section 1 | T7: radius by role |
| Touch target sizes | expo-design-system references/audit.md section 3 | none |
| Durations, springs, haptics | expo-animation | none |

## Growing the list

- The list stays at 20, mirroring native-slop "Growing the list": recognition degrades with length.
- A new tell replaces a weaker one only after the same failure repeats across sessions and cannot be folded into an existing entry. Fold first.
- A replacement keeps the retired ID and family. SKILL.md's index, preflight.md and the grep block above change in the same edit.
- A tell that restates a # entry is not added; extend the "Not here" table instead.
- After editing SKILL.md frontmatter, from the skill folder: `python3 -c "import yaml;d=yaml.safe_load(open('SKILL.md').read().split('---')[1]);assert len(d['description'])<=1024"`.
- Every entry ships with a native fix and a Detect class. A grep joins the block only when it is review-each or advisory, never as an auto-fail, except T13.
