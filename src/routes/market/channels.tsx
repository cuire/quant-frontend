import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { Skeleton } from '@/components/Skeleton';
import { MarketFilters } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';
import { useChannelsInfinite, useGifts } from '@/lib/api-hooks';
import { channelFiltersSearchSchema, useGlobalFilters } from '@/lib/filters';
import { getChannelPrice } from '@/helpers/priceUtils';
import { useEffect, useRef, useCallback } from 'react';

// Search schema for channels page that extends base schema
const searchSchema = channelFiltersSearchSchema;

export const Route = createFileRoute('/market/channels')({
  validateSearch: searchSchema,
  component: ChannelsPage,
});

function ChannelsPage() {
  const search = Route.useSearch();
  const { openModal } = useModal();
  const navigate = Route.useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Use the global filters hook
  const { handleFilterChange, currentFilters, apiFilters } = useGlobalFilters(search, navigate);

  // Use infinite query for channels
  const {
    data: channelsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useChannelsInfinite(search.limit, apiFilters);

  // Use regular query for gifts
  const { data: gifts = [] } = useGifts();

  // Flatten all pages of channels data
  const channels = channelsData?.pages.flat() || [];

  // Reset scroll when search params change (sorting, filters, etc.)
  useEffect(() => {
    if (channels.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [search.sort_by, search.gift_id, search.channel_type, search.price_min, search.price_max, search.quantity_min, search.quantity_max, search.show_upgraded_gifts, search.only_exact_gift]);

  // Wrapped fetchNextPage with logging
  const wrappedFetchNextPage = useCallback(async () => {
    try {
      const result = await fetchNextPage();
      return result;
    } catch (error) {
      throw error;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, channelsData]);

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
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: '100px', // Start loading 100px before the element comes into view
    });
    
    if (node && observerRef.current) {
      observerRef.current.observe(node);
      
      // Immediate check if element is already in viewport
      setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        // If element is already visible and should trigger, force trigger
        if (isInViewport && hasNextPage && !isFetchingNextPage) {
          wrappedFetchNextPage();
        }
      }, 100);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, wrappedFetchNextPage, channels.length]);

  // Cleanup observer on unmount + reset scroll position
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Debug scroll position + fallback infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      if (scrollPercentage > 80) { // Only log when near bottom
        // Fallback: if we're at 95%+ and should load more, trigger manually
        if (scrollPercentage > 95 && hasNextPage && !isFetchingNextPage) {
          wrappedFetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, wrappedFetchNextPage]);

  // Force check intersection after page changes (debugging tool)
  useEffect(() => {
    const checkIntersection = () => {
      if (observerRef.current && channels.length > 0) {
        console.log('🔍 Force checking intersection state');
        // Get all observed elements
        const observedElements = document.querySelectorAll('.gift:last-child');
        observedElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
          console.log(`Element ${index}:`, {
            isVisible,
            rect: {
              top: Math.round(rect.top),
              bottom: Math.round(rect.bottom),
              height: Math.round(rect.height)
            },
            windowHeight: window.innerHeight
          });
        });
      }
    };

    // Check after a short delay to ensure DOM is ready
    const timer = setTimeout(checkIntersection, 1000);
    return () => clearTimeout(timer);
  }, [channels.length]);

  // Global debugging function (can be called from console)
  useEffect(() => {
    (window as any).debugInfiniteScroll = () => {
      const lastElement = document.querySelector('.gift:last-child') as HTMLElement;
      const rect = lastElement?.getBoundingClientRect();
      
      console.log('🔧 Debug info:', {
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        channelsCount: channels.length,
        pagesCount: channelsData?.pages?.length || 0,
        observerActive: !!observerRef.current,
        lastElement: !!lastElement,
        lastElementRect: rect ? {
          top: Math.round(rect.top),
          bottom: Math.round(rect.bottom),
          height: Math.round(rect.height),
          isVisible: rect.top < window.innerHeight && rect.bottom > 0
        } : null,
        windowHeight: window.innerHeight
      });
      
      if (hasNextPage && !isFetchingNextPage) {
        wrappedFetchNextPage();
      }
    };

    return () => {
      delete (window as any).debugInfiniteScroll;
    };
  }, [hasNextPage, isFetchingNextPage, isLoading, channels.length, channelsData, wrappedFetchNextPage]);

  const handleGiftClick = (channel: any) => {
    openModal('gift-details', { channel, gifts });
  };

  return (
    <>
      <MarketFilters 
        onFilterChange={handleFilterChange}
        currentFilters={currentFilters as any}
        gifts={gifts}
      />

      {/* Market Content */}
      <div className="px-4 py-6">
        {/* Loading state */}
        {isLoading && channels.length === 0 ? (
          <div className="gifts-grid">
            <Skeleton count={8} />
          </div>
        ) : (
          <>
            {/* Channels Grid */}
            {channels.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-semibold mb-2">No channels found</h3>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="gifts-grid">
                  {channels.map((channel, index) => {
                    const channelGifts = channel.gifts || {};
                    
                    // Convert gifts to array format, handling both simple and upgraded structures
                    const channelGiftsArray = [];
                    
                    if (channelGifts) {
                      // Check if gifts has upgraded structure at root level
                      if ('upgraded' in channelGifts && typeof channelGifts === 'object') {
                        // Structure: { upgraded: { modelId: [backdropIds] } }
                        for (const [modelId, backdropIds] of Object.entries(channelGifts.upgraded || {})) {
                          const foundGift = gifts.find((gift) => gift.id === modelId);
                          
                          // Ensure backdropIds is an array and get its length safely
                          const quantity = Array.isArray(backdropIds) ? backdropIds.length : 1;
                          
                          channelGiftsArray.push({
                            id: modelId,
                            name: foundGift?.short_name || foundGift?.full_name || 'Unknown',
                            quantity: quantity,
                            type: 'nft' as const
                          });
                        }
                      } else {
                        // Simple structure: { giftId: quantity }
                        for (const [gift_id, quantity] of Object.entries(channelGifts)) {
                          if (typeof quantity === 'number') {
                            const foundGift = gifts.find((gift) => gift.id === gift_id);
                            channelGiftsArray.push({
                              id: gift_id,
                              name: foundGift?.short_name || foundGift?.full_name || 'Unknown',
                              quantity: quantity,
                              type: 'item' as const
                            });
                          }
                        }
                      }
                    }

                    const generateChannelTitle = (gifts: any[], isModal = false) => {
                      if (!gifts || gifts.length === 0) return "Empty Channel";

                      const maxDisplay = 2;
                      const displayGifts = gifts.slice(0, maxDisplay);

                      let parts = [];

                      for (let i = 0; i < displayGifts.length; i++) {
                        const gift = displayGifts[i];
                        const giftName = gift.name || "Unknown";
                        
                        // Ensure quantity is a number
                        const quantity = typeof gift.quantity === 'number' ? gift.quantity : 1;
                        const giftText = `${giftName} x${quantity}`;

                        // Add spacing if not first item
                        const spacing = i > 0 ? (isModal ? "  " : " ") : "";

                        parts.push(`${spacing}${giftText}`);
                      }

                      // Add ellipsis if there are more gifts
                      if (gifts.length > maxDisplay) {
                        parts[parts.length - 1] += "...";
                      }

                      return parts.join("");
                    };

                    const title = generateChannelTitle(channelGiftsArray);

                    // Add ref to last element for infinite scroll
                    const isLastElement = index === channels.length - 1;
                    const ref = isLastElement ? lastElementRef : undefined;
                    

                    return (
                      <Gift
                        key={channel.id}
                        ref={ref}
                        items={channelGiftsArray.slice(0, 4).map((gift) => ({
                          id: gift.id.toString(),
                          name: gift.name || 'Unknown',
                          icon: `https://FlowersRestricted.github.io/gifts/${gift.id}/default.png`,
                          quantity: typeof gift.quantity === 'number' ? gift.quantity : 1,
                          type: gift.type || 'item'
                        }))}
                        title={title}
                        giftNumber={`#${channel.id}`}
                        price={getChannelPrice(channel.price)}
                        isFastSale={channel.type === 'fast'}
                        onClick={() => handleGiftClick(channel)}
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
          </>
        )}
      </div>
    </>
  );
}
