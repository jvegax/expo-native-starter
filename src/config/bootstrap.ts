import '@/config/i18n/i18n';

import { setupAuth } from '@/config/auth';
import { setupHttp } from '@/config/http';
import { setupQueryManagers } from '@/config/query-managers';
import { initializeCriticalSdks, scheduleDeferredSdks } from '@/config/sdks/initialize-sdks';

// Runs once at module scope from the root layout, before any screen mounts.
// Everything here is synchronous and on the startup path: keep it short and defer the rest.
// The marks show up in React Native DevTools (Performance panel) to measure its cost.
// Critical SDKs (crash reporting) go first so they observe failures in the setup calls after them.
export function bootstrap(): void {
  performance.mark('bootstrap:start');
  initializeCriticalSdks();
  setupHttp();
  setupAuth();
  setupQueryManagers();
  scheduleDeferredSdks();
  performance.mark('bootstrap:end');
}
