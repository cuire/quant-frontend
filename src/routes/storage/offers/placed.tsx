import { createFileRoute, Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { MarketHeader } from '@/components/MarketHeader';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';

export const Route = createFileRoute('/storage/offers/placed')({
  component: PlacedOffersPage,
});

function PlacedOffersPage() {
  const { openModal } = useModal();

  const mockOffers = useMemo(() => ([
    {
      id: '415',
      title: 'Gifts Charm Ch...',
      giftNumber: '#415',
      items: [
        { id: '1', name: 'Hoodie', icon: '/placeholder-gift.svg', quantity: 3 },
        { id: '2', name: 'Ring', icon: '/placeholder-gift.svg', quantity: 1 },
        { id: '3', name: 'Heart', icon: '/placeholder-gift.svg', quantity: 7 },
        { id: '4', name: 'Paper', icon: '/placeholder-gift.svg', quantity: 1 },
      ],
      offerPriceTon: 515,
      timeEnd: '23:21:55',
    },
    {
      id: '416',
      title: 'Plush Pepe & Br...',
      giftNumber: '#416',
      items: [
        { id: '5', name: 'Pepe', icon: '/placeholder-gift.svg', quantity: 1 },
        { id: '6', name: 'Brick', icon: '/placeholder-gift.svg', quantity: 2 },
        { id: '7', name: 'Lock Heart', icon: '/placeholder-gift.svg', quantity: 1 },
        { id: '8', name: 'Paper', icon: '/placeholder-gift.svg', quantity: 1 },
      ],
      offerPriceTon: 91.67,
      timeEnd: '12:34:56',
    },
  ]), []);

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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px'
      }}>
        {mockOffers.slice(0, 1).map((offer) => (
          <Gift
            key={`placed-${offer.id}`}
            items={offer.items}
            title={offer.title}
            giftNumber={offer.giftNumber}
            price={offer.offerPriceTon}
            variant="storage-offer"
            storageAction="remove"
            offerPriceTon={offer.offerPriceTon}
            timeEnd={offer.timeEnd}
            onSell={() => openModal('cancel-offer', offer)}
            onClick={() => openModal('gift-details', { ...offer, price: offer.offerPriceTon, showPurchaseActions: false })}
          />
        ))}
      </div>
    </>
  );
}
