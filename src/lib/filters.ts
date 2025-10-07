import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { useChannelFilters, useGiftFilters } from '@/contexts/FilterContext'; 

// Channels filters schema for API calls
export const channelFiltersSearchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  sort_by: z.enum([
    'date_new_to_old',
    'date_old_to_new', 
    'price_low_to_high',
    'price_high_to_low',
    'price_per_unit',
    'quantity_low_to_high',
    'quantity_high_to_low'
  ]).default('date_new_to_old'),
  gift_id: z.array(z.string()).optional(),
  channel_type: z.enum(['fast', 'waiting']).optional(),
  price_min: z.string().optional(),
  price_max: z.string().optional(),
  quantity_min: z.string().optional(),
  quantity_max: z.string().optional(),
  show_upgraded_gifts: z.boolean().optional(),
  only_exact_gift: z.boolean().optional(),
});

export type ChannelFiltersSearchParams = z.infer<typeof channelFiltersSearchSchema>;

// Gifts filters schema for API calls
export const giftFiltersSearchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  sort_by: z.enum([
    'date_new_to_old',
    'date_old_to_new', 
    'price_low_to_high',
    'price_high_to_low',
    'name_a_to_z',
    'name_z_to_a'
  ]).default('date_new_to_old'),
  collection: z.string().optional(),
  model: z.string().optional(),
  background: z.string().optional(),
  symbol: z.string().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  show_premarket: z.string().optional(),
  show_unupgraded: z.string().optional(),
});

export type GiftFiltersSearchParams = z.infer<typeof giftFiltersSearchSchema>;

export type FilterChangeParams = {
  gift: string[]; // array of gift IDs
  channelType: string; // 'fast' | 'waiting' | 'all'
  sorting: string; // sorting values
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onlyExactGift?: boolean;
  showUpgraded?: boolean;
};

export type CurrentFilters = {
  gift: string[];
  channelType: string;
  sorting: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onlyExactGift?: boolean;
  showUpgraded?: boolean;
};

export type GiftFilterChangeParams = {
  collection: string;
  model: string;
  background: string;
  symbol?: string;
  sorting: string;
  minPrice?: number;
  maxPrice?: number;
  showPremarket?: boolean;
  showUnupgraded?: boolean;
  channelsOnSale?: boolean;
};

export type GiftCurrentFilters = {
  collection: string;
  model: string;
  background: string;
  symbol?: string;
  sorting: string;
  minPrice?: number;
  maxPrice?: number;
  showPremarket?: boolean;
  showUnupgraded?: boolean;
  channelsOnSale?: boolean;
};

// Build filters object from search params
export function buildFiltersFromSearch(search: ChannelFiltersSearchParams): Record<string, any> {
  const filters: Record<string, any> = {};

  Object.entries(search).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      filters[key] = value;
    }
  });

  return filters;
}

// Convert frontend filter changes to backend format
export function convertFiltersToBackendFormat(
  newFilters: FilterChangeParams,
  currentSearch: ChannelFiltersSearchParams
): Partial<ChannelFiltersSearchParams> {
  const backendFilters: Partial<ChannelFiltersSearchParams> = {};
  
  // Sorting is already in backend format
  if (newFilters.sorting && newFilters.sorting !== 'All') {
    backendFilters.sort_by = newFilters.sorting as ChannelFiltersSearchParams['sort_by'];
  }
  
  // Gift IDs are already in backend format
  if (newFilters.gift && newFilters.gift.length > 0) {
    backendFilters.gift_id = newFilters.gift;
  } else {
    // Ensure gift_id is cleared from the URL when no gifts are selected
    backendFilters.gift_id = undefined;
  }

  if (newFilters.channelType && newFilters.channelType !== 'All') {
    backendFilters.channel_type = newFilters.channelType as ChannelFiltersSearchParams['channel_type'];
  }

  if (newFilters.channelType === 'All') {
    backendFilters.channel_type = undefined;
  }

  // Price filters
  if (newFilters.minPrice !== undefined) {
    backendFilters.price_min = newFilters.minPrice.toString();
  }

  if (newFilters.maxPrice !== undefined) {
    backendFilters.price_max = newFilters.maxPrice.toString();
  }

  // Quantity filters
  if (newFilters.minQuantity !== undefined) {
    backendFilters.quantity_min = newFilters.minQuantity.toString();
  }

  if (newFilters.maxQuantity !== undefined) {
    backendFilters.quantity_max = newFilters.maxQuantity.toString();
  }

  // Show upgraded gifts filter
  if (newFilters.showUpgraded !== undefined) {
    backendFilters.show_upgraded_gifts = newFilters.showUpgraded;
  }

  // Only exact gift filter
  if (newFilters.onlyExactGift !== undefined) {
    backendFilters.only_exact_gift = newFilters.onlyExactGift;
  }
  
  const updatedSearch = {
    ...currentSearch,
    ...backendFilters,
    // Reset page to 1 when filters change
    page: 1,
  };
  
  // Remove empty values
  Object.keys(updatedSearch).forEach(key => {
    if (updatedSearch[key as keyof typeof updatedSearch] === '' || 
        updatedSearch[key as keyof typeof updatedSearch] === undefined) {
      delete updatedSearch[key as keyof typeof updatedSearch];
    }
  });
  
  return updatedSearch;
}

