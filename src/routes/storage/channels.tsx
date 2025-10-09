import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useRef, useCallback, useMemo } from 'react';
import { useMeChannelsInfinite, useMeGiftsInfinite, useGifts, useSellItem, useSellChannel } from '@/lib/api-hooks';
import { useLastTab } from '@/hooks/useLastTab';
import { Gift } from '@/components/Gift';
import { Skeleton } from '@/components/Skeleton';
import { useModal } from '@/contexts/ModalContext';
import { getGiftIcon } from '@/lib/images';
import { openUserGiftModal, useDeclineGift, useDeclineChannel } from '@/lib/gift-modals';
import { useToast } from '@/hooks/useToast';
import './activity.css';

export const Route = createFileRoute('/storage/channels')({
  component: ChannelsPage,
});

function ChannelsPage() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  const sellItemMutation = useSellItem();
  const sellChannelMutation = useSellChannel();
  const handleDeclineUserGift = useDeclineGift();
  const handleDeclineChannel = useDeclineChannel();
  const [activeSubTab, setActiveSubTab] = useLastTab('storage_channels_subtab', 'channels');
  const { success: showSuccessToast, block: showErrorToast } = useToast();
  
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
    fetchNextPage: fetchNextGifts,
    hasNextPage: hasNextGifts,
    isFetchingNextPage: isFetchingNextGifts,
  } = useMeGiftsInfinite(20);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if ((activeSubTab === 'channels' && isLoadingChannels) || (activeSubTab === 'gifts' && isLoadingGifts)) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      if (activeSubTab === 'channels') {
        if (hasNextChannels && !isFetchingNextChannels) {
          fetchNextChannels();
        }
      } else {
        if (hasNextGifts && !isFetchingNextGifts) {
          fetchNextGifts();
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [activeSubTab, isLoadingChannels, isLoadingGifts, hasNextChannels, isFetchingNextChannels, fetchNextChannels, hasNextGifts, isFetchingNextGifts, fetchNextGifts]);

  const allChannels = channelsData?.pages.flatMap(page => page) || [];
  const allUserGifts = userGiftsData?.pages.flatMap(page => page) || [];

  // Create a map of gift IDs to gift data for quick lookup
  const giftsMap = useMemo(() => {
    if (!giftsData) return new Map();
    return new Map(giftsData.map(gift => [gift.id, gift]));
  }, [giftsData]);

  const handleSellChannel = async (id: string, price: number, duration?: number) => {
    console.log('Selling channel:', id, price, 'TON', duration ? `for ${duration}h` : '');
    
    try {
      // Convert duration from hours to seconds if provided
      const secondsToTransfer = duration ? duration * 3600 : 3600;
      
      await sellChannelMutation.mutateAsync({
        channelId: id,
        price,
        secondsToTransfer,
        timezone: 'UTC'
      });
      
      console.log('✅ Channel listed for sale successfully');
      showSuccessToast({ message: t('toast.channelListedSuccess') });
    } catch (error) {
      console.error('❌ Failed to list channel for sale:', error);
      const errorMessage = (error as any)?.message || t('toast.channelListedFailed');
      showErrorToast({ message: errorMessage });
    }
  };

  const handleSellUserGift = async (id: string, price: number, duration?: number) => {
    console.log('Selling user gift:', id, price, 'TON', duration ? `for ${duration}h` : '');
    
    try {
      // Convert duration from hours to seconds if provided
      const secondsToTransfer = duration ? duration * 3600 : 3600;
      
      await sellItemMutation.mutateAsync({
        itemId: id,
        price,
        secondsToTransfer,
        timezone: 'UTC'
      });
      
      console.log('✅ User gift listed for sale successfully');
      showSuccessToast({ message: t('toast.giftListedSuccess') });
    } catch (error) {
      console.error('❌ Failed to list user gift for sale:', error);
      const errorMessage = (error as any)?.message || t('toast.giftListedFailed');
      showErrorToast({ message: errorMessage });
    }
  };

  const handleGiftClick = (userGift: any) => {
    openUserGiftModal(userGift, openModal, handleDeclineUserGift);
  };

  return (
    <>
      <div className="storage-tabs">
        <div className="storage-segment">
          <Link to="/storage/channels" className="storage-tab-link is-active">
            {t('tabs.items')}
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link">
            {t('tabs.offers')}
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
            {t('tabs.activity')}
          </Link>
        </div>
        <div className="storage-segment" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <button
            className={`storage-tab-link ${activeSubTab === 'channels' ? 'is-active' : ''}`}
            onClick={() => setActiveSubTab('channels')}
          >
            {t('tabs.channels')}
          </button>
          <button
            className={`storage-tab-link ${activeSubTab === 'gifts' ? 'is-active' : ''}`}
            onClick={() => setActiveSubTab('gifts')}
          >
            {t('tabs.gifts')}
          </button>
        </div>
      </div>

      {activeSubTab === 'channels' && isLoadingChannels && allChannels.length === 0 && (
        <div className="gifts-grid">
          <Skeleton count={8} />
        </div>
      )}

      {activeSubTab === 'channels' && channelsError && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3939' }}>
          <p>{t('storage.errorLoadingChannels')}: {channelsError.message}</p>
        </div>
      )}

      {activeSubTab === 'channels' && !isLoadingChannels && allChannels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">{t('storage.noActivityFound')}</h3>
            <p className="text-gray-400">{t('storage.yourItemsWillAppearHere')}</p>
          </div>
        </div>
      )}

      {activeSubTab === 'channels' && (
      <div className="gifts-grid">
          {allChannels.map((channel, index) => {
           // Convert channel gifts to items format for Gift component
           const items = Object.entries(channel.gifts).map(([giftId, quantity]) => {
              const giftData = giftsMap.get(giftId);
             return {
               id: giftId,
               name: giftData?.full_name || `Gift ${giftId}`,
                icon: giftData?.image_url || `https://FlowersRestricted.github.io/gifts/${giftId}/default.png`,
               quantity
             };
           });

           // Generate channel title like on index.tsx
           const generateChannelTitle = (gifts: any[], isModal = false) => {
             if (!gifts || gifts.length === 0) return t('channel.emptyChannel');

             const maxDisplay = 2;
             const displayGifts = gifts.slice(0, maxDisplay);

             let parts = [];

             for (let i = 0; i < displayGifts.length; i++) {
               const gift = displayGifts[i];
               const giftName = gift.name || t('channel.unknown');
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
                  shouldShowDuration: true,
                  onSubmit: handleSellChannel,
                  defaultPrice: channel.price,
                })}
                transferringEndAt={channel.transferring_end_at}
                
                key={channel.id}
              ref={index === allChannels.length - 1 ? lastElementRef : undefined}
              />
           );
        })}
      </div>
      )}

      {activeSubTab === 'gifts' && isLoadingGifts && allUserGifts.length === 0 && (
        <div className="gifts-grid">
          <Skeleton count={8} />
        </div>
      )}

      {activeSubTab === 'gifts' && !isLoadingGifts && allUserGifts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">No gifts found</h3>
            <p className="text-gray-400">Your gifts will appear here</p>
          </div>
        </div>
      )}

      {activeSubTab === 'gifts' && (
      <div className="gifts-grid">
        {allUserGifts.map((userGift, index) => (
          <Gift
            key={`gift-${userGift.id}`}
            items={[{
              id: userGift.gift_data.id,
              name: userGift.gift_data.full_name || `Gift ${userGift.gift_data.id}`,
              icon: userGift.slug && userGift.slug !== 'None-None' 
                ? ''
                : getGiftIcon(userGift.gift_data.id),
              giftSlug: userGift.slug,
            }]}
            title={userGift.gift_data.full_name || `Gift ${userGift.gift_data.id}`}
            giftNumber={`#${userGift.id}`}
            price={userGift.price}
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
            onDecline={() => handleDeclineUserGift(userGift.id)}
            onClick={() => handleGiftClick(userGift)}
            ref={index === allUserGifts.length - 1 ? lastElementRef : undefined}
          />
        ))}
      </div>
      )}

      {activeSubTab === 'channels' && isFetchingNextChannels && (
        <div className="gifts-grid">
          <Skeleton count={4} />
        </div>
      )}
      {activeSubTab === 'gifts' && isFetchingNextGifts && (
        <div className="gifts-grid">
          <Skeleton count={4} />
        </div>
      )}
    </>
  );
}
