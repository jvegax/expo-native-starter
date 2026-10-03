/**
 * Measures WCAG contrast for the role pairs listed in bindings §0, in every exported theme.
 * Run from the repo root: `bun .agents/skills/expo-taste-skill/scripts/contrast.ts [--check]`.
 * Reads THEME_MODULE and CONTRAST_PAIRS from the §0 block of references/repo-bindings.md, imports the
 * module and measures each `fg/bg:min` pair in every export that has a `colors` object.
 * Without --check it always exits 0 (known debt is listed in bindings §9); with --check a failing pair exits 1.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const bindingsPath = join(import.meta.dir, '..', 'references', 'repo-bindings.md');
const bindings = readFileSync(bindingsPath, 'utf8');

function readVar(name: string): string {
  const match = bindings.match(new RegExp(`^${name}=(?:'([^']*)'|"([^"]*)"|(\\S+))`, 'm'));
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  if (!value) throw new Error(`${name} is missing from the §0 block of ${bindingsPath}`);
  return value;
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(full.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const isHex = (value: unknown): value is string =>
  typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

const themeModule = readVar('THEME_MODULE');
const pairs = readVar('CONTRAST_PAIRS')
  .split(/\s+/)
  .filter(Boolean)
  .map((entry) => {
    const [roles, min] = entry.split(':');
    const [fg, bg] = roles.split('/');
    return { fg, bg, min: Number(min) };
  });

const mod: Record<string, unknown> = await import(join(process.cwd(), themeModule));
const themes = Object.entries(mod).filter(
  (entry): entry is [string, { colors: Record<string, unknown> }] =>
    typeof entry[1] === 'object' && entry[1] !== null && 'colors' in entry[1],
);

let failures = 0;
for (const [name, theme] of themes) {
  console.log(name);
  for (const { fg, bg, min } of pairs) {
    const a = theme.colors[fg];
    const b = theme.colors[bg];
    if (!isHex(a) || !isHex(b)) {
      console.log(`  ${fg} on ${bg}: not a hex pair, skipped`);
      continue;
    }
    const value = ratio(a, b);
    const ok = value >= min;
    if (!ok) failures += 1;
    console.log(`  ${fg} on ${bg}: ${value.toFixed(2)}:1 (min ${min}) ${ok ? 'ok' : 'FAIL'}`);
  }
}
console.log(`${failures} pair(s) below their minimum`);
if (process.argv.includes('--check') && failures > 0) process.exit(1);
