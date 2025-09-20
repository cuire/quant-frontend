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
}

export const GiftFilters: FC<GiftFiltersProps> = ({ 
  onFilterChange,
  currentFilters
}) => {
  // Get gifts data from API
  const { data: giftsData, isLoading, error } = useGiftsWithFilters();
  const gifts = giftsData?.gifts || [];
  const backdrops = giftsData?.backdrops || [];
  const [collectionFilter, setCollectionFilter] = useState(currentFilters?.collection || 'All');
  const [modelFilter, setModelFilter] = useState(currentFilters?.model || 'All');
  const [backgroundFilter, setBackgroundFilter] = useState(currentFilters?.background || 'All');
  const [sortingFilter, setSortingFilter] = useState(currentFilters?.sorting || 'date_new_to_old');
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [openSheet, setOpenSheet] = useState<null | 'collection' | 'model' | 'background' | 'filters'>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Update filter states when currentFilters change
  useEffect(() => {
    if (currentFilters) {
      setCollectionFilter(currentFilters.collection);
      setModelFilter(currentFilters.model);
      setBackgroundFilter(currentFilters.background);
      setSortingFilter(currentFilters.sorting);
      
      // Update selectedGiftIds from collection filter
      if (currentFilters.collection && currentFilters.collection !== 'All') {
        setSelectedGiftIds(currentFilters.collection.split(',').filter(id => id.trim()));
      } else {
        setSelectedGiftIds([]);
      }
    }
  }, [currentFilters]);

  // Clear search when closing/opening sheet
  useEffect(() => {
    if (openSheet !== 'collection') {
      setSearchTerm('');
    }
  }, [openSheet]);

  // Helper function to get gift name by ID
  const getGiftNameById = (giftIds: string[]): string => {
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


  const handleFilterChange = (type: string, value: string) => {
    const newFilters = {
      collection: type === 'collection' ? value : collectionFilter,
      model: type === 'model' ? value : modelFilter,
      background: type === 'background' ? value : backgroundFilter,
      sorting: type === 'sorting' ? value : sortingFilter,
    };

    if (type === 'collection') setCollectionFilter(value);
    if (type === 'model') setModelFilter(value);
    if (type === 'background') setBackgroundFilter(value);
    if (type === 'sorting') setSortingFilter(value);

    onFilterChange?.(newFilters);
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
      ...Array.from(new Set(gifts.flatMap(gift => gift.models.map(model => ({ id: model.id, name: model.name }))))).map(model => ({
        value: model.id,
        label: model.name
      }))
    ],
    background: [
      { value: 'All', label: 'All' },
      ...backdrops.map(backdrop => ({
        value: backdrop.id,
        label: backdrop.name
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
              <span className={e('chip-value')}>{getGiftNameById(currentFilters?.collection ? currentFilters.collection.split(',') : [])}</span>
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
        <div style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
          <div className={e('filter-chip')} onClick={() => setOpenSheet('model')} role="button" tabIndex={0}>
            <span className={e('chip-label')}>Model</span>
            <div className={e('chip-control')}>
              <span className={e('chip-value')}>{getModelDisplay(modelFilter)}</span>
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
              <span className={e('chip-value')}>{getBackgroundDisplay(backgroundFilter)}</span>
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
        <div className={e('sheet-overlay')} onClick={() => setOpenSheet(null)}>
          <div className={e('sheet')} onClick={(ev) => ev.stopPropagation()}>
            <div className={e('sheet-header')}>
              <div>
                <div className={e('sheet-title')}>
            {openSheet === 'collection' && 'Collection'}
                  {openSheet === 'filters' && 'Filters'}
                </div>
                <div className={e('sheet-subtitle')}>Selects the appropriate filter</div>
              </div>
              <button className={e('sheet-close')} onClick={() => setOpenSheet(null)}>✕</button>
            </div>

            {openSheet === 'collection' ? (
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
                      const checked = selectedGiftIds.includes(gift.id);
                      return (
                        <label key={gift.id} className={e('row')}>
                          <input type="checkbox" className={e('check')} checked={checked} onChange={(ev) => {
                            setSelectedGiftIds(prev => ev.target.checked ? [...prev, gift.id] : prev.filter(v => v !== gift.id));
                          }} />
                          <GiftIcon giftId={gift.id} size={40} />
                          
                          <div className={e('row-main')}>
                            <div className={e('row-title')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{gift.short_name || gift.full_name}</span>
                              {gift.new && <span className={e('new-badge')} style={{ 
                                backgroundColor: gift.new_color,
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>NEW</span>}
                              {gift.premarket && <span className={e('premarket-badge')} style={{ 
                                backgroundColor: '#ff6b35',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}>PREMARKET</span>}
                            </div>
                            <div className={e('row-note')}>Available in market</div>
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
                  <button className={e('btn-secondary')} onClick={() => { setSelectedGiftIds([]); }}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { 
                    handleFilterChange('collection', selectedGiftIds.join(',')); 
                    setOpenSheet(null); 
                  }}>Search</button>
                </div>
              </div>
            ) : (
              <div className={e('sheet-content')}>
                {/* Model Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Model</div>
                    <div className={e('toggle-value')}>{getModelDisplay(modelFilter)}</div>
                  </div>
                  {filterOptions.model.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="model"
                        checked={modelFilter === option.value}
                        onChange={() => {
                          handleFilterChange('model', option.value);
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

                {/* Background Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Background</div>
                    <div className={e('toggle-value')}>{getBackgroundDisplay(backgroundFilter)}</div>
                  </div>
                  {filterOptions.background.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="background"
                        checked={backgroundFilter === option.value}
                        onChange={() => {
                          handleFilterChange('background', option.value);
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

                {/* Sorting Section */}
                <div className={e('panel')}>
                  <div className={e('toggle-row')}>
                    <div className={e('toggle-label')}>Sorting</div>
                    <div className={e('toggle-value')}>{getSortingDisplay(sortingFilter)}</div>
                  </div>
                  {filterOptions.sorting.map((option) => (
                    <label key={option.value} className={e('toggle-row')}>
                      <input 
                        type="radio" 
                        className={e('radio')} 
                        name="sorting"
                        checked={sortingFilter === option.value}
                        onChange={() => {
                          handleFilterChange('sorting', option.value);
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
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
