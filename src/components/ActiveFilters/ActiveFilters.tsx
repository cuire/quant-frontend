import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { GiftCurrentFilters, CurrentFilters } from '@/lib/filters';
import './ActiveFilters.css';

interface ActiveFiltersProps {
  filters: GiftCurrentFilters | CurrentFilters;
  onClearAll: () => void;
  onRemoveFilter: (filterKey: string) => void;
  filterType: 'gift' | 'channel';
  symbols?: Array<{ id: string; name: string }>;
  bounds?: {
    min_price?: number;
    max_price?: number;
    min_count?: number;
    max_count?: number;
  };
}

export const ActiveFilters: FC<ActiveFiltersProps> = ({
  filters,
  onClearAll,
  onRemoveFilter,
  filterType,
  symbols = [],
  bounds,
}) => {
  const { t } = useTranslation();
  const activeFilters: Array<{ key: string; label: string; value: string }> = [];

  if (filterType === 'gift') {
    const giftFilters = filters as GiftCurrentFilters;

    // Only show filters from the Filters modal (not those with separate chips)
    // Don't show: Collection, Model, Background, Sorting (they have their own chips)

    // Symbol filter (from Filters modal)
    if (giftFilters.symbol && giftFilters.symbol !== 'All') {
      const symbolIds = giftFilters.symbol.split(',').filter(id => id.trim());
      if (symbolIds.length === 1) {
        const symbol = symbols.find(s => s.id === symbolIds[0]);
        const name = symbol ? symbol.name : symbolIds[0];
        activeFilters.push({ key: 'symbol', label: t('filters.symbol'), value: name });
      } else if (symbolIds.length > 1) {
        activeFilters.push({ key: 'symbol', label: t('filters.symbol'), value: `${symbolIds.length} symbols` });
      }
    }

    // Price filter (from Filters modal) - only show if not default bounds
    if (giftFilters.minPrice !== undefined && giftFilters.maxPrice !== undefined) {
      // Check if it's the default range - if bounds are available, use them, otherwise use a large range as default
      const defaultMin = bounds?.min_price ?? 0;
      const defaultMax = bounds?.max_price ?? 999999;
      const isDefaultPrice = giftFilters.minPrice === defaultMin && giftFilters.maxPrice === defaultMax;
      
      console.log('🔍 ActiveFilters Price Check:');
      console.log('  Filter price:', giftFilters.minPrice, '-', giftFilters.maxPrice);
      console.log('  Bounds:', bounds);
      console.log('  Default min/max:', defaultMin, defaultMax);
      console.log('  isDefaultPrice:', isDefaultPrice);
      console.log('  Will show chip:', !isDefaultPrice);
      
      if (!isDefaultPrice) {
        activeFilters.push({ 
          key: 'price', 
          label: t('common.price'), 
          value: `${giftFilters.minPrice} - ${giftFilters.maxPrice}` 
        });
      }
    }

    // Show pre-market toggle (when disabled)
    if (giftFilters.showPremarket === false) {
      activeFilters.push({ 
        key: 'showPremarket', 
        label: t('filters.preMarket'), 
        value: t('filters.hidden') 
      });
    }

    // Show unupgraded gifts toggle (when disabled)
    if (giftFilters.showUnupgraded === false) {
      activeFilters.push({ 
        key: 'showUnupgraded', 
        label: t('filters.unupgraded'), 
        value: t('filters.hidden') 
      });
    }
  } else {
    const channelFilters = filters as CurrentFilters;

    // Only show filters from the Filters modal (not those with separate chips)
    // Don't show: Gift, Channel Type, Sorting (they have their own chips)

    // Price filter (from Filters modal) - only show if not default bounds
    if (channelFilters.minPrice !== undefined && channelFilters.maxPrice !== undefined) {
      // Check if it's the default range
      const defaultMin = bounds?.min_price ?? 0;
      const defaultMax = bounds?.max_price ?? 999999;
      const isDefaultPrice = channelFilters.minPrice === defaultMin && channelFilters.maxPrice === defaultMax;
      
      if (!isDefaultPrice) {
        activeFilters.push({ 
          key: 'price', 
          label: t('common.price'), 
          value: `${channelFilters.minPrice} - ${channelFilters.maxPrice}` 
        });
      }
    }

    // Quantity filter (from Filters modal) - only show if not default bounds
    if (channelFilters.minQuantity !== undefined && channelFilters.maxQuantity !== undefined) {
      // Check if it's the default range
      const defaultMin = bounds?.min_count ?? 0;
      const defaultMax = bounds?.max_count ?? 999999;
      const isDefaultQuantity = channelFilters.minQuantity === defaultMin && channelFilters.maxQuantity === defaultMax;
      
      if (!isDefaultQuantity) {
        activeFilters.push({ 
          key: 'quantity', 
          label: t('common.quantity'), 
          value: `${channelFilters.minQuantity} - ${channelFilters.maxQuantity}` 
        });
      }
    }

    // Only exact gift toggle (when enabled)
    if (channelFilters.onlyExactGift === true) {
      activeFilters.push({ 
        key: 'onlyExactGift', 
        label: t('filters.onlyExactGift'), 
        value: t('filters.enabled') 
      });
    }

    // Show upgraded gifts toggle (when disabled)
    if (channelFilters.showUpgraded === false) {
      activeFilters.push({ 
        key: 'showUpgraded', 
        label: t('filters.upgradedGifts'), 
        value: t('filters.hidden') 
      });
    }
  }

  // Don't show anything if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="active-filters">
      <button className="active-filters__clear" onClick={onClearAll}>
        {t('filters.clearFilters')}
      </button>
      {activeFilters.map(({ key, label, value }) => (
        <div key={key} className="active-filters__chip">
          <span className="active-filters__chip-text">
            {label}: {value}
          </span>
          <button 
            className="active-filters__chip-close" 
            onClick={() => onRemoveFilter(key)}
            aria-label={`Remove ${label} filter`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

