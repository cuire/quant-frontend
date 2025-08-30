import giftsData from '@/backend-mocks/gifts.json';
import channelsData from '@/backend-mocks/channels.json';
import meData from '@/backend-mocks/me.json';

export interface Gift {
  id: string;
  short_name: string;
  full_name: string;
  type: string;
  image_url: string | null;
  floor_price: string;
  supply: number;
  is_active: boolean;
  count: number;
}

export interface Channel {
  id: number;
  gifts: Record<string, number>;
  price: number;
  my_channel: boolean;
  invite_link: string;
  description: string | null;
  stars_count: number;
  type: string;
  is_active: boolean;
}

export interface User {
  user_id: number;
  photo_url: string;
  first_name: string;
  last_name: string;
  lang: string;
  username: string;
  is_premium: boolean;
  referral_code: string;
  balance: number;
  total_volume: number;
  total_purchases: number;
  total_sales: number;
  channel_waiting_id: number | null;
  channel_waiting_started_at: string | null;
  channel_waiting_username: string | null;
  referrals_count: number;
  referrals_amount: number;
  theme: string;
  filters: {
    sort_by: string;
    only_exact_gift: boolean;
    show_upgraded_gifts: boolean;
  };
  joined_main_channel: boolean;
}

// Mock loader for gifts
export const loadGifts = async (): Promise<Gift[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return giftsData as Gift[];
};

// Mock loader for channels
export const loadChannels = async (): Promise<Channel[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return channelsData.channels as unknown as Channel[];
};

// Mock loader for user data
export const loadUser = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return meData as User;
};

// Helper function to get gifts for a channel
export const getChannelGifts = (channel: Channel, allGifts: Gift[]): Array<{
  gift: Gift;
  quantity: number;
}> => {
  return Object.entries(channel.gifts).map(([giftId, quantity]) => {
    const gift = allGifts.find(g => g.id === giftId);
    return {
      gift: gift!,
      quantity
    };
  }).filter(item => item.gift);
};

// Helper function to generate channel title from gifts
export const generateChannelTitle = (channelGifts: Array<{gift: Gift; quantity: number}>): string => {
  if (channelGifts.length === 0) return 'Empty Channel';
  
  const firstGift = channelGifts[0];
  if (channelGifts.length === 1) {
    return `${firstGift.gift.short_name} x${firstGift.quantity}`;
  }
  
  const totalItems = channelGifts.reduce((sum, item) => sum + item.quantity, 0);
  return `${firstGift.gift.short_name} & ${channelGifts.length - 1} more (${totalItems} items)`;
};
