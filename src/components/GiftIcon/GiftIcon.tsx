import type { FC } from 'react';

interface GiftIconProps {
  giftId: string;
  size?: string;
  className?: string;
}

export const GiftIcon: FC<GiftIconProps> = ({ 
  giftId, 
  size = 24, 
  className = '' 
}) => {
  const iconUrl = `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const sizeStr = typeof size === 'number' ? size.toString() : size;
  const isPercentage = sizeStr.includes('%');
  
  return (
    <img 
      src={iconUrl}
      alt={`Gift ${giftId}`}
      {...(!isPercentage && { width: size, height: size })}
      className={className}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-gift.svg';
      }}
    />
  );
};

interface GiftSlugIconProps {
  giftSlug: string;
  size?: string;
  className?: string;
}

export const GiftSlugIcon: FC<GiftSlugIconProps> = ({ 
  giftSlug, 
  size = '24', 
  className = '' 
}) => {
  const iconUrl = `https://nft.fragment.com/gift/${giftSlug}.medium.jpg`;
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const isPercentage = size.includes('%');
  
  return (
    <img 
      src={iconUrl}
      alt={`Gift ${giftSlug}`}
      {...(!isPercentage && { width: size, height: size })}
      className={className}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-gift.svg';
      }}
    />
  );
};

interface UpgradedGiftSlugIconProps {
  giftSlug: string;
  size?: string;
  className?: string;
}

export const UpgradedGiftSlugIcon: FC<UpgradedGiftSlugIconProps> = ({ 
  giftSlug, 
  size = '24', 
  className = '' 
}) => {
  const iconUrl = `https://nft.fragment.com/gift/${giftSlug}.medium.jpg`;
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const isPercentage = size.includes('%');
  
  return (
    <img 
      src={iconUrl}
      alt={`Gift ${giftSlug}`}
      {...(!isPercentage && { width: size, height: size })}
      className={className}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-gift.svg';
      }}
    />
  );
};
