import { createFileRoute } from '@tanstack/react-router';
import { useGiftsWithFilters } from '@/lib/api-hooks';
import { Skeleton } from '@/components/Skeleton';
import { Gift } from '@/components/Gift';
import { formatRarity } from '@/helpers/formatUtils';

export const Route = createFileRoute('/market/stickers')({
  component: StickersPage,
});

function StickersPage() {
  const { data, isLoading, isError, error } = useGiftsWithFilters();
  const backgrounds = data?.backdrops || [];

  return (
    <>
      {/* Market Content */}
      <div className="px-4 py-6">
        {/* Loading state */}
        {isLoading ? (
          <div className="gifts-grid">
            <Skeleton count={8} />
          </div>
        ) : isError ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Error loading backgrounds</h3>
            <p className="text-gray-400">{error?.message || 'Something went wrong'}</p>
          </div>
        ) : backgrounds.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No backgrounds available</h3>
            <p className="text-gray-400">Check back later for new backgrounds</p>
          </div>
        ) : (
          <div className="gifts-grid">
            {backgrounds.map((background) => {
              return (
                <Gift
                  key={background.id}
                  items={[
                    {
                      id: background.id,
                      name: background.name,
                      icon: '', // We'll render a gradient circle instead
                      type: undefined,
                    }
                  ]}
                  title={background.name}
                  giftNumber={`${formatRarity(background.rarity_per_mille)}%`}
                  price={Math.round(Number(background.floor) || 0)}
                  action="buy-or-cart"
                  onClick={() => {
                    // Handle background click if needed
                    console.log('Background clicked:', background);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
