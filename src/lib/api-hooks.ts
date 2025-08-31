// Simple React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, updateLanguage, getChannels, getUserChannels, addChannel, getGifts } from './api';

// Query keys
export const queryKeys = {
  user: ['user'] as const,
  channels: (page: number, limit: number, filters?: Record<string, any>) => 
    ['channels', page, limit, filters] as const,
  userChannels: ['userChannels'] as const,
  gifts: ['gifts'] as const,
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

export const useUserChannels = () => {
  return useQuery({
    queryKey: queryKeys.userChannels,
    queryFn: getUserChannels,
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
