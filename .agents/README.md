# Agent configuration

Vendor-neutral instructions for AI coding agents (Codex, Cursor, Gemini CLI, Claude Code, ...).

- `AGENTS.md` at the repository root is the entry point every agent reads first.
- `.agents/skills/<name>/SKILL.md` holds the skills: self-contained guides an agent loads when a task matches the skill's description. The format is the open [Agent Skills](https://agentskills.io) standard (YAML frontmatter with `name` and `description`, then Markdown). Codex discovers this folder automatically; Claude Code reads the same files through the symlink in `.claude/skills/`.

Skills in this repository:

| Skill | Source | When it applies |
| --- | --- | --- |
| `app-architecture` | local | Any change under `src/`: where files go, naming, import rules, data layer, design system, i18n. |
| `navigation-auth` | local | Routes, `_layout.tsx`, tabs, drawer, sheets, deep links, the auth gate and the session. |
| `forms-keyboard` | local | Forms, text inputs, validation and anything the keyboard can cover. |
| `expo-taste-skill` | local | First for any screen, sheet, empty state, onboarding step, user-visible component or UI copy: Design Read, dials, archetype, taste tells, pre-flight. Only `references/repo-bindings.md` is app-specific. |
| `expo-design-system` | vendored (`expo/skills`, `skills-lock.json`) | Tokens, the component contract and the native-slop tells. Update with `bunx skills update`, never by hand. |
| `expo-animation` | vendored (`expo/skills`, `skills-lock.json`) | Any animation, gesture, transition, press feedback or haptic. Update with `bunx skills update`, never by hand. |

Keep skills here, never duplicated per vendor. To add a vendor that reads a different folder, add a symlink to this one.
