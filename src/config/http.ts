import { env } from '@/config/env';
import { selectToken, useSessionStore } from '@/features/auth/store/session/session.store';
import { configureHttp } from '@/shared/lib/http/client';

export function setupHttp(): void {
  configureHttp({
    baseUrl: env.API_URL,
    // The session store already holds the token in memory (read once from SecureStore at startup).
    getToken: () => selectToken(useSessionStore.getState()),
    // Any 401 ends the session: the root guard then swaps (app) for (auth), and setupAuth clears the cache.
    onUnauthorized: () => useSessionStore.getState().clearSession(),
  });
}
