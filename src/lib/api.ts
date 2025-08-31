// Simple API functions
import { initData } from '@telegram-apps/sdk';
import { config } from './config.ts';

// Basic types
export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  balance: number;
  lang: string;
  theme: string;
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

// Channel functions
export async function getChannels(
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
): Promise<Channel[]> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  // Add filters
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
  
  const data = await request<{channels: Channel[]}>(`/channels?${params.toString()}`);
  return data.channels || [];
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
  
  const data = await request<{channels: UserChannel[]}>(`/users/me/channels?${params.toString()}`);
  return data.channels || [];
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

// Activity functions
export interface Activity {
  id: number;
  gift_id: string;
  is_upgraded: boolean;
  gifts_data: {
    upgraded: Record<string, number[]>;
  };
  channel_stars: number;
  type: string;
  amount: number;
  channel_id: number;
  created_at: string;
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
