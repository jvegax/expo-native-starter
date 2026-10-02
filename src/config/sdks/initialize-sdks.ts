// Registry of third-party SDK initializers (analytics, crash reporting, push, payments...).
// One file per SDK in this folder exporting `initX`, registered in one of the two lists below.
// See README.md in this folder.
type CriticalInitializer = () => void;
type DeferredInitializer = () => void | Promise<void>;

// Run synchronously, in order, before the first render. Only what must observe startup itself
// belongs here (crash reporting); everything here delays the first frame.
const criticalInitializers: readonly CriticalInitializer[] = [];

// Run in parallel once the JS thread is idle after the first frames (analytics, push, feature flags...).
const deferredInitializers: readonly DeferredInitializer[] = [];

// Upper bound for the idle wait, so deferred SDKs still start on a busy JS thread.
const DEFERRED_TIMEOUT_MS = 3000;

let criticalDone = false;
let deferredScheduled = false;

export function initializeCriticalSdks(): void {
  if (criticalDone) return;
  criticalDone = true;

  for (const init of criticalInitializers) {
    try {
      init();
    } catch (error) {
      // One broken SDK must never prevent the app from starting.
      console.error(`SDK initializer "${init.name}" failed`, error);
    }
  }
}

export function scheduleDeferredSdks(): void {
  if (deferredScheduled || deferredInitializers.length === 0) return;
  deferredScheduled = true;

  requestIdleCallback(() => void runDeferredSdks(), { timeout: DEFERRED_TIMEOUT_MS });
}

async function runDeferredSdks(): Promise<void> {
  // The async wrapper turns a synchronous throw into a rejection, so one SDK never stops the others.
  const results = await Promise.allSettled(deferredInitializers.map(async (init) => init()));
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`SDK initializer "${deferredInitializers[index]?.name}" failed`, result.reason);
    }
  });
}
