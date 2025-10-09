import { useTranslation } from 'react-i18next';

export type Language = 'en' | 'ru' | 'zh';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

/**
 * Hook to manage language switching
 * @returns Object with current language, change language function, and available languages
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
    // Optionally save to localStorage
    localStorage.setItem('language', lng);
  };

  // Load language from localStorage on init
  const currentLanguage = (i18n.language || 'en') as Language;

  return {
    currentLanguage,
    changeLanguage,
    languages,
  };
};

