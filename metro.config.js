// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1 (set by eas.json; any future eas update must set it too) makes the Expo CLI
// transform every module first and run the import/export pass once the whole graph is known. That
// pass is also where requires get inlined, and only then is it safe: it can skip modules with side
// effects because it sees the full graph. Without the flag, Metro would inline per file with no
// side-effect information (Expo leaves inlineRequires off by default for that reason).
const optimizeGraph = /^(1|true)$/i.test(process.env.EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH ?? '');

const getDefaultTransformOptions = config.transformer.getTransformOptions;

// Inline requires defer each module's evaluation to its first use, which shortens startup.
// The CLI only optimizes the graph for production bundles, so `options.dev` keeps development
// (expo start, dev builds) on the default, non-inlined output.
config.transformer.getTransformOptions = async (entryPoints, options, getDependenciesOf) => {
  const defaults = await getDefaultTransformOptions(entryPoints, options, getDependenciesOf);
  return {
    ...defaults,
    transform: {
      ...defaults.transform,
      inlineRequires: optimizeGraph && !options.dev,
    },
  };
};

module.exports = config;
