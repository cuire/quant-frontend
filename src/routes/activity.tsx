import { createFileRoute } from '@tanstack/react-router';
import { MarketHeader } from '@/components/MarketHeader';
import { BottomNav } from '@/components/Navigation';
import { loadGifts } from '@/lib/mockLoaders';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export const Route = createFileRoute('/activity')({
  loader: async () => {
    const gifts = await loadGifts();
    return { gifts };
  },
  component: ActivityPage,
});

function ActivityPage() {
  const { gifts } = Route.useLoaderData();
  const [selected, setSelected] = useState<null | {
    title: string;
    giftNumber: string;
    price: number;
    items: { id: string; name: string; icon: string; quantity: number }[];
  }>(null);
  const rows = (gifts || []).slice(0, 12).map((g) => ({
    id: String(g.id),
    name: g.full_name,
    num: `#${g.id}`,
    icon: g.image_url || '/placeholder-gift.svg',
    isNft: g.type !== 'REGULAR',
    status: 'Purchase' as const,
    price: 91.67,
    time: 'Aug 25, 03:48',
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketHeader balance={243.16} onFilterChange={() => {}} />

      <div className="activity-list">
        {rows.map((r) => (
          <div key={r.id} className="activity-item" onClick={() => {
            const gallery = (gifts || []).slice(0, 4).map((g, idx) => ({
              id: String(g.id),
              name: g.full_name,
              icon: g.image_url || '/placeholder-gift.svg',
              quantity: idx === 0 ? 3 : idx === 1 ? 1 : idx === 2 ? 7 : 1,
            }));
            setSelected({ title: r.name, giftNumber: r.num, price: r.price, items: gallery });
          }}>
            <div className="activity-icon"><img src={r.icon} alt={r.name} onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder-gift.svg';}} /></div>
            <div className="activity-main">
              <div className="activity-title-row">
                <div className="activity-title">{r.name}</div>
                {r.isNft && <span className="activity-badge activity-badge--nft">NFTs</span>}
              </div>
              <div className="activity-sub">583</div>
            </div>
            <div className="activity-center"><span className="activity-badge activity-badge--purchase">{r.status}</span></div>
            <div className="activity-right">
              <div className="activity-price">
                
                <span>{r.price} TON</span>
              </div>
              <div className="activity-time">{r.time}</div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />

      {selected && createPortal(
        <div className="market-header__sheet-overlay" onClick={() => setSelected(null)}>
          <div className="market-header__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="product-sheet__header">
              <div className="product-sheet__gallery">
                {(() => {
                  const count = selected.items.length;
                  const gridClass = count === 1 ? 'single' : count === 2 ? 'double' : count === 3 ? 'triple' : 'multiple';
                  const visible = gridClass === 'multiple' ? selected.items.slice(0, 4) : selected.items.slice(0, count);
                  return (
                    <div className={`product-sheet__grid product-sheet__grid--${gridClass}`}>
                      {visible.map((it) => (
                        <div className="product-sheet__cell" key={it.id}>
                          <img src={it.icon} alt={it.name} />
                          <span className="product-sheet__q">x{it.quantity}</span>
                        </div>
                      ))}
                      {count > 4 && (
                        <div className="product-sheet__more-badge">+{count - 4} more</div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <button className="product-sheet__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="product-sheet__title">
              <div className="product-sheet__name">{selected.title}</div>
              <div className="product-sheet__num">{selected.giftNumber}</div>
            </div>
            <div className="product-sheet__list">
              {selected.items.map((it) => (
                <div key={it.id} className="product-sheet__row">
                  <div className="product-sheet__row-icon"><img src={it.icon} alt={it.name} /></div>
                  <div className="product-sheet__row-main">
                    <div className="product-sheet__row-title">{it.name}</div>
                    <div className="product-sheet__row-note">Quantity: {it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="product-sheet__actions">
              <button className="product-sheet__btn" type="button">Share Channel</button>
              <button className="product-sheet__btn product-sheet__btn--primary" type="button">Open Channel</button>
            </div>
            <div className="product-sheet__actions">
              <button className="product-sheet__btn" type="button">Make Offer</button>
              <button className="product-sheet__btn product-sheet__btn--primary" type="button">Buy Channel
                <span className="product-sheet__price">{selected.price} TON</span>
              </button>
            </div>
          </div>
        </div>, document.body)}
    </div>
  );
}

//

