import Constants from 'expo-constants';
import { z } from 'zod';

// Environment-dependent values are resolved once in app.config.ts (APP_ENV selects the environment)
// and reach the app through `expoConfig.extra`. This file validates them and is the only reader.
export const APP_ENVS = ['production', 'preview'] as const;
export type AppEnv = (typeof APP_ENVS)[number];

const envSchema = z.object({
  APP_ENV: z.enum(APP_ENVS),
  API_URL: z.url(),
  APP_VERSION: z.string().min(1),
});

const extra = Constants.expoConfig?.extra ?? {};

const parsed = envSchema.safeParse({
  APP_ENV: extra.appEnv,
  API_URL: extra.apiUrl,
  // `version` in app.config.ts; also busts the persisted query cache on every release.
  APP_VERSION: Constants.expoConfig?.version,
});

if (!parsed.success) {
  throw new Error(`Invalid app environment (check app.config.ts and APP_ENV):\n${z.prettifyError(parsed.error)}`);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.APP_ENV === 'production',
} as const;

export type Env = typeof env;
