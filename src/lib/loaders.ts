// TanStack loaders for data fetching
import { getUser, getChannels, getUserChannels, getGifts } from './api';

// TODO: Add proper error handling for loaders
// TODO: Add loading states
// TODO: Add caching strategies

export const userLoader = async () => {
  try {
    return await getUser();
  } catch (error) {
    console.error('Failed to load user:', error);
    throw new Error('Failed to load user data');
  }
};

export const channelsLoader = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    return await getChannels(page, limit);
  } catch (error) {
    console.error('Failed to load channels:', error);
    throw new Error('Failed to load channels');
  }
};

export const userChannelsLoader = async () => {
  try {
    return await getUserChannels();
  } catch (error) {
    console.error('Failed to load user channels:', error);
    throw new Error('Failed to load user channels');
  }
};

export const giftsLoader = async () => {
  try {
    return await getGifts();
  } catch (error) {
    console.error('Failed to load gifts:', error);
    throw new Error('Failed to load gifts');
  }
};
