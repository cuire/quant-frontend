// Simple configuration
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || "https://quant-marketplace-dev.top",
  },

  telegramChannelUrl: import.meta.env.VITE_TELEGRAM_CHANNEL_URL || "https://t.me/quantmarketplace",
  
  commissionRate: import.meta.env.VITE_COMMISSION_RATE || 0.05,

  telegram: {
    botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "quant_marketplace_bot",
  },

  settings: {
    politicsUrl: import.meta.env.VITE_SETTINGS_POLITICS_URL || 'https://t.me/quantmarketplace_politics',
    supportUrl: import.meta.env.VITE_SETTINGS_SUPPORT_URL || 'https://t.me/quantmarketplace_support',
  },

  debug: {
    mockAuthData: import.meta.env.VITE_MOCK_AUTH_DATA || undefined,
  },

  guide: {
    items: [
      {
        title: 'How to put a channel up for sale',
        description: 'You can read the guide on how to properly sell a channel on our market.',
        link: import.meta.env.VITE_GUIDE_LINK_CHANNEL_SALE || 'https://telegra.ph/How-to-Sell-Your-Channel-on-QuantMarket-12-23'
      },
      {
        title: 'How to Sell Upgraded Gifts',
        description: 'You can open a short guide on how to correctly add a gift for sale.',
        link: import.meta.env.VITE_GUIDE_LINK_UPGRADED_GIFTS || 'https://telegra.ph/How-to-Sell-Upgraded-Gifts-12-23'
      },
      {
        title: 'How to Sell Unimproved Gifts',
        description: 'A guide on how to properly sell non-upgraded gifts given to our channel account.',
        link: import.meta.env.VITE_GUIDE_LINK_UNIMPROVED_GIFTS || 'https://telegra.ph/How-to-Sell-Unimproved-Gifts-12-23'
      },
      {
        title: 'About how premarket works with us',
        description: 'You can read the guide on how to properly sell gifts that are not yet unlocked for sale.',
        link: import.meta.env.VITE_GUIDE_LINK_PREMARKET || 'https://telegra.ph/About-Premarket-12-23'
      }
    ]
  }
};
