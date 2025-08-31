import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { MarketHeader } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';
import { getChannels, getGifts } from '@/lib/api';
import { z } from 'zod';

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
  gift_id: z.string().optional(),
  type: z.enum(['fast', 'waiting']).optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional(),
  min_qty: z.string().optional(),
  max_qty: z.string().optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  loader: async ({ location }) => {
    const search = location.search as z.infer<typeof searchSchema>;
    const { page, limit, sort_by, gift_id, type, min_price, max_price, min_qty, max_qty } = search;
    
    // Build filters object directly from search params
    const filters: Record<string, any> = {
      sort_by,
    };
    
    // Add optional filters only if they have values
    if (gift_id) filters.gift_id = gift_id;
    if (type) filters.type = type;
    if (min_price) filters.min_price = min_price;
    if (max_price) filters.max_price = max_price;
    if (min_qty) filters.min_qty = min_qty;
    if (max_qty) filters.max_qty = max_qty;

    const [channelsData, giftsData] = await Promise.all([
      getChannels(page, limit, filters),
      getGifts()
    ]);
    
    return { 
      channels: channelsData || [],
      gifts: giftsData || [],
      filters: search,
      page,
      limit
    };
  },
  component: MarketPage,
});

function MarketPage() {
  const { channels, gifts, filters } = Route.useLoaderData();
  const { openModal } = useModal();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const handleFilterChange = (newFilters: {
    gift: string; // gift_id
    channelType: string; // 'fast' | 'waiting' | 'all'
    sorting: string; // sorting values
  }) => {
    const backendFilters: Partial<z.infer<typeof searchSchema>> = {};
    
    // Sorting is already in backend format
    if (newFilters.sorting && newFilters.sorting !== 'All') {
      backendFilters.sort_by = newFilters.sorting as z.infer<typeof searchSchema>['sort_by'];
    }
    
    // Gift ID is already in backend format
    if (newFilters.gift && newFilters.gift !== 'All') {
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
    
    navigate({ search: updatedSearch });
  };

  const handleGiftClick = (channel: any) => {
    openModal('gift-details', channel);
  };

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
          gift: filters.gift_id || 'All',
          channelType: filters.type || 'All',
          sorting: filters.sort_by || 'date_new_to_old'
        }}
        gifts={gifts}
      />

      {/* Market Content */}
      <div className="px-4 py-6">
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
              {channels.map((channel) => {
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

                return (
                  <Gift
                    key={channel.id}
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
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