// Build filters object from search params for gifts
export function buildGiftFiltersFromSearch(search: GiftFiltersSearchParams): Record<string, any> {
  const filters: Record<string, any> = {};

  Object.entries(search).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      filters[key] = value;
    }
  });

  return filters;
}

// Convert frontend gift filter changes to backend format
export function convertGiftFiltersToBackendFormat(
  newFilters: GiftFilterChangeParams,
  currentSearch: GiftFiltersSearchParams
): Partial<GiftFiltersSearchParams> {
  const backendFilters: Partial<GiftFiltersSearchParams> = {};
  
  // Sorting is already in backend format
  if (newFilters.sorting && newFilters.sorting !== 'All') {
    backendFilters.sort_by = newFilters.sorting as GiftFiltersSearchParams['sort_by'];
  }
  
  // Collection filter
  if (newFilters.collection && newFilters.collection !== 'All') {
    backendFilters.collection = newFilters.collection;
  }

  // Model filter
  if (newFilters.model && newFilters.model !== 'All') {
    backendFilters.model = newFilters.model;
  }

  // Background filter
  if (newFilters.background && newFilters.background !== 'All') {
    backendFilters.background = newFilters.background;
  }

  // Symbol filter
  if (newFilters.symbol && newFilters.symbol !== 'All') {
    backendFilters.symbol = newFilters.symbol;
  }

  // Price filters
  if (newFilters.minPrice !== undefined) {
    backendFilters.min_price = newFilters.minPrice.toString();
  }

  if (newFilters.maxPrice !== undefined) {
    backendFilters.max_price = newFilters.maxPrice.toString();
  }

  // Show premarket filter
  if (newFilters.showPremarket !== undefined) {
    backendFilters.show_premarket = newFilters.showPremarket.toString();
  }

  // Show unupgraded filter
  if (newFilters.showUnupgraded !== undefined) {
    backendFilters.show_unupgraded = newFilters.showUnupgraded.toString();
  }
  
  const updatedSearch = {
    ...currentSearch,
    ...backendFilters,
    // Reset page to 1 when filters change
    page: 1,
  };
  
  // Remove empty values
  Object.keys(updatedSearch).forEach(key => {
    if (updatedSearch[key as keyof typeof updatedSearch] === '' || 
        updatedSearch[key as keyof typeof updatedSearch] === undefined) {
      delete updatedSearch[key as keyof typeof updatedSearch];
    }
  });
  
  return updatedSearch;
}

// Get current gift filters for display
export function getGiftCurrentFilters(search: GiftFiltersSearchParams): GiftCurrentFilters {
  return {
    collection: search.collection || 'All',
    model: search.model || 'All',
    background: search.background || 'All',
    symbol: search.symbol || 'All',
    sorting: search.sort_by || 'date_new_to_old',
    minPrice: search.min_price ? parseFloat(search.min_price) : undefined,
    maxPrice: search.max_price ? parseFloat(search.max_price) : undefined,
    showPremarket: search.show_premarket ? search.show_premarket === 'true' : true,
    showUnupgraded: search.show_unupgraded ? search.show_unupgraded === 'true' : true,
  };
}

// Get current filters for display
export function getCurrentFilters(search: ChannelFiltersSearchParams): CurrentFilters {
  return {
    gift: search.gift_id || [],
    channelType: search.channel_type || 'All',
    sorting: search.sort_by || 'date_new_to_old',
    minPrice: search.price_min ? parseFloat(search.price_min) : undefined,
    maxPrice: search.price_max ? parseFloat(search.price_max) : undefined,
    minQuantity: search.quantity_min ? parseInt(search.quantity_min) : undefined,
    maxQuantity: search.quantity_max ? parseInt(search.quantity_max) : undefined,
    onlyExactGift: search.only_exact_gift,
    showUpgraded: search.show_upgraded_gifts,
  };
}

