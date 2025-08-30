import type { FC } from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { bem } from '@/css/bem.ts';

import './MarketHeader.css';

const [b, e] = bem('market-header');

export interface MarketHeaderProps {
  balance?: number;
  onFilterChange?: (filters: {
    gift: string;
    channelType: string;
    sorting: string;
  }) => void;
}

export const MarketHeader: FC<MarketHeaderProps> = ({ 
  balance = 243.16, 
  onFilterChange 
}) => {
  const [giftFilter, setGiftFilter] = useState('All');
  const [channelTypeFilter, setChannelTypeFilter] = useState('All');
  const [sortingFilter, setSortingFilter] = useState('All');
  const [openSheet, setOpenSheet] = useState<null | 'gift' | 'channelType' | 'sorting' | 'filters'>(null);
  const [selectedGifts, setSelectedGifts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [qtyRange, setQtyRange] = useState<[number, number]>([0, 100]);
  const [onlyExactGift, setOnlyExactGift] = useState(false);
  const [showUpgraded, setShowUpgraded] = useState(true);

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = {
      gift: type === 'gift' ? value : giftFilter,
      channelType: type === 'channelType' ? value : channelTypeFilter,
      sorting: type === 'sorting' ? value : sortingFilter,
    };

    if (type === 'gift') setGiftFilter(value);
    if (type === 'channelType') setChannelTypeFilter(value);
    if (type === 'sorting') setSortingFilter(value);

    onFilterChange?.(newFilters);
  };

  return (
    <div className={b()}>
      <div className={e('second-row')}>
        <div className={e('telegram-badge')}>
          <div className={e('telegram-icon')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.624 3.44667L12.604 12.9033C12.4533 13.5693 12.0667 13.7193 11.508 13.4187L8.47799 11.184L6.99466 12.602C6.84466 12.7527 6.69399 12.9033 6.34999 12.9033L6.58666 9.78667L12.2387 4.65067C12.4747 4.414 12.174 4.328 11.8733 4.522L4.84599 8.94867L1.81533 8.02467C1.14933 7.81 1.14933 7.358 1.96599 7.058L13.7427 2.48C14.3227 2.308 14.8173 2.60933 14.624 3.44667Z" fill="white"/>
            </svg>
          </div>
          <span className={e('telegram-text')}>Telegram Channel</span>
          <div className={e('arrow')}>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.99998 11.6667L6.33331 8.33333L2.99998 5" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={e('right-section')}>
          <div className={e('btn-group')}>
            <div className={e('balance-icon')}>
              <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
              </svg>
            </div>
            <span className={e('balance-amount')}>{balance}</span>
            <button className={e('add-button')}><span style={{fontSize: '18px', marginBottom: '3px'}}>+</span></button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={e('filters')}>
        {/* Gift chip */}
        <div  style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
        <div className={e('filter-chip')} onClick={() => setOpenSheet('gift')} role="button" tabIndex={0}>
          <span className={e('chip-label')}>Gift</span>
          <div className={e('chip-control')}>
            <span className={e('chip-value')}>{giftFilter}</span>
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

        {/* Channel Type chip */}
        <div  style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
        <div className={e('filter-chip')} onClick={() => setOpenSheet('channelType')} role="button" tabIndex={0}>
          <span className={e('chip-label')}>Channel Type</span>
          <div className={e('chip-control')}>
            <span className={e('chip-value')}>{channelTypeFilter}</span>
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

        {/* Sorting chip */}
        <div  style={{display: 'flex', flexDirection: 'row', backgroundColor: '#212A33', alignItems: 'center'}} className={e('filter-chip-container')}>
        <div className={e('filter-chip')} onClick={() => setOpenSheet('sorting')} role="button" tabIndex={0}>
          <span className={e('chip-label')}>Sorting</span>
          <div className={e('chip-control')}>
            <span className={e('chip-value')}>{sortingFilter}</span>
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
                  {openSheet === 'gift' && 'Gift'}
                  {openSheet === 'channelType' && 'Channel Type'}
                  {openSheet === 'sorting' && 'Sorting'}
                  {openSheet === 'filters' && 'Filters'}
                </div>
                <div className={e('sheet-subtitle')}>Selects the appropriate filter</div>
              </div>
              <button className={e('sheet-close')} onClick={() => setOpenSheet(null)}>✕</button>
            </div>

            {openSheet === 'gift' && (
              <div className={e('sheet-content')}>
                <div className={e('search-input')}>
                  <svg className={e('search-icon')} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-4.23C15.91 6.01 13.4 3.5 10.45 3.5S5 6.01 5 9.5 7.51 15.5 10.45 15.5c1.61 0 3.09-.59 4.23-1.48l.27.28v.79L20 20.49 21.49 19 15.5 14zm-5.05 0C8.01 14 6 11.99 6 9.5S8.01 5 10.45 5 14.9 7.01 14.9 9.5 12.89 14 10.45 14z" fill="#5B738F"/>
                  </svg>
                  <input placeholder="Name Gifts" />
                </div>
                <div className={e('panel')}>
                  {[
                    {name:'Redo Woof', price:91.67},
                    {name:'Plush Pepe', price:1100},
                    {name:'Heart Charm', price:51.55},
                    {name:'Fly Paper', price:91.67},
                    {name:'Snoop Doogy', price:2.1},
                    {name:'Heart Locked', price:800},
                    {name:'Brick', price:981},
                  ].map(({name, price}) => {
                    const checked = selectedGifts.includes(name);
                    return (
                      <label key={name} className={e('row')}>
                        <input type="checkbox" className={e('check')} checked={checked} onChange={(ev) => {
                          setSelectedGifts(prev => ev.target.checked ? [...prev, name] : prev.filter(v => v!==name));
                        }} />
                        <div className={e('row-main')}>
                          <div className={e('row-title')}>{name}</div>
                          <div className={e('row-note')}>channels on sale</div>
                        </div>
                        <div className={e('row-right')}>
                          <div className={e('row-price')}>
                            <svg className={e('diamond-icon')} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
                            </svg>
                            <span>{price}</span>
                          </div>
                          <div className={e('row-min')}>Min. Price</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => { setSelectedGifts([]); }}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => { handleFilterChange('gift', selectedGifts[0] ?? 'All'); setOpenSheet(null); }}>Search</button>
                </div>
              </div>
            )}

            {openSheet === 'channelType' && (
              <div className={e('sheet-content')}>
                <div className={e('panel')}>
                {['All','Instant','With Waiting'].map(v => (
                  <label key={v} className={e('row')}>
                    <input type="radio" className={e('radio')} name="channelType" checked={channelTypeFilter===v} onChange={() => handleFilterChange('channelType', v)} />
                    <div className={e('row-main')}>
                      <div className={e('row-title')}>
                        {v === 'Instant' && (
                          <svg style={{marginRight: '4px', marginBottom: '-1px'}} width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.83338 0.833322C5.83342 0.741725 5.80328 0.652665 5.74763 0.579919C5.69197 0.507173 5.61389 0.454795 5.52546 0.430887C5.43704 0.406979 5.34321 0.412873 5.25847 0.447659C5.17374 0.482444 5.10283 0.544182 5.05671 0.623322L2.14004 5.62332C2.10309 5.68664 2.0835 5.75859 2.08325 5.83191C2.08301 5.90522 2.1021 5.9773 2.13862 6.04087C2.17514 6.10444 2.22779 6.15725 2.29125 6.19397C2.35471 6.23069 2.42673 6.25001 2.50004 6.24999H4.16671V9.16666C4.16666 9.25825 4.1968 9.34731 4.25246 9.42006C4.30812 9.4928 4.3862 9.54518 4.47462 9.56909C4.56304 9.593 4.65688 9.5871 4.74161 9.55232C4.82635 9.51753 4.89726 9.4558 4.94338 9.37666L7.86004 4.37665C7.89699 4.31333 7.91658 4.24138 7.91683 4.16807C7.91708 4.09476 7.89798 4.02267 7.86146 3.9591C7.82494 3.89553 7.77229 3.84272 7.70884 3.80601C7.64538 3.76929 7.57336 3.74997 7.50004 3.74999H5.83338V0.833322Z" fill="#E7EEF7"/>
                          </svg>
                        )}
                        {v === 'With Waiting' && (
                          <svg style={{marginRight: '4px', marginBottom: '-1px'}} width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_clock)">
                              <path d="M5.00002 2.70831C5.00002 2.60831 5.00002 2.55873 5.03335 2.5279C5.06752 2.49706 5.11418 2.50081 5.20835 2.50873C5.62809 2.54379 6.03216 2.68433 6.38306 2.9173C6.73396 3.15027 7.02031 3.46812 7.21553 3.84135C7.41075 4.21458 7.50851 4.63108 7.49972 5.05218C7.49094 5.47329 7.37591 5.88535 7.1653 6.25011C6.95469 6.61488 6.65534 6.92051 6.29503 7.13865C5.93472 7.35679 5.52513 7.48036 5.1043 7.49789C4.68347 7.51542 4.26503 7.42634 3.88783 7.23891C3.51063 7.05149 3.18689 6.7718 2.94668 6.42581C2.89252 6.34831 2.86585 6.30956 2.87585 6.26498C2.88585 6.2204 2.92918 6.19581 3.01543 6.14581L4.89585 5.05998C4.94668 5.03081 4.9721 5.01623 4.98585 4.99206C5.00002 4.9679 5.00002 4.93831 5.00002 4.87956V2.70831Z" fill="#E7EEF7"/>
                              <path d="M5 8.75C7.07107 8.75 8.75 7.07107 8.75 5C8.75 2.92893 7.07107 1.25 5 1.25C2.92893 1.25 1.25 2.92893 1.25 5C1.25 7.07107 2.92893 8.75 5 8.75Z" stroke="#E7EEF7" strokeWidth="0.833333"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_clock">
                                <rect width="10" height="10" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        )}
                        {v}
                      </div>
                    </div>
                  </label>
                ))}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => handleFilterChange('channelType', 'All')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => setOpenSheet(null)}>Search</button>
                </div>
              </div>
            )}

            {openSheet === 'sorting' && (
              <div className={e('sheet-content')}>
                <div className={e('panel')}>
                {['Date: New to Old','Date: Old to New','Price: Low to High','Price: High to Low','Price per unit','Quantity: Low to High','Quantity: High to Low'].map(v => (
                  <label key={v} className={e('row')}>
                    <input type="radio" className={e('radio')} name="sorting" checked={sortingFilter===v} onChange={() => handleFilterChange('sorting', v)} />
                    <div className={e('row-main')}>
                      <div className={e('row-title')}>{v}</div>
                    </div>
                  </label>
                ))}
                </div>
                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')} onClick={() => handleFilterChange('sorting', 'Date: New to Old')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => setOpenSheet(null)}>Search</button>
                </div>
              </div>
            )}

            {openSheet === 'filters' && (
              <div className={e('sheet-content')}>
                <div className={e('card')}>
                  <div className={e('card-header')}>
                    <span className={e('card-icon')}>
                      <svg width="14" height="14" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="#AFC0D4"/></svg>
                    </span>
                    <span className={e('card-title')}>Price</span>
                  </div>
                  <div className={e('range-wrap')}>
                    <div className={e('range-track')} />
                    <div
                      className={e('range-progress')}
                      style={{ left: `${(priceRange[0] / 2000) * 100}%`, right: `${100 - (priceRange[1] / 2000) * 100}%` }}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={0}
                      max={2000}
                      value={priceRange[0]}
                      onChange={(e)=> {
                        const nextMin = Math.min(Number(e.target.value), priceRange[1] - 1);
                        setPriceRange([nextMin, priceRange[1]]);
                      }}
                      onInput={(e)=> {
                        const nextMin = Math.min(Number((e.target as HTMLInputElement).value), priceRange[1] - 1);
                        setPriceRange([nextMin, priceRange[1]]);
                      }}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={0}
                      max={2000}
                      value={priceRange[1]}
                      onChange={(e)=> {
                        const nextMax = Math.max(Number(e.target.value), priceRange[0] + 1);
                        setPriceRange([priceRange[0], nextMax]);
                      }}
                      onInput={(e)=> {
                        const nextMax = Math.max(Number((e.target as HTMLInputElement).value), priceRange[0] + 1);
                        setPriceRange([priceRange[0], nextMax]);
                      }}
                    />
                  </div>
                  <div className={e('inputs-inline')}>
                    <input value={priceRange[0]} onChange={(e)=> {
                      const val = Math.max(0, Math.min(2000, Number(e.target.value)));
                      setPriceRange([Math.min(val, priceRange[1] - 1), priceRange[1]]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder="From" />
                    <input value={priceRange[1]} onChange={(e)=> {
                      const val = Math.max(0, Math.min(2000, Number(e.target.value)));
                      setPriceRange([priceRange[0], Math.max(val, priceRange[0] + 1)]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder="To" />
                  </div>
                </div>
                <div className={e('card')}>
                  <div className={e('card-header')}>
                    <span className={e('card-icon')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16v2H4V7zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" fill="#AFC0D4"/></svg>
                    </span>
                    <span className={e('card-title')}>Quantity</span>
                  </div>
                  <div className={e('range-wrap')}>
                    <div className={e('range-track')} />
                    <div
                      className={e('range-progress')}
                      style={{ left: `${(qtyRange[0] / 200) * 100}%`, right: `${100 - (qtyRange[1] / 200) * 100}%` }}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={0}
                      max={200}
                      value={qtyRange[0]}
                      onChange={(e)=> {
                        const nextMin = Math.min(Number(e.target.value), qtyRange[1] - 1);
                        setQtyRange([nextMin, qtyRange[1]]);
                      }}
                      onInput={(e)=> {
                        const nextMin = Math.min(Number((e.target as HTMLInputElement).value), qtyRange[1] - 1);
                        setQtyRange([nextMin, qtyRange[1]]);
                      }}
                    />
                    <input
                      className={e('range')}
                      type="range"
                      min={0}
                      max={200}
                      value={qtyRange[1]}
                      onChange={(e)=> {
                        const nextMax = Math.max(Number(e.target.value), qtyRange[0] + 1);
                        setQtyRange([qtyRange[0], nextMax]);
                      }}
                      onInput={(e)=> {
                        const nextMax = Math.max(Number((e.target as HTMLInputElement).value), qtyRange[0] + 1);
                        setQtyRange([qtyRange[0], nextMax]);
                      }}
                    />
                  </div>
                  <div className={e('inputs-inline')}>
                    <input value={qtyRange[0]} onChange={(e)=> {
                      const val = Math.max(0, Math.min(200, Number(e.target.value)));
                      setQtyRange([Math.min(val, qtyRange[1] - 1), qtyRange[1]]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder="From" />
                    <input value={qtyRange[1]} onChange={(e)=> {
                      const val = Math.max(0, Math.min(200, Number(e.target.value)));
                      setQtyRange([qtyRange[0], Math.max(val, qtyRange[0] + 1)]);
                    }} style={{backgroundColor: '#2A3541', border: '1px solid #3F4B58', borderRadius: '7px'}} placeholder="To" />
                  </div>
                </div>

                <div className={e('panel')}>
                  <label className={e('toggle-row')}>
                    <span style={{color: '#fff'}}>Only exact gift</span>
                    <input className={e('switch')} type="checkbox" checked={onlyExactGift} onChange={(e)=> setOnlyExactGift(e.target.checked)} />
                  </label>
                  <label className={e('toggle-row')}>
                    <span style={{color: '#fff'}}>Show with upgraded gifts</span>
                    <input className={e('switch')} type="checkbox" checked={showUpgraded} onChange={(e)=> setShowUpgraded(e.target.checked)} />
                  </label>
                </div>

                <div className={e('sheet-footer')}>
                  <button className={e('btn-secondary')}>Restart</button>
                  <button className={e('btn-primary')} onClick={() => setOpenSheet(null)}>Search</button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
