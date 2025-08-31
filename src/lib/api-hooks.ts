// Simple React Query hooks
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getUser, updateLanguage, getChannels, getUserChannels, getMeChannels, addChannel, getGifts, getActivity, getOffers, acceptOffer, rejectOffer, cancelOffer } from './api';

// Query keys
export const queryKeys = {
  user: ['user'] as const,
  channels: (page: number, limit: number, filters?: Record<string, any>) => 
    ['channels', page, limit, filters] as const,
  channelsInfinite: (limit: number, filters?: Record<string, any>) => 
    ['channelsInfinite', limit, filters] as const,
  userChannels: ['userChannels'] as const,
  meChannels: (page: number, limit: number) => 
    ['meChannels', page, limit] as const,
  meChannelsInfinite: (limit: number) => 
    ['meChannelsInfinite', limit] as const,
  gifts: ['gifts'] as const,
  activity: (limit: number, offset: number, onlyExactGift: boolean, showUpgradedGifts: boolean) => 
    ['activity', limit, offset, onlyExactGift, showUpgradedGifts] as const,
  activityInfinite: (limit: number, onlyExactGift: boolean, showUpgradedGifts: boolean) => 
    ['activityInfinite', limit, onlyExactGift, showUpgradedGifts] as const,
  offers: (page: number, limit: number) => 
    ['offers', page, limit] as const,
  offersInfinite: (limit: number) => 
    ['offersInfinite', limit] as const,
};

// User hooks
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getUser,
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

// Channel hooks
export const useChannels = (
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: queryKeys.channels(page, limit, filters),
    queryFn: () => getChannels(page, limit, filters),
  });
};

export const useChannelsInfinite = (
  limit = 20,
  filters: Record<string, any> = {}
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.channelsInfinite(limit, filters),
    queryFn: ({ pageParam = 1 }) => getChannels(pageParam, limit, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserChannels = () => {
  return useQuery({
    queryKey: queryKeys.userChannels,
    queryFn: getUserChannels,
  });
};

export const useMeChannels = (
  page = 1, 
  limit = 20
) => {
  return useQuery({
    queryKey: queryKeys.meChannels(page, limit),
    queryFn: () => getMeChannels(page, limit),
  });
};

export const useMeChannelsInfinite = (
  limit = 20
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.meChannelsInfinite(limit),
    queryFn: ({ pageParam = 1 }) => getMeChannels(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userChannels });
    },
  });
};

// Gift hooks
export const useGifts = () => {
  return useQuery({
    queryKey: queryKeys.gifts,
    queryFn: getGifts,
  });
};

// Activity hooks
export const useActivity = (
  limit = 20,
  offset = 0,
  onlyExactGift = false,
  showUpgradedGifts = true
) => {
  return useQuery({
    queryKey: queryKeys.activity(limit, offset, onlyExactGift, showUpgradedGifts),
    queryFn: () => getActivity(limit, offset, onlyExactGift, showUpgradedGifts),
  });
};

export const useActivityInfinite = (
  limit = 20,
  onlyExactGift = false,
  showUpgradedGifts = true
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.activityInfinite(limit, onlyExactGift, showUpgradedGifts),
    queryFn: ({ pageParam = 0 }) => getActivity(limit, pageParam, onlyExactGift, showUpgradedGifts),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length * limit;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Offer hooks
export const useOffers = (
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: queryKeys.offers(page, limit),
    queryFn: () => getOffers(page, limit),
  });
};

export const useOffersInfinite = (
  limit = 20
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.offersInfinite(limit),
    queryFn: ({ pageParam = 1 }) => getOffers(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.received.length < limit && lastPage.placed.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAcceptOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: acceptOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useRejectOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};

export const useCancelOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};
