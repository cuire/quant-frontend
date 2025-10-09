import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { bem } from '@/css/bem.ts';
import type { GiftFilterChangeParams, GiftCurrentFilters } from '@/lib/filters';
import { GiftIcon } from '@/components/GiftIcon';
// removed unused api types
import { useGiftsWithFilters, useGiftModels } from '@/lib/api-hooks';
import { formatRarity } from '@/helpers/formatUtils';
import './MarketHeader.css';

const [, e] = bem('market-header');

const new_colors: Record<string, { backgroundColor: string; color: string }> = {
    '1': {
      backgroundColor: '#FF9500',
      color: '#ffffff'
    },
    '2': {
      backgroundColor: '#018C03',
      color: '#ffffff'
    },
    '3': {
      backgroundColor: '#800080',
      color: '#ffffff'
    },
    '4': {
      backgroundColor: '#8B4513',
      color: '#ffffff'
    },
    '5': {
      backgroundColor: '#1B1B1B',
      color: '#ffffff'
    }
}

export interface GiftFiltersProps {
  onFilterChange?: (filters: GiftFilterChangeParams) => void;
  currentFilters?: GiftCurrentFilters;
  models?: Array<{
    value: string;
    model_id?: string;
    rarity_per_mille: number;
    floor: number;
  }>;
  bounds?: {
    min_price?: number;
    max_price?: number;
  };
}

