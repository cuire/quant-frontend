import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';
import zhTranslations from '@/locales/zh.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ru: {
    translation: ruTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
};

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en', // default language from localStorage or 'en'
    fallbackLng: 'en', // fallback language if translation is missing
    
    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    // Optional: debug mode for development
    debug: false,
    
    // Optional: namespace configuration
    defaultNS: 'translation',
    
    // Optional: key separator (default is '.')
    keySeparator: '.',
    
    // Optional: nested key separator
    nsSeparator: ':',
  });

// Save language to localStorage whenever it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;

