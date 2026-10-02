import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/config/i18n/languages';
import { defaultNS, resources } from '@/config/i18n/resources';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys';
import { storage } from '@/shared/lib/storage/storage';

function toSupported(code: string | null | undefined): SupportedLanguage | undefined {
  return SUPPORTED_LANGUAGES.find((language) => language === code);
}

// Storage is synchronous, so a language picked in a previous session is applied on the first frame.
function detectLanguage(): SupportedLanguage {
  return (
    toSupported(storage.get(STORAGE_KEYS.language)) ?? toSupported(getLocales()[0]?.languageCode) ?? DEFAULT_LANGUAGE
  );
}

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});
