// https://docs.expo.dev/guides/using-eslint/
const fs = require('node:fs');
const path = require('node:path');

const pluginQuery = require('@tanstack/eslint-plugin-query');
const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

// Boundaries are enforced per folder with no-restricted-imports. The rules mirror
// .claude/skills/app-architecture/SKILL.md ("Dependency rules").
// A bare alias ("@/providers") and its subpaths ("@/providers/*") are both restricted.
// gitignore semantics apply: a bare (directory) pattern cannot be re-included with "!", so
// folders that allow exceptions (@/config, @/features) are listed with "/*" only.
const roots = (...names) => names.flatMap((name) => [name, `${name}/*`]);
const configExcept = ['@/config/*', '!@/config/env', '!@/config/app'];

// Every import goes through the "@/" alias so a path reads the same from any file.
const relativeImports = {
  regex: '^\\.{1,2}/',
  message: 'Import through the "@/" alias (e.g. "@/features/club/..."); relative paths are not allowed.',
};

// Lists always go through <List> (src/shared/ui/list), which wraps LegendList.
const rnLists = {
  group: ['react-native'],
  importNames: ['FlatList', 'SectionList', 'VirtualizedList'],
  message: 'Never use FlatList/SectionList/VirtualizedList. Use <List> from "@/shared/ui/list/list" (LegendList).',
};
const legendListDirect = {
  group: ['@legendapp/list', '@legendapp/list/*'],
  message: 'Import <List> (and useRecyclingState) from "@/shared/ui/list/list"; only that folder talks to @legendapp/list.',
};

// Images always go through the expo-image wrapper (memory + disk cache, transitions, recycling).
const rnImages = {
  group: ['react-native'],
  importNames: ['Image', 'ImageBackground'],
  message: 'Never use Image/ImageBackground from react-native. Use <Image> from "@/shared/ui/image/image" (expo-image).',
};

const basePatterns = [relativeImports, rnLists, rnImages, legendListDirect];

const restricted = (patterns, base = basePatterns) => ({
  'no-restricted-imports': ['error', { patterns: [...base, ...patterns] }],
});

const sharedBoundary = {
  group: [...roots('@/features', '@/components', '@/screens', '@/app', '@/providers'), ...configExcept],
  message:
    'shared/ must not depend on features, components, screens, app, providers or config (env and app constants excepted).',
};

const domainsIn = (folder) =>
  fs
    .readdirSync(path.join(__dirname, 'src', folder), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

const featureNames = domainsIn('features');
const componentDomains = domainsIn('components');
const screenDomains = domainsIn('screens');

module.exports = defineConfig([
  expoConfig,
  ...pluginQuery.configs['flat/recommended'],
  {
    ignores: ['dist/*', '.expo/*', 'patches/*'],
  },
  {
    files: ['src/**'],
    rules: {
      ...restricted([]),
      // No barrel files: every module is imported by its own path.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message: 'No barrel exports ("export * from"). Import each module by its own path.',
        },
      ],
    },
  },
  {
    // The React Compiler silently skips any component or hook that suppresses a lint rule, and a
    // useMemo whose result is unused is a bug it cannot optimize. Both rules exist in
    // eslint-plugin-react-hooks 7 but are not in the recommended preset eslint-config-expo uses.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rule-suppression': 'error',
      'react-hooks/void-use-memo': 'error',
    },
  },
  {
    // Components grow as a tree of small files, never as one big file.
    files: ['src/**/*.tsx'],
    rules: {
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/shared/**'],
    rules: restricted([sharedBoundary]),
  },
  {
    // The one place allowed to import @legendapp/list.
    files: ['src/shared/ui/list/**'],
    rules: restricted([sharedBoundary], [relativeImports, rnLists, rnImages]),
  },
  {
    files: ['src/providers/**'],
    rules: restricted([
      {
        group: roots('@/features', '@/components', '@/screens', '@/app'),
        message: 'providers/ must not depend on features, components, screens or routes.',
      },
    ]),
  },
  {
    files: ['src/config/**'],
    rules: restricted([
      {
        group: [
          '@/features/*/*',
          '!@/features/*/i18n',
          '!@/features/*/store',
          ...roots('@/app', '@/screens', '@/components'),
        ],
        message: 'config/ may only import a feature\'s i18n/ and store/ folders (composition root).',
      },
    ]),
  },
  {
    files: ['src/app/**'],
    rules: restricted([
      {
        group: roots('@/features', '@/components'),
        message: 'Routes render a screen from @/screens; they never import features or components.',
      },
    ]),
  },
  ...screenDomains.map((name) => ({
    files: [`src/screens/${name}/**`],
    rules: restricted([
      {
        // Only the domain's own screen-level files (shared .styles) are importable, never a screen.
        group: ['@/screens/*', `!@/screens/${name}`, '@/screens/**/*-screen'],
        message: 'A screen never imports another screen; move the shared part to a component or @/shared/ui.',
      },
      {
        group: [...roots('@/app', '@/providers'), ...configExcept],
        message: 'screens/ must not depend on routes, providers or config (env and app constants excepted).',
      },
    ]),
  })),
  ...componentDomains.map((name) => ({
    files: [`src/components/${name}/**`],
    rules: restricted([
      {
        group: ['@/components/*', `!@/components/${name}`],
        message: 'A component imports only components of its own domain; a generic one belongs in @/shared/ui.',
      },
      {
        group: [...roots('@/app', '@/providers', '@/screens'), ...configExcept],
        message: 'components/ must not depend on routes, providers, screens or config (env and app constants excepted).',
      },
    ]),
  })),
  ...featureNames.map((name) => ({
    files: [`src/features/${name}/**`],
    rules: restricted([
      {
        group: ['@/features/*/*', `!@/features/${name}/*`, '!@/features/*/types', '!@/features/*/store'],
        message: 'Another feature exposes only its types/ and store/ folders.',
      },
      {
        group: [...roots('@/app', '@/providers', '@/screens', '@/components'), ...configExcept],
        message:
          'features/ must not depend on routes, providers, screens, components or config (env and app constants excepted).',
      },
    ]),
  })),
]);
