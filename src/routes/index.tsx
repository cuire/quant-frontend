import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { MarketHeader } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';
import { getChannels, getGifts } from '@/lib/api';

export const Route = createFileRoute('/')({
  loader: async () => {
    const page = 1;
    const limit = 20;
    const filters = {
      sort_by: 'date_new_to_old',
      gift_id: '',
      min_subscribers: '',
      max_price: '',
    };

    const [channelsData, giftsData] = await Promise.all([
      getChannels(page, limit, filters),
      getGifts()
    ]);
    
    return { 
      channels: channelsData || [],
      gifts: giftsData || [],
      filters,
      page,
      limit
    };
  },
  component: MarketPage,
});

function MarketPage() {
  const { channels, gifts, filters, page, limit } = Route.useLoaderData();
  const { openModal } = useModal();

  const handleFilterChange = () => {
    // TODO: Implement filter navigation
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
                    icon: foundGift?.image_url || '/placeholder-gift.svg',
                    quantity: quantity
                  };
                });

                // Generate channel title using the same logic as generateChannelTitle
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

                // Add corner badges for variety
                let cornerBadge: 'blue' | 'orange' | null = null;
                if (index % 3 === 0) cornerBadge = 'blue';
                else if (index % 5 === 0) cornerBadge = 'orange';
                
                // Add Fast Sale banners for some items
                const isFastSale = index % 4 === 1 || index % 7 === 0;
                
                // Add time badges for some items
                const timeBadge = index % 6 === 2 ? '2h' : null;

                return (
                  <Gift
                    key={channel.id}
                                         items={channelGiftsArray.slice(0, 4).map((gift) => ({
                       id: gift.id.toString(),
                       name: gift.name,
                       icon: gift.icon || '/placeholder-gift.svg',
                       quantity: 1,
                       type: undefined
                     }))}
                                         title={title}
                    giftNumber={`#${channel.id}`}
                    price={Math.round(channel.price)}
                    isFastSale={isFastSale}
                    timeBadge={timeBadge}
                    cornerBadge={cornerBadge}
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
