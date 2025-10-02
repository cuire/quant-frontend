import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useCallback, useMemo } from 'react';
import { useMeChannelsInfinite, useMeGiftsInfinite, useGifts } from '@/lib/api-hooks';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';
import { getGiftIcon } from '@/lib/images';

export const Route = createFileRoute('/storage/channels')({
  component: ChannelsPage,
});

function ChannelsPage() {
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  
  const {
    data: channelsData,
    fetchNextPage: fetchNextChannels,
    hasNextPage: hasNextChannels,
    isFetchingNextPage: isFetchingNextChannels,
    isLoading: isLoadingChannels,
    error: channelsError
  } = useMeChannelsInfinite(20);

  const {
    data: userGiftsData,
    isLoading: isLoadingGifts,
  } = useMeGiftsInfinite(20);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingChannels) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextChannels && !isFetchingNextChannels) {
        fetchNextChannels();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingChannels, hasNextChannels, isFetchingNextChannels, fetchNextChannels]);

  const allChannels = channelsData?.pages.flatMap(page => page) || [];
  const allUserGifts = userGiftsData?.pages.flatMap(page => page) || [];

  // Create a map of gift IDs to gift data for quick lookup
  const giftsMap = useMemo(() => {
    if (!giftsData) return new Map();
    return new Map(giftsData.map(gift => [gift.id, gift]));
  }, [giftsData]);

  const handleSellChannel = (id: string, price: number, duration?: number) => {
    console.log('Selling channel:', id, price, 'TON', duration ? `for ${duration}h` : '');
    // TODO: Implement actual API call to create sell offer
    // await createChannelOffer(channel.id, price, duration);
  };

  const handleDeclineChannel = (id: string) => {
    console.log('Declining channel', id);
    // TODO: Implement actual API call to decline channel
    // await declineChannel(channel.id);
  };

  const handleSellUserGift = (id: string, price: number, duration?: number) => {
    console.log('Selling user gift:', id, price, 'TON', duration ? `for ${duration}h` : '');
    // TODO: Implement actual API call to create sell offer
    // await createUserGiftOffer(userGift.id, price, duration);
  };

  const handleDeclineUserGift = (id: string) => {
    console.log('Declining user gift', id);
    // TODO: Implement actual API call to decline user gift
    // await declineUserGift(userGift.id);
  };

  const handleGiftClick = (userGift: any) => {
    // Extract attributes from user gift data
    const model = userGift.model_data ? {
      value: userGift.model_data.name || '',
      rarity_per_mille: userGift.model_data.rarity_per_mille || 0,
      floor: userGift.model_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    const backdrop = userGift.backdrop_data ? {
      value: userGift.backdrop_data.name || '',
      rarity_per_mille: userGift.backdrop_data.rarity_per_mille || 0,
      floor: userGift.backdrop_data.floor || 0,
      centerColor: userGift.backdrop_data.center_color || '000000',
      edgeColor: userGift.backdrop_data.edge_color || '000000'
    } : { value: '', rarity_per_mille: 0, floor: 0, centerColor: '000000', edgeColor: '000000' };

    const symbol = userGift.symbol_data ? {
      value: userGift.symbol_data.name || '',
      rarity_per_mille: userGift.symbol_data.rarity_per_mille || 0,
      floor: userGift.symbol_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    // Open upgraded-gift modal with hideActions flag
    openModal('upgraded-gift', {
      id: userGift.id,
      giftId: String(userGift.gift_data.id),
      giftSlug: userGift.slug,
      name: userGift.gift_data?.full_name || `Gift ${userGift.gift_id}`,
      num: userGift.id,
      gift_frozen_until: userGift.gift_frozen_until || null,
      model,
      backdrop,
      symbol,
      hideActions: true,
    });
  };

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
          <Link 
            to="/storage/activity" 
            search={{ 
              page: 1, 
              limit: 20, 
              gift_id: [], 
              sort_by: 'date_new_to_old',
            } as any}
            className="storage-tab-link"
          >
            Activity
          </Link>
        </div>
      </div>

      {isLoadingChannels && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading channels...</p>
        </div>
      )}

      {channelsError && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3939' }}>
          <p>Error loading channels: {channelsError.message}</p>
        </div>
      )}

      {!isLoadingChannels && allChannels.length === 0 && !isLoadingGifts && allUserGifts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>No items found</p>
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
                  showPurchaseActions: channel.status !== 'transferring' && channel.status !== 'frozen',
                  onDecline: handleDeclineChannel,
                })}
                onSell={() => openModal('sell-channel', {
                  itemId: channel.id,
                  itemName: `#${channel.id}`,
                  floorPrice: null,
                  onSubmit: handleSellChannel,
                  defaultPrice: channel.price,
                })}
                transferringEndAt={channel.transferring_end_at}
                
                key={channel.id}
              ref={index === allChannels.length - 1 ? lastElementRef : undefined}
              />
           );
        })}

        {/* Render user gifts as cards */}
        {allUserGifts.map((userGift) => (
          <Gift
            key={`gift-${userGift.id}`}
            items={[{
              id: userGift.gift_id,
              name: userGift.gift_data.full_name || `Gift ${userGift.gift_id}`,
              icon: userGift.slug && userGift.slug !== 'None-None' 
                ? '' // Will use UpgradedGiftSlugIcon component
                : getGiftIcon(userGift.gift_data.id),
              giftSlug: userGift.slug,
            }]}
            title={userGift.gift_data.full_name || `Gift ${userGift.gift_id}`}
            giftNumber={`#${userGift.id}`}
            price={0}
            variant="my-channel"
            giftStatus={userGift.status}
            onSell={() => openModal('sell-channel', {
              itemId: userGift.id,
              itemName: `#${userGift.id}`,
              floorPrice: null,
              type: 'gift',
              onSubmit: handleSellUserGift,
              defaultPrice: userGift.gift_data.price,
            })}
            onClick={() => handleGiftClick(userGift)}
          />
        ))}
      </div>

      {isFetchingNextChannels && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading more...</p>
        </div>
      )}
    </>
  );
}
