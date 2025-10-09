import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { useOffersInfinite, useGifts } from '@/lib/api-hooks';
import { Gift } from '@/components/Gift';
import { Skeleton } from '@/components/Skeleton';
import { useModal } from '@/contexts/ModalContext';
import { parseGiftData } from '@/helpers/giftDataUtils';
import '../activity.css';

export const Route = createFileRoute('/storage/offers/placed')({
  component: PlacedOffersPage,
});

function PlacedOffersPage() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { data: giftsData } = useGifts();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useOffersInfinite(20);



  const giftsMap = useMemo(() => {
    if (!giftsData) return new Map();
    return new Map(giftsData.map(gift => [gift.id, gift]));
  }, [giftsData]);

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

  const handleCancelOffer = (offer: any) => {
    openModal('cancel-offer', { offer, offerSide: 'placed' });
  };

  const handleGiftClick = (offer: any) => {
    // Only handle user_gift type offers
    if (offer.type !== 'user_gift' || !offer.gift_data) return;

    // Extract attributes from offer data - these might be available if the offer contains upgraded gift data
    const model = offer.model_data ? {
      value: offer.model_data.name || '',
      rarity_per_mille: offer.model_data.rarity_per_mille || 0,
      floor: offer.model_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    const backdrop = offer.backdrop_data ? {
      value: offer.backdrop_data.name || '',
      rarity_per_mille: offer.backdrop_data.rarity_per_mille || 0,
      floor: offer.backdrop_data.floor || 0,
      centerColor: offer.backdrop_data.center_color || '000000',
      edgeColor: offer.backdrop_data.edge_color || '000000'
    } : { value: '', rarity_per_mille: 0, floor: 0, centerColor: '000000', edgeColor: '000000' };

    const symbol = offer.symbol_data ? {
      value: offer.symbol_data.name || '',
      rarity_per_mille: offer.symbol_data.rarity_per_mille || 0,
      floor: offer.symbol_data.floor || 0
    } : { value: '', rarity_per_mille: 0, floor: 0 };

    // Open upgraded-gift modal with status and onDecline
    openModal('upgraded-gift', {
      id: offer.gift_id,
      giftId: String(offer.gift_data.id),
      giftSlug: offer.slug || 'None-None',
      name: offer.gift_data?.full_name || `Gift ${offer.gift_id}`,
      num: offer.gift_id,
      gift_frozen_until: offer.gift_frozen_until || null,
      price: offer.price || 0,
      model,
      backdrop,
      symbol,
      status: offer.status || 'available',
      hideActions: true,
      offer: offer,
      offerSide: 'placed',
    });
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
            {t('tabs.items')}
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link is-active">
            {t('tabs.offers')}
          </Link>
          <Link to="/storage/activity" search={{ page: 1, limit: 20, gift_id: [], sort_by: 'date_new_to_old' } as any} className="storage-tab-link">
            {t('tabs.activity')}
          </Link>
        </div>

        <div className="storage-subsegment">
          <Link to="/storage/offers/received" className="storage-tab-link">
            {t('tabs.received')}
          </Link>
          <Link to="/storage/offers/placed" className="storage-tab-link is-active">
            {t('tabs.placed')}
          </Link>
        </div>
      </div>

      {isLoading && allOffers.length === 0 && (
        <div className="gifts-grid">
          <Skeleton count={8} />
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3939' }}>
          <p>{t('common.error')}: {error.message}</p>
        </div>
      )}

      {!isLoading && allOffers.length === 0 && (
       <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold mb-2">{t('storage.noOffersFound')}</h3>
        <p className="text-gray-400">{t('storage.checkBackLater')}</p>
      </div>
      )}

      <div className="gifts-grid">
        {allOffers.map((offer, index) => {
          // Convert gifts_data to items format for Gift component
          const items = [];
          
          // Handle gift offers (user_gift type)
          if (offer.type === 'user_gift' && offer.gift_data) {
            // Use the gift image from backend or fallback to placeholder
            const giftImage = offer.gift_data.image_url || 
              `https://FlowersRestricted.github.io/gifts/${offer.gift_data.id}/default.png`;
            
            items.push({
              id: offer.gift_data.id.toString(),
              name: offer.gift_data.full_name,
              icon: giftImage,
              type: 'item' as const
            });
          }
          // Handle channel offers (existing logic)
          else if (offer.gifts_data) {
            items.push(...parseGiftData(offer.gifts_data, giftsMap));
          }

          const title = offer.type === 'channel' ? generateChannelTitle(items) : offer.gift_data?.full_name || '';
          const timeEnd = offer.expires_at ? new Date(offer.expires_at).toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }) : '--:--:--';

          // Generate appropriate gift number based on offer type
          const giftNumber = offer.type === 'user_gift' 
            ? `#${offer.gift_id}` 
            : `#${offer.channel_id}`;

          return (
            <Gift
              key={offer.id}
              ref={index === allOffers.length - 1 ? observer : undefined}
              items={items}
              title={title}
              giftNumber={giftNumber}
              price={offer.price}
              action={offer.type === 'user_gift' ? 'cancel-offer' : undefined}
              storageAction={offer.type === 'user_gift' ? undefined : 'remove'}
              offerPriceTon={offer.price}
              timeEnd={timeEnd}
              timeEndTimestamp={offer.expires_at || undefined}
              showOfferInfo
              onSell={() => handleCancelOffer(offer)}
              onClick={offer.type === 'user_gift' ? () => handleGiftClick(offer) : () => openModal('gift-details', { 
                channel: { id: offer.channel_id, gifts: offer.gifts_data || {} }, 
                gifts: giftsData || [],
                price: offer.price,
                showPurchaseActions: false,
                offer: offer,
                offerSide: 'placed'
              })}
            />
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="gifts-grid">
          <Skeleton count={4} />
        </div>
      )}
    </>
  );
}
