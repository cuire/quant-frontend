import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useCallback, useMemo } from 'react';
import { useMeChannelsInfinite, useGifts } from '@/lib/api-hooks';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';

export const Route = createFileRoute('/storage/channels')({
  component: ChannelsPage,
});

function ChannelsPage() {
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useMeChannelsInfinite(20);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allChannels = data?.pages.flatMap(page => page) || [];

  // Create a map of gift IDs to gift data for quick lookup
  const giftsMap = useMemo(() => {
    if (!giftsData) return new Map();
    return new Map(giftsData.map(gift => [gift.id, gift]));
  }, [giftsData]);

  return (
    <>
      <div className="storage-tabs">
        <div className="storage-segment">
          <Link to="/storage/channels" className="storage-tab-link is-active">
            Channels
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link">
            Offers
          </Link>
          <Link to="/storage/activity"  disabled className="storage-tab-link">
            Activity
          </Link>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading channels...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3939' }}>
          <p>Error loading channels: {error.message}</p>
        </div>
      )}

      {!isLoading && allChannels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No channels found</p>
        </div>
      )}

      <div className="gifts-grid">
          {allChannels.map((channel, index) => {
           // Convert channel gifts to items format for Gift component
           const items = Object.entries(channel.gifts).map(([giftId, quantity]) => {
             const giftData = giftsMap.get(giftId);
             return {
               id: giftId,
               name: giftData?.full_name || `Gift ${giftId}`,
               icon: giftData?.image_url || '/placeholder-gift.svg',
               quantity
             };
           });

           // Generate channel title like on index.tsx
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

           const title = generateChannelTitle(items);
            return (
              <Gift
                items={items}
                title={title}
                giftNumber={`#${channel.id}`}
                price={channel.price}
                variant="my-channel"
                channelStatus={channel.status}
                onClick={() => openModal('gift-details', {channel, gifts: giftsData || [],
                  showPurchaseActions: channel.status !== 'transferring' && channel.status !== 'frozen'
                })}
                transferringEndAt={channel.transferring_end_at}
                
                key={channel.id}
              ref={index === allChannels.length - 1 ? lastElementRef : undefined}
              />
           );
        })}
      </div>

      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading more channels...</p>
        </div>
      )}
    </>
  );
}
