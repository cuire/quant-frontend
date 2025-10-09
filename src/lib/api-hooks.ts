// Simple React Query hooks
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getUser, updateLanguage, updateTheme, getChannels, getChannelsWithBounds, getUserChannels, getMeChannels, getMeGifts, addChannel, getGifts, getGiftsWithFilters, getActivity, getActivityGifts, getActivityChannels, getUserActivity, getOffers, acceptOffer, rejectOffer, cancelOffer, marketGetGifts, purchaseGift, offerGift, createItemSale, editGiftPrice, removeGiftFromSale, removeChannelFromSale, editChannelPrice, sellChannel, returnChannel, removeChannel, transferGift, receiveGift, getUserProfile, withdrawReferralBalance, getGiftModels, respondOffer, updateSetting, getWalletInfo, listWallets, connectWallet, disconnectWallet, initiateDeposit, initiateWithdrawal } from './api';

// Query keys
export const queryKeys = {
  user: ['user'] as const,
  userProfile: ['userProfile'] as const,
  channels: (page: number, limit: number, filters?: Record<string, any>) => 
    ['channels', page, limit, filters] as const,
  channelsInfinite: (limit: number, filters?: Record<string, any>) => 
    ['channelsInfinite', limit, filters] as const,
  channelsBounds: (filters?: Record<string, any>) => 
    ['channelsBounds', filters] as const,
  userChannels: ['userChannels'] as const,
  meChannels: (page: number, limit: number) => 
    ['meChannels', page, limit] as const,
  meChannelsInfinite: (limit: number) => 
    ['meChannelsInfinite', limit] as const,
  meGiftsInfinite: (limit: number) => 
    ['meGiftsInfinite', limit] as const,
  gifts: ['gifts'] as const,
  giftsWithFilters: ['giftsWithFilters'] as const,
  activity: (limit: number, offset: number, onlyExactGift: boolean, showUpgradedGifts: boolean) => 
    ['activity', limit, offset, onlyExactGift, showUpgradedGifts] as const,
  activityInfinite: (limit: number, onlyExactGift: boolean, showUpgradedGifts: boolean) => 
    ['activityInfinite', limit, onlyExactGift, showUpgradedGifts] as const,
  offers: (page: number, limit: number) => 
    ['offers', page, limit] as const,
  offersInfinite: (limit: number) => 
    ['offersInfinite', limit] as const,
  userActivity: (page: number, limit: number) => 
    ['userActivity', page, limit] as const,
  userActivityInfinite: (limit: number) => 
    ['userActivityInfinite', limit] as const,
  marketGifts: (page: number, limit: number, filters?: Record<string, any>) => 
    ['marketGifts', page, limit, filters] as const,
  marketGiftsInfinite: (limit: number, filters?: Record<string, any>) => 
    ['marketGiftsInfinite', limit, filters] as const,
  activityGifts: (page: number, limit: number, filters?: Record<string, any>) => 
    ['activityGifts', page, limit, filters] as const,
  activityGiftsInfinite: (limit: number, filters?: Record<string, any>) => 
    ['activityGiftsInfinite', limit, filters] as const,
  activityChannels: (page: number, limit: number, filters?: Record<string, any>) => 
    ['activityChannels', page, limit, filters] as const,
  activityChannelsInfinite: (limit: number, filters?: Record<string, any>) => 
    ['activityChannelsInfinite', limit, filters] as const,
  giftModels: (giftIds: string[]) => 
    ['giftModels', giftIds] as const,
  walletInfo: ['walletInfo'] as const,
  wallets: ['wallets'] as const,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

// Generic settings update hook
export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ setting, status }: { setting: string; status: boolean }) => updateSetting(setting, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: getUserProfile,
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

export const useChannelsBounds = (
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: queryKeys.channelsBounds(filters),
    queryFn: () => getChannelsWithBounds(1, 1, filters),
    staleTime: 1000 * 60 * 10, // 10 minutes - bounds don't change often
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

export const useMeGiftsInfinite = (
  limit = 20
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.meGiftsInfinite(limit),
    queryFn: ({ pageParam = 1 }) => getMeGifts(pageParam, limit),
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
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
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

export const useGiftsWithFilters = () => {
  return useQuery({
    queryKey: queryKeys.giftsWithFilters,
    queryFn: getGiftsWithFilters,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMarketGifts = (
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: queryKeys.marketGifts(page, limit, filters),
    queryFn: () => marketGetGifts(page, limit, filters),
  });
};

export const useMarketGiftsInfinite = (
  limit = 20,
  filters: Record<string, any> = {}
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.marketGiftsInfinite(limit, filters),
    queryFn: ({ pageParam = 1 }) => marketGetGifts(pageParam, limit, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.gifts.length < limit || lastPage.gifts.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      queryClient.invalidateQueries({ queryKey: ['offersInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

export const useRejectOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offersInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
    },
  });
};

export const useCancelOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offersInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
    },
  });
};

export const useRespondOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, action }: { offerId: number; action: 'accept' | 'reject' }) => respondOffer(offerId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offersInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

// User Activity hooks
export const useUserActivity = (
  page = 1,
  limit = 20
) => {
  return useQuery({
    queryKey: queryKeys.userActivity(page, limit),
    queryFn: () => getUserActivity(page, limit),
  });
};

export const useUserActivityInfinite = (
  limit = 20,
  types?: string[]
) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.userActivityInfinite(limit), types] as const,
    queryFn: ({ pageParam = 1 }) => getUserActivity(pageParam, limit, types as any),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.activities.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// New activity hooks for split backend
export const useActivityGifts = (
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: queryKeys.activityGifts(page, limit, filters),
    queryFn: () => getActivityGifts(page, limit, filters),
  });
};

