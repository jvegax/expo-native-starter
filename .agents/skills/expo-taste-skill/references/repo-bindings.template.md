# Repo bindings template

Blank skeleton of `references/repo-bindings.md`. Use it when a project has no bindings file, or when the one present was copied from another app (the paths in its §0 do not exist here, or its header names another project). Copy this file to `repo-bindings.md`, fill every section from what the project already declares (design-bible.md 'Greenfield procedure', step 1: detect before proposing), then delete the instruction lines. The core cites these section numbers as "bindings §N", so keep the numbering and headings even when a section is short.

Every value is either read from the project (`declared`), derived from code or the category row (`derived`), or proposed (`assumed`). Assumed values in §1, §2 (type, platform mode) and §4 need the user's yes before the first screen.

```markdown
# Repo bindings: this app

The ONLY repo-specific file in expo-taste-skill. To port the skill, replace this file and nothing else. Where it disagrees with SKILL.md, another reference or a sibling skill, this file wins. Never write the product's brand name here: say "this app". Verified against <commit or date> (Expo SDK <n>, RN <n>, <compiler / architecture notes>).

## 0. Grep variables

<!-- One bash block exporting the variables tells.md, preflight.md, audit.md and native-slop.md read.
     Required: SRC, THEME, SCREENS, COMPONENTS, I18N_GLOB, I18N_FILES, SPACING_WHITELIST, BRAND (declared|none),
     ACCENT_RE, WHISPER_RE, TITLE_TEXT_RE, BUTTON_TAG, TABS_LAYOUT, WHISPER_ALLOW_RE, UPPERCASE_ALLOW_RE, CHROME_RE,
     EXTRA_BANNED_RE (banned phrases per non-English locale), DEV_COPY_RE, HERO_RE_<LANG>, EMPTY_RE_<LANG>, ERROR_RE_<LANG>
     for every non-English locale, DASH_RE (build it with printf so this file stays free of the characters), MOCK_PREFIX.
     Then: shell notes (bash, UTF-8 locale, whether rg exists), and the expected hits on a clean baseline with one-line reasons. -->

## 1. Brand status: <DECLARED | NONE>

<!-- Where the palette and the type family are declared (files), whether T10's stock-palette branch is on, the accent hue,
     gray temperature, the type family and weights embedded, and the rule for adding a missing token (which files). -->

## 2. Design bible (filled)

<!-- The 16 fields of design-bible.md, filled: product and audience, category row (and per-screen presets if two apply),
     app-wide quiet constraints with measured contrast, locales, platform mode with per-platform affordances
     (large titles, chevrons, create placement, sheet detents and grabber), palette roles, type ramp (variant names,
     sizes, weights, which step is the identity name, block heading, meta; how weight emphasis is done; tabular figures
     support of the family, verified on both platforms or marked OPEN), spacing scale and tempo, radius roles,
     separation and elevation, icon rules, button hierarchy, press feedback pattern(s), imagery and scrim, copy register
     per language, signature component (today or TARGET), where chrome color is configured. -->

## 3. Archetype -> container and components

<!-- Table: each archetype in archetypes.md -> the screen container, the components to build it with, and an honest
     reference screen (or "none" / "debt, see §9"). Then: list rules (capped preview vs root virtualized list), the
     shared UI inventory, formatter helpers and plural key style. -->

## 4. Default dials

<!-- Repo default triple and preset, then a table of per-screen defaults (screen, V M D, preset, cap or reason).
     Domain screens take their triple from here, never from dials.md's vibe inference. Haptics status (installed or not). -->

## 5. Repo overrides of sibling skills

<!-- Where this project overrides expo-design-system and expo-animation (token location and API, press feedback,
     recipe scaffolding, lint-enforced primitives, audit grep settings, packages not installed, skills hygiene).
     Mirror the project's AGENTS.md / CLAUDE.md rules; do not invent overrides. -->

## 6. Gaps: what to do when a screen needs a missing piece

<!-- Table: need -> what to do in this project (empty-state slot, error mapping, skeleton, row accessories, section
     header role, emphasis weight, stale content on error, small-button target, field boundary contrast, badge, avatar,
     header actions, header search status, menu primitive, brand mark, pickers, toast policy, missing tokens). -->

## 7. Platform-mode exceptions

<!-- Deliberate deviations from the platform mode (a FAB, an iOS style on Android, ...), each with its reason. "None" is valid. -->

## 8. Copy and i18n

<!-- Locales and the longest one, where strings live (namespaces, files), mock data style and naming, allowed
     exceptions (ellipsis on in-progress verbs), quote and apostrophe style per language. -->

## 9. Baseline findings (<commit or date>)

<!-- Existing debt found by the first audit, by ID (T/#/C) with file paths and line numbers, verified by reading the files.
     State the policy: report by ID, fix only when asked or when real screens replace them; a minimal entry point added
     to a listed screen is not a redesign. End with what is clean today. Empty is valid for a new project. -->

## 10. Delegation paths

<!-- Where this project's sibling skills live: architecture (file placement, tokens, i18n), navigation (routes, sheets,
     tabs), forms (inputs, keyboard), expo-design-system and expo-animation paths, missing Expo siblings, and the
     done checks (lint, typecheck commands). A sibling that does not exist is written as "none: <what to do instead>". -->
```
