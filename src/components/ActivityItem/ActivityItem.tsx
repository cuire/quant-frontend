import { Activity } from '@/lib/api';
import './ActivityItem.css';
import { GiftIcon, GiftSlugIcon } from '../GiftIcon';

interface ActivityItemProps {
  activity: Activity;
  giftName: string;
  giftIcon: string;
  onItemClick: (activity: Activity) => void;
}

export function ActivityItem({ activity, giftName, giftIcon, onItemClick }: ActivityItemProps) {
  const getTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'purchase': 'Purchase',
      'sale': 'Sale',
      'offer_sent': 'Offer sent',
      'offer_received': 'Offer received',
      'offer_accepted': 'Offer accepted',
      'offer_rejected': 'Offer rejected',
      'offer_cancelled': 'Offer cancelled',
      'listed': 'Listed',
      'unlisted': 'Unlisted',
      'price_changed': 'Price changed',
      'transferred': 'Transferred',
      'upgraded': 'Upgraded',
      'deleted': 'Deleted',
      'returned': 'Returned'
    };
    return typeMap[type] || type;
  };

  const getActivityTypeLabel = () => {
    return { text: activity.activity_type === 'gift' ? 'Gift' : 'Channel', color: activity.activity_type === 'gift' ? 'yellow' : 'blue' };
  };

  const getGiftName = () => {
    if (activity.activity_type === 'gift' && activity.base_gift_data) {
      return activity.base_gift_data.full_name || activity.base_gift_data.short_name;
    }
    return giftName;
  };

  // For gifts, prefer GiftSlugIcon when slug present; fallback to base gift icon

  const getSubtitle = () => {
    const parts = [];
    if (activity.activity_type === 'gift') {
      parts.push(`#${activity.gift_id}`);
    } else if (activity.activity_type === 'channel') {
      parts.push(`#${activity.channel_id}`);
    }
    parts.push(getTypeDisplay(activity.type));
    return parts.join(' · ');
  };

  const getPriceDisplay = () => {
    if (activity.amount === 0) return null;

    const isPositive = ['sale', 'offer_accepted'].includes(activity.type);
    const sign = isPositive ? '+' : '-';
    const color = isPositive ? 'green' : 'red';

    return {
      amount: `${sign}${activity.amount} TON`,
      label: isPositive ? 'Received' : 'Paid',
      color
    };
  };

  const getAdditionalLabels = () => {
    const labels = [];

    // Gift-specific labels
    if (activity.activity_type === 'gift') {
      if (activity.is_upgraded) {
        labels.push({ text: 'NFT', color: 'purple' });
      }
    }

    // Channel-specific labels
    // if (activity.activity_type === 'channel') {
    //   if (activity.is_upgraded) {
    //     labels.push({ text: 'NFT', color: 'purple' });
    //   }
    // }

    return labels;
  };

  const priceDisplay = getPriceDisplay();
  const additionalLabels = getAdditionalLabels();
  const typeLabel = getActivityTypeLabel();

  return (
    <div 
      className="activity-item"
      onClick={() => onItemClick(activity)}
    >
      <div className="activity-item__icon">
        {activity.activity_type === 'gift' ? (
          activity.slug && activity.slug !== 'None-None' ? (
            <GiftSlugIcon giftSlug={activity.slug as string} size={'44'} className="activity-icon" />
          ) : (
            <GiftIcon giftId={(activity.base_gift_data?.id || activity.gift_id) as string} size={44} className="activity-icon" />
          )
        ) : (
            <img 
              src={`https://FlowersRestricted.github.io/gifts/${String(activity.gift_id)}/default.png`} 
              alt={getGiftName()}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder-gift.svg';
              }}
            />
        )}
      </div>

      <div className="activity-item__content">
        <div className="activity-item__title">{getGiftName()}</div>
        <div className="activity-item__subtitle">
          <span className="activity-item__subtitle-text">
            {getSubtitle()}
          </span>
          <div className="activity-item__labels">
            <span className={`activity-label activity-label--${typeLabel.color}`}>
              {typeLabel.text}
            </span>
            {additionalLabels.map((label, index) => (
              <span key={index} className={`activity-label activity-label--${label.color}`}>
                {label.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {priceDisplay && (
        <div className="activity-item__price">
          <div className={`activity-price activity-price--${priceDisplay.color}`}>
            {priceDisplay.amount}
          </div>
          <div className="activity-price__label">{priceDisplay.label}</div>
        </div>
      )}
    </div>
  );
}
