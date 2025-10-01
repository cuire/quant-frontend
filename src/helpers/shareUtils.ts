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

    // Try Telegram WebApp share first
    const tg = (window as any).Telegram as { WebApp?: { openTelegramLink?: (url: string) => void } } | undefined;
    if (tg?.WebApp?.openTelegramLink) {
      const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      tg.WebApp.openTelegramLink(telegramShareUrl);
    } else if (navigator.share) {
      // Use native Web Share API
      navigator.share({
        title: "QuantMarket - Gift Channel",
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        // Fallback to copying link
        copyToClipboard(`${shareText}\n\n${shareUrl}`);
      });
    } else {
      // Fallback to copying the link
      copyToClipboard(`${shareText}\n\n${shareUrl}`);
    }
  } catch (error) {
    console.error("Failed to share channel", error);
  }
};

const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Channel link copied! Share it with your friends.");
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Channel link copied! Share it with your friends.");
  }
};

export const shareGift = (giftId: string) => {
  try {
    const shareText = `Gift ${giftId}`;
    const shareUrl = `https://t.me/QuantMarketRobot/market?startapp=gift${giftId}`;
    if (navigator.share) {
      // Use native Web Share API
      navigator.share({
        title: "QuantMarket - Gift",
        text: shareText,
        url: shareUrl,
      }).catch(() => {
        // Fallback to copying link
        copyToClipboard(`${shareText}\n\n${shareUrl}`);
      });
    } else {
      // Fallback to copying the link
      copyToClipboard(`${shareText}\n\n${shareUrl}`);
    }
  } catch (error) {
    console.error("Failed to share gift", error);
  }
};