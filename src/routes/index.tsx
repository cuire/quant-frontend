import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { MarketHeader } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';
import { loadChannels, loadGifts, getChannelGifts } from '@/lib/mockLoaders';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [channelsData, giftsData] = await Promise.all([
      loadChannels(),
      loadGifts()
    ]);
    
    // Convert channels to gift format for display
    const channelGifts = channelsData
      .map((channel, index) => {
        const channelGifts = getChannelGifts(channel, giftsData);
        
        // Skip channels with no gifts
        if (channelGifts.length === 0) {
          return null;
        }
        
        // Generate titles like on screenshot
        const title = channelGifts.length === 1 
          ? `${channelGifts[0].gift.short_name} X3`
          : channelGifts.length === 2
          ? `${channelGifts[0].gift.short_name} Ch...`
          : `${channelGifts[0].gift.short_name} & Br...`;
      
      // Add corner badges for variety (simulate different gift types)
      let cornerBadge: 'blue' | 'orange' | null = null;
      if (index % 3 === 0) cornerBadge = 'blue';
      else if (index % 5 === 0) cornerBadge = 'orange';
      
      // Add Fast Sale banners for some items
      const isFastSale = index % 4 === 1 || index % 7 === 0;
      
      // Add time badges for some items
      const timeBadge = index % 6 === 2 ? '2h' : null;
      
      return {
        id: channel.id.toString(),
        title,
        giftNumber: `#${channel.id}`,
        price: Math.round(channel.price),
        isFastSale,
        timeBadge,
        cornerBadge,
        items: channelGifts.slice(0, 4).map(({ gift, quantity }) => ({
          id: gift.id,
          name: gift.full_name,
          icon: gift.image_url || '/placeholder-gift.svg',
          quantity,
          type: gift.type === 'REGULAR' ? undefined : ('nft' as const)
        }))
      };
    })
    .filter((channel): channel is NonNullable<typeof channel> => channel !== null);

    return { channelGifts };
  },
  component: MarketPage,
});

function MarketPage() {
  const { channelGifts } = Route.useLoaderData();
  const { openModal } = useModal();

  const handleFilterChange = (newFilters: any) => {
    // Here you could implement actual filtering logic
  };

  const handleGiftClick = (gift: any) => {
    openModal('gift-details', gift);
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

      {/* Gift Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px'
      }}>
        {channelGifts.map((gift) => (
          <Gift
            key={gift.id}
            items={gift.items}
            title={gift.title}
            giftNumber={gift.giftNumber}
            price={gift.price}
            isFastSale={gift.isFastSale}
            timeBadge={gift.timeBadge}
            cornerBadge={gift.cornerBadge}
            onClick={() => handleGiftClick(gift)}
          />
        ))}
      </div>
    </div>
  );
}
