import { createFileRoute } from '@tanstack/react-router';
import { useActivityGiftsInfinite, useGifts } from '@/lib/api-hooks';
import { GiftFilters } from '@/components/MarketHeader';
import { GiftCurrentFilters, giftFiltersSearchSchema, useGlobalFilters } from '@/lib/filters';
import { useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { UpgradedGiftSlugIcon } from '@/components/GiftIcon';

// Search schema for activity gifts page (reuse market gifts filters)
const searchSchema = giftFiltersSearchSchema;

export const Route = createFileRoute('/activity/gifts')({
  validateSearch: searchSchema,
  component: ActivityGiftsPage,
});

function ActivityGiftsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { openModal } = useModal();
  
  // Filters
  const { handleFilterChange, currentFilters, apiFilters } = useGlobalFilters(search, navigate, 'gift');
  
  // Infinite activity gifts
  const {
    data: activityGiftsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useActivityGiftsInfinite(search.limit, apiFilters);

  // Gifts dictionary
  const { data: gifts = [] } = useGifts();

  const activityGifts = activityGiftsData?.pages.flat() || [];

  useEffect(() => {
    if (activityGifts.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [search]);

  const wrappedFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchNextPage();
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, activityGiftsData]);

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
  }, [isLoading, hasNextPage, isFetchingNextPage, wrappedFetchNextPage, activityGifts.length]);

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
    return gift ? (gift.full_name || gift.short_name) : 'Unknown Gift';
  };

  // Handler for opening gift modal
  const handleGiftClick = (activity: any) => {
    // Extract attributes from activity data
    const model = activity.model_data ? {
      value: activity.model_data.name || '',
      rarity_per_mille: activity.model_data.rarity_per_mille || 0,
      floor: activity.model_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    const backdrop = activity.backdrop_data ? {
      value: activity.backdrop_data.name || '',
      rarity_per_mille: activity.backdrop_data.rarity_per_mille || 0,
      floor: activity.backdrop_data.floor || 0,
      centerColor: activity.backdrop_data.center_color || '000000',
      edgeColor: activity.backdrop_data.edge_color || '000000'
    } : { value: '', rarity_per_mille: 0, floor: 0, centerColor: '000000', edgeColor: '000000' };

    const symbol = activity.symbol_data ? {
      value: activity.symbol_data.name || '',
      rarity_per_mille: activity.symbol_data.rarity_per_mille || 0,
      floor: activity.symbol_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    // Open upgraded-gift modal with hideActions flag
    openModal('upgraded-gift', {
      id: activity.gift_data?.id || activity.id,
      giftId: activity.base_gift_data.id,
      giftSlug: activity.slug,
      price: activity.gift_data?.price || activity.amount,
      name: activity.base_gift_data?.full_name || getGiftNameById(activity.gift_id),
      num: activity.gift_data?.id || activity.id,
      gift_frozen_until: activity.gift_data?.gift_frozen_until || null,
      model,
      backdrop,
      symbol,
      hideActions: true,
    });
  };

  return (
    <>
      <GiftFilters 
        onFilterChange={handleFilterChange}
        currentFilters={currentFilters as GiftCurrentFilters}
      />

      <div className="px-4 py-6">
        {isLoading && activityGifts.length === 0 ? (
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
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Error loading activity gifts</h3>
            <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
          </div>
        ) : activityGifts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2">No activity gifts available</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="activity-list">
              {activityGifts.map((activity, index) => {
                const isLastElement = index === activityGifts.length - 1;
                const ref = isLastElement ? lastElementRef : undefined;
                
                return (
                  <div 
                    key={activity.id}
                    ref={ref}
                    className="activity-item" 
                    onClick={() => handleGiftClick(activity)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="activity-icon">
                      {activity.slug && activity.slug !== 'None-None' ? (
                        <UpgradedGiftSlugIcon 
                          giftSlug={activity.slug}
                          size="44"
                          className="activity-icon"
                        />
                      ) : (
                        <img 
                          src={`https://FlowersRestricted.github.io/gifts/${activity.base_gift_data?.id || activity.gift_id}/default.png`}
                          alt={activity.base_gift_data?.full_name || getGiftNameById(activity.gift_id.toString())} 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/placeholder-gift.svg';
                          }}
                        />
                      )}
                    </div>
                    <div className="activity-main">
                      <div className="activity-title-row">
                        <div className="activity-title">
                          {activity.base_gift_data?.full_name || getGiftNameById(activity.gift_id.toString())}
                        </div>
                      </div>
                      <div className="activity-sub">
                        {activity.slug || `#${activity.gift_id}`}
                      </div>
                    </div>
                    <div className="activity-center">
                      {activity.is_upgraded && (
                        <span className="activity-badge activity-badge--nft">NFT</span>
                      )}
                      {activity.type === 'purchase' && (
                        <span className="activity-badge activity-badge--purchase">{activity.type}</span>
                      )}
                    </div>
                    <div className="activity-right">
                      <div className="activity-price">
                        {Math.round(activity.amount)} TON
                      </div>
                      <div className="activity-time">{formatDate(activity.created_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

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
      </div>
    </>
  );
}


