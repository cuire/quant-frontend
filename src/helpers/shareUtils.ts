import { shareURL } from '@telegram-apps/sdk-react';

export const shareChannel = (channelId: number, channelData?: any) => {
  try {
    let shareText = `Listed on Quant now\nChannel #${channelId}`;

    // Add gifts information if available
    if (channelData?.gifts) {
      const gifts = Object.entries(channelData.gifts).map(([giftId, quantity]) => {
        return `Gift ${giftId} x${quantity}`;
      });
      
      if (gifts.length > 0) {
        shareText += `\nGifts: ${gifts.join(", ")}`;
      }
    }

    // Add price information if available
    if (channelData?.price) {
      const formattedPrice = parseFloat(channelData.price) % 1 === 0
        ? Math.floor(channelData.price).toString()
        : channelData.price.toString();
      shareText += `\nPrice: ${formattedPrice} TON`;
    }

    const shareUrl = `https://t.me/QuantMarketRobot/market?startapp=channel${channelId}`;

    // Use Telegram SDK shareURL
    shareURL(shareUrl, shareText);
  } catch (error) {
    console.error("Failed to share channel", error);
  }
};

export const shareGift = (giftId: string) => {
  try {
    const shareText = `Gift ${giftId}`;
    const shareUrl = `https://t.me/QuantMarketRobot/market?startapp=gift${giftId}`;
    
    // Use Telegram SDK shareURL
    shareURL(shareUrl, shareText);
  } catch (error) {
    console.error("Failed to share gift", error);
  }
};