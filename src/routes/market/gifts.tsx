import { createFileRoute } from '@tanstack/react-router';
import { useMarketGiftsInfinite, useGiftsWithFilters } from '@/lib/api-hooks';
import { Skeleton } from '@/components/Skeleton';
import { Gift } from '@/components/Gift';
import { GiftFilters } from '@/components/MarketHeader';
import { ActiveFilters } from '@/components/ActiveFilters';
import { GiftCurrentFilters, giftFiltersSearchSchema, useGlobalFilters } from '@/lib/filters';
import { useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { MarketGift } from '@/lib/api';
import { openMarketGiftModal, useDeclineGift } from '@/lib/gift-modals';

// Search schema for gifts page
const searchSchema = giftFiltersSearchSchema;

export const Route = createFileRoute('/market/gifts')({
  validateSearch: searchSchema,
  component: GiftsPage,
});

function GiftsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { openModal } = useModal();
  const handleDeclineGift = useDeclineGift();
  
  // Use the global filters hook
  const { handleFilterChange, currentFilters, apiFilters, resetFilters } = useGlobalFilters(search, navigate, 'gift');
  
  // Get symbols data for filter badges
  const { data: giftsMetadata } = useGiftsWithFilters();
  const allSymbols = giftsMetadata?.symbols || [];
  
  // Use infinite query for gifts with filters
  const {
    data: giftsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useMarketGiftsInfinite(search.limit, apiFilters);
  
  // Get bounds from the market gifts query (first page has bounds)
  const giftBounds = giftsData?.pages[0]?.bounds;
  
  // Flatten all pages of gifts data
  const gifts = giftsData?.pages.flatMap(page => page.gifts) || [];
  
  // Get models from the first page (they should be the same across all pages)
  const models = giftsData?.pages[0]?.models || [];

  // Handler to remove individual filter
  const handleRemoveFilter = (filterKey: string) => {
    const giftFilters = currentFilters as GiftCurrentFilters;
    const updatedFilters: GiftCurrentFilters = { ...giftFilters };
    
    switch (filterKey) {
      case 'collection':
        updatedFilters.collection = 'All';
        break;
      case 'model':
        updatedFilters.model = 'All';
        break;
      case 'background':
        updatedFilters.background = 'All';
        break;
      case 'symbol':
        updatedFilters.symbol = 'All';
        break;
      case 'price':
        updatedFilters.minPrice = undefined;
        updatedFilters.maxPrice = undefined;
        break;
      case 'showPremarket':
        updatedFilters.showPremarket = true; // Reset to default
        break;
      case 'showUnupgraded':
        updatedFilters.showUnupgraded = true; // Reset to default
        break;
    }
    
    handleFilterChange(updatedFilters);
  };

  // Handler for opening gift modal
  const handleGiftClick = (gift: MarketGift) => {
    openMarketGiftModal(gift, openModal, gift.my_gift, gift.my_gift ? handleDeclineGift : undefined);
  };

  // Wrapped fetchNextPage with logging
  const wrappedFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchNextPage();
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, giftsData]);

  // Intersection Observer for infinite scroll
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
      };
    }, {
      threshold: 0.1,
      rootMargin: '100px',
    });
    
    if (node && observerRef.current) {
      observerRef.current.observe(node);
      
      // Immediate check if element is already in viewport
      setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport && hasNextPage && !isFetchingNextPage) {
          wrappedFetchNextPage();
        }
      }, 100);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, wrappedFetchNextPage, gifts.length]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <GiftFilters 
        onFilterChange={handleFilterChange}
        currentFilters={currentFilters as GiftCurrentFilters}
        models={models}
        bounds={giftBounds}
      />

      <ActiveFilters
        filters={currentFilters as GiftCurrentFilters}
        filterType="gift"
        onClearAll={resetFilters}
        onRemoveFilter={handleRemoveFilter}
        symbols={allSymbols}
        bounds={giftBounds}
      />

      {/* Market Content */}
      <div className="px-4 py-6" style={{ paddingBottom: '100px' }}>
        {/* Loading state */}
        {isLoading && gifts.length === 0 ? (
        <div className="gifts-grid">
          <Skeleton count={8} />
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold mb-2">Error loading gifts</h3>
          <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
        </div>
      ) : gifts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold mb-2">No gifts available</h3>
          <p className="text-gray-400">Check back later for new gifts</p>
        </div>
      ) : (
        <>
          <div className="gifts-grid">
            {gifts.map((gift, index) => {
              // Add ref to last element for infinite scroll
              const isLastElement = index === gifts.length - 1;
              const ref = isLastElement ? lastElementRef : undefined;
              
              return (
                <Gift
                  key={gift.id}
                  ref={ref}
                  items={[
                    {
                      id: gift.gift_id.toString(),
                      name: gift.slug || 'Unknown Gift',
                      icon: `https://FlowersRestricted.github.io/gifts/${gift.gift_id}/default.png`,
                      type: undefined,
                      giftSlug: gift.slug,
                    }
                  ]}
                  title={gift.full_name || 'Unknown Gift'}
                  giftNumber={`#${gift.id}`}
                  gift_frozen_until={gift.gift_frozen_until}
                  price={Math.round(Number(gift.price) || 0)}
                  action="buy-or-cart"
                  onClick={() => handleGiftClick(gift)}
                  style={{ cursor: 'pointer' }}
                  {...(gift.my_gift && {
                    variant: 'my-channel',
                    giftStatus: 'active',
                  })}
                />
              );
            })}
          </div>

          {/* Loading indicator for next page */}
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
