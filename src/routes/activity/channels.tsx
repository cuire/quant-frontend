import { createFileRoute } from '@tanstack/react-router';
import { MarketTopBar } from '@/components/MarketHeader';
import { useActivityChannelsInfinite, useGifts } from '@/lib/api-hooks';
import { channelFiltersSearchSchema, useFilters } from '@/lib/filters';
import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

// Reuse market channels search schema
const searchSchema = channelFiltersSearchSchema;

export const Route = createFileRoute('/activity/channels')({
  validateSearch: searchSchema,
  component: ActivityChannelsPage,
});

function ActivityChannelsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const { apiFilters } = useFilters(search, navigate);

  const {
    data: activitiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useActivityChannelsInfinite(search.limit, apiFilters);

  const { data: gifts = [] } = useGifts();

  const activities = activitiesData?.pages.flat() || [];

  const [selected, setSelected] = useState<null | {
    title: string;
    giftNumber: string;
    price: number;
    items: { id: string; name: string; icon: string; quantity: number }[];
  }>(null);

  useEffect(() => {
    if (activities.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [search.sort_by, search.gift_id, search.type, search.min_price, search.max_price, search.min_qty, search.max_qty]);

  const wrappedFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchNextPage();
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, activitiesData]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) {
      return;
    }
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        wrappedFetchNextPage();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px',
    });
    
    if (node && observerRef.current) {
      observerRef.current.observe(node);
      setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport && hasNextPage && !isFetchingNextPage) {
          wrappedFetchNextPage();
        }
      }, 100);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, wrappedFetchNextPage, activities.length]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Helper function to get gift name by ID
  const getGiftNameById = (giftId: string) => {
    const gift = gifts.find(g => g.id === giftId);
    return gift ? (gift.short_name || gift.full_name) : 'Unknown Gift';
  };

  // Helper function to get gift icon by ID
  const getGiftIconById = (giftId: string) => {
    return `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  };

  if (isError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#1A2026',
        color: '#ffffff',
        paddingBottom: '80px'
      }}>
        <MarketTopBar />
        <div className="px-4 py-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Error loading activity channels</h3>
            <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketTopBar />

      {/* Activity Channels Content */}
      <div className="px-4 py-6">
        {/* Loading state */}
        {isLoading && activities.length === 0 ? (
          <div className="activity-list">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="activity-item" style={{ opacity: 0.7 }}>
                <div className="activity-icon" style={{ backgroundColor: '#2A3541', borderRadius: '8px', width: '40px', height: '40px' }}></div>
                <div className="activity-main">
                  <div className="activity-title-row">
                    <div className="activity-title" style={{ backgroundColor: '#2A3541', height: '16px', width: '120px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="activity-sub" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                </div>
                <div className="activity-center">
                  <span className="activity-badge activity-badge--purchase" style={{ backgroundColor: '#2A3541', color: 'transparent' }}>Loading</span>
                </div>
                <div className="activity-right">
                  <div className="activity-price" style={{ backgroundColor: '#2A3541', height: '16px', width: '60px', borderRadius: '4px' }}></div>
                  <div className="activity-time" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Activity List */}
            {activities.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No activity channels found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="activity-list">
                  {activities.map((activity, index) => {
                    // Add ref to last element for infinite scroll
                    const isLastElement = index === activities.length - 1;
                    const ref = isLastElement ? lastElementRef : undefined;

                    return (
                      <div 
                        key={activity.id} 
                        ref={ref}
                        className="activity-item" 
                        onClick={() => {
                          // Create items array from gifts_data
                          let items: { id: string; name: string; icon: string; quantity: number }[] = [];
                          if (activity.gifts_data?.upgraded) {
                           items = Object.entries(activity.gifts_data.upgraded).map(([giftId, channelIds]) => ({
                             id: giftId,
                             name: getGiftNameById(giftId),
                             icon: getGiftIconById(giftId),
                             quantity: channelIds.length
                           }));
                         } else {
                           items = Object.entries(activity.gifts_data ?? {}).map(([giftId, quantity]) => ({
                             id: giftId,
                             name: getGiftNameById(giftId),
                             icon: getGiftIconById(giftId),
                             quantity: quantity as any,
                           }));
                         }
                          
                          if (items.length > 0) {
                            setSelected({ 
                              title: getGiftNameById(activity.gift_id), 
                              giftNumber: `#${activity.channel_id}`, 
                              price: activity.amount, 
                              items: items 
                            });
                          }
                        }}
                      >
                        <div className="activity-icon">
                          <img 
                            src={getGiftIconById(activity.gift_id)} 
                            alt={getGiftNameById(activity.gift_id)} 
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/placeholder-gift.svg';
                            }} 
                          />
                        </div>
                        <div className="activity-main">
                          <div className="activity-title-row">
                            <div className="activity-title">{getGiftNameById(activity.gift_id)}</div>
                          </div>
                          <div className="activity-sub">Channel #{activity.channel_id}</div>
                        </div>
                        <div className="activity-center">
                          {activity.is_upgraded && (
                           <span className="activity-badge activity-badge--nft">NFTs</span>
                          )}
                          {activity.type === 'purchase' && (
                           <span className="activity-badge activity-badge--purchase">{activity.type}</span>
                          )}
                        </div>
                        <div className="activity-right">
                          <div className="activity-price">
                             {activity.amount} TON
                          </div>
                          <div className="activity-time">{formatDate(activity.created_at)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <div className="activity-list">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`loading-${index}`} className="activity-item" style={{ opacity: 0.7 }}>
                        <div className="activity-icon" style={{ backgroundColor: '#2A3541', borderRadius: '8px', width: '40px', height: '40px' }}></div>
                        <div className="activity-main">
                          <div className="activity-title-row">
                            <div className="activity-title" style={{ backgroundColor: '#2A3541', height: '16px', width: '120px', borderRadius: '4px' }}></div>
                          </div>
                          <div className="activity-sub" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                        <div className="activity-center">
                          <span className="activity-badge activity-badge--purchase" style={{ backgroundColor: '#2A3541', color: 'transparent' }}>Loading</span>
                        </div>
                        <div className="activity-right">
                          <div className="activity-price" style={{ backgroundColor: '#2A3541', height: '16px', width: '60px', borderRadius: '4px' }}></div>
                          <div className="activity-time" style={{ backgroundColor: '#2A3541', height: '12px', width: '80px', borderRadius: '4px', marginTop: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {selected && createPortal(
        <div className="market-header__sheet-overlay" onClick={() => setSelected(null)}>
          <div className="market-header__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="product-sheet__header">
              <div className="product-sheet__gallery">
                {(() => {
                  const count = selected.items.length;
                  const gridClass = count === 1 ? 'single' : count === 2 ? 'double' : count === 3 ? 'triple' : 'multiple';
                  const visible = gridClass === 'multiple' ? selected.items.slice(0, 4) : selected.items.slice(0, count);
                  return (
                    <div className={`product-sheet__grid product-sheet__grid--${gridClass}`}>
                      {visible.map((it) => (
                        <div className="product-sheet__cell" key={it.id}>
                          <img src={it.icon} alt={it.name} />
                          <span className="product-sheet__q">x{it.quantity}</span>
                        </div>
                      ))}
                      {count > 4 && (
                        <div className="product-sheet__more-badge">+{count - 4} more</div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <button className="product-sheet__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="product-sheet__title">
              <div className="product-sheet__name">{selected.title}</div>
              <div className="product-sheet__num">{selected.giftNumber}</div>
            </div>
            <div className="product-sheet__list">
              {selected.items.map((it) => (
                <div key={it.id} className="product-sheet__row">
                  <div className="product-sheet__row-icon"><img src={it.icon} alt={it.name} /></div>
                  <div className="product-sheet__row-main">
                    <div className="product-sheet__row-title">{it.name}</div>
                    <div className="product-sheet__row-note">Quantity: {it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-sheet__actions">
              <button className="product-sheet__btn" type="button">Share Channel</button>
              <button className="product-sheet__btn product-sheet__btn--primary" type="button">Open Channel</button>
            </div>
          </div>
        </div>, document.body)}
    </div>
  );
}


