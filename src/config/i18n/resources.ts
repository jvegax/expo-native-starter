import { clubResources } from '@/features/club/i18n/resources';
import { homeResources } from '@/features/home/i18n/resources';
import { commonResources } from '@/shared/i18n/resources';

// One namespace per feature plus the shared "common" namespace.
// This is the only place allowed to deep-import a feature folder (features/<name>/i18n).
export const defaultNS = 'common';

export const resources = {
  en: {
    common: commonResources.en,
    home: homeResources.en,
    club: clubResources.en,
  },
  es: {
    common: commonResources.es,
    home: homeResources.es,
    club: clubResources.es,
  },
} as const;
