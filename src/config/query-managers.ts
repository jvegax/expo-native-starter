import { focusManager, onlineManager } from '@tanstack/react-query';
import { addNetworkStateListener, getNetworkStateAsync, type NetworkState } from 'expo-network';
import { AppState } from 'react-native';

// TanStack Query listens to window focus and navigator.onLine by default, neither of which exists
// in React Native. These listeners give it the native equivalents: refetch stale queries when the
// app returns to the foreground, pause fetches and mutations while offline and resume on reconnect.

// An unknown reading (undefined) counts as online so a missing value never pauses every query.
function isOnline(state: NetworkState): boolean {
  return state.isConnected !== false;
}

export function setupQueryManagers(): void {
  focusManager.setEventListener((setFocused) => {
    const subscription = AppState.addEventListener('change', (status) => setFocused(status === 'active'));
    return () => subscription.remove();
  });

  onlineManager.setEventListener((setOnline) => {
    // The listener only fires on changes, so read the current state once.
    getNetworkStateAsync()
      .then((state) => setOnline(isOnline(state)))
      .catch((error: unknown) => console.warn('query-managers: could not read network state', error));
    const subscription = addNetworkStateListener((state) => setOnline(isOnline(state)));
    return () => subscription.remove();
  });
}
