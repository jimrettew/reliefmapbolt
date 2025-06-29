import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../localization/en.json';
import esTranslations from '../localization/es.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
