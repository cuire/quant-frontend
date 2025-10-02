import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';
import { useOffersInfinite, useGifts } from '@/lib/api-hooks';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';
import './activity.css';

export const Route = createFileRoute('/storage/offers/received')({
  component: ReceivedOffersPage,
});

function ReceivedOffersPage() {
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useOffersInfinite(20);

  const giftsMap = useMemo(() => {
    if (!giftsData) return new Map();
    return new Map(giftsData.map(gift => [gift.id, gift]));
  }, [giftsData]);

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



  // Extract received offers from all pages
  const allOffers = data?.pages.flatMap(page => page.received) || [];

  // Intersection Observer for infinite loading
  const observer = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (node) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      observer.observe(node);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="storage-tabs">
        <div className="storage-segment">
          <Link to="/storage/channels" className="storage-tab-link">
            Channels
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link is-active">
            Offers
          </Link>
          <Link to="/storage/activity" search={{ page: 1, limit: 20, gift_id: [], sort_by: 'date_new_to_old' } as any} className="storage-tab-link">
            Activity
          </Link>
        </div>

        <div className="storage-subsegment">
          <Link to="/storage/offers/received" className="storage-tab-link is-active">
            Received
          </Link>
          <Link to="/storage/offers/placed" className="storage-tab-link">
            Placed
          </Link>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading offers...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3939' }}>
          <p>Error loading offers: {error.message}</p>
        </div>
      )}

      {!isLoading && allOffers.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold mb-2">No activity found</h3>
          <p className="text-gray-400">Your received offers will appear here</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px'
      }}>
        {allOffers.map((offer, index) => {
          // Convert gifts_data to items format for Gift component
          const items = [];
          
          if (offer.gifts_data) {
            // Check if gifts_data has upgraded structure at root level
            if ('upgraded' in offer.gifts_data && typeof offer.gifts_data === 'object') {
              // Structure: { upgraded: { modelId: [backdropIds] } }
              for (const [modelId, backdropIds] of Object.entries(offer.gifts_data.upgraded || {})) {
                const gift = giftsMap.get(modelId);
                items.push({
                  id: modelId,
                  name: gift?.full_name || `Gift ${modelId}`,
                  icon: gift?.image_url || '/placeholder-gift.svg',
                  quantity: backdropIds.length,
                  type: 'nft' as const // Add NFT tag for upgraded gifts
                });
              }
            } else {
              // Simple structure: { giftId: quantity }
              for (const [giftId, quantity] of Object.entries(offer.gifts_data)) {
                if (typeof quantity === 'number') {
                  const gift = giftsMap.get(giftId);
                  items.push({
                    id: giftId,
                    name: gift?.full_name || `Gift ${giftId}`,
                    icon: gift?.image_url || '/placeholder-gift.svg',
                    quantity: quantity,
                    type: 'item' as const
                  });
                }
              }
            }
          }

          const title = generateChannelTitle(items);
          const timeEnd = offer.expires_at ? new Date(offer.expires_at).toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }) : '--:--:--';

          return (
            <Gift
              items={items}
              title={title}
              giftNumber={`#${offer.channel_id}`}
              price={offer.price}
              variant="storage-offer"
              offerPriceTon={offer.price}
              timeEnd={timeEnd}
              onSell={() => openModal('accept-offer', { offer })}
              onDecline={() => openModal('cancel-offer', { offer })}
                              onClick={() => openModal('gift-details', { 
                  channel: { id: offer.channel_id, gifts: offer.gifts_data || {} }, 
                  gifts: giftsData || [],
                  price: offer.price,
                  showPurchaseActions: false 
                })}
              key={offer.id} ref={index === allOffers.length - 1 ? observer : undefined}
            />
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading more offers...</p>
        </div>
      )}
    </>
  );
}
