// https://docs.expo.dev/versions/latest/config/babel/
// babel-preset-expo already includes the React Compiler; it is turned on by
// experiments.reactCompiler in app.config.ts, not here.
module.exports = function (api) {
  // The returned object does not depend on the environment: Babel resolves the `env` block below
  // itself, so a permanent cache is correct.
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    env: {
      // Release bundles only (Metro sets BABEL_ENV=production when dev is false). Hermes builds skip
      // the minifier, so drop_console in minifierConfig would do nothing; this strips console.log,
      // .info and .debug calls instead and keeps error and warn for crash reporting.
      production: {
        plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
      },
    },
  };
};
