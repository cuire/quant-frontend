// import { config } from './config.ts';


export const getGiftIcon = (giftId: string) => {
  return `https://quant-marketplace.com/assets/gifts/${giftId}/default.png`;
}

export const getGiftModelIcon = (giftId: string, modelId: string) => {
  return `https://quant-marketplace.com/assets/gifts/${giftId}/${modelId}.png`;
}
