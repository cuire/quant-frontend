// Simple API functions
import { initData } from '@telegram-apps/sdk';
import { config } from './config.ts';

// Basic types
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

export interface Channel {
  type: 'fast' | undefined;
  id: number;
  username: string;
  title: string;
  description?: string;
  photo_url?: string;
  subscribers_count: number;
  price: number;
  is_for_sale: boolean;
  owner_id?: number;
  created_at?: string;
  updated_at?: string;
  gifts?: Record<number, number>;  // { gift_id: quantity }
}

export interface UserChannel extends Channel {
  transferring_end_at: string | undefined;
  gifts: Record<string, number>;  // { gift_id: quantity }
  status: string;
  waiting_started_at?: string;
  invite_link: string;
  my_channel: boolean;
  transferring_started_at?: string;
  transferring_to_id?: number;
  transferring_to_username?: string;
  transferring_to_full_name?: string;
  stars_count: number;
  item_type?: string;
}

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

export interface GiftAttribute {
  type: string;
  value: string;
  rarity_per_mille: number;
  floor: string;
}

// New types for /gifts/gifts endpoint
export interface GiftModel {
  id: string;
  name: string;
  rarity_per_mille: number;
  floor: string;
  url: string;
}

export interface GiftBackdrop {
  id: string;
  name: string;
  floor: string;
  rarity_per_mille: number;
  centerColor: string;
  edgeColor: string;
  patternColor: string;
  textColor: string;
}

export interface GiftSymbol {
  id: string;
  name: string;
  floor: string;
  rarity_per_mille: number;
  url: string;
}

export interface GiftWithDetails {
  id: string;
  short_name: string;
  full_name: string;
  type: string;
  image_url: string | null;
  floor_price: string;
  supply: number;
  is_active: boolean;
  new: boolean;
  new_color: string;
  premarket: boolean;
  count: number;
  models: GiftModel[];
}

export interface GiftsResponse {
  gifts: GiftWithDetails[];
  backdrops: GiftBackdrop[];
  symbols: GiftSymbol[];
}

export interface MarketGift {
  full_name: string;
  slug: string;
  gift_id: string;
  model_id: number;
  backdrop_id: number;
  symbol_id: number;
  price: number;
  my_gift: boolean;
  pre_market_until: string | null;
  gift_frozen_until: string | null;
  type: string;
  model_floor: number;
  backdrop_floor: number;
  symbol_floor: number;
  model_backdrops_floor: Record<string, any>;
  model_symbols_floor: Record<string, any>;
}

export interface Offer {
  id: number;
  channel_id: number;
  gifts_data?: Record<string, number> | {
    upgraded?: Record<string, string[]>;
  };
  channel_price: number;
  channel_stars: number;
  price: number;
  expires_at: string | null;
  channel_type: string | null;
}

export interface OffersResponse {
  received: Offer[];
  placed: Offer[];
}

// Base URL
const baseURL = import.meta.env.VITE_API_URL ||  "https://quant-marketplace-dev.top/api";

