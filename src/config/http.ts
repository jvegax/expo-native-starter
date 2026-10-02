import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys';
import { configureHttp } from '@/shared/lib/http/client';
import { storage } from '@/shared/lib/storage/storage';

export function setupHttp(): void {
  configureHttp({
    baseUrl: env.API_URL,
    getToken: () => storage.get(STORAGE_KEYS.authToken),
    onUnauthorized: () => {
      // Hook point for an auth feature: clear session, redirect to login, etc.
      storage.remove(STORAGE_KEYS.authToken);
    },
  });
}
