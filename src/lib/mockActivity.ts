import activityData from '@/backend-mocks/activity.json';
import { Activity, UserActivityResponse } from './api';

// Mock loader for user activity
export const loadUserActivity = async (
  page = 1,
  limit = 20
): Promise<UserActivityResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const activities = activityData.activities.slice(startIndex, endIndex);
  
  return {
    activities
  };
};

// Mock loader for activity (general)
export const loadActivity = async (
  limit = 20,
  offset = 0,
  onlyExactGift = false,
  showUpgradedGifts = true
): Promise<Activity[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  let filteredActivities = [...activityData.activities];
  
  // Apply filters
  if (onlyExactGift) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.gifts_data && Object.keys(activity.gifts_data).length === 1
    );
  }
  
  if (!showUpgradedGifts) {
    filteredActivities = filteredActivities.filter(activity => !activity.is_upgraded);
  }
  
  // Apply pagination
  const startIndex = offset;
  const endIndex = startIndex + limit;
  
  return filteredActivities.slice(startIndex, endIndex);
};

// Helper function to generate more activity data for infinite scroll
export const generateMoreActivity = (baseActivities: Activity[], count: number): Activity[] => {
  const newActivities: Activity[] = [];
  const giftIds = [
    "5834651202612102354", "5832279504491381684", "5832497899283415733",
    "5834918435477259676", "5832644211639321671", "5832371318007268701",
    "6014697240977737490", "6014675319464657779", "6014591077976114307",
    "6012607142387778152", "6012435906336654262", "5998981470310368313",
    "5999298447486747746", "5895544372761461960", "5895603153683874485"
  ];
  
  const types = ['purchase', 'sale', 'transfer'];
  const channelIds = [6900, 6901, 6902, 6903, 6904, 6905, 6906, 6907, 6908, 6909];
  
  for (let i = 0; i < count; i++) {
    const giftId = giftIds[Math.floor(Math.random() * giftIds.length)];
    const channelId = channelIds[Math.floor(Math.random() * channelIds.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const isUpgraded = Math.random() > 0.7;
    const amount = Math.random() * 500 + 1;
    
    // Generate random date within the last 30 days
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const randomDate = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
    
    const activity: Activity = {
      id: baseActivities.length + i + 1,
      gift_id: giftId,
      is_upgraded: isUpgraded,
      gifts_data: {
        [giftId]: Math.floor(Math.random() * 10) + 1
      },
      channel_stars: Math.floor(Math.random() * 100),
      type,
      amount: Math.round(amount * 100) / 100,
      channel_id: channelId,
      created_at: randomDate.toISOString()
    };
    
    // Add hold_time to some activities (30% chance)
    if (Math.random() < 0.3) {
      const days = Math.floor(Math.random() * 30) + 1;
      const hours = Math.floor(Math.random() * 24);
      const seconds = Math.floor(Math.random() * 60);
      activity.hold_time = `${days}d ${hours}h ${seconds}s`;
    }
    
    newActivities.push(activity);
  }
  
  return newActivities;
};
