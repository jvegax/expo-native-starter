#!/usr/bin/env bash
# Runs the tells.md grep block with the bindings §0 variables and compares the hits with the expected
# baseline stored in bindings §0 (the ```taste-greps-expected block). Run from the repo root:
#   bash .agents/skills/expo-taste-skill/scripts/taste-greps.sh            # diff against the baseline, exit 1 on new hits
#   bash .agents/skills/expo-taste-skill/scripts/taste-greps.sh --update   # rewrite the baseline from a clean tree
#   bash .agents/skills/expo-taste-skill/scripts/taste-greps.sh FILE...    # scope to touched files, print hits, no diff
# Line numbers are stripped from the output so the baseline survives edits that only move code.
set -uo pipefail
export LC_ALL=en_US.UTF-8

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BINDINGS="$SKILL_DIR/references/repo-bindings.md"
TELLS="$SKILL_DIR/references/tells.md"

# The first ```bash block under "## 0." in the bindings and the one under "## Grep block" in tells.md.
extract() { awk -v head="$2" 'index($0, head) == 1 { f = 1 } f && /^```bash/ { g = 1; next } g && /^```/ { exit } g' "$1"; }
VARS="$(extract "$BINDINGS" '## 0.')"
BLOCK="$(extract "$TELLS" '## Grep block' | sed -E 's/^# (T[0-9]+|C[0-9]+)([^0-9].*)?$/echo "## \1"/')"
[ -n "$VARS" ] && [ -n "$BLOCK" ] || { echo "could not read the §0 block or the tells.md grep block" >&2; exit 2; }

run() {
  bash -c "$VARS
$( [ $# -gt 0 ] && printf 'SRC="%s"; SCREENS="%s"; COMPONENTS=""\n' "$*" "$*" )
$BLOCK" 2>&1 | normalize
}

# Strip line numbers and sort the hits inside each "## <ID>" section: grep -r and find list files in
# readdir order, which differs between machines.
normalize() {
  python3 -c '
import re, sys
out, section = [], []
def flush():
    out.extend(sorted(section)); section.clear()
for line in sys.stdin.read().splitlines():
    line = re.sub(r"^([^: ]+\.(?:tsx?|json)):[0-9]+:", r"\1:", line)
    if line.startswith("## "):
        flush(); out.append(line)
    else:
        section.append(line)
flush()
print("\n".join(out))
'
}

if [ "${1:-}" != "--update" ] && [ $# -gt 0 ]; then
  run "$@"
  exit 0
fi

ACTUAL="$(run)"

if [ "${1:-}" = "--update" ]; then
  python3 - "$BINDINGS" "$ACTUAL" <<'PY'
import re, sys
path, actual = sys.argv[1], sys.argv[2]
text = open(path, encoding='utf-8').read()
block = '```taste-greps-expected\n' + actual.rstrip('\n') + '\n```'
pattern = re.compile(r'```taste-greps-expected\n(?:.*?\n)?```', re.S)
if not pattern.search(text):
    sys.exit('no ```taste-greps-expected block in bindings §0: add an empty one first')
open(path, 'w', encoding='utf-8').write(pattern.sub(lambda _: block, text, count=1))
PY
  [ $? -eq 0 ] || exit 2
  echo "baseline updated in $BINDINGS"
  exit 0
fi

EXPECTED="$(awk '/^```taste-greps-expected/ { g = 1; next } g && /^```/ { exit } g' "$BINDINGS")"
DIFF="$(diff <(printf '%s\n' "$EXPECTED") <(printf '%s\n' "$ACTUAL"))"
if [ -z "$DIFF" ]; then
  echo "taste greps: no hits beyond the baseline"
  exit 0
fi
echo "taste greps: differences from the baseline (> new hit, < baseline hit gone):"
printf '%s\n' "$DIFF" | grep -E '^[<>]'
exit 1
