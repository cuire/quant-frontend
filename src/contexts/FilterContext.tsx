import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { 
  CurrentFilters, 
  GiftCurrentFilters,
  FilterChangeParams,
  GiftFilterChangeParams 
} from '@/lib/filters';

// Action types for filter state management
type FilterAction = 
  | { type: 'UPDATE_CHANNEL_FILTERS'; payload: Partial<FilterChangeParams> }
  | { type: 'UPDATE_GIFT_FILTERS'; payload: Partial<GiftFilterChangeParams> }
  | { type: 'RESET_CHANNEL_FILTERS' }
  | { type: 'RESET_GIFT_FILTERS' }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: FilterState };

// Global filter state
interface FilterState {
  channels: CurrentFilters;
  gifts: GiftCurrentFilters;
}

// Default filter values
const defaultChannelFilters: CurrentFilters = {
  gift: [],
  channelType: 'All',
  sorting: 'date_new_to_old',
  minPrice: undefined,
  maxPrice: undefined,
  minQuantity: undefined,
  maxQuantity: undefined,
  onlyExactGift: false,
  showUpgraded: true,
};

const defaultGiftFilters: GiftCurrentFilters = {
  collection: 'All',
  model: 'All',
  background: 'All',
  sorting: 'date_new_to_old',
};

const initialState: FilterState = {
  channels: defaultChannelFilters,
  gifts: defaultGiftFilters,
};

// Reducer function
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'UPDATE_CHANNEL_FILTERS':
      return {
        ...state,
        channels: { ...state.channels, ...action.payload },
      };
    
    case 'UPDATE_GIFT_FILTERS':
      return {
        ...state,
        gifts: { ...state.gifts, ...action.payload },
      };
    
    case 'RESET_CHANNEL_FILTERS':
      return {
        ...state,
        channels: defaultChannelFilters,
      };
    
    case 'RESET_GIFT_FILTERS':
      return {
        ...state,
        gifts: defaultGiftFilters,
      };
    
    case 'HYDRATE_FROM_STORAGE':
      return action.payload;
    
    default:
      return state;
  }
}

// Context type
interface FilterContextType {
  state: FilterState;
  updateChannelFilters: (filters: Partial<FilterChangeParams>) => void;
  updateGiftFilters: (filters: Partial<GiftFilterChangeParams>) => void;
  resetChannelFilters: () => void;
  resetGiftFilters: () => void;
  getChannelFilters: () => CurrentFilters;
  getGiftFilters: () => GiftCurrentFilters;
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'quant-filters';

// Provider component
interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored);
        // Validate and merge with defaults to handle schema changes
        const hydratedState: FilterState = {
          channels: { ...defaultChannelFilters, ...parsedState.channels },
          gifts: { ...defaultGiftFilters, ...parsedState.gifts },
        };
        dispatch({ type: 'HYDRATE_FROM_STORAGE', payload: hydratedState });
      }
    } catch (error) {
      console.warn('Failed to load filters from localStorage:', error);
    }
  }, []);

  // Save filters to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error);
    }
  }, [state]);

  // Context value
  const contextValue: FilterContextType = {
    state,
    updateChannelFilters: (filters) => {
      dispatch({ type: 'UPDATE_CHANNEL_FILTERS', payload: filters });
    },
    updateGiftFilters: (filters) => {
      dispatch({ type: 'UPDATE_GIFT_FILTERS', payload: filters });
    },
    resetChannelFilters: () => {
      dispatch({ type: 'RESET_CHANNEL_FILTERS' });
    },
    resetGiftFilters: () => {
      dispatch({ type: 'RESET_GIFT_FILTERS' });
    },
    getChannelFilters: () => state.channels,
    getGiftFilters: () => state.gifts,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

// Hook to use filter context
export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}

// Convenience hooks for specific filter types
export function useChannelFilters() {
  const { state, updateChannelFilters, resetChannelFilters, getChannelFilters } = useFilterContext();
  return {
    filters: state.channels,
    updateFilters: updateChannelFilters,
    resetFilters: resetChannelFilters,
    getFilters: getChannelFilters,
  };
}

export function useGiftFilters() {
  const { state, updateGiftFilters, resetGiftFilters, getGiftFilters } = useFilterContext();
  return {
    filters: state.gifts,
    updateFilters: updateGiftFilters,
    resetFilters: resetGiftFilters,
    getFilters: getGiftFilters,
  };
}
