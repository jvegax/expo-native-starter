# Repo bindings: this app

The ONLY repo-specific file in expo-taste-skill. To port the skill, replace this file with a filled copy of `repo-bindings.template.md` and nothing else. Where it disagrees with SKILL.md, another reference or a sibling skill, this file wins (it mirrors AGENTS.md "Design & motion"). Never write the product's brand name here: say "this app". Verified against commit 7cd6f67 (Expo SDK 57, RN 0.86, React Compiler on). Edit it under the rules in maintenance.md section 3: no new line numbers, and any section you touch drops its old ones for symbols.

## 0. Grep variables

Paste before the tells.md block, audit.md and native-slop.md. Run in **bash** (`bash -c '...'` or a script): zsh does not word-split unquoted `$COMPONENTS` or `$I18N_FILES`. Patterns with `¡`, accents or dashes need a UTF-8 locale.

```bash
export LC_ALL=en_US.UTF-8
SRC=src
THEME=src/shared/theme
SCREENS=src/screens
COMPONENTS="src/components src/shared/ui"
I18N_GLOB='*/i18n/*.json'                # find -path glob for tells.md i18n_grep (src/shared/i18n and src/features/*/i18n)
I18N_FILES='src/shared/i18n/*.json src/features/*/i18n/*.json'   # unquoted: bash expands the globs (ad hoc copy greps)
SPACING_WHITELIST='0|4|8|16|24|32|48'     # audit.md override from AGENTS.md
BRAND=none                                # T10 stock-palette branch is ON (§1)
ACCENT_RE='color="primary"|colors\.primary\b'
WHISPER_RE='variant="caption"[^>]*color="textMuted"|color="textMuted"[^>]*variant="caption"'
TITLE_TEXT_RE='variant="title"'
BUTTON_TAG='<Button\b'                    # default variant is primary (the filled one)
TABS_LAYOUT=src/screens/navigation/tabs/app-tabs-layout.tsx
# *_ALLOW_RE and CHROME_RE are PATH EREs for tells.md `drop` (grep --include/--exclude match basenames only)
WHISPER_ALLOW_RE='src/shared/ui/list-(row|section)/|src/components/club/member/member-row/|src/components/club/club/club-card/club-card-header'
UPPERCASE_ALLOW_RE='src/shared/ui/list-section/list-section\.tsx|src/components/account/user/user-summary/'
CHROME_RE='src/screens/navigation/'       # navigator options (sheetCornerRadius: 24) are chrome config
EXTRA_BANNED_RE='sin esfuerzo|siguiente nivel|desbloquea|potencia tu|revoluciona|de nueva generaci|tu viaje|m[aá]gic|\bups\b|\bvaya\b|genial|con [eé]xito|¡'
DEV_COPY_RE='\b(sheet|detents?|tabs?|drawer|stack|grabber|pushed|form sheet|detail screen|pantalla de detalle|with no data|sin datos)\b'   # T15: navigation and implementation jargon in UI copy, both locales
HERO_RE_ES=':[[:space:]]*"(bienvenid[oa]s?|hola de nuevo|empieza|descubre)'   # T1, Spanish
EMPTY_RE_ES=':[[:space:]]*"(a[uú]n no hay|no hay (nada|resultados|datos)|nada (aqu[ií]|que mostrar))'   # T18
ERROR_RE_ES=':[[:space:]]*"[^"]*(algo (ha ido|sali[oó]) mal|error desconocido|ha ocurrido un error|int[eé]ntalo m[aá]s tarde)'   # T19
DASH_RE="$(printf '\342\200\224|\342\200\223')"   # T13: U+2014 | U+2013, built so this file stays clean
MOCK_PREFIX=MOCK_                         # mock constants (§8)
```

Usage:
- The tells.md block reads these through its `src_grep`, `i18n_grep` and `drop` helpers; paste this block first and nothing else is needed. Ad hoc copy greps: `grep -En -i "$RE" $I18N_FILES`, value patterns anchored to `:[[:space:]]*"` so JSON keys never match.
- T13 (binary, all files, comments included): `grep -rEn "$DASH_RE" $SRC` must print nothing.
- `rg` is not available in bash here (only a zsh shell function), so never call it from these blocks. native-slop's #3 emoji grep becomes: `find $SRC -name '*.tsx' -exec perl -CSD -ne 'print "$ARGV:$.:$_" if /[\p{Emoji_Presentation}\x{FE0F}]/; close ARGV if eof' {} +`. audit.md and native-slop.md run with `SRC=src THEME=src/shared/theme` and the whitelist above.

