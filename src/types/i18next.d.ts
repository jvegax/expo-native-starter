import type { defaultNS, resources } from '@/config/i18n/resources';

// Makes t('club.listTitle') and useTranslation('club') fully typed from the JSON files.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
  }
}
