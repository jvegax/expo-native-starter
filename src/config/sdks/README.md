# Third-party SDK configuration

Every external SDK (analytics, crash reporting, push notifications, payments, feature flags...) gets **one file in this folder** and nothing else in the app knows how it is initialized.

## Adding an SDK

1. Install it with `bunx expo install <package>` (resolves the SDK-compatible version). If it has native code, the app needs a development build afterwards.
2. Put any required key in `.env` as `EXPO_PUBLIC_*` and validate it in `src/config/env.ts`. Public keys only: these values ship in the bundle.
3. Create `src/config/sdks/<sdk>.ts` exporting a single `init<Sdk>()`:

   ```ts
   import { env } from '@/config/env';

   export function initAnalytics(): void {
     analytics.setup({ key: env.ANALYTICS_KEY });
   }
   ```

4. Register it in `src/config/sdks/initialize-sdks.ts` in one of the two lists (see "Critical or deferred" below). `src/config/bootstrap.ts` calls `initializeCriticalSdks()` first (before the http and query setup, so crash reporting observes them) and `scheduleDeferredSdks()` last, once, at module scope of the root layout.
5. If the SDK must wrap the React tree (an `ErrorBoundary`, a `Provider`), add that in `src/providers/` and compose it in `app-providers.tsx`. Keep the SDK import confined to its file in this folder plus that provider.
6. Expose the SDK to features, components and screens through a small wrapper in `src/shared/lib/<sdk>/<sdk>.ts` (for example `track(event)`), never by importing the SDK package outside `config/` and `shared/`.

## Critical or deferred

Every initializer sits on the startup path unless it is deferred, so the default is **deferred**.

| List | When it runs | Use it for |
| --- | --- | --- |
| `criticalInitializers` | Synchronously, in array order, before the first render. Each one is wrapped in try/catch and logged with `console.error`, so a broken SDK never blocks startup. Must be synchronous (`() => void`). | Only SDKs that must observe startup itself: crash reporting / error monitoring. |
| `deferredInitializers` | Together (`Promise.allSettled`) inside `requestIdleCallback(..., { timeout: 3000 })`: after the first frames, or after 3 s at the latest on a busy JS thread. Failures are logged one by one and never affect the others. May be async. | Everything else: analytics, push registration, feature flags, attribution, chat widgets. |

- Do not use `InteractionManager.runAfterInteractions`: it is deprecated in React Native 0.86. `requestIdleCallback` is the replacement.
- A deferred SDK is not ready on the first frames. Wrappers in `src/shared/lib/<sdk>/` must tolerate calls before initialization (queue them or drop them), never throw.
- `bootstrap()` is wrapped in `performance.mark('bootstrap:start')` / `performance.mark('bootstrap:end')`. Check the gap in the React Native DevTools Performance panel after adding a critical SDK.