// Custom hook for managing filters with global state
export function useFilters<T extends ChannelFiltersSearchParams | GiftFiltersSearchParams>(
  search: T, 
  navigate: (options: { search: Partial<T> }) => void,
  filterType: 'channel' | 'gift' = 'channel'
) {
  const handleFilterChange = useCallback((newFilters: FilterChangeParams | GiftFilterChangeParams) => {
    let updatedSearch: Partial<T>;
    
    if (filterType === 'gift') {
      updatedSearch = convertGiftFiltersToBackendFormat(newFilters as GiftFilterChangeParams, search as GiftFiltersSearchParams) as Partial<T>;
    } else {
      updatedSearch = convertFiltersToBackendFormat(newFilters as FilterChangeParams, search as ChannelFiltersSearchParams) as Partial<T>;
    }
    
    // Navigate to new search params - this will automatically trigger a new infinite query
    navigate({ search: updatedSearch });
    
    // Reset scroll position when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, navigate, filterType]);

  const currentFilters = filterType === 'gift' 
    ? getGiftCurrentFilters(search as GiftFiltersSearchParams)
    : getCurrentFilters(search as ChannelFiltersSearchParams);
    
  const apiFilters = filterType === 'gift'
    ? buildGiftFiltersFromSearch(search as GiftFiltersSearchParams)
    : buildFiltersFromSearch(search as ChannelFiltersSearchParams);

  return {
    handleFilterChange,
    currentFilters,
    apiFilters,
  };
}

// New hook that integrates with global filter state
export function useGlobalFilters<T extends ChannelFiltersSearchParams | GiftFiltersSearchParams>(
  search: T, 
  navigate: (options: { search: Partial<T> }) => void,
  filterType: 'channel' | 'gift' = 'channel'
) {
  const channelFilters = useChannelFilters();
  const giftFilters = useGiftFilters();
  
  const globalFilters = filterType === 'gift' ? giftFilters : channelFilters;

  const handleFilterChange = useCallback((newFilters: FilterChangeParams | GiftFilterChangeParams) => {
    // Update global state first
    globalFilters.updateFilters(newFilters);
    
    // Then update URL search params
    let updatedSearch: Partial<T>;
    
    if (filterType === 'gift') {
      updatedSearch = convertGiftFiltersToBackendFormat(newFilters as GiftFilterChangeParams, search as GiftFiltersSearchParams) as Partial<T>;
    } else {
      updatedSearch = convertFiltersToBackendFormat(newFilters as FilterChangeParams, search as ChannelFiltersSearchParams) as Partial<T>;
    }
    
    // Navigate to new search params
    navigate({ search: updatedSearch });
    
    // Reset scroll position when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, navigate, filterType, globalFilters]);

  // Use global filters as current filters - don't sync with URL params
  // This prevents navigation from resetting our global state
  const currentFilters = globalFilters.filters;
    
  // Build API filters from global state instead of URL params
  const apiFilters = useMemo(() => {
    if (filterType === 'gift') {
      const giftFilters = currentFilters as GiftCurrentFilters;
      const filters: Record<string, any> = {
        sort_by: giftFilters.sorting,
      };

      // Map frontend filter names to backend API parameter names
      if (giftFilters.collection && giftFilters.collection !== 'All') {
        // Collection filter contains comma-separated gift IDs, keep as strings to preserve precision for large numbers
        const giftIds = giftFilters.collection.split(',').map(id => id.trim()).filter(id => id !== '');
        if (giftIds.length > 0) {
          filters.gift_id = giftIds;
        }
      }

      if (giftFilters.model && giftFilters.model !== 'All') {
        // Model value can be comma-separated model IDs, convert to array for backend
        const modelIds = giftFilters.model.split(',').map(id => id.trim()).filter(id => id !== '');
        if (modelIds.length > 0) {
          filters.model_id = modelIds;
        }
      }

      if (giftFilters.background && giftFilters.background !== 'All') {
        // Background value can be comma-separated backdrop IDs, convert to array for backend
        const backdropIds = giftFilters.background.split(',').map(id => id.trim()).filter(id => id !== '');
        if (backdropIds.length > 0) {
          filters.backdrop_id = backdropIds;
        }
      }

      if (giftFilters.symbol && giftFilters.symbol !== 'All') {
        // Symbol value can be comma-separated symbol IDs, convert to array for backend
        const symbolIds = giftFilters.symbol.split(',').map(id => id.trim()).filter(id => id !== '');
        if (symbolIds.length > 0) {
          filters.symbol_id = symbolIds;
        }
      }

      // Price filters
      if (giftFilters.minPrice !== undefined) {
        filters.price_min = giftFilters.minPrice.toString();
      }

      if (giftFilters.maxPrice !== undefined) {
        filters.price_max = giftFilters.maxPrice.toString();
      }

      // Show premarket filter (currently not supported by backend, but keeping for future)
      if (giftFilters.showPremarket !== undefined) {
        filters.show_premarket = giftFilters.showPremarket.toString();
      }

      // Show unupgraded filter (currently not supported by backend, but keeping for future)
      if (giftFilters.showUnupgraded !== undefined) {
        filters.show_unupgraded = giftFilters.showUnupgraded.toString();
      }

      return filters;
    } else {
      const channelFilters = currentFilters as CurrentFilters;
      return {
        sort_by: channelFilters.sorting,
        gift_id: channelFilters.gift.length > 0 ? channelFilters.gift : undefined,
        channel_type: channelFilters.channelType === 'All' ? undefined : channelFilters.channelType,
        price_min: channelFilters.minPrice?.toString(),
        price_max: channelFilters.maxPrice?.toString(),
        quantity_min: channelFilters.minQuantity?.toString(),
        quantity_max: channelFilters.maxQuantity?.toString(),
        show_upgraded_gifts: channelFilters.showUpgraded,
        only_exact_gift: channelFilters.onlyExactGift,
      };
    }
  }, [currentFilters, filterType]);

  return {
    handleFilterChange,
    currentFilters,
    apiFilters,
    resetFilters: globalFilters.resetFilters,
  };
}