export const GiftFilters: FC<GiftFiltersProps> = ({ 
  onFilterChange,
  currentFilters,
  models = [],
  bounds: propBounds
}) => {
  const { t } = useTranslation();
  // Get gifts data from API (for collection and background options)
  const { data: giftsData, isLoading, error } = useGiftsWithFilters();
  const gifts = giftsData?.gifts || [];
  const backdrops = giftsData?.backdrops || [];
  const symbols = giftsData?.symbols || [];
  const boundsData = propBounds; // Use bounds passed from parent (from market gifts query)
  const [openSheet, setOpenSheet] = useState<null | 'collection' | 'model' | 'background' | 'filters'>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for pending changes (not applied until modal closes)
  const [pendingCollectionFilter, setPendingCollectionFilter] = useState(currentFilters?.collection || 'All');
  const [pendingModelFilter, setPendingModelFilter] = useState(currentFilters?.model || 'All');
  const [pendingBackgroundFilter, setPendingBackgroundFilter] = useState(currentFilters?.background || 'All');
  const [pendingSortingFilter, setPendingSortingFilter] = useState(currentFilters?.sorting || 'date_new_to_old');
  const [pendingSelectedGiftIds, setPendingSelectedGiftIds] = useState<string[]>([]);
  const [pendingSelectedModelIds, setPendingSelectedModelIds] = useState<string[]>([]);
  const [pendingSelectedBackgroundIds, setPendingSelectedBackgroundIds] = useState<string[]>([]);
  const [pendingSelectedSymbolIds, setPendingSelectedSymbolIds] = useState<string[]>([]);
  const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>([0, 10000]);
  const [pendingShowPremarket, setPendingShowPremarket] = useState(true);
  const [pendingShowUnupgraded, setPendingShowUnupgraded] = useState(true);
  const [symbolSectionOpen, setSymbolSectionOpen] = useState(false);

  // Check if a collection is selected (not 'All' and not empty)
  const isCollectionSelected = pendingCollectionFilter && pendingCollectionFilter !== 'All' && pendingCollectionFilter.trim() !== '';

  // Fetch gift models when collection is selected
  const { data: giftModelsData, isLoading: modelsLoading } = useGiftModels(
    isCollectionSelected ? pendingSelectedGiftIds : []
  );
  const fetchedModels = giftModelsData?.models || [];

  console.log('GiftFilters fetchedModels:', fetchedModels);

  // Update filter states when currentFilters change
  useEffect(() => {
    if (currentFilters) {
      // Update pending states
      setPendingCollectionFilter(currentFilters.collection);
      setPendingModelFilter(currentFilters.model);
      setPendingBackgroundFilter(currentFilters.background);
      setPendingSortingFilter(currentFilters.sorting);
      
      if (currentFilters.collection && currentFilters.collection !== 'All') {
        setPendingSelectedGiftIds(currentFilters.collection.split(',').filter(id => id.trim()));
      } else {
        setPendingSelectedGiftIds([]);
      }

      if (currentFilters.model && currentFilters.model !== 'All') {
        setPendingSelectedModelIds(currentFilters.model.split(',').filter(id => id.trim()));
      } else {
        setPendingSelectedModelIds([]);
      }

      if (currentFilters.background && currentFilters.background !== 'All') {
        setPendingSelectedBackgroundIds(currentFilters.background.split(',').filter(id => id.trim()));
      } else {
        setPendingSelectedBackgroundIds([]);
      }

      if (currentFilters.symbol && currentFilters.symbol !== 'All') {
        setPendingSelectedSymbolIds(currentFilters.symbol.split(',').filter(id => id.trim()));
      } else {
        setPendingSelectedSymbolIds([]);
      }

      setPendingShowPremarket(currentFilters.showPremarket ?? true);
      setPendingShowUnupgraded(currentFilters.showUnupgraded ?? true);
    }
  }, [currentFilters]);

  // Initialize and update price range from currentFilters or bounds
  useEffect(() => {
    console.log('=== Price Range Update ===');
    console.log('GiftFilters boundsData:', boundsData);
    console.log('Current filters price:', currentFilters?.minPrice, currentFilters?.maxPrice);
    console.log('giftsData:', giftsData);
    
    if (currentFilters?.minPrice !== undefined && currentFilters?.maxPrice !== undefined) {
      // Use filter values if they exist
      console.log('✅ Using current filter prices:', currentFilters.minPrice, currentFilters.maxPrice);
      setPendingPriceRange([currentFilters.minPrice, currentFilters.maxPrice]);
    } else if (boundsData) {
      // Otherwise use bounds as defaults
      console.log('✅ Using API bounds:', boundsData.min_price, boundsData.max_price);
      setPendingPriceRange([boundsData.min_price ?? 0, boundsData.max_price ?? 10000]);
    } else {
      console.log('❌ No bounds available, using fallback: 0-10000');
    }
  }, [boundsData, currentFilters?.minPrice, currentFilters?.maxPrice, giftsData]);

  // Reset model filter when collection changes
  useEffect(() => {
    if (!isCollectionSelected) {
      setPendingModelFilter('All');
      setPendingSelectedModelIds([]);
    }
  }, [isCollectionSelected]);

  // Clear search when closing/opening sheet
  useEffect(() => {
    if (openSheet !== 'collection' && openSheet !== 'model' && openSheet !== 'background') {
      setSearchTerm('');
    }
  }, [openSheet]);

  // Helper function to get pending gift name by ID
  const getPendingGiftNameById = (giftIds: string[]): string => {
    if (giftIds.length === 0) return t('common.all');
    if (giftIds.length === 1) {
      const gift = gifts.find(g => g.id === giftIds[0]);
      return gift ? (gift.short_name || gift.full_name) : t('common.all');
    }
    return `${giftIds.length} ${t('market.giftsSelected')}`;
  };
  // removed unused getCollectionDisplay
  // Helper function to get display name for model
  const getModelDisplay = (modelIds: string[]): string => {
    if (modelIds.length === 0) return t('common.all');
    if (modelIds.length === 1) {
      const model = fetchedModels.find(m => String(m.model_id) === modelIds[0]);
      return model ? model.value : t('common.all');
    }
    return `${modelIds.length} ${t('filters.modelsSelected')}`;
  };

  // Helper function to get display name for background
  const getBackgroundDisplay = (backgroundIds: string[]): string => {
    if (backgroundIds.length === 0) return t('common.all');
    if (backgroundIds.length === 1) {
      const backdrop = backdrops.find(b => b.id === backgroundIds[0]);
      return backdrop ? backdrop.name : t('common.all');
    }
    return `${backgroundIds.length} ${t('filters.backgroundsSelected')}`;
  };

  // Function to apply pending filters when modal closes
  const applyPendingFilters = (collectionOverride?: string, modelOverride?: string, backgroundOverride?: string) => {
    const symbolValue = pendingSelectedSymbolIds.length > 0 
      ? pendingSelectedSymbolIds.join(',') 
      : 'All';
    
    const newFilters = {
      collection: collectionOverride || pendingCollectionFilter,
      model: modelOverride !== undefined ? modelOverride : pendingModelFilter,
      background: backgroundOverride !== undefined ? backgroundOverride : pendingBackgroundFilter,
      symbol: symbolValue,
      sorting: pendingSortingFilter,
      minPrice: pendingPriceRange[0],
      maxPrice: pendingPriceRange[1],
      showPremarket: pendingShowPremarket,
      showUnupgraded: pendingShowUnupgraded,
    };

    // Update the actual filter states (these are used internally for consistency)
    // The actual state updates are handled by the parent component through onFilterChange

    onFilterChange?.(newFilters);
  };

  // Function to update pending filters without applying them
  const updatePendingFilter = (type: string, value: string) => {
    if (type === 'collection') setPendingCollectionFilter(value);
    if (type === 'model') setPendingModelFilter(value);
    if (type === 'background') setPendingBackgroundFilter(value);
    if (type === 'sorting') setPendingSortingFilter(value);
  };

  // Generate filter options from real data
  const filterOptions = {
    collection: [
      { value: 'All', label: 'All' },
      ...Array.from(new Set(gifts.map(gift => gift.type))).map(type => ({
        value: type,
        label: type
      }))
    ],
    model: [
      { value: 'All', label: 'All' },
      // Use fetched models if available, otherwise fall back to prop models
      ...(fetchedModels.length > 0 
        ? fetchedModels.map(model => ({
            value: String(model.model_id),
            label: model.value,
            rarity_per_mille: model.rarity_per_mille,
            floor: model.floor
          }))
        : models.map(model => ({
            value: String(model.value),
            label: String(model.value),
            rarity_per_mille: model.rarity_per_mille,
            floor: model.floor
          }))
      )
    ],
    background: [
      { value: 'All', label: 'All' },
      ...backdrops.map(backdrop => ({
        value: backdrop.id,
        label: backdrop.name,
        centerColor: backdrop.centerColor,
        edgeColor: backdrop.edgeColor,
        rarity_per_mille: backdrop.rarity_per_mille,
        floor: backdrop.floor,
      }))
    ],
    symbol: [
      { value: 'All', label: 'All' },
      ...symbols.map(symbol => ({
        value: symbol.id,
        label: symbol.name,
        url: symbol.url,
        rarity_per_mille: symbol.rarity_per_mille,
        floor: symbol.floor,
      }))
    ],
    sorting: [
      { value: 'date_new_to_old', label: 'Date: New to Old' },
      { value: 'date_old_to_new', label: 'Date: Old to New' },
      { value: 'price_low_to_high', label: 'Price: Low to High' },
      { value: 'price_high_to_low', label: 'Price: High to Low' },
      { value: 'name_a_to_z', label: 'Name: A to Z' },
      { value: 'name_z_to_a', label: 'Name: Z to A' },
    ],
  };

  return (
    <>
      <div className={e('filters')}>
        {/* Collection chip */}
        <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
          <div className={e('filter-chip')} onClick={() => setOpenSheet('collection')} role="button" tabIndex={0}>
            <span className={e('chip-label')}>{t('filters.gift')}</span>
            <div className={e('chip-control')}>
              <span className={e('chip-value')}>{getPendingGiftNameById(pendingSelectedGiftIds)}</span>
              <div className={e('chip-select')} />
            </div>
          </div>
          <span className={e('chevrons')}>
            <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18L6.35355 14.3536C6.15829 14.1583 5.84171 14.1583 5.64645 14.3536L2 18" stroke="#5C6874" strokeLinecap="round"/>
              <path d="M10 22L6.35355 25.6464C6.15829 25.8417 5.84171 25.8417 5.64645 25.6464L2 22" stroke="#5C6874" strokeLinecap="round"/>
            </svg>
          </span>
        </div>

        {/* Model chip */}
        <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center', opacity: isCollectionSelected ? 1 : 0.5}} className={e('filter-chip-container')}>
          <div 
            className={e('filter-chip')} 
            onClick={() => isCollectionSelected && setOpenSheet('model')} 
            role="button" 
            tabIndex={0}
            style={{ cursor: isCollectionSelected ? 'pointer' : 'not-allowed' }}
          >
            <span className={e('chip-label')}>{t('filters.model')}</span>
          <div className={e('chip-control')}>
            <span className={e('chip-value')}>{getModelDisplay(pendingSelectedModelIds)}</span>
            <div className={e('chip-select')} />
          </div>
          </div>
          <span className={e('chevrons')}>
            <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18L6.35355 14.3536C6.15829 14.1583 5.84171 14.1583 5.64645 14.3536L2 18" stroke="#5C6874" strokeLinecap="round"/>
              <path d="M10 22L6.35355 25.6464C6.15829 25.8417 5.84171 25.8417 5.64645 25.6464L2 22" stroke="#5C6874" strokeLinecap="round"/>
            </svg>
          </span>
        </div>

        {/* Background chip */}
        <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
          <div className={e('filter-chip')} onClick={() => setOpenSheet('background')} role="button" tabIndex={0}>
          <span className={e('chip-label')}>{t('filters.background')}</span>
          <div className={e('chip-control')}>
            <span className={e('chip-value')}>{getBackgroundDisplay(pendingSelectedBackgroundIds)}</span>
            <div className={e('chip-select')} />
          </div>
          </div>
          <span className={e('chevrons')}>
            <svg width="20" height="40" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18L6.35355 14.3536C6.15829 14.1583 5.84171 14.1583 5.64645 14.3536L2 18" stroke="#5C6874" strokeLinecap="round"/>
              <path d="M10 22L6.35355 25.6464C6.15829 25.8417 5.84171 25.8417 5.64645 25.6464L2 22" stroke="#5C6874" strokeLinecap="round"/>
            </svg>
          </span>
        </div>

        <button className={e('filter-button')} aria-label="Filter settings" onClick={() => setOpenSheet('filters')}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.8333 11V18.2233C12.87 18.4983 12.7783 18.7917 12.5675 18.9842C12.4827 19.0691 12.382 19.1366 12.2711 19.1826C12.1602 19.2286 12.0413 19.2522 11.9212 19.2522C11.8012 19.2522 11.6823 19.2286 11.5714 19.1826C11.4605 19.1366 11.3598 19.0691 11.275 18.9842L9.4325 17.1417C9.33258 17.0439 9.2566 16.9244 9.21049 16.7924C9.16438 16.6604 9.14938 16.5196 9.16667 16.3808V11H9.13917L3.85916 4.235C3.71031 4.0439 3.64314 3.80165 3.67234 3.56119C3.70154 3.32072 3.82473 3.10158 4.015 2.95167C4.18916 2.82333 4.38166 2.75 4.58333 2.75H17.4167C17.6183 2.75 17.8108 2.82333 17.985 2.95167C18.1753 3.10158 18.2985 3.32072 18.3277 3.56119C18.3569 3.80165 18.2897 4.0439 18.1408 4.235L12.8608 11H12.8333Z" fill="#5C6874"/>
          </svg>
        </button>
      </div>

      {openSheet && createPortal(
        <div className={e('sheet-overlay')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>
          <div className={e('sheet')} onClick={(ev) => ev.stopPropagation()}>
            <div className={e('sheet-header')}>
              <div>
                <div className={e('sheet-title')}>
                  {openSheet === 'collection' && t('filters.collection')}
                  {openSheet === 'model' && t('filters.model')}
                  {openSheet === 'background' && t('filters.background')}
                  {openSheet === 'filters' && t('common.filters')}
                </div>
                <div className={e('sheet-subtitle')}>{t('filters.selectFilter')}</div>
              </div>
              <button className={e('sheet-close')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>✕</button>
            </div>

            {openSheet === 'model' && !isCollectionSelected ? (
              <div className={e('sheet-content')}>
                <div className={e('panel')}>
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5C6874' }}>
                    <div style={{ fontSize: '16px', marginBottom: '8px' }}>{t('modals.selectCollectionFirst')}</div>
                    <div style={{ fontSize: '14px' }}>{t('modals.chooseCollectionForModels')}</div>
                  </div>
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-primary')} onClick={() => setOpenSheet(null)}>{t('modals.close')}</button>
                </div>
              </div>
            ) : openSheet === 'collection' ? (
              <div className={e('sheet-content')}>
                <div className={e('search-input')}>
                  <svg className={e('search-icon')} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                  </svg>
            <input
              placeholder={t('market.nameGifts')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
                </div>
                <div className={e('panel')}>
            {isLoading ? (
                    <div className={e('loading')}>{t('modals.loadingGifts')}</div>
                  ) : error ? (
                    <div className={e('error')}>{t('modals.errorLoadingGifts')}</div>
                  ) : (
              gifts
                .filter((gift) => {
                  const q = searchTerm.trim().toLowerCase();
                  if (!q) return true;
                  const name = (gift.short_name || gift.full_name || '').toLowerCase();
                  return name.includes(q);
                })
                .sort((a, b) => {
                  // Sort selected gifts to the top
                  const aSelected = pendingSelectedGiftIds.includes(a.id);
                  const bSelected = pendingSelectedGiftIds.includes(b.id);
                  
                  if (aSelected && !bSelected) return -1;
                  if (!aSelected && bSelected) return 1;
                  return 0;
                })
                .map((gift) => {
                      const checked = pendingSelectedGiftIds.includes(gift.id);
                      return (
                        <label key={gift.id} className={e('row')}>
                          <input type="checkbox" className={e('check')} checked={checked} onChange={(ev) => {
                            setPendingSelectedGiftIds(prev => ev.target.checked ? [...prev, gift.id] : prev.filter(v => v !== gift.id));
                          }} />
                          <GiftIcon giftId={gift.id} size="40" badge={gift.new ? { text: t('filters.new'), ...new_colors[gift.new_color] } : undefined} />
                          
                          <div className={e('row-main')}>
                            <div className={e('row-title')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{gift.full_name || gift.short_name}</span>
                              {gift.new && <span className={e('new-badge')} style={{ 
                                backgroundColor: gift.new_color,
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>NEW</span>}
                            </div>
                            <div className={e('row-note')}>
                              {gift.count} {t('market.channelsOnSale')}
                              {gift.premarket && (
                                <span style={{ 
                                  backgroundColor: '#FF4545',
                                  color: 'white',
                                  padding: '1px 4px',
                                  borderRadius: '16px',
                                  fontSize: '8px',
                                  fontWeight: '600',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  height: '16px',
                                  marginLeft: '8px'
                                }}>
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="10" height="10" rx="5" fill="white"/>
                                    <path d="M5 1C4.47471 1 3.95457 1.10346 3.46927 1.30448C2.98396 1.5055 2.54301 1.80014 2.17157 2.17157C1.42143 2.92172 1 3.93913 1 5C1 6.06087 1.42143 7.07828 2.17157 7.82843C2.54301 8.19986 2.98396 8.4945 3.46927 8.69552C3.95457 8.89654 4.47471 9 5 9C6.06087 9 7.07828 8.57857 7.82843 7.82843C8.57857 7.07828 9 6.06087 9 5C9 4.47471 8.89654 3.95457 8.69552 3.46927C8.4945 2.98396 8.19986 2.54301 7.82843 2.17157C7.45699 1.80014 7.01604 1.5055 6.53073 1.30448C6.04543 1.10346 5.52529 1 5 1ZM6.68 6.68L4.6 5.4V3H5.2V5.08L7 6.16L6.68 6.68Z" fill="#FF4545"/>
                                  </svg>
                                  <span style={{ marginTop: '-2px' }}>
                                    {t('filters.preMarket')}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={e('row-right')}>
                            <div className={e('row-price')}>
                              <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                              </svg>
                              <span>{gift.floor_price}</span>
                            </div>
                            <div className={e('row-min')}>{t('market.minPrice')}</div>
                          </div>
                        </label>
                  )
                })
                  )}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => { 
                    setPendingSelectedGiftIds([]);
                    setPendingCollectionFilter('All');
                    // Apply reset filters directly
                    onFilterChange?.({
                      collection: 'All',
                      model: pendingModelFilter,
                      background: pendingBackgroundFilter,
                      sorting: pendingSortingFilter,
                    });
                    setOpenSheet(null);
                  }}>{t('common.reset')}</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    const collectionValue = pendingSelectedGiftIds.length > 0 
                      ? pendingSelectedGiftIds.join(',') 
                      : 'All';
                    setPendingCollectionFilter(collectionValue);
                    applyPendingFilters(collectionValue);
                    setOpenSheet(null); 
                  }}>{t('common.search')}</button>
                </div>
              </div>
            ) : openSheet === 'model' && isCollectionSelected ? (
              <div className={e('sheet-content')}>
                <div className={e('search-input')}>
                  <svg className={e('search-icon')} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                  </svg>
                  <input
                    placeholder={t('filters.nameModel')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Model Section */}
                <div className={e('panel')}>
                  {modelsLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5C6874' }}>
                      <div style={{ fontSize: '16px' }}>{t('modals.loadingModels')}</div>
                    </div>
                  ) : fetchedModels.length === 0 && pendingSelectedGiftIds.length > 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5C6874' }}>
                      <div style={{ fontSize: '16px', marginBottom: '8px' }}>{t('modals.noModelsAvailable')}</div>
                      <div style={{ fontSize: '14px' }}>{t('modals.noModelsToFilter')}</div>
                    </div>
                  ) : (
                    filterOptions.model
                      .filter((option) => {
                        if (option.value === 'All') return false; // Don't show "All" option
                        const q = searchTerm.trim().toLowerCase();
                        if (!q) return true;
                        const name = option.label.toLowerCase();
                        return name.includes(q);
                      })
                      .sort((a, b) => {
                        // Sort selected models to the top
                        const aSelected = pendingSelectedModelIds.includes(a.value);
                        const bSelected = pendingSelectedModelIds.includes(b.value);
                        
                        if (aSelected && !bSelected) return -1;
                        if (!aSelected && bSelected) return 1;
                        return 0;
                      })
                      .map((option) => {
                        const checked = pendingSelectedModelIds.includes(option.value);
                        // Get the gift ID for icon - use first selected gift ID
                        const giftId = pendingSelectedGiftIds[0] || '';
                        // Use model name for the image URL
                        const imageUrl = `https://quant-marketplace.com/assets/gifts/${giftId}/${option.label}.png`;
                        
                        return (
                          <label key={option.value} className={e('row')}>
                            <input 
                              type="checkbox" 
                              className={e('check')} 
                              checked={checked}
                              onChange={(ev) => {
                                setPendingSelectedModelIds(prev => 
                                  ev.target.checked 
                                    ? [...prev, option.value] 
                                    : prev.filter(v => v !== option.value)
                                );
                              }} 
                            />
                            <div className={e('row-icon')}>
                              <img src={imageUrl} alt={option.label} style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                            </div>
                            
                            <div className={e('row-main')}>
                              <div className={e('row-title')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{option.label}</span>
                              </div>
                              {'rarity_per_mille' in option && option.rarity_per_mille && (
                                <div className={e('row-note')} style={{ color: '#248BDA'}}>
                                  {formatRarity(option.rarity_per_mille)}%
                                </div>
                              )}
                            </div>
                            {'floor' in option && (
                              <div className={e('row-right')}>
                                <div className={e('row-price')}>
                                  <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                                  </svg>
                                  <span>{option.floor}</span>
                                </div>
                                <div className={e('row-min')}>Min. Price</div>
                              </div>
                            )}
                          </label>
                        );
                      })
                  )}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => {
                    setPendingSelectedModelIds([]);
                    setPendingModelFilter('All');
                    setSearchTerm('');
                    // Apply reset filters directly
                    onFilterChange?.({
                      collection: pendingCollectionFilter,
                      model: 'All',
                      background: pendingBackgroundFilter,
                      sorting: pendingSortingFilter,
                    });
                    setOpenSheet(null);
                  }}>Reset</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    const modelValue = pendingSelectedModelIds.length > 0 
                      ? pendingSelectedModelIds.join(',') 
                      : 'All';
                    setPendingModelFilter(modelValue);
                    applyPendingFilters(undefined, modelValue);
                    setSearchTerm('');
                    setOpenSheet(null); 
                  }}>Search</button>
                </div>
              </div>
            ) : openSheet === 'background' ? (
              <div className={e('sheet-content')}>
                <div className={e('search-input')}>
                  <svg className={e('search-icon')} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                  </svg>
                  <input
                    placeholder={t('filters.nameBackground')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Background Section */}
                <div className={e('panel')}>
                  {filterOptions.background
                    .filter((option) => {
                      if (option.value === 'All') return false; // Don't show "All" option
                      const q = searchTerm.trim().toLowerCase();
                      if (!q) return true;
                      const name = option.label.toLowerCase();
                      return name.includes(q);
                    })
                    .sort((a, b) => {
                      // Sort selected backgrounds to the top
                      const aSelected = pendingSelectedBackgroundIds.includes(a.value);
                      const bSelected = pendingSelectedBackgroundIds.includes(b.value);
                      
                      if (aSelected && !bSelected) return -1;
                      if (!aSelected && bSelected) return 1;
                      return 0;
                    })
                    .map((option) => {
                      const checked = pendingSelectedBackgroundIds.includes(option.value);
                      
                      return (
                        <label key={option.value} className={e('row')}>
                          <input 
                            type="checkbox" 
                            className={e('check')} 
                            checked={checked}
                            onChange={(ev) => {
                              setPendingSelectedBackgroundIds(prev => 
                                ev.target.checked 
                                  ? [...prev, option.value] 
                                  : prev.filter(v => v !== option.value)
                              );
                            }} 
                          />
                          <div 
                            className={e('row-icon')}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'centerColor' in option && 'edgeColor' in option && option.centerColor && option.edgeColor 
                                ? `radial-gradient(circle, #${option.centerColor}, #${option.edgeColor})`
                                : '#2F82C7'
                            }}
                          />
                          <div className={e('row-main')}>
                            <div className={e('row-title')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{option.label}</span>
                            </div>
                            {'rarity_per_mille' in option && option.rarity_per_mille && (
                              <div className={e('row-note')} style={{ color: '#248BDA'}}>
                                {formatRarity(option.rarity_per_mille)}%
                              </div>
                            )}
                          </div>
                          {'floor' in option && (
                            <div className={e('row-right')}>
                              <div className={e('row-price')}>
                                <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                                </svg>
                                <span>{option.floor}</span>
                              </div>
                              <div className={e('row-min')}>Min. Price</div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => {
                    setPendingSelectedBackgroundIds([]);
                    setPendingBackgroundFilter('All');
                    setSearchTerm('');
                    // Apply reset filters directly
                    onFilterChange?.({
                      collection: pendingCollectionFilter,
                      model: pendingModelFilter,
                      background: 'All',
                      sorting: pendingSortingFilter,
                    });
                    setOpenSheet(null);
                  }}>{t('common.reset')}</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    const backgroundValue = pendingSelectedBackgroundIds.length > 0 
                      ? pendingSelectedBackgroundIds.join(',') 
                      : 'All';
                    setPendingBackgroundFilter(backgroundValue);
                    applyPendingFilters(undefined, undefined, backgroundValue);
                    setSearchTerm('');
                    setOpenSheet(null); 
                  }}>{t('common.search')}</button>
                </div>
              </div>
            ) : openSheet === 'filters' ? (
              <div className={e('sheet-content')}>
                {/* Price Section */}
                <div className={e('card')}>
                  <div className={e('card-header')}>
                    <span className={e('card-icon')}>
                      <svg width="14" height="14" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="#AFC0D4"/></svg>
                    </span>
                    <span className={e('card-title')}>{t('common.price')}</span>
                  </div>
                  <div className={e('range-wrap')}>
                    <div className={e('range-track')} />
                    <div
                      className={e('range-progress')}
                      style={(() => {
                        const minPrice = boundsData?.min_price ?? 0;
                        const maxPrice = boundsData?.max_price ?? 10000;
                        const range = maxPrice - minPrice;
                        
                        if (range === 0) {
                          return { left: '0%', right: '0%' };
                        }
                        
                        return {
                          left: `${((pendingPriceRange[0] - minPrice) / range) * 100}%`,
                          right: `${100 - ((pendingPriceRange[1] - minPrice) / range) * 100}%`
                        };
                      })()}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={boundsData?.min_price ?? 0}
                      max={boundsData?.max_price ?? 10000}
                      value={pendingPriceRange[0]}
                      onChange={(e)=> {
                        const nextMin = Math.min(Number(e.target.value), pendingPriceRange[1] - 1);
                        setPendingPriceRange([nextMin, pendingPriceRange[1]]);
                      }}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={boundsData?.min_price ?? 0}
                      max={boundsData?.max_price ?? 10000}
                      value={pendingPriceRange[1]}
                      onChange={(e)=> {
                        const nextMax = Math.max(Number(e.target.value), pendingPriceRange[0] + 1);
                        setPendingPriceRange([pendingPriceRange[0], nextMax]);
                      }}
                    />
                  </div>
                  <div className={e('inputs-inline')}>
                    <input value={pendingPriceRange[0]} onChange={(e)=> {
                      const minPrice = boundsData?.min_price ?? 0;
                      const maxPrice = boundsData?.max_price ?? 10000;
                      const val = Math.max(minPrice, Math.min(maxPrice, Number(e.target.value)));
                      setPendingPriceRange([Math.min(val, pendingPriceRange[1] - 1), pendingPriceRange[1]]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder={t('common.from')} />
                    <input value={pendingPriceRange[1]} onChange={(e)=> {
                      const minPrice = boundsData?.min_price ?? 0;
                      const maxPrice = boundsData?.max_price ?? 10000;
                      const val = Math.max(minPrice, Math.min(maxPrice, Number(e.target.value)));
                      setPendingPriceRange([pendingPriceRange[0], Math.max(val, pendingPriceRange[0] + 1)]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder={t('common.to')} />
                  </div>
                </div>

                {/* Collapsible Symbol Section */}
                <div className={e('card')}>
                  <div className={e('card-header')} onClick={() => setSymbolSectionOpen(!symbolSectionOpen)} style={{ cursor: 'pointer' }}>
                    <span className={e('card-icon')}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6952 6.3048C15.7411 8.35073 15.7411 11.6493 13.6952 13.6952C11.6493 15.7411 8.35073 15.7411 6.31524 13.6952C4.27975 11.6493 4.25887 8.35073 6.31524 6.3048C8.37161 4.25887 11.6493 4.25887 13.6952 6.3048ZM17.7975 2.22338C17.7975 2.22338 16.785 2.34864 15.6681 3.06889C15.4903 1.90397 14.9412 0.827593 14.1023 0C13.5649 0.518701 13.1753 1.17114 12.9735 1.89027C12.7717 2.6094 12.765 3.36929 12.9541 4.09186C14.405 4.46764 15.5324 5.59499 15.9081 7.04593C17.0772 7.35908 18.7056 7.20251 20 5.8977C19.1816 5.07114 18.1214 4.52642 16.9729 4.34238C17.38 3.73695 17.7035 3.03758 17.7975 2.22338ZM2.20251 17.7766C2.20251 17.7766 3.21503 17.6514 4.33194 16.9311C4.48852 18.0167 5.01044 19.1127 5.8977 20C7.20251 18.7056 7.35908 17.0772 7.04593 15.9081C6.33456 15.7245 5.68538 15.3536 5.16588 14.8341C4.64637 14.3146 4.27551 13.6654 4.09186 12.9541C2.92276 12.6409 1.29436 12.7975 0 14.1023C0.876827 14.9791 1.95198 15.501 3.02714 15.6576C2.62004 16.263 2.29645 16.9729 2.20251 17.7766Z" fill="#AFC0D4"/>
                      </svg>
                    </span>
                    <span className={e('card-title')}>{t('filters.symbol')}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto', transform: symbolSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M4 6L8 10L12 6" stroke="#5C6874" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {symbolSectionOpen && (
                    <>
                      <div className={e('search-input')} style={{ padding: '8px 0px' }}>
                        <svg className={e('search-icon')} 
                        style={{ left: '12px' }}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                        </svg>
                        <input
                          placeholder={t('filters.nameSymbol')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ color: '#E7EEF7'}}
                        />
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {filterOptions.symbol
                          .filter((option) => {
                            if (option.value === 'All') return false;
                            const q = searchTerm.trim().toLowerCase();
                            if (!q) return true;
                            const name = option.label.toLowerCase();
                            return name.includes(q);
                          })
                          .sort((a, b) => {
                            const aSelected = pendingSelectedSymbolIds.includes(a.value);
                            const bSelected = pendingSelectedSymbolIds.includes(b.value);
                            if (aSelected && !bSelected) return -1;
                            if (!aSelected && bSelected) return 1;
                            return 0;
                          })
                          .map((option) => {
                            const checked = pendingSelectedSymbolIds.includes(option.value);
                            const symbolUrl = `https://quant-marketplace.com/assets/symbols/${option.label}.png`;
                            return (
                              <label key={option.value} className={e('row')} style={{ padding: '8px 0' }}>
                                <input 
                                  type="checkbox" 
                                  className={e('check')} 
                                  checked={checked}
                                  onChange={(ev) => {
                                    setPendingSelectedSymbolIds(prev => 
                                      ev.target.checked 
                                        ? [...prev, option.value] 
                                        : prev.filter(v => v !== option.value)
                                    );
                                  }} 
                                />
                                <div className={e('row-icon')}>
                                  <img src={symbolUrl} alt={option.label} style={{ width: '30px', height: '30px', borderRadius: '8px', filter: 'brightness(0) invert(1)' }} />
                                </div>
                                <div className={e('row-main')}>
                                  <div className={e('row-title')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{option.label}</span>
                                  </div>
                                  {'rarity_per_mille' in option && option.rarity_per_mille && (
                                    <div className={e('row-note')} style={{ color: '#248BDA'}}>
                                      {formatRarity(option.rarity_per_mille)}%
                                    </div>
                                  )}
                                </div>
                                {'floor' in option && (
                                  <div className={e('row-right')}>
                                    <div className={e('row-price')}>
                                      <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                                      </svg>
                                      <span>{option.floor}</span>
                                    </div>
                                    <div className={e('row-min')}>Min. Price</div>
                                  </div>
                                )}
                              </label>
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>

                {/* Sorting Section */}
                <div className={e('card')}>
                  <div className={e('card-header')} style={{ marginBottom: '14px' }}>
                    <span className={e('card-icon')}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5H13M5 9H11M7 13H9" stroke="#AFC0D4" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className={e('card-title')}>{t('filters.sorting')}</span>
                  </div>
                  {filterOptions.sorting.map((option) => (
                    <label key={option.value} className={e('row')} style={{ paddingLeft: '0', paddingRight: '0'}}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="sorting"
                        checked={pendingSortingFilter === option.value}
                        onChange={() => {
                          updatePendingFilter('sorting', option.value);
                        }} 
                      />
                      <div className={e('row-main')}>
                        <div className={e('row-title')}>
                          {option.label}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Toggle Section */}
                <div className={e('card')}>
                  <label className={e('toggle-row')}>
                    <span style={{color: '#fff'}}>{t('filters.showPremarket')}</span>
                    <input className={e('switch')} type="checkbox" checked={pendingShowPremarket} onChange={(e)=> setPendingShowPremarket(e.target.checked)} />
                  </label>
                  <label className={e('toggle-row')}>
                    <span style={{color: '#fff'}}>{t('filters.showUnupgraded')}</span>
                    <input className={e('switch')} type="checkbox" checked={pendingShowUnupgraded} onChange={(e)=> setPendingShowUnupgraded(e.target.checked)} />
                  </label>
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => {
                    // Reset all filters in this modal
                    const resetPriceRange: [number, number] = boundsData 
                      ? [boundsData.min_price ?? 0, boundsData.max_price ?? 10000]
                      : [0, 10000];
                    
                    console.log('Resetting filters with bounds:', boundsData, 'resetPriceRange:', resetPriceRange);
                    
                    setPendingPriceRange(resetPriceRange);
                    setPendingSelectedSymbolIds([]);
                    setPendingSortingFilter('date_new_to_old');
                    setPendingShowPremarket(true);
                    setPendingShowUnupgraded(true);
                    setSearchTerm('');
                    // Apply reset filters directly
                    onFilterChange?.({
                      collection: pendingCollectionFilter,
                      model: pendingModelFilter,
                      background: pendingBackgroundFilter,
                      symbol: 'All',
                      sorting: 'date_new_to_old',
                      minPrice: resetPriceRange[0],
                      maxPrice: resetPriceRange[1],
                      showPremarket: true,
                      showUnupgraded: true,
                    });
                    setOpenSheet(null);
                  }}>{t('common.reset')}</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    applyPendingFilters(); 
                    setOpenSheet(null); 
                  }}>{t('common.search')}</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
