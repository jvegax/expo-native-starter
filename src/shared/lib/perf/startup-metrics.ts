// Startup and responsiveness marks on React Native's Web Performance API (RN 0.86 installs
// `performance` and `PerformanceObserver` globally when the native module exists). Marks and
// measures show up in React Native DevTools' Performance panel; send them to analytics if needed.

/** Non-standard RN extension, not in the DOM typings: native timestamps (ms, performance time origin). */
type StartupTiming = { startTime?: number | null };
type ReactNativePerformance = Performance & { rnStartupTiming?: StartupTiming };

let ttiMeasured = false;

function nativeStartTime(): number | undefined {
  try {
    const startTime = (performance as ReactNativePerformance).rnStartupTiming?.startTime;
    return typeof startTime === 'number' ? startTime : undefined;
  } catch {
    return undefined; // Legacy performance polyfill: no native startup timing.
  }
}

/**
 * Marks `screen-interactive:<name>` and, the first time per process, measures `tti` from the
 * native app start to now. Call it in the first screen's effect, once its content is usable.
 */
export function markScreenInteractive(name: string): void {
  if (typeof performance === 'undefined' || typeof performance.mark !== 'function') return;
  performance.mark(`screen-interactive:${name}`);

  if (ttiMeasured) return;
  ttiMeasured = true;
  const start = nativeStartTime();
  if (start === undefined || typeof performance.measure !== 'function') return;
  try {
    performance.measure('tti', { start, end: performance.now() });
  } catch (error) {
    console.warn('[perf] could not measure tti', error);
  }
}

/**
 * Reports every JS task longer than 50 ms (a frozen frame for the user). Returns the unsubscribe.
 * A no-op where the runtime does not support `longtask` entries.
 */
export function observeLongTasks(report: (task: PerformanceEntry) => void): () => void {
  if (
    typeof PerformanceObserver === 'undefined' ||
    !PerformanceObserver.supportedEntryTypes?.includes('longtask')
  ) {
    return () => {};
  }
  const observer = new PerformanceObserver((list) => list.getEntries().forEach(report));
  observer.observe({ type: 'longtask', buffered: true });
  return () => observer.disconnect();
}
