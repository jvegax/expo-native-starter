// Ambient typing for the variables read at config time (app.config.ts) and at bundle time.
// Keep in sync with app.config.ts and src/config/env.ts.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Selects the environment in app.config.ts. Defaults to `preview`. */
      APP_ENV?: 'production' | 'preview';
      /** Optional override of the environment's API URL (inlined by Expo, public). */
      EXPO_PUBLIC_API_URL?: string;
      /** EAS project id and account, normally hardcoded in app.config.ts; override in CI. */
      EAS_PROJECT_ID?: string;
      EAS_OWNER?: string;
    }
  }
}

export {};
