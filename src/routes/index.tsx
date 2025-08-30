import { createFileRoute } from '@tanstack/react-router';
import { Gift } from '@/components/Gift';
import { Page } from '@/components/Page';
import { BottomNav } from '@/components/Navigation';
import { loadChannels, loadGifts, getChannelGifts, generateChannelTitle, type Channel, type Gift as GiftType } from '@/lib/mockLoaders';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [channelsData, giftsData] = await Promise.all([
      loadChannels(),
      loadGifts()
    ]);
    
    // Convert channels to gift format for display
    const channelGifts = channelsData.map(channel => {
      const channelGifts = getChannelGifts(channel, giftsData);
      const title = generateChannelTitle(channelGifts);
      
      return {
        id: channel.id.toString(),
        title,
        giftNumber: channel.id.toString(),
        price: channel.price,
        isFastSale: channel.type === 'waiting', // Mark waiting channels as fast sale
        items: channelGifts.map(({ gift, quantity }) => ({
          id: gift.id,
          name: gift.full_name,
          icon: gift.image_url || '/placeholder-gift.svg', // Fallback image
          quantity,
          type: gift.type === 'REGULAR' ? undefined : ('nft' as const)
        }))
      };
    });

    return { channelGifts };
  },
  component: Gifts,
});

function Gifts() {
  const { channelGifts } = Route.useLoaderData();

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Page>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          padding: '15px'
        }}>
          {channelGifts.map((gift) => (
            <Gift
              key={gift.id}
              items={gift.items}
              title={gift.title}
              giftNumber={gift.giftNumber}
              price={gift.price}
              isFastSale={gift.isFastSale}
            />
          ))}
        </div>
      </Page>
      <BottomNav />
    </div>
  );
}
