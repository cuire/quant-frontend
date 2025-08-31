// Simple configuration
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || "https://quant-marketplace-dev.top/api",
  },
  
  telegram: {
    botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "quant_marketplace_bot",
  },

  debug: {
    mockAuthData: import.meta.env.DEV ? 
      "query_id=AAHdilYOAwAAAN2KVg4-itBe&user=%7B%22id%22%3A6683003613%2C%22first_name%22%3A%22watafc%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ruferscoll%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FernaHbFFI4j2su89noA2I-3CG8iTTnohJceSZ_MQppiNal2Z6N2HV6r_4bjRdPot.svg%22%7D&auth_date=1756642845&signature=KFE2_tnueT7kTByrM6fDo7l6FS25ULcBWzdwBgNH3VmT1yfI2DXW7ZE7r5aFxUbbnJJueymjOSk2ilQY1WNhBQ&hash=d88f23edc535787c0b24a90eb99c245d665f95e849d3c74096cfe645fff39345" : 
      undefined,
  },
} as const;
