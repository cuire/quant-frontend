import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useCallback, useMemo } from 'react';
import { useOffersInfinite, useGifts, useCancelOffer } from '@/lib/api-hooks';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';

export const Route = createFileRoute('/storage/offers/placed')({
  component: PlacedOffersPage,
});

function PlacedOffersPage() {
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useOffersInfinite(20);
  const cancelOfferMutation = useCancelOffer();

  const lastElementRef = useRef<HTMLDivElement>(null);

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

  const handleCancelOffer = (offerId: number) => {
    cancelOfferMutation.mutate(offerId);
  };

  // Extract placed offers from all pages
  const allOffers = data?.pages.flatMap(page => page.placed) || [];

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
          <Link to="/storage/activity" className="storage-tab-link">
            Activity
          </Link>
        </div>

        <div className="storage-subsegment">
          <Link to="/storage/offers/received" className="storage-tab-link">
            Received
          </Link>
          <Link to="/storage/offers/placed" className="storage-tab-link is-active">
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
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No offers found</p>
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
          const items = Object.entries(offer.gifts_data || {}).map(([giftId, quantity]) => {
            const giftData = giftsMap.get(giftId);
            return {
              id: giftId,
              name: giftData?.full_name || `Gift ${giftId}`,
              icon: giftData?.image_url || '/placeholder-gift.svg',
              quantity: quantity as number
            };
          });

          const title = generateChannelTitle(items);
          const timeEnd = offer.expires_at ? new Date(offer.expires_at).toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }) : '--:--:--';

          return (
            <div key={offer.id} ref={index === allOffers.length - 1 ? observer : undefined}>
              <Gift
                items={items}
                title={title}
                giftNumber={`#${offer.channel_id}`}
                price={offer.price}
                variant="storage-offer"
                storageAction="remove"
                offerPriceTon={offer.price}
                timeEnd={timeEnd}
                onSell={() => handleCancelOffer(offer.id)}
                onClick={() => openModal('gift-details', { 
                  channel: { id: offer.channel_id, gifts: offer.gifts_data || {} }, 
                  gifts: giftsData || [],
                  price: offer.price,
                  showPurchaseActions: false 
                })}
              />
            </div>
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
