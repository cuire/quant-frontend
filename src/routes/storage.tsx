import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { MarketHeader } from '@/components/MarketHeader';
import { BottomNav } from '@/components/Navigation';
import { Gift } from '@/components/Gift';
import { useModal } from '@/contexts/ModalContext';

export const Route = createFileRoute('/storage')({
  component: StoragePage,
});

function StoragePage() {
  const [section, setSection] = useState<'Channels' | 'Offers' | 'Activity'>('Offers');
  const [offersTab, setOffersTab] = useState<'Received' | 'Placed'>('Received');
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
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketHeader balance={243.16} onFilterChange={() => {}} />

      <div className="storage-tabs">
        <div className="storage-segment">
          {(['Channels','Offers','Activity'] as const).map((name) => (
            <button key={name} type="button" className={section === name ? 'is-active' : ''} onClick={() => setSection(name)}>
              {name}
            </button>
          ))}
        </div>

        <div className="storage-subsegment">
          {(['Received','Placed'] as const).map((name) => (
            <button key={name} type="button" className={offersTab === name ? 'is-active' : ''} onClick={() => setOffersTab(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      {section === 'Offers' && offersTab === 'Received' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          padding: '16px'
        }}>
          {mockOffers.map((offer) => (
            <Gift
              key={offer.id}
              items={offer.items}
              title={offer.title}
              giftNumber={offer.giftNumber}
              price={offer.offerPriceTon}
              variant="storage-offer"
              offerPriceTon={offer.offerPriceTon}
              timeEnd={offer.timeEnd}
              onSell={() => openModal('accept-offer', offer)}
              onDecline={() => openModal('cancel-offer', offer)}
              onClick={() => openModal('gift-details', { ...offer, price: offer.offerPriceTon, showPurchaseActions: false })}
            />
          ))}
        </div>
      )}

      {section === 'Offers' && offersTab === 'Placed' && (
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
      )}

      <BottomNav />
    </div>
  );
}

