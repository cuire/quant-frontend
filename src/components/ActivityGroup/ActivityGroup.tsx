import { Activity } from '@/lib/api';
import { ActivityItem } from '@/components/ActivityItem';
import './ActivityGroup.css';

interface ActivityGroupProps {
  date: string;
  activities: Activity[];
  giftNameById: (id: string) => string;
  giftIconById: (id: string) => string;
  onActivityClick: (activity: Activity) => void;
}

export function ActivityGroup({ 
  date, 
  activities, 
  giftNameById, 
  giftIconById, 
  onActivityClick 
}: ActivityGroupProps) {
  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="activity-group">
      <div className="activity-group__date">
        {formatGroupDate(date)}
      </div>
      <div className="activity-group__items">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            giftName={giftNameById(String(activity.gift_id))}
            giftIcon={giftIconById(String(activity.base_gift_data?.id ?? 'unknown'))}
            onItemClick={onActivityClick}
          />
        ))}
      </div>
    </div>
  );
}
