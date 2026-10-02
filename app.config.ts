import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Dynamic Expo config. Replaces app.json so the app can target several environments.
 *
 * Select the environment with APP_ENV (`production` | `preview`). It defaults to `preview`, so
 * `expo start`, development builds and preview builds all point at the preview backend unless told
 * otherwise. eas.json sets APP_ENV per build profile; locally you can set it in .env or inline:
 *   APP_ENV=production bunx expo start
 *
 * Inspect the result for a given environment with `bunx expo config --type public`.
 */

const APP_ENVS = ['production', 'preview'] as const;
type AppEnv = (typeof APP_ENVS)[number];

const DEFAULT_APP_ENV: AppEnv = 'preview';

type EnvironmentConfig = {
  /** Display name on the home screen. Distinct per environment so both can be installed side by side. */
  name: string;
  /** Deep-link scheme (`myapp://`). */
  scheme: string;
  /** iOS bundle identifier and Android package name. */
  appId: string;
  /** Backend base URL exposed to the app as `env.API_URL`. */
  apiUrl: string;
};

// Example values: replace them with your own domains and identifiers.
const environments: Record<AppEnv, EnvironmentConfig> = {
  production: {
    name: 'My App',
    scheme: 'myapp',
    appId: 'com.example.myapp',
    apiUrl: 'https://api.example.com',
  },
  preview: {
    name: 'My App (Preview)',
    scheme: 'myapp-preview',
    appId: 'com.example.myapp.preview',
    apiUrl: 'https://api-preview.example.com',
  },
};

// Set once after `bunx eas-cli init` (the CLI prints the id). EAS_PROJECT_ID overrides it in CI.
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID ?? 'your-eas-project-id';
const EAS_OWNER = process.env.EAS_OWNER ?? 'your-expo-account';

function resolveAppEnv(): AppEnv {
  const raw = process.env.APP_ENV;
  if (!raw) return DEFAULT_APP_ENV;
  if (!APP_ENVS.includes(raw as AppEnv)) {
    throw new Error(`Invalid APP_ENV "${raw}". Expected one of: ${APP_ENVS.join(', ')}.`);
  }
  return raw as AppEnv;
}

const appEnv = resolveAppEnv();
const environment = environments[appEnv];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: environment.name,
  slug: 'expo-native-starter',
  owner: EAS_OWNER,
  // Native only. Without this Expo adds 'web' whenever react-dom resolves, and it does here: it is
  // auto-installed as a peer of expo-router's dependencies (@expo/ui -> vaul).
  platforms: ['ios', 'android'],
  version: '1.0.0',
  runtimeVersion: { policy: 'appVersion' },
  scheme: environment.scheme,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  // Root view colour behind every React view (gray50, the light theme background). expo-system-ui
  // applies it natively and theme-provider updates it at runtime when the colour scheme changes.
  backgroundColor: '#F9FAFB',
  ios: {
    bundleIdentifier: environment.appId,
    supportsTablet: true,
  },
  android: {
    package: environment.appId,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    // Off on purpose: it sets android:enableOnBackInvokedCallback, but react-native-screens has no
    // predictive-back animations, so the stack would keep its classic pop transition while the
    // system shows its own preview. Revisit when the native stack supports it.
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        // Same colours as the gray50 / gray900 theme tokens (src/shared/theme/tokens/colors.ts),
        // so the splash hands over to the first frame without a flash. Expo Router hides the
        // splash once the first route renders, so preventAutoHideAsync is not needed.
        image: './assets/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F9FAFB',
        dark: {
          image: './assets/splash-icon.png',
          backgroundColor: '#111827',
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          // R8 shrinks and obfuscates Java/Kotlin code and drops unused resources in release builds.
          // Libraries ship their own consumer proguard rules; add extraProguardRules only if a
          // release build crashes with a missing class.
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          // enableBundleCompression and useLegacyPackaging stay at their default (false): the JS
          // bundle and the native libraries stay uncompressed in the APK so Hermes can mmap the
          // bundle and .so files load in place, which is faster at startup than a smaller APK.
        },
      },
    ],
    // No biometric prompts are used, so do not add a Face ID usage string to Info.plist.
    ['expo-secure-store', { faceIDPermission: false }],
    'expo-image',
    [
      'expo-localization',
      {
        supportedLocales: {
          ios: ['en', 'es'],
          android: ['en', 'es'],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    // babel-preset-expo ships the React Compiler and enables it only through this flag.
    reactCompiler: true,
  },
  extra: {
    // Read by src/config/env.ts through expo-constants. Public values only: they ship in the bundle.
    appEnv,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? environment.apiUrl,
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
});
