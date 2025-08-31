// Simple configuration
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || "https://quant-marketplace-dev.top/api",
  },

  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL || "https://t.me/quantmarketplace",
  
  telegram: {
    botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "quant_marketplace_bot",
  },

  debug: {
    mockAuthData: import.meta.env.MOCK_AUTH_DATA || undefined,
  },
} as const;
