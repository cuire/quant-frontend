import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/lib/api-hooks';

/**
 * Component that syncs the i18n language with the user's language preference
 * This component should be mounted in the root of the app
 */
export const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { data: user } = useUser();

  useEffect(() => {
    if (user?.lang) {
      // Map Telegram language codes to our supported languages
      const langMap: Record<string, string> = {
        'en': 'en',
        'ru': 'ru',
        'zh': 'zh',
        'zh-hans': 'zh',
        'zh-cn': 'zh',
        'zh-hant': 'zh',
        'zh-tw': 'zh',
      };

      // Get the language code (first part before any hyphen)
      const baseLang = user.lang.toLowerCase().split('-')[0];
      
      // Find the mapped language or default to English
      const targetLang = langMap[user.lang.toLowerCase()] || langMap[baseLang] || 'en';
      
      // Only change if different from current language
      if (i18n.language !== targetLang) {
        i18n.changeLanguage(targetLang);
      }
    }
  }, [user?.lang, i18n]);

  return null; // This component doesn't render anything
};

