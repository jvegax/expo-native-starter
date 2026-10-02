# Agent configuration

Vendor-neutral instructions for AI coding agents (Codex, Cursor, Gemini CLI, Claude Code, ...).

- `AGENTS.md` at the repository root is the entry point every agent reads first.
- `.agents/skills/<name>/SKILL.md` holds the skills: self-contained guides an agent loads when a task matches the skill's description. The format is the open [Agent Skills](https://agentskills.io) standard (YAML frontmatter with `name` and `description`, then Markdown). Codex discovers this folder automatically; Claude Code reads the same files through the symlink in `.claude/skills/`.

Skills in this repository:

| Skill | When it applies |
| --- | --- |
| `app-architecture` | Any change under `src/`: where files go, naming, import rules, data layer, design system, i18n. |

Keep skills here, never duplicated per vendor. To add a vendor that reads a different folder, add a symlink to this one.
