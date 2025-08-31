import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { MarketHeader } from '@/components/MarketHeader';
import { Skeleton } from '@/components/Skeleton';
import { useModal } from '@/contexts/ModalContext';
import { useChannelsInfinite, useGifts } from '@/lib/api-hooks';
import { z } from 'zod';
import { useEffect, useRef, useCallback } from 'react';

// Search params schema using backend format directly
const searchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  sort_by: z.enum([
    'date_new_to_old',
    'date_old_to_new', 
    'price_low_to_high',
    'price_high_to_low',
    'price_per_unit',
    'quantity_low_to_high',
    'quantity_high_to_low'
  ]).default('date_new_to_old'),
  gift_id: z.array(z.string()).optional(),
  type: z.enum(['fast', 'waiting']).optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  min_qty: z.string().optional(),
  max_qty: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: MarketPage,
});

function MarketPage() {
  const search = Route.useSearch();
  const { openModal } = useModal();
  const navigate = Route.useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Add shimmer animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Build filters object from search params
  const filters: Record<string, any> = {
    sort_by: search.sort_by,
  };
  
  if (search.gift_id && search.gift_id.length > 0) filters.gift_id = search.gift_id;
  if (search.type) filters.type = search.type;
  if (search.min_price) filters.min_price = search.min_price;
  if (search.max_price) filters.max_price = search.max_price;
  if (search.min_qty) filters.min_qty = search.min_qty;
  if (search.max_qty) filters.max_qty = search.max_qty;

  // Use infinite query for channels
  const {
    data: channelsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useChannelsInfinite(search.limit, filters);

  // Use regular query for gifts
  const { data: gifts = [] } = useGifts();

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      rootMargin: '100px', // Start loading 100px before the element comes into view
    });
    
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Flatten all pages of channels data
  const channels = channelsData?.pages.flat() || [];

  const handleFilterChange = (newFilters: {
    gift: string[]; // array of gift IDs
    channelType: string; // 'fast' | 'waiting' | 'all'
    sorting: string; // sorting values
  }) => {
    const backendFilters: Partial<z.infer<typeof searchSchema>> = {};
    
    // Sorting is already in backend format
    if (newFilters.sorting && newFilters.sorting !== 'All') {
      backendFilters.sort_by = newFilters.sorting as z.infer<typeof searchSchema>['sort_by'];
    }
    
    // Gift IDs are already in backend format
    if (newFilters.gift && newFilters.gift.length > 0) {
      backendFilters.gift_id = newFilters.gift;
    }

    if (newFilters.channelType && newFilters.channelType !== 'All') {
      backendFilters.type = newFilters.channelType as z.infer<typeof searchSchema>['type'];
    }

    if (newFilters.channelType === 'All') {
      backendFilters.type = undefined;
    }
    
    const updatedSearch = {
      ...search,
      ...backendFilters,
      // Reset page to 1 when filters change
      page: 1,
    };
    
    // Remove empty values
    Object.keys(updatedSearch).forEach(key => {
      if (updatedSearch[key as keyof typeof updatedSearch] === '' || 
          updatedSearch[key as keyof typeof updatedSearch] === undefined) {
        delete updatedSearch[key as keyof typeof updatedSearch];
      }
    });
    
    // Navigate to new search params - this will automatically trigger a new infinite query
    navigate({ search: updatedSearch });
  };

  const handleGiftClick = (channel: any) => {
    openModal('gift-details', { channel, gifts });
  };

  if (isError) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#1A2026',
        color: '#ffffff',
        paddingBottom: '80px'
      }}>
        <MarketHeader 
          balance={243.16}
          onFilterChange={handleFilterChange}
          currentFilters={{
            gift: search.gift_id || [],
            channelType: search.type || 'All',
            sorting: search.sort_by || 'date_new_to_old'
          }}
          gifts={gifts}
        />
        <div className="px-4 py-6">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Error loading channels</h3>
            <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1A2026',
      color: '#ffffff',
      paddingBottom: '80px'
    }}>
      <MarketHeader 
        balance={243.16}
        onFilterChange={handleFilterChange}
        currentFilters={{
          gift: search.gift_id || [],
          channelType: search.type || 'All',
          sorting: search.sort_by || 'date_new_to_old'
        }}
        gifts={gifts}
      />

      {/* Market Content */}
      <div className="px-4 py-6">
        {/* Loading state */}
        {isLoading && channels.length === 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {channels.map((channel, index) => {
                    // Generate gift display data
                    const channelGifts = channel.gifts || {};
                    console.log('Channel gifts:', channelGifts);
                    console.log('Available gifts:', gifts);
                    
                    const channelGiftsArray = Object.entries(channelGifts).map(([gift_id, quantity]) => {
                      const foundGift = gifts.find((gift) => gift.id === gift_id);
                      console.log(`Looking for gift_id ${gift_id}, found:`, foundGift);
                      
                      return {
                        id: gift_id,
                        name: foundGift?.short_name || foundGift?.full_name || 'Unknown',
                        quantity: quantity
                      };
                    });

                    const generateChannelTitle = (gifts: any[], isModal = false) => {
                      if (!gifts || gifts.length === 0) return "Empty Channel";

                      const maxDisplay = 2;
                      const displayGifts = gifts.slice(0, maxDisplay);

                      let parts = [];

                      for (let i = 0; i < displayGifts.length; i++) {
                        const gift = displayGifts[i];
                        const giftName = gift.name || "Unknown";
                        const giftText = `${giftName} x${gift.quantity}`;

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
                      <div key={channel.id} ref={ref}>
                        <Gift
                          items={channelGiftsArray.slice(0, 4).map((gift) => ({
                            id: gift.id.toString(),
                            name: gift.name,
                            icon: `https://FlowersRestricted.github.io/gifts/${gift.id}/default.png`,
                            quantity: 1,
                            type: undefined
                          }))}
                          title={title}
                          giftNumber={`#${channel.id}`}
                          price={Math.round(channel.price)}
                          isFastSale={channel.type === 'fast'}
                          onClick={() => handleGiftClick(channel)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <Skeleton count={4} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
