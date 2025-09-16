import { Activity } from '@/lib/api';
import './ActivityItem.css';

interface ActivityItemProps {
  activity: Activity;
  giftName: string;
  giftIcon: string;
  onItemClick: (activity: Activity) => void;
}

export function ActivityItem({ activity, giftName, giftIcon, onItemClick }: ActivityItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      'offer_cancelled': 'Offer cancelled',
      'remove': 'Remove',
      'listing': 'Listing',
      'buy': 'Buy',
      'sell': 'Sell',
      'sell_by_offer': 'Sell by offer',
      'purchase': 'Purchase'
    };
    return typeMap[type] || type;
  };

  const getTypeLabel = (type: string) => {
    if (type === 'buy' || type === 'sell' || type === 'sell_by_offer' || type === 'listing') {
      return { text: 'Gift', color: 'yellow' };
    }
    if (type === 'offer_cancelled' || type === 'remove') {
      return { text: 'Channel', color: 'blue' };
    }
    return { text: 'Channel', color: 'blue' };
  };

  const getPriceDisplay = () => {
    if (activity.amount === 0) return null;
    
    const isPositive = activity.type === 'sell' || activity.type === 'sell_by_offer';
    const sign = isPositive ? '+' : '-';
    const color = isPositive ? 'green' : 'red';
    
    return {
      amount: `${sign}${activity.amount} TON`,
      label: isPositive ? 'Price' : 'Price',
      color
    };
  };

  const getAdditionalLabels = () => {
    const labels = [];
    
    if (activity.transfer_time) {
      labels.push({ text: `Transfer: ${activity.transfer_time}`, color: 'orange' });
    }
    
    if (activity.hold_time) {
      labels.push({ text: `Hold: ${activity.hold_time}`, color: 'teal' });
    }
    
    if (activity.channel_type === 'fast') {
      labels.push({ text: 'Fast', color: 'green' });
    }
    
    return labels;
  };

  const priceDisplay = getPriceDisplay();
  const additionalLabels = getAdditionalLabels();
  const typeLabel = getTypeLabel(activity.type);

  return (
    <div 
      className="activity-item"
      onClick={() => onItemClick(activity)}
    >
      <div className="activity-item__icon">
        <img 
          src={giftIcon} 
          alt={giftName}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/placeholder-gift.svg';
          }}
        />
      </div>
      
      <div className="activity-item__content">
        <div className="activity-item__title">{giftName}</div>
        <div className="activity-item__subtitle">
          <span className="activity-item__subtitle-text">
            #{activity.channel_id} · {getTypeDisplay(activity.type)}
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
