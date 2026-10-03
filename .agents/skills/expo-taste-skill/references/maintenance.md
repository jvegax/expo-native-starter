# Maintaining expo-taste-skill

Read this before editing SKILL.md, any reference or repo-bindings.md. It is not loaded while building screens.

## 1. Status: useful, not yet proven

The skill is a reasoned guide with countable rules, deterministic greps and a known-debt list, and those parts work. What it lacks is evidence that screens built with it are better than screens built without it. Until that evidence exists:

- **No new rules.** No new T, C or # IDs, dial bands, references or checklist boxes. A change that removes, merges or shortens a rule is welcome.
- **A rule earns its place with a failure.** Any rule added after the eval names the screen it would have caught (file or screenshot) and the output it changed.
- **Size budget.** SKILL.md stays at or below its size once the light path was added (about 39 KB): anything added to it moves an equal amount into a reference. The light path (SKILL.md 'Light path and full path') must stay sufficient to build a standard screen.

## 2. Pending: the with/without eval

Run it before growing the skill again (anthropic-skills:skill-creator supports evals and benchmarks):

1. Four prompts on this app's real domain, one per archetype: a Collection, a Detail, a Task/Form and a first-run Empty state.
2. Each built twice from the same commit, with the skill and without it (AGENTS.md design section disabled for the second run).
3. Compare on what users see, not on ritual: the tells.md grep hits, the native-slop greps, C15 contrast, copy defects in both locales, and a blind side-by-side of screenshots in both themes.
4. Record the result here (date, commit, what changed). Cut the rules and references that changed nothing; keep the ones that did.

## 3. Bindings that do not rot

repo-bindings.md is the most fragile file: it describes code that keeps changing. Apply these rules to every section you touch, and convert the old style in that section while you are there:

- **Paths and symbols, never line numbers.** Write `async-state.tsx` `errorMessage`, not `async-state.tsx line 24`. A line number is wrong after the next edit and nothing warns about it.
- **No unverifiable snapshots.** The header names the SDK and the date of the last full verification. "Clean today" and "verified on <commit>" claims are stale as soon as `src` changes: re-run the greps before repeating them.
- **Computed values come from a script, not from prose.** Contrast ratios (§2, §6, §9) are measured from the theme files every time the palette changes, in the same commit as the palette change. The expected grep hits (§0) are the output of the tells.md block on a clean tree. Both are scripted: `scripts/contrast.ts` (bun; measures bindings §0 `CONTRAST_PAIRS` in every theme exported by `THEME_MODULE`) and `scripts/taste-greps.sh` (runs the tells.md block with §0 and diffs against the `taste-greps-expected` block in §0; `--update` rewrites it). A ratio written in the bindings must match the script's output; a changed baseline goes in the same commit as the code that changed it.
- **Porting** replaces repo-bindings.md only (repo-bindings.template.md). The core files stay identical across the repos that share the skill: change them in one repo and copy them to the others in the same session.
