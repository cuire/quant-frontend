import { z } from 'zod';
import { useCallback } from 'react';

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
  type: z.enum(['fast', 'waiting']).optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  min_qty: z.string().optional(),
  max_qty: z.string().optional(),
});

export type ChannelFiltersSearchParams = z.infer<typeof channelFiltersSearchSchema>;

export type FilterChangeParams = {
  gift: string[]; // array of gift IDs
  channelType: string; // 'fast' | 'waiting' | 'all'
  sorting: string; // sorting values
};

export type CurrentFilters = {
  gift: string[];
  channelType: string;
  sorting: string;
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
  }

  if (newFilters.channelType && newFilters.channelType !== 'All') {
    backendFilters.type = newFilters.channelType as ChannelFiltersSearchParams['type'];
  }

  if (newFilters.channelType === 'All') {
    backendFilters.type = undefined;
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

// Get current filters for display
export function getCurrentFilters(search: ChannelFiltersSearchParams): CurrentFilters {
  return {
    gift: search.gift_id || [],
    channelType: search.type || 'All',
    sorting: search.sort_by || 'date_new_to_old'
  };
}

// Custom hook for managing filters
export function useFilters<T extends ChannelFiltersSearchParams>(
  search: T, 
  navigate: (options: { search: Partial<T> }) => void
) {
  const handleFilterChange = useCallback((newFilters: FilterChangeParams) => {
    const updatedSearch = convertFiltersToBackendFormat(newFilters, search) as Partial<T>;
    
    // Navigate to new search params - this will automatically trigger a new infinite query
    navigate({ search: updatedSearch });
    
    // Reset scroll position when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, navigate]);

  const currentFilters = getCurrentFilters(search);
  const apiFilters = buildFiltersFromSearch(search);

  return {
    handleFilterChange,
    currentFilters,
    apiFilters,
  };
}