// Helper function for API requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Restore Telegram init data
  initData.restore();
  
  const url = `${baseURL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  // Add Telegram auth if available
  let telegramInitData: string | undefined = initData.raw?.();
  
  // Use mock auth data in development if Telegram auth is not available
  if (config.debug.mockAuthData) {
    telegramInitData = config.debug.mockAuthData;
    console.log('🔧 Using mock auth data for development');
  }
  
  if (telegramInitData) {
    headers["Authorization"] = `Bearer ${telegramInitData}`;
    console.log('🔑 Adding Authorization header:', `Bearer ${telegramInitData.substring(0, 50)}...`);
  } else {
    console.log('⚠️ No Telegram init data available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
        'Authorization': `Bearer ${telegramInitData}`,
        'Content-Type': 'application/json',
    },
  });


  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// User functions
export async function getUser(): Promise<User> {
  return request<User>("/users/me");
}

export async function updateLanguage(language: string): Promise<User> {
  return request<User>("/users/me/language", {
    method: "POST",
    body: JSON.stringify({ language }),
  });
}

const filtersToUrlParams = (filters: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        // Handle arrays by appending each element
        value.forEach(item => {
          params.append(key, item.toString());
        });
      } else {
        params.append(key, value.toString());
      }
    }
  });
  return params;
};



// Bounds interface for channels API response
export interface ChannelBounds {
  min_price: number;
  max_price: number;
  min_count: number;
  max_count: number;
}

export interface ChannelsResponse {
  channels: Channel[];
  bounds: ChannelBounds;
}

// Channel functions
export async function getChannels(
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
): Promise<Channel[]> {
  let params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params = new URLSearchParams([...filtersToUrlParams(filters), ...params]);
  
  const data = await request<{channels: Channel[]}>(`/channels?${params.toString()}`);
  return data.channels || [];
}

// Get channels with bounds data
export async function getChannelsWithBounds(
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
): Promise<ChannelsResponse> {
  let params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params = new URLSearchParams([...filtersToUrlParams(filters), ...params]);
  
  const data = await request<ChannelsResponse>(`/channels?${params.toString()}`);
  return data;
}

export async function marketGetGifts(
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
): Promise<MarketGift[]> {
  let params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params = new URLSearchParams([...filtersToUrlParams(filters), ...params]);

  const data = await request<{gifts: MarketGift[]}>(`/market/gifts?${params.toString()}`);
  return data.gifts || [];
}

export async function getUserChannels(): Promise<Channel[]> {
  const response = await request<{ channels: Channel[] }>("/users/me/channels");
  return response.channels || [];
}

export async function getMeChannels(
  page = 1, 
  limit = 20
): Promise<UserChannel[]> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const data = await request<{items: UserChannel[]}>(`/users/me/items?${params.toString()}`);
  const items = data.items.filter((item: UserChannel) => item.item_type === 'channel');
  return items || [];
}

export async function addChannel(inviteLink: string): Promise<Channel> {
  return request<Channel>("/channels/add", {
    method: "POST",
    body: JSON.stringify({ invite_link: inviteLink }),
  });
}

// Gift functions
export async function getGifts(): Promise<Gift[]> {
  return request<Gift[]>("/gifts");
}

// New function for getting gifts with filters data
export async function getGiftsWithFilters(): Promise<GiftsResponse> {
  return request<GiftsResponse>("/gifts/gifts");
}

// Activity functions
export interface Activity {
  id: number;
  activity_type: 'gift' | 'channel';
  gift_id: string | number;
  is_upgraded: boolean;
  gifts_data?: Record<string, number> | {
    upgraded?: Record<string, string[]>;
  };
  channel_stars: number;
  type: string;
  amount: number;
  channel_id: number | null;
  created_at: string;
  slug: string;
  user_gift_type?: string | null;
  gift_data?: {
    id: number;
    slug: string;
    type: string;
    image_url: string | null;
    price: number;
    status: string;
    pre_market_until: string | null;
    gift_frozen_until: string | null;
  } | null;
  base_gift_data?: {
    id: number;
    short_name: string;
    full_name: string;
    type: string;
    image_url: string | null;
    supply: number;
    stars: number;
  } | null;
  model_data?: {
    id: number;
    name: string;
    url: string | null;
    rarity_per_mille: number;
    floor: number;
  } | null;
  backdrop_data?: {
    id: number;
    name: string;
    centerColor: string;
    edgeColor: string;
    patternColor: string;
    textColor: string;
    rarity_per_mille: number;
    floor: number;
  } | null;
  symbol_data?: {
    id: number;
    name: string;
    url: string | null;
    rarity_per_mille: number;
    floor: number;
  } | null;
}

export interface UserActivityResponse {
  activities: Activity[];
}

export async function getActivity(
  limit = 20,
  offset = 0,
  onlyExactGift = false,
  showUpgradedGifts = true
): Promise<Activity[]> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  params.append('only_exact_gift', onlyExactGift.toString());
  params.append('show_upgraded_gifts', showUpgradedGifts.toString());
  
  const data = await request<Activity[]>(`/activity?${params.toString()}`);
  return data || [];
}

// New activity endpoints for split backend
export async function getActivityGifts(
  page = 1,
  limit = 20,
  filters: Record<string, any> = {}
): Promise<Activity[]> {
  let params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params = new URLSearchParams([...filtersToUrlParams(filters), ...params]);
  
  const data = await request<Activity[]>(`/activity/gifts?${params.toString()}`);
  return data || [];
}

export async function getActivityChannels(
  page = 1,
  limit = 20,
  filters: Record<string, any> = {}
): Promise<Activity[]> {
  let params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params = new URLSearchParams([...filtersToUrlParams(filters), ...params]);
  
  const data = await request<Activity[]>(`/activity/channels?${params.toString()}`);
  return data || [];
}


const activityTypes = ["purchase", "sale", "offer_sent", "offer_received", "offer_accepted", "offer_rejected", "offer_cancelled", "deposit", "withdrawal", "referral_reward", "reward_by_admin", "listed", "price_changed", "transferred", "upgraded", "unlisted", "deleted", "returned"] as const;

type ActivityType = (typeof activityTypes)[number];

const storageActivityTypes: ActivityType[] = ["purchase", "sale", "offer_sent", "offer_received", "offer_accepted", "offer_rejected", "offer_cancelled", "listed", "price_changed", "transferred", "upgraded", "unlisted", "deleted", "returned"];

export async function getUserActivity(
  page = 1,
  limit = 20,
  types: ActivityType[] = storageActivityTypes,
): Promise<UserActivityResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  for (const type of types) {
    params.append('activity_types', type);
  }
  
  const data = await request<UserActivityResponse>(`/users/me/activity?${params.toString()}`);
  return data;
}

// Offer functions
export async function getOffers(
  page = 1,
  limit = 20
): Promise<OffersResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const data = await request<OffersResponse>(`/users/me/offers?${params.toString()}`);
  return data;
}

export async function acceptOffer(offerId: number): Promise<void> {
  return request<void>(`/offers/${offerId}/accept`, {
    method: 'POST',
  });
}

export async function rejectOffer(offerId: number): Promise<void> {
  return request<void>(`/offers/${offerId}/reject`, {
    method: 'POST',
  });
}

export async function cancelOffer(offerId: number): Promise<void> {
  return request<void>(`/offers/${offerId}/cancel`, {
    method: 'POST',
  });
}

export async function createOffer(
  channelId: number, 
  price: number, 
  gifts: Record<string, number>, 
  timezone: string = 'Europe/Moscow', 
  durationDays: number = 7
): Promise<void> {
  return request<void>(`/channels/${channelId}/offer`, {
    method: 'POST',
    body: JSON.stringify({
      price,
      gifts,
      timezone,
      duration_days: durationDays
    }),
  });
}

export async function purchaseChannel(
  channelId: number,
  price: number,
  gifts: Record<string, number>,
  timezone: string = 'Europe/Moscow'
): Promise<void> {
  return request<void>(`/channels/${channelId}/purchase-waiting`, {
    method: 'POST',
    body: JSON.stringify({
      price,
      gifts,
      timezone
    }),
  });
}

export async function purchaseGift(
  giftId: string,
  price: number
): Promise<void> {
  return request<void>(`/usergifts/${giftId}/purchase`, {
    method: 'POST',
    body: JSON.stringify({
      price
    }),
  });
}

export async function offerGift(
  giftId: string,
  price: number
): Promise<void> {
  return request<void>(`/usergifts/${giftId}/offer`, {
    method: 'POST',
    body: JSON.stringify({
      price
    }),
  });
}