Expected hits on the clean baseline (justify, do not fix): native-slop `headerShown: false` x4 (root gate, drawer group, drawer, sheet: chrome config, not #11); T10 on the stock hex values in `src/shared/theme/tokens/colors.ts` (the placeholder palette, §1: fixed by declaring a brand, never per screen); audit hex grep on `#1077` in `src/providers/keyboard-provider.android.tsx` (an issue number in a comment); T16 `@example.com` in `src/features/auth/utils/session/mock-auth.ts` (mock seam triggers, never shown); T3 in not-found, AsyncState and auth error lines; T17 count 2 in sign-in/sign-up (primary + ghost link, sanctioned); T8 `boxShadow` in a comment at `club-card.styles.ts:16`; T16 advisory `account_circle` in `app-tabs-layout.tsx:55` (Profile tab icon) and `settings-screen.tsx:17` (Account row icon), not person placeholders; T17 count 2 in `item-detail-screen.tsx` (primary next item + secondary open sheet, distinct intents, demo screen); T3 at `item-detail-screen.tsx:29` (the §9 centered placeholder). Everything else is in §9.

## 1. Brand status: NONE (starter placeholder)

- Palette in `src/shared/theme/tokens/colors.ts`: stock Tailwind cool grays (gray50-gray900) + a blue accent (blue100-blue900), red500, green500. Roles in `src/shared/theme/themes.ts`, typed by `ThemeColors` in `src/shared/theme/theme.types.ts`. It is the starter's placeholder, not a brand: several values are T10's named stock hex (`#E5E7EB`, `#6B7280`, `#111827`).
- **T10's stock-palette branch is ON.** The theme itself is the expected §0 hit; screens still use only theme roles, never a new hex. The first app built from this starter declares its brand before its first real screen (design-bible.md 'Greenfield procedure': palette, accent for the category and audience, gray temperature, type), writes it into `tokens/colors.ts` + `themes.ts` with AA steps (§9 palette debt), rewrites this section as DECLARED and sets `BRAND=declared` in §0. Until then: one gray temperature (cool), the same blue accent on every screen.
- Type: the platform system font (SF Pro on iOS, Roboto on Android). `tokens/typography.ts` sets sizes, line heights and weights only, no `fontFamily` anywhere, so #6 does not fire. A brand family, when declared, is embedded with the expo-font config plugin in `app.config.ts` and set once in `textVariants` (plus `navigation-theme.ts` fonts, the Android tab label and `text-field.styles.ts`); never a second family, mono or serif.
- Never create `src/theme/`, a theme barrel, `ThemedText`, or a `Color`/`PlatformColor` palette. A missing value goes into `src/shared/theme/tokens/*` (colors also into `ThemeColors` and both themes).

## 2. Design bible (filled)

- **Product / audience:** the starter's demo domain (replace this field when a real product is built): sports clubs and their members (club list, club detail, members, profile, settings, auth). Club admins and coaches plus members of mixed ages, often one-handed and outdoors, glancing between activities.
- **Category:** Sports and clubs (design-read.md category table): members at branded 4/2/5; admin, rosters and fixtures at performance 3/2/7, per screen as §4 lists. A screen members and admins both use reads for its most frequent audience (members, unless the screen is an admin tool); the other is named in the read only if it changes the primary action.
- **App-wide quiet constraints:** outdoor or glanceable. Key values (scores, times, next fixture, membership status) use `text` (17.7:1 light, 14.1:1 dark on `surface`: passes 7:1), never `textMuted` (4.8:1 light: fails 7:1; 10.0:1 dark), one step above their default (caption -> label, label -> body). No dial cap. Write "capped by outdoor" only when it changes a value.
- **Locales:** `en`, `es`; longest `es` (§8).
- **Platform mode: deliberate neutral.** Chrome native per platform: native stack headers, NativeTabs, expo-router drawer, `formSheet` routes, native `Alert` for destructive confirmation. Shared content language: system type, the blue accent, `radii.lg` groups and cards. Per-platform affordances:
  - Large title on section roots (tab and drawer stack roots) is iOS only (`headerLargeTitleEnabled`); a pushed screen (a Collection such as a club's events list, a Detail) uses the standard title; Android shows its top app bar title on every screen (#16).
  - Trailing chevron on navigating rows: iOS only. ListRow today shows it on EVERY pressable row (`onPress && !isAndroid`, `list-row.tsx` line 46), navigating or not, so an action row (sign out) gets a dead chevron (T8) until the §6 accessory option exists.
  - **Create = header-right item on both platforms.** No FAB component; adding one means writing it in §7 first, Android list roots only.
  - **Edit** (own profile, any edit flow) = header-right item: iOS a text item "Edit", Android a pencil icon action (`<Icon ios="pencil" android="edit">`) with an `accessibilityLabel`, modeled on `header-menu-button.tsx`; it opens a `presentation: 'modal'` route with Cancel/Save in its header. Only when an edit flow exists; none does yet.
  - Section headers uppercase on both platforms (a ListSection choice, not a platform rule). The ListSection title is a muted caption, so it may carry a group header that only navigates (a day on a fixtures list, a letter) when every row carries its own key value (the time in the row, label step, `text` color, tabular figures; composition.md C14). If the header itself is the key value (the date is what the member reads to decide), put the date in the rows or record header emphasis as a §6 gap; never restyle the ListSection title inline.
  - Menus: header menu = expo-router `Stack.Toolbar placement="right"` + `Stack.Toolbar.Menu` / `MenuAction` (alpha in SDK 57, iOS and Android; some props iOS-only; Android renders through `@expo/ui` jetpack-compose, a transitive dependency of expo-router). Not used yet: verify on a dev build on both platforms before first use (§6). `Link.Menu` row context menus are iOS only.
- **Palette roles** (light / dark), as `theme.colors.*`, never `palette.*` in components:
  - `background` gray50 / gray900: canvas. `surface` white / gray800: groups, cards, fields. `surfaceMuted` gray100 / gray700: pressed rows and cards, pressed secondary and ghost buttons, skeleton blocks, image placeholders.
  - `text`, `textMuted`: the only text colors. Icons default to `text`, secondary icons `textMuted`.
  - `primary` blue600 / blue400 = THE accent, at most 3 content roles (C6): primary Button fill, selection/active, one highlight. A ghost Button label counts as the highlight. Chrome tint is exempt: back button and header items (navigation theme `primary`), NativeTabs `tintColor`, Android selected tab icon. `primary` on `surface` is 5.2:1 light and 5.8:1 dark, on `background` 5.0:1 and 7.0:1, so a ghost Button may sit on either.
  - `primaryPressed`: iOS pressed fill of primary. `onPrimary`: content on primary only. `primaryContainer` blue100 / blue900: selected background, the one badge, initials avatars, the V3+ empty-state symbol circle, the V5+ focal module. Text on it is `text` (`primary` on it is only 4.2:1 light, 4.1:1 dark). It is a fill role of its own (design-bible.md field 3 'Accent container') and does not count toward C6's 3 accent roles.
  - `border` gray200 / gray700: hairlines, ListSection separators, the secondary Button outline and today's TextField outline. It is 1.24:1 on white and 1.42:1 on gray800, so it never carries a meaningful boundary alone (C15, §6 `inputBorder`).
  - `danger`: destructive and errors only. `success`: confirmed outcomes only. Both are below 4.5:1 as text today (§9 palette debt). `ripple`: Android press only.
  - Missing: `scrim` (text over photos), add to `ThemeColors` + both themes before first use (proposal `rgba(0,0,0,0.45)`).
- **Chrome color lives in the navigation files only:** `src/shared/theme/navigation-theme.ts` (headers, drawer, screen background), `src/screens/navigation/tabs/app-tabs-layout.tsx` (`tintColor` + `androidTabBarStyle`: surface bar, `primaryContainer` indicator, `primary` selected icon and label), `src/screens/navigation/drawer/app-drawer-content.tsx` (sign-out item in `danger`, `ripple` press color) and the header item components in `src/screens/navigation/section/` (`header-menu-button.tsx`: icon in `text`, borderless `ripple`). Never set header or tab colors per screen.
- **Type ramp** (`<Text variant color align>`, `src/shared/ui/text/text.tsx`): title 28/34 700 (the identity-name step: identity-block name only, never repeating the header); subtitle 20/26 600 (the block-heading step: block headings, sheet titles); body 16/22 400 (every sentence); label 14/20 500 (buttons, field labels, trailing values); caption 12/16 400 (1-line metadata). Screen titles live in the native header. No `display` step: a V5+ hero number needs `display` in `textVariants` first (proposal 34/40 700). **Weight comes only from the variant:** `<Text>` has no weight prop, and the five variants fix the weights (title 700, subtitle 600, body 400, label 500, caption 400). Emphasis by weight therefore means choosing a variant: a key value or a row title that needs weight takes `label` (500) or `subtitle` (600), and a body-size medium or semibold does not exist. An inline `fontWeight` is an audit.md section 1 hit; adding a weight prop or a body-size weight variant is a component gap (§6). No letterSpacing tokens; never track inline. Tabular figures: `style={{ fontVariant: ['tabular-nums'] }}` on scores, times, column counts and money. The system fonts (SF Pro, Roboto) both carry tabular figures. A declared brand family must be checked for tnum on device; if it lacks them, right-align numeric columns and record a token decision. Never add a second font.
- **Spacing tempo** (`theme.spacing`: none 0, xs 4, sm 8, md 16, lg 24, xl 32, xxl 48; screen edge `md` via `padded`; ScrollScreen and FormScrollScreen gap blocks by `lg`):

  | D band | inline | row-internal | group padding | section gap |
  | --- | --- | --- | --- | --- |
  | 1-3 | xs | sm | lg | xl (xxl on Hub) |
  | 4-6 | xs | xs-sm | md | lg between consecutive ListSections, xl between unrelated blocks (ScrollScreen gives lg only: §6 'Block gap xl') |
  | 7-8 | xs | xs | sm-md | md-lg |

  12 exists only as `sm + xs` (Button md padding, MemberRow).
- **Radius** (`theme.radii`): sm 4 badges, small thumbnails, chips; md 8 Button, TextField; lg 16 ListSection groups, ClubCard, media frames; full avatars and capsules. Inside an lg container with md padding, children use 0 or sm. Nothing between md and lg, nothing above lg except full. Exempt: `sheetCornerRadius: 24` (chrome config).
- **Elevation** (`theme.shadows`, boxShadow): `sm` only on a pressable entity card on the canvas; `md` only on overlays floating above content. Grouped rows never have a shadow. Dark mode: elevation is the surface step. One separation device per container (C7). **The grouped list counts as ONE device**: ListSection = surface rows + hairline gaps over `border` + hairline outline + `radii.lg`.
- **Sizes** (`theme.sizes`): iconSm 16 (inline, chevrons), iconMd 24 (leading row icons, default), avatarSm 32, avatarMd 48, avatarLg 72 (identity blocks, Profile), touchTarget 44 (the iOS minimum; Android needs 48dp: hitSlop or a platform token), listRow 60 (ListRow minHeight). Missing: iconLg 48 for empty-state symbols (add on first use).
- **Icons**: `<Icon ios android size color>` (`src/shared/ui/icon/icon.tsx`, expo-symbols: SF Symbols / Material Symbols), always decorative (hidden from accessibility); the control carries the label. Filled SF variant only for selected states (as the tab icons do). No icon font, emoji or SVG.
- **Imagery**: `<Image>` (`src/shared/ui/image/image.tsx`, expo-image) with a fixed `aspectRatio` or a sizes token, `placeholder`, `surfaceMuted` background, `recyclingKey={item.id}` in lists, `accessibilityLabel` when meaningful. Avatar 1:1, club cover 16:9, crest 1:1. The Club and Member models have no image fields today: list crest and cover under "Assets needed", never fake them. Initials fallback as in UserSummary. Scrim: the solid `scrim` token by default; `experimental_backgroundImage` linear-gradient (RN 0.86, New Architecture, no dependency) only after checking both platforms and themes. Or put text below the image.
- **Nav model**: root Stack auth gate (`root-navigator.tsx`) > App Stack (`app-stack-layout.tsx`: `details/[id]` push over tabs, `sheet`) > Drawer (`(tabs)`, `settings`) > NativeTabs `(home)`, `clubs`, `profile` (3 of max 5), each a SectionStackLayout (`section-stack-layout.tsx`) with a large title (iOS) and the HeaderMenuButton on its root. In-tab push: `/clubs/[clubId]`. Auth stack: large titles on sign-in and sign-up (iOS).
- **Sheets**: one `formSheet` route, `sheet` in `app-stack-layout.tsx`: `headerShown: false`, `sheetAllowedDetents: [0.4, 1]`, `sheetGrabberVisible: true` (iOS only), `sheetCornerRadius: 24`. On Android a formSheet renders no native header, title or header buttons and supports no nested navigator (Expo Router modals, 'Android limitations'), so every sheet is designed without them on both platforms: title and actions are content, a subtitle-step title at the top, one primary at the end or a trailing Done text button. Swipe-down is cancel (#2). Short fixed content: `'fitToContents'` (no `flex: 1` inside). Android: at most 3 detents. An edit flow that needs Cancel/Save in a header uses `presentation: 'modal'`.
- **Card vs row**: grouped rows by default. `ClubCard` (`src/components/club/club/club-card/`) is the one sanctioned entity card (identity + 2-line description). **Recorded exemption:** the club list may render one ClubCard per club at D<=6; at D>=7, or for items without a description, it is rows. The exemption stands despite no identity media (composition.md C11 asks for identity media and a description): it holds until club crests exist, and without them the club list may also be rows. Everything else is rows.
- **Buttons** (`<Button label variant size loading>`, `src/shared/ui/button/button.tsx`; every variant has a 1px border, transparent unless secondary):
  - `primary` (default): `primary` fill, `onPrimary` label, pressed `primaryPressed`. One per screen.
  - `secondary`: `surface` fill + 1px `border` outline, `text` label, pressed `surfaceMuted`. Alternatives and sign out. Fill + outline is one device (the fill barely differs from the canvas); the label identifies it, so the outline is not a C15 boundary.
  - `ghost`: transparent, `primary` label, pressed `surfaceMuted`. Tertiary actions and inline links (counts as the C6 highlight).
  - `size="md"` is about 46pt: it passes on iOS and is 2dp short on Android. `size="sm"` is about **30pt** (4 + 20 + 4 + 2px border): below the minimum in expo-design-system references/audit.md section 3 (44pt iOS, 48dp Android). Every sm Button gets `hitSlop` to reach the target until sm gets a `minHeight` at the platform minimum (§6).
  - No icon slot, no destructive variant. Destructive actions go through native `Alert` (pattern: `useConfirmSignOut`, `src/features/auth/hooks/session/use-confirm-sign-out.ts`; policy #10). Icon-only actions go in `<Stack.Screen options={{ headerRight }}>` modeled on `src/screens/navigation/section/header-menu-button.tsx` (44pt box, `accessibilityLabel`).
- **Press feedback** (AGENTS.md override of expo-animation step 7): only when `onPress` exists, never scale (#13).
  - Rows, cards, buttons: Android `android_ripple={{ color: theme.colors.ripple, foreground: true }}` + a static style (`overflow: 'hidden'` on Android to clip it to the radius); iOS a `pressed` style (rows and cards `surfaceMuted`, primary `primaryPressed`, secondary and ghost `surfaceMuted`).
  - Header icon buttons: Android `android_ripple={{ color: theme.colors.ripple, borderless: true }}`; iOS opacity 0.5 while pressed (`header-menu-button.styles.ts`).
- **Copy register**: English: second person, sentence case, plain, no "please", the app never says "we". Spanish: informal tú throughout ("Revisa tu conexión", "Arrástralo", "¿No tienes cuenta?"), sentence case, no exclamation marks (so no `¡`), no gendered greetings ("Bienvenido"), no English UI jargon (sheet, tabs, mock, detents; grep `DEV_COPY_RE`, §0). Spanish runs about 25-30% longer: check every CTA in `es`. Curly apostrophes and quotes in values, the same curly double quotes (“ ”) in `es` as in `en` (§8); `…` for an in-progress verb ("Loading…"). Ranges are i18n strings (`{{from}} to {{to}}` / `de {{from}} a {{to}}`), never Intl `formatRange` (prints U+2013, may be missing in Hermes). Extra banned phrases: `EXTRA_BANNED_RE` (§0).
- **Signature component (TARGET, not today):** the club identity block = crest, or an initials avatar on `primaryContainer`, + name (identity-name step, `title`) + member count. Today `ClubCardHeader` is only a subtitle name + caption count. Build the block when Club Detail is redone; extract it to a shared place on its second use.

## 3. Archetype -> container and components

| Archetype | Build with | Reference |
| --- | --- | --- |
| Hub | `<ScrollScreen>` + `<Stack.Screen options={{ title }}>` + one focal block in `src/components/<d>/` + `<ListSection>`/`<ListRow>` | `src/screens/home/home/home-screen.tsx` (demo, §9) |
| Collection | `<Screen edges={['left', 'right']}>` (default `padded` for card lists; `padded={false}` for edge-to-edge rows) + `<AsyncState>` + `<List>` (`keyExtractor`, `estimatedItemSize`, `contentContainerStyle` gap, pull-to-refresh with a local `isPullRefreshing`, prefetch on `onPressIn`) + `headerLargeTitleEnabled` (iOS); header search when the collection can exceed 20 items: expo-router `<Stack.SearchBar>` (or `headerSearchBarOptions` on the screen's `Stack.Screen`), native on iOS and Android, no scope-bar prop in SDK 57; not used yet, so the header-search check is OPEN: verify on both platforms in a dev build, then record it in §6. Until it passes, ship the Collection without search and list search as pending in the answer | `src/screens/club/club/club-list-screen.tsx` |
| Detail | TARGET: `<ScrollScreen>` + identity block + `<ListSection>` facts + capped related `<ListRow>`s + "See all N" row; `placeholderData` from the list query | none: `club-detail-screen.tsx` is debt (§9) |
| Task/Form, Auth | `<FormScrollScreen>` + `<TextField label error>` + `useUncontrolledForm` + one `<Button>` (forms skill) | `src/screens/auth/session/sign-in-screen.tsx`, `sign-up-screen.tsx` |
| Sheet | the `formSheet` route (§2) with a content title row; `<ScrollScreen>` when content can exceed the smallest detent, a `View` with `'fitToContents'` when short and fixed | `src/screens/home/item/item-sheet-screen.tsx` is a plain `View` (subtitle content title, muted body, secondary Close): shape OK, copy is debt |
| Settings | `<ScrollScreen>` + `<ListSection title>` + `<ListRow>`; RN `Switch` for immediate booleans (expo-design-system 'When to extract - and when not to': do not wrap platform components) | `src/screens/account/settings/settings-screen.tsx` |
| Profile | `<ScrollScreen>` + `<ListSection>`. Identity: today `UserSummary` (`avatarMd`, shared with the drawer); target: a Profile identity block of its own in `src/components/account/` (`Avatar` at `avatarLg`, name at `title`, email as the meta line), while `UserSummary` stays the drawer's compact header (§6 Avatar). Primary: none (no edit flow yet; the §2 Edit item when one exists). Rows today: none beyond Sign out (`User` is only id, name and email, and there is no user-to-club membership); a "My clubs" group arrives with memberships; a Settings row only after the navigation skill decides how a profile-tab row opens a drawer screen (push a shared screen vs jump). Sign out: today a full-width secondary `<Button>` (line 34, recorded exemption until ListRow gets the `danger` tone, §6); target: a `danger` ListRow in its own final `<ListSection>` + `useConfirmSignOut` | `src/screens/account/profile/profile-screen.tsx` |
| Loading/Error/Empty | `<AsyncState isPending isError error isEmpty emptyMessage onRetry>` | club list |
| Overview, Result, Onboarding | none yet: compose from primitives, extract per expo-design-system 'When to extract' into the place the architecture skill names | none |

- C11 here: a capped preview (<=8 items) is mapped `<ListRow>`s inside `<ListSection>`; an unbounded list is the screen's root `<List>`; a `<List>` never sits inside a `<ScrollScreen>` or below other content.
- Shared UI today (`src/shared/ui/`): text, button, icon, image, list, list-row, list-section, async-state, screen, scroll-screen, form-scroll-screen, text-field. Full table: architecture skill "Reuse before writing".
- Copy helpers: `formatDate`, `formatNumber` in `src/shared/utils/format.ts` (pass `i18n.language`); plurals `_one/_other` (example `club.membersCount`).

## 4. Default dials

- Repo default: **branded V4 M2 D5** (platform motion only until expo-haptics exists; standard density).
- Domain screens (rosters, fixtures, standings) get their triple from this table, never from dials.md's vibe inference, which takes style words only.

| Screen | V M D | Preset | Cap or reason |
| --- | --- | --- | --- |
| Tab roots (home, profile) | V4 M2 D5 | branded | frequency cap V<=5; the clubs tab root is the club list (next row) |
| Club list | V3 M2 D6 | native | Collection; ClubCard exemption (§2) |
| Club detail | V5 M2 D4 | branded | Detail default+1; build at V4 until club images and a `display` token exist |
| Member roster, fixtures, standings | V3 M2 D7 | performance | tabular figures on every number |
| Settings | V2 M1 D5 | platform | Settings cap |
| Sign-in, sign-up | V4 M2 D3 | branded, airier | Auth cap V<=4 M<=2; one task per screen; one centered brand mark |
| Item sheet | V3 M2 D5 | native | Sheet cap V<=4 |
| Future fees and payments | V2 M1 D5 | trust | trust-first |
| Future onboarding, celebration | V7 M5 D2 | moment | rare tier only |

- Haptics follow expo-animation step 8 (feedback, not motion) and are not gated by M. They need `bunx expo install expo-haptics` and a new dev build: tell the user first.

## 5. Repo overrides of sibling skills (mirrors AGENTS.md "Design & motion")

- **Tokens:** `src/shared/theme/tokens/*` through `useStyles(createStyles)` / `useTheme()` is the declared system ("Adopt Before You Build"). Use `<Text variant color>`, `<Button>` and the existing `radii`, `spacing`, `shadows` scales. A missing token goes into those files.
- **Sibling skills not installed:** expo-native-ui -> `docs/performance.md` + the architecture skill's native-feel rules; expo-data-fetching (four-state screens) -> `<AsyncState>` + `app-architecture/references/data-layer.md`; expo-project-structure -> the architecture skill. Grouped lists -> `<ListSection>` + `<ListRow>`; icons -> `<Icon>`; sheets -> a `formSheet` route, not `@expo/ui`.
- **Press feedback:** §2 pattern (ripple on Android, `pressed` style on iOS), not expo-animation's scale-on-both-platforms default.
- **Recipes:** keep expo-animation's motion decisions, not its scaffolding. React Compiler: no `useMemo`/`useCallback`/`React.memo`, none around gestures or layout-animation builders. `<List>` instead of `Animated.FlatList`. `<ScrollScreen>` + `headerLargeTitleEnabled` instead of a hand-rolled collapsing header. Keyboard-synced UI goes through the forms skill: react-native-keyboard-controller is Android-only here, never import it from an iOS file.
- **Lint-enforced primitives:** lists `<List>`, images `<Image>`, inputs `<TextField>` + `<FormScrollScreen>`.
- **Corner smoothing:** no override. expo-design-system 'Radius' (`borderCurve: 'continuous'` on every non-capsule radius) applies; the repo does not do it yet (§9).
- **Audit greps:** run with `SRC=src THEME=src/shared/theme` and whitelist `0|4|8|16|24|32|48` (§0).
- **Not installed:** expo-haptics, expo-linear-gradient, expo-blur, react-native-svg, lottie, a segmented control, a date/time picker. `@expo/ui` is not a direct dependency: it ships transitively with expo-router 57 (its native module is already in the dev build). Before importing it, run `bunx expo install @expo/ui`, and never use it for sheets (AGENTS.md). Installed: Reanimated 4, Gesture Handler, expo-image, expo-symbols. Ask before adding anything (`bunx expo install`, new dev build; this app never runs in Expo Go). T8 ornament stays off.
- **Skills hygiene:** do not install other design or taste skills (taste-skill, impeccable, frontend-design). Update the vendored two with `bunx skills update`, never by hand. Never run `submit-expo-feedback` unless the user asks.

## 6. Gaps: what to do when a screen needs a missing piece

| Need | Do |
| --- | --- |
| Composed empty state (T18) | Add an `empty` slot to `AsyncState` (symbol, title, body, optional action label + onPress); a shared empty-state component once 2 screens need it |
| Error mapping (T19) | Stop rendering `HttpError.message` for `http`/`parse` kinds (`async-state.tsx` `errorMessage`, line 24); map kinds and statuses to translation keys in the data layer |
| Skeleton | A shared skeleton of static `surfaceMuted` blocks matching the layout, radius by role, no shimmer at M<=2 (mechanics #19) |
| ListRow trailing slot, destructive tone, compact row | Extend ListRow per expo-design-system 'Composition over configuration': a trailing/accessory slot (value, count, `Switch`), an `accessory: 'chevron' | 'none'` option (or a `navigates` flag) so the iOS chevron shows only on navigating rows, a `danger` tone for the last-section destructive row (title in `danger`, no chevron, no leading icon; `danger` on the iOS pressed `surfaceMuted` is 3.4:1 light and 2.7:1 dark, transient and below 4.5:1, so verify it on device), a compact variant at the touch target (D7-8: title + at most one meta line; D9-10: single-line) (today fixed `minHeight` 60, title + subtitle + icon + onPress only) |
| ListSection footer, header role | Optional `footer` prop (caption, `textMuted`) for Settings explanations and the version line; `accessibilityRole="header"` on the title |
| ListSection header as key value | Only when a group header is itself the key value (§2 section headers): an emphasized title option (label step, `text` color, sentence case) per expo-design-system 'Composition over configuration'; until then the value goes into the rows |
| Emphasis weight | `<Text>` has no weight prop and no body-size medium or semibold variant (§2 type ramp). When a screen needs one: add a variant to `textVariants` (for example 16/22 500) or a `weight` prop on `<Text>`, never an inline `fontWeight` |
| Stale content on error | `AsyncState` blanks children whenever `isError` (§9): show the full-screen error only when there is no data, otherwise render children with an inline error line ("Could not refresh <objects>." + Retry) |
| Button sm target | `hitSlop` on every sm use now; then a `minHeight` at the platform minimum (expo-design-system references/audit.md section 3: 44pt iOS, 48dp Android) on `sm` in `button.styles.ts` |
| Field boundary (C15) | Add an `inputBorder` color reaching 3:1 against `surface` in both themes (around `#8B95A1` light, 3.0:1 on white, and `#6B7280` dark, 3.0:1 on gray800; measure), use it in `text-field.styles.ts`; `border` stays for hairlines |
| Badge | `primaryContainer` bg + label/caption in `text` + `radii.sm`, one per row; colocate until a second domain needs it |
| Avatar | Second use is reached (drawer `UserSummary` + the Profile identity block target). Extract `<Avatar name size>` when the Profile identity block is built, into shared UI because the club identity block (§2 signature) is its second domain (confirm with the architecture skill). Fill: one `primaryContainer` for everyone with initials in `text` (never `surfaceMuted`, which reads as a skeleton or placeholder); T16 "same color for everyone" is accepted on initials avatars until avatar tint tokens of the palette's gray temperature exist in `ThemeColors` and both themes. `avatarLg` in identity blocks, `avatarMd` in `UserSummary`, which adopts `Avatar` in its own commit |
| Block gap xl in ScrollScreen | `ScrollScreen` gaps every block by `lg` and has no gap prop (`scroll-screen.styles.ts` line 12). Fix: a `gap?: 'lg' | 'xl'` prop, or related blocks wrapped in a `View` (gap `lg`) inside a ScrollScreen set to `xl`. Until then the sanctioned workaround is `marginTop: theme.spacing.sm` (lg + sm = xl) on the following block, in its styles file |
| Header icon action | `headerRight` + Pressable + `<Icon>` + label + 44pt box (`header-menu-button.tsx`, borderless ripple) |
| Header search | The Collection row's Stack search bar (§3), when the collection can exceed 20 items; never a search field drawn in content. Check OPEN: verify on both platforms in a dev build, then record "verified" here; until then ship without search and list it as pending |
| Header/overflow menu | `Stack.Toolbar.Menu` (§2; alpha): verify on both platforms in a dev build, then record it here. A menu imported from `@expo/ui` directly needs it as a direct dependency, the user's call. Never a custom popover (#1) |
| Brand mark (Auth) | No logo yet (`assets/` holds only the app icon and splash): add black and white variants under `assets/brand/`, then a small fixed-size `<Image>` picking the variant by theme, in the place the architecture skill names |
| Segmented control, date picker | Check the SDK 57 docs, ask, `bunx expo install`, new dev build |
| Toast/snackbar | Not planned; success shows in place; Undo needs a design decision first |
| Divider | None; hairlines come from `<ListSection>` |
| `display` step, `scrim`, `iconLg` | Add to tokens / `ThemeColors` first |

## 7. Platform-mode exceptions

None beyond §2. A FAB, an iOS-only segmented style or an Android chevron is written here, with its reason, before use.

## 8. Copy and i18n

- Locales: `en`, `es`. Longest locale: `es` (about 25-30% longer than `en`); check every CTA and title in `es`.
- Domain strings in `src/features/<d>/i18n/{en,es}.json` (one namespace per domain: account, auth, club, home), shared ones in `src/shared/i18n/{en,es}.json` (`common`: actions, errors, states, navigation). Every new key goes in both files.
- Mock data: varied Spanish and English names and clubs ("CD Ribera Alta", "Club Natación Arenal", "Lucía Ferrer-Valcárcel", "Tomás Okafor"), imperfect counts (23, 1, 0), varied dates, constants prefixed `MOCK_` as `home-screen.tsx` does. Mocks live in the mock seam (`src/features/auth/utils/session/mock-auth.ts` today) or a `MOCK_` constant, never in the UI as "mock".
- "Loading…" (`common.states.loading`) uses the ellipsis character for an in-progress verb: allowed.
- Quote style: Spanish uses the same curly double quotes as English (“ ”) in UI strings, for example `No hay eventos que coincidan con “{{query}}”`; angular quotes (« ») are not used. Apostrophes are ’ in both locales.

## 9. Baseline findings (7cd6f67; starter demo screens)

Report by ID; fix only when asked or when real screens replace them (architecture skill, one screen per commit). Adding a minimal entry point (one row or one link) to a screen listed here, so a new screen has a way in, is allowed and is not a redesign of that screen (design-bible.md 'Flow path rule'): change nothing else on it and report the touch in the answer.

- **Home, WelcomeCard** (`src/components/home/home/welcome-card/`): **T1** first viewport is "Welcome to {{appName}}" ("Bienvenido a"); **T4** title-step text under a header whose title is already `appConfig.name`; **T15** subtitle describes the stack ("This starter ships with Expo Router..." / "Esta plantilla..."); **T17** CTA "Browse clubs" duplicates the Clubs tab; **T5** `welcome-card.styles.ts` surface + `borderWidth: 1` + `shadows.md` on the canvas (drop the border, `md` is overlay-only).
- **Home, items** (`home-screen.tsx` lines 33-43): **T15** "Explore navigation", "Item {{id}}", "Opens a detail screen with no data"; **C9** the same `doc.text` icon on every row.
- **Item screens** (`src/screens/home/item/`): **T15** `home.item.body`, `sheetTitle` "Native sheet", `sheetBody` (es: "Sheet nativo", "detents", "grabber"), `home.item.openSheet` "Open sheet" / "Abrir sheet", `home.item.openNext` "Open item {{id}}" (demo label); item detail placeholder is a centered block (**T3**, `item-detail-screen.tsx` line 29) with a `primary` decorative icon (**C6**) on surface + 1px border (`item-screens.styles.ts`).
- **ClubCard** (`club-card.styles.ts` lines 8-14): **T5** surface + `borderWidth: 1` + `shadows.sm`. Keep surface + `shadows.sm`, drop the border.
- **Club detail** (`src/screens/club/club/club-detail-screen.tsx`): `<Screen>` instead of `<ScrollScreen>`; **T4** header title `club.data.name` (line 24) repeated by the reused list ClubCard (no crest or initials: not an identity block); **C11** the member `<List>` sits below other content instead of being the root or a capped `<ListSection>` (`club-members-section.tsx` line 37), with a hand-made subtitle header and per-row bottom hairlines (`member-row.styles.ts`); **#19** a nested AsyncState spinner follows the screen spinner; **T17** a full-width secondary `InviteMemberButton` in the content, and it does nothing (`pickEmail` resolves `null`, line 16): screen actions go in `headerRight`.
- **Auth** (`src/features/auth/i18n/{en,es}.json`): **T15** `signIn.subtitle` "...Use any email and a password of 6+ characters." / "Usa cualquier email..." and `signUp.subtitle` "This is a mock: no data leaves the device." / "Es un mock...". The T1 hit on "Welcome back." / "Hola de nuevo." is exempt for Auth. The ghost `size="sm"` links (sign-in and sign-up line 81) are about 30pt (§2). `signIn.noAccount` "Don't" uses a straight apostrophe. No brand mark yet (§6).
- **Profile** (`src/features/account/i18n/{en,es}.json`): **T15** `profile.openDetail` "Open a detail screen", `profile.openSheet` "Open a sheet" / "Abrir un sheet", `profile.openDetailHint` "Pushed over the tabs", `openSheetHint` "Native form sheet with detents" (es: "tabs", "sheet", "detents"). Sign out is a full-width secondary Button (`profile-screen.tsx` line 34, recorded exemption in §3).
- **UserSummary** (`user-summary.styles.ts`): avatar filled with `primary` (**C6** decorative accent) at `avatarMd`. Also the drawer header, where it stays compact at `avatarMd`; its fix is the §6 Avatar fill only. Profile gets its own identity block (§3).
- **AsyncState** (`src/shared/ui/async-state/async-state.tsx`): **T19** renders raw `HttpError.message` for non-network errors (line 24) and `common.errors.generic` "Something went wrong" / "Algo ha ido mal"; **T18** empty is muted text only with no action slot (`common.states.empty`, `club.empty`, `member.empty` in both locales); Retry is `size="sm"` secondary, about 30pt (line 56); **T19** stale content: `if (isError)` (line 50) replaces children whenever `isError` is true, so a failed refresh wipes the stale content on screen, which breaks "stale content stays" (SKILL.md Step 6); fix target: the full-screen error only when there is no data, otherwise an inline line (§6); **#19** risk: a centered `ActivityIndicator` for every pending state, though club and member layouts are known (skeleton target).
- **ListSection** (`list-section.tsx` line 21): the title has no `accessibilityRole="header"`.
- **Palette** (`src/shared/theme/themes.ts`): **T10** the stock placeholder palette (§1); `danger` red500 as text is 3.8:1 light and 3.9:1 dark on `surface`, `success` green500 is 2.3:1 light (error lines, field errors and confirmations below 4.5:1); dark `onPrimary` on `primaryPressed` is 3.4:1 (the iOS pressed primary label). Fixed by the brand declaration, which picks AA steps.
- **TextField** (`text-field.styles.ts` line 18): **C15** outline `border` is 1.24:1 (light) / 1.42:1 (dark) against `surface`: token debt until `inputBorder` exists (§6). Preflight reports it, it does not fail every form.
- **Radius**: no style uses `borderCurve: 'continuous'` (expo-design-system 'Radius').
- **Settings** (`settings-screen.tsx` line 16): mock constant `ENTRIES` lacks the `MOCK_` prefix; every row opens the same data-less detail.
- Clean today: zero U+2014/U+2013 in `src` (comments included); zero `!` and `¡` in i18n; sentence case; 3 tabs; plurals for member counts; one gray temperature (cool); no hex, raw radius or off-scale spacing outside the theme; uppercase only in ListSection titles and UserSummary initials; the 4 WHISPER_RE hits are allow-listed 1-line metadata (ListRow subtitle, ListSection title, MemberRow role, ClubCardHeader count); max 2 accent references per file. With §0 pasted, the tells.md block prints only the §0 expected hits and the grep-detected items above (verified on 7cd6f67). Grep-detected: the T1, T3, T5, T15 (with `DEV_COPY_RE`), T16, T18 and T19 items and the straight apostrophe. Found only by reading or on screen: T4 (WelcomeCard, Club detail), T17 in content (WelcomeCard CTA, InviteMemberButton), C9, C11, #19, the C6 fills (UserSummary, item placeholder), the ListSection header role, the TextField contrast, `borderCurve`, the Settings `MOCK_` prefix, AsyncState's stale-content behavior and the sm Button targets.

## 10. Delegation paths

- Architecture skill = `app-architecture` (`.agents/skills/app-architecture/SKILL.md`, reference domain `club`; data layer `references/data-layer.md`, i18n `references/config-and-i18n.md`). Forms skill = `forms-keyboard` (`.agents/skills/forms-keyboard/SKILL.md`). Navigation skill = `navigation-auth` (`.agents/skills/navigation-auth/SKILL.md`, route tree `references/route-tree.md`).
- `.agents/skills/expo-design-system/SKILL.md` + `references/native-slop.md` + `references/audit.md`; `.agents/skills/expo-animation/SKILL.md` + `RECIPES.md`. Both vendored (`skills-lock.json`), never hand-edited.
- Missing Expo siblings: see §5.
- Done checks: `bunx expo lint` and `bunx tsc --noEmit`.
