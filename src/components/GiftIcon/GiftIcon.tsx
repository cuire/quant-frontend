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
  title?: string;
  subtitle?: string;
}

export const UpgradedGiftSlugIcon: FC<UpgradedGiftSlugIconProps> = ({ 
  giftSlug, 
  size = '24', 
  className = '',
  title,
  subtitle
}) => {
  const iconUrl = `https://nft.fragment.com/gift/${giftSlug}.medium.jpg`;
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const isPercentage = size.includes('%');
  
  const imgElement = (
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

  // If no title or subtitle, just return the image
  if (!title && !subtitle) {
    return imgElement;
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {imgElement}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '100%',
        padding: '4px'
      }}>
        {title && (
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2
          }}>
            {title}
          </div>
        )}
        {subtitle && (
          <div style={{
            fontSize: '15px',
            color: '#ffffff65',
            fontWeight: 500,
            lineHeight: 1.2,
            marginTop: title ? '2px' : 0
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
