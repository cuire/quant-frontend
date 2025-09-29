// Global Telegram typings to allow optional usage like window.Telegram?.WebApp?.openTelegramLink

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        openTelegramLink?: (url: string) => void;
      };
    };
  }
}

export {};


