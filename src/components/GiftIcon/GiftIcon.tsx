import { type FC, useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface GiftIconProps {
  giftId: string;
  size?: string | number;
  className?: string;
  badge?: {
    text: string;
    backgroundColor: string;
    color: string;
  };
}

export const GiftIcon: FC<GiftIconProps> = ({ 
  giftId, 
  size = 24, 
  className = '',
  badge,
}) => {
  const iconUrl = `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const sizeStr = typeof size === 'number' ? size.toString() : size;
  const isPercentage = sizeStr.includes('%');
  
  return (
    <div style={{ position: 'relative' }}>
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
      {badge && (
        <div style={{ position: 'absolute', height: '11px', width: '28px', bottom: '0px', left: '50%', transform: 'translate(-50%, 0%)', backgroundColor: badge.backgroundColor, color: badge.color, borderRadius: '12px', fontSize: '7.26px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <span style={{ marginTop: '-1px' }}>{badge.text}</span>
        </div>
      )}
    </div>
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
  
  // Lottie animation state
  const [lottieData, setLottieData] = useState<any>(null);
  const [lottieError, setLottieError] = useState(false);
  
  // Don't set width/height attributes if size is a percentage (use CSS instead)
  const isPercentage = size.includes('%');
  
  // Fetch Lottie animation when component mounts
  useEffect(() => {
    const fetchLottieAnimation = async () => {
      if (!giftSlug || giftSlug === 'None-None') return;
      
      try {
        const lottieUrl = `https://nft.fragment.com/gift/${giftSlug}.lottie.json`;
        const response = await fetch(lottieUrl);
        
        if (!response.ok) {
          throw new Error('Lottie animation not found');
        }
        
        const animationData = await response.json();
        setLottieData(animationData);
        setLottieError(false);
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
        setLottieError(true);
      }
    };

    fetchLottieAnimation();
  }, [giftSlug]);
  
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

  // Render Lottie animation if available
  const renderContent = () => {
    if (lottieData && !lottieError) {
      return (
        <Lottie 
          animationData={lottieData}
          loop={false}
          autoplay={true}
          style={{ 
            width: isPercentage ? size : `${size}px`, 
            height: isPercentage ? size : `${size}px`,
            borderRadius: '12px',
            marginBottom: '4px',
            overflow: 'hidden'
          }}
          className={className}
        />
      );
    }
    return imgElement;
  };

  // If no title or subtitle, just return the content
  if (!title && !subtitle) {
    return renderContent();
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {renderContent()}
      <div style={{
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        width: '100%',
        padding: '4px',
        zIndex: 10
      }}>
        {title && (
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
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
            marginTop: title ? '2px' : 0,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
