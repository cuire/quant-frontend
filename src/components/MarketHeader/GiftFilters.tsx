import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { bem } from '@/css/bem.ts';
import type { GiftFilterChangeParams, GiftCurrentFilters } from '@/lib/filters';
import { GiftIcon } from '@/components/GiftIcon';
// removed unused api types
import { useGiftsWithFilters } from '@/lib/api-hooks';
import './MarketHeader.css';

const [, e] = bem('market-header');

export interface GiftFiltersProps {
  onFilterChange?: (filters: GiftFilterChangeParams) => void;
  currentFilters?: GiftCurrentFilters;
  models?: Array<{
    value: string;
    rarity_per_mille: number;
    floor: number;
  }>;
}

export const GiftFilters: FC<GiftFiltersProps> = ({ 
  onFilterChange,
  currentFilters,
  models = []
}) => {
  // Get gifts data from API (for collection and background options)
  const { data: giftsData, isLoading, error } = useGiftsWithFilters();
  const gifts = giftsData?.gifts || [];
  const backdrops = giftsData?.backdrops || [];
  const [openSheet, setOpenSheet] = useState<null | 'collection' | 'model' | 'background' | 'filters'>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for pending changes (not applied until modal closes)
  const [pendingCollectionFilter, setPendingCollectionFilter] = useState(currentFilters?.collection || 'All');
  const [pendingModelFilter, setPendingModelFilter] = useState(currentFilters?.model || 'All');
  const [pendingBackgroundFilter, setPendingBackgroundFilter] = useState(currentFilters?.background || 'All');
  const [pendingSortingFilter, setPendingSortingFilter] = useState(currentFilters?.sorting || 'date_new_to_old');
  const [pendingSelectedGiftIds, setPendingSelectedGiftIds] = useState<string[]>([]);

  // Check if a collection is selected (not 'All' and not empty)
  const isCollectionSelected = pendingCollectionFilter && pendingCollectionFilter !== 'All' && pendingCollectionFilter.trim() !== '';

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
    }
  }, [currentFilters]);

  // Reset model filter when collection changes
  useEffect(() => {
    if (!isCollectionSelected) {
      setPendingModelFilter('All');
    }
  }, [isCollectionSelected]);

  // Clear search when closing/opening sheet
  useEffect(() => {
    if (openSheet !== 'collection') {
      setSearchTerm('');
    }
  }, [openSheet]);

  // Helper function to get pending gift name by ID
  const getPendingGiftNameById = (giftIds: string[]): string => {
    if (giftIds.length === 0) return 'All';
    if (giftIds.length === 1) {
      const gift = gifts.find(g => g.id === giftIds[0]);
      return gift ? (gift.short_name || gift.full_name) : 'All';
    }
    return `${giftIds.length} gifts selected`;
  };
  // removed unused getCollectionDisplay
  // Helper function to get display name for model
  const getModelDisplay = (value: string): string => {
    if (value === 'All') return 'All';
    return value;
  };

  // Helper function to get display name for background
  const getBackgroundDisplay = (value: string): string => {
    if (value === 'All') return 'All';
    return value;
  };

  // Helper function to get display name for sorting
  const getSortingDisplay = (value: string): string => {
    const mapping: Record<string, string> = {
      'date_new_to_old': 'Date: New to Old',
      'date_old_to_new': 'Date: Old to New',
      'price_low_to_high': 'Price: Low to High',
      'price_high_to_low': 'Price: High to Low',
      'name_a_to_z': 'Name: A to Z',
      'name_z_to_a': 'Name: Z to A',
    };
    return mapping[value] || 'Date: New to Old';
  };


  // Function to apply pending filters when modal closes
  const applyPendingFilters = (collectionOverride?: string) => {
    const newFilters = {
      collection: collectionOverride || pendingCollectionFilter,
      model: pendingModelFilter,
      background: pendingBackgroundFilter,
      sorting: pendingSortingFilter,
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
      ...models.map(model => ({
        value: model.value,
        label: model.value
      }))
    ],
    background: [
      { value: 'All', label: 'All' },
      ...backdrops.map(backdrop => ({
        value: backdrop.id,
        label: backdrop.name,
        centerColor: backdrop.centerColor,
        edgeColor: backdrop.edgeColor,
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
            <span className={e('chip-label')}>Collection</span>
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
            <span className={e('chip-label')}>Model</span>
            <div className={e('chip-control')}>
              <span className={e('chip-value')}>{getModelDisplay(pendingModelFilter)}</span>
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
            <span className={e('chip-label')}>Background</span>
            <div className={e('chip-control')}>
              <span className={e('chip-value')}>{getBackgroundDisplay(pendingBackgroundFilter)}</span>
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
                  {openSheet === 'collection' && 'Collection'}
                  {openSheet === 'model' && 'Model'}
                  {openSheet === 'background' && 'Background'}
                  {openSheet === 'filters' && 'Filters'}
                </div>
                <div className={e('sheet-subtitle')}>Selects the appropriate filter</div>
              </div>
              <button className={e('sheet-close')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>✕</button>
            </div>

            {openSheet === 'model' && !isCollectionSelected ? (
              <div className={e('sheet-content')}>
                <div className={e('panel')}>
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5C6874' }}>
                    <div style={{ fontSize: '16px', marginBottom: '8px' }}>Select a collection first</div>
                    <div style={{ fontSize: '14px' }}>Choose a collection to see available models</div>
                  </div>
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-primary')} onClick={() => setOpenSheet(null)}>Close</button>
                </div>
              </div>
            ) : openSheet === 'collection' ? (
              <div className={e('sheet-content')}>
                <div className={e('search-input')}>
                  <svg className={e('search-icon')} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                  </svg>
            <input
              placeholder="Name Gifts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
                </div>
                <div className={e('panel')}>
            {isLoading ? (
                    <div className={e('loading')}>Loading gifts...</div>
                  ) : error ? (
                    <div className={e('error')}>Error loading gifts</div>
                  ) : (
              gifts
                .filter((gift) => {
                  const q = searchTerm.trim().toLowerCase();
                  if (!q) return true;
                  const name = (gift.short_name || gift.full_name || '').toLowerCase();
                  return name.includes(q);
                })
                .map((gift) => {
                      const checked = pendingSelectedGiftIds.includes(gift.id);
                      return (
                        <label key={gift.id} className={e('row')}>
                          <input type="checkbox" className={e('check')} checked={checked} onChange={(ev) => {
                            setPendingSelectedGiftIds(prev => ev.target.checked ? [...prev, gift.id] : prev.filter(v => v !== gift.id));
                          }} />
                          <GiftIcon giftId={gift.id} size="40" />
                          
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
                                  marginTop: '3px'
                                }}>
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="10" height="10" rx="5" fill="white"/>
                                    <path d="M5 1C4.47471 1 3.95457 1.10346 3.46927 1.30448C2.98396 1.5055 2.54301 1.80014 2.17157 2.17157C1.42143 2.92172 1 3.93913 1 5C1 6.06087 1.42143 7.07828 2.17157 7.82843C2.54301 8.19986 2.98396 8.4945 3.46927 8.69552C3.95457 8.89654 4.47471 9 5 9C6.06087 9 7.07828 8.57857 7.82843 7.82843C8.57857 7.07828 9 6.06087 9 5C9 4.47471 8.89654 3.95457 8.69552 3.46927C8.4945 2.98396 8.19986 2.54301 7.82843 2.17157C7.45699 1.80014 7.01604 1.5055 6.53073 1.30448C6.04543 1.10346 5.52529 1 5 1ZM6.68 6.68L4.6 5.4V3H5.2V5.08L7 6.16L6.68 6.68Z" fill="#FF4545"/>
                                  </svg>
                                  Pre-Market
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
                            <div className={e('row-min')}>Min. Price</div>
                          </div>
                        </label>
                  )
                })
                  )}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => { setPendingSelectedGiftIds([]); }}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    const collectionValue = pendingSelectedGiftIds.join(',');
                    setPendingCollectionFilter(collectionValue);
                    applyPendingFilters(collectionValue);
                    setOpenSheet(null); 
                  }}>Search</button>
                </div>
              </div>
            ) : openSheet === 'model' && isCollectionSelected ? (
              <div className={e('sheet-content')}>
                {/* Model Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Model</div>
                    <div className={e('toggle-value')}>{getModelDisplay(pendingModelFilter)}</div>
                  </div>
                  {filterOptions.model.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="model"
                        checked={pendingModelFilter === option.value}
                        onChange={() => {
                          updatePendingFilter('model', option.value);
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
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => updatePendingFilter('model', 'All')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>Search</button>
                </div>
              </div>
            ) : openSheet === 'background' ? (
              <div className={e('sheet-content')}>
                {/* Background Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Background</div>
                    <div className={e('toggle-value')}>{getBackgroundDisplay(pendingBackgroundFilter)}</div>
                  </div>
                  {filterOptions.background.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="background"
                        checked={pendingBackgroundFilter === option.value}
                        onChange={() => {
                          updatePendingFilter('background', option.value);
                        }} 
                      />
                      <div 
                        className={e('row-icon')}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'centerColor' in option && 'edgeColor' in option && option.centerColor && option.edgeColor 
                            ? `radial-gradient(circle, ${option.centerColor}, ${option.edgeColor})`
                            : '#2F82C7'
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
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => updatePendingFilter('background', 'All')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>Search</button>
                </div>
              </div>
            ) : openSheet === 'filters' ? (
              <div className={e('sheet-content')}>
                {/* Sorting Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Sorting</div>
                    <div className={e('toggle-value')}>{getSortingDisplay(pendingSortingFilter)}</div>
                  </div>
                  {filterOptions.sorting.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
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
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => updatePendingFilter('sorting', 'date_new_to_old')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { applyPendingFilters(); setOpenSheet(null); }}>Search</button>
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
