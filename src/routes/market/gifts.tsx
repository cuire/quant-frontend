import { createFileRoute } from '@tanstack/react-router';
import { useGifts } from '@/lib/api-hooks';
import { Skeleton } from '@/components/Skeleton';
import { Gift } from '@/components/Gift';

export const Route = createFileRoute('/market/gifts')({
  component: GiftsPage,
});

function GiftsPage() {
  const { data: gifts = [], isLoading, isError, error } = useGifts();

  return (
    <div>
      <div className="gifts-grid">
      <Gift
          key={1}
          // items={channelGiftsArray.slice(0, 4).map((gift) => ({
          //   id: gift.id.toString(),
          //   name: gift.name,
          //   icon: `https://FlowersRestricted.github.io/gifts/${gift.id}/default.png`,
          //   quantity: 1,
          //   type: undefined
          // }))}
          items={[
            {
              id: '5170145012310081615',
              name: 'Heart Locket',
              icon: `https://FlowersRestricted.github.io/gifts/5170145012310081615/default.png`
            }
          ]}
          title={"Heart Locket"}
          price={Math.round(675)}
          giftNumber='1'
          action='buy-or-cart'
        />
      </div>
      {/* Loading state */}
      {isLoading ? (
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
        <div className="gifts-grid">
          {gifts.map((gift) => (
            <div key={gift.id} className="gift-card">
              <div className="gift-image">
                <img 
                  src={gift.image_url || '/placeholder-gift.svg'} 
                  alt={gift.full_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="gift-info p-3">
                <h3 className="font-semibold text-white mb-1">{gift.full_name}</h3>
                <p className="text-sm text-gray-400">{gift.short_name}</p>
                {gift.floor_price && (
                  <p className="text-sm text-blue-400 mt-2">${gift.floor_price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
