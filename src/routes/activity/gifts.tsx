import { createFileRoute } from '@tanstack/react-router';
import { useActivityGiftsInfinite, useGifts } from '@/lib/api-hooks';
import { Skeleton } from '@/components/Skeleton';
import { Gift } from '@/components/Gift';
import { GiftFilters } from '@/components/MarketHeader';
import { GiftCurrentFilters, giftFiltersSearchSchema, useGlobalFilters } from '@/lib/filters';
import { useEffect, useRef, useCallback } from 'react';

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


  const getGiftNameById = (giftId: string) => {
    const gift = gifts.find(g => g.id === giftId);
    return gift ? (gift.short_name || gift.full_name) : 'Unknown Gift';
  };

  const getGiftIconById = (giftId: string) => {
    return `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`;
  };

  return (
    <>
      <GiftFilters 
        onFilterChange={handleFilterChange}
        currentFilters={currentFilters as GiftCurrentFilters}
      />

      <div className="px-4 py-6">
        {isLoading && activityGifts.length === 0 ? (
          <div className="gifts-grid">
            <Skeleton count={8} />
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
            <div className="gifts-grid">
              {activityGifts.map((activity, index) => {
                const isLastElement = index === activityGifts.length - 1;
                const ref = isLastElement ? lastElementRef : undefined;
                
                return (
                  <Gift
                    key={activity.id}
                    ref={ref}
                    items={[{
                      id: activity.gift_id,
                      name: getGiftNameById(activity.gift_id),
                      icon: getGiftIconById(activity.gift_id),
                      type: undefined,
                    }]}
                    title={getGiftNameById(activity.gift_id)}
                    giftNumber={`#${activity.channel_id}`}
                    price={Math.round(activity.amount)}
                    action="buy-or-cart"
                  />
                );
              })}
            </div>

            {isFetchingNextPage && (
              <div className="gifts-grid">
                <Skeleton count={4} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}