export const useActivityGiftsInfinite = (
  limit = 20,
  filters: Record<string, any> = {}
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.activityGiftsInfinite(limit, filters),
    queryFn: ({ pageParam = 1 }) => getActivityGifts(pageParam, limit, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit || lastPage.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useActivityChannels = (
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: queryKeys.activityChannels(page, limit, filters),
    queryFn: () => getActivityChannels(page, limit, filters),
  });
};

export const useActivityChannelsInfinite = (
  limit = 20,
  filters: Record<string, any> = {}
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.activityChannelsInfinite(limit, filters),
    queryFn: ({ pageParam = 1 }) => getActivityChannels(pageParam, limit, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than the limit, we've reached the end
      if (lastPage.length < limit || lastPage.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePurchaseGift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ giftId, price }: { giftId: string; price: number }) => 
      purchaseGift(giftId, price),
    onSuccess: () => {
      // Invalidate relevant queries after successful purchase
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

export const useOfferGift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ giftId, price, duration_days }: { giftId: string; price: number; duration_days?: number }) => 
      offerGift(giftId, price, duration_days),
    onSuccess: () => {
      // Invalidate relevant queries after successful offer
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offersInfinite'] });
    },
  });
};

export const useSellItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, price, secondsToTransfer, timezone }: { 
      itemId: string; 
      price: number; 
      secondsToTransfer?: number;
      timezone?: string;
    }) => createItemSale(itemId, price, secondsToTransfer, timezone),
    onSuccess: () => {
      // Invalidate relevant queries after successful sale listing
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

export const useWithdrawReferralBalance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: withdrawReferralBalance,
    onSuccess: () => {
      // Invalidate user and profile queries after successful withdrawal
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

// Edit gift price mutation
export const useEditGiftPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ giftId, price }: { giftId: string; price: number }) => 
      editGiftPrice(giftId, price),
    onSuccess: () => {
      // Invalidate user gifts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

// Remove gift from sale mutation
export const useRemoveGiftFromSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (giftId: string) => 
      removeGiftFromSale(giftId),
    onSuccess: () => {
      // Invalidate user gifts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      // Also invalidate market gifts to update the market view
      queryClient.invalidateQueries({ queryKey: ['marketGifts'] });
      queryClient.invalidateQueries({ queryKey: ['marketGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

// Remove channel from sale mutation
export const useRemoveChannelFromSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => 
      removeChannelFromSale(channelId),
    onSuccess: () => {
      // Invalidate channels queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userChannels'] });
      // Also invalidate market channels to update the market view
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['channelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannels'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannelsInfinite'] });
    },
  });
};

// Edit channel price mutation
export const useEditChannelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, price }: { channelId: string; price: number }) => 
      editChannelPrice(channelId, price),
    onSuccess: () => {
      // Invalidate channels queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userChannels'] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['channelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannels'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannelsInfinite'] });
    },
  });
};

// Sell channel mutation
export const useSellChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, price, secondsToTransfer, timezone }: { 
      channelId: string; 
      price: number; 
      secondsToTransfer?: number;
      timezone?: string;
    }) => 
      sellChannel(channelId, price, secondsToTransfer, timezone),
    onSuccess: () => {
      // Invalidate channels queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userChannels'] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['channelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannels'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannelsInfinite'] });
    },
  });
};

// Return channel mutation
export const useReturnChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => 
      returnChannel(channelId),
    onSuccess: () => {
      // Invalidate channels queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannels'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannelsInfinite'] });
    },
  });
};

// Remove channel mutation
export const useRemoveChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) => 
      removeChannel(channelId),
    onSuccess: () => {
      // Invalidate channels queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meChannelsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userChannels'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannels'] });
      queryClient.invalidateQueries({ queryKey: ['activityChannelsInfinite'] });
    },
  });
};

// Transfer gift mutation
export const useTransferGift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ giftId, userIdOrUsername }: { giftId: string; userIdOrUsername: string }) => 
      transferGift(giftId, userIdOrUsername),
    onSuccess: () => {
      // Invalidate user gifts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

// Receive gift mutation
export const useReceiveGift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (giftId: string) => 
      receiveGift(giftId),
    onSuccess: () => {
      // Invalidate user gifts queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['meGiftsInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['meGifts'] });
      queryClient.invalidateQueries({ queryKey: ['userActivity'] });
      queryClient.invalidateQueries({ queryKey: ['userActivityInfinite'] });
      queryClient.invalidateQueries({ queryKey: ['activityGifts'] });
      queryClient.invalidateQueries({ queryKey: ['activityGiftsInfinite'] });
    },
  });
};

// Gift models hook
export const useGiftModels = (giftIds: string[]) => {
  return useQuery({
    queryKey: queryKeys.giftModels(giftIds),
    queryFn: () => getGiftModels(giftIds),
    enabled: giftIds.length > 0, // Only fetch when there are gift IDs
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Wallet hooks
export const useWalletInfo = () => {
  return useQuery({
    queryKey: queryKeys.walletInfo,
    queryFn: getWalletInfo,
  });
};

export const useWallets = () => {
  return useQuery({
    queryKey: queryKeys.wallets,
    queryFn: listWallets,
  });
};

export const useConnectWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ address, provider }: { address: string; provider: string }) => connectWallet(address, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletInfo });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useDisconnectWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walletId: number) => disconnectWallet(walletId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletInfo });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
};

export const useInitiateDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, amount }: { walletId: number; amount: number }) => initiateDeposit(walletId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletInfo });
    },
  });
};

export const useInitiateWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ walletAddress, amount }: { walletAddress: string; amount: number }) => initiateWithdrawal(walletAddress, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.walletInfo });
    },
  });
};
