import type { FC } from 'react';

interface GiftIconProps {
  giftId: string;
  size?: number;
  className?: string;
}

export const GiftIcon: FC<GiftIconProps> = ({ 
  giftId, 
  size = 24, 
  className = '' 
}) => {
  const iconUrl = `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  
  return (
    <img 
      src={iconUrl}
      alt={`Gift ${giftId}`}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback to placeholder if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder-gift.svg';
      }}
    />
  );
};
