import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Gift } from '@/components/Gift';
import { BottomNav } from '@/components/Navigation';
import { MarketHeader } from '@/components/MarketHeader';
import { loadChannels, loadGifts, getChannelGifts } from '@/lib/mockLoaders';

export const Route = createFileRoute('/')({
  loader: async () => {
    const [channelsData, giftsData] = await Promise.all([
      loadChannels(),
      loadGifts()
    ]);
    
    // Convert channels to gift format for display
    const channelGifts = channelsData
      .map((channel, index) => {
        const channelGifts = getChannelGifts(channel, giftsData);
        
        // Skip channels with no gifts
        if (channelGifts.length === 0) {
          return null;
        }
        
        // Generate titles like on screenshot
        const title = channelGifts.length === 1 
          ? `${channelGifts[0].gift.short_name} X3`
          : channelGifts.length === 2
          ? `${channelGifts[0].gift.short_name} Ch...`
          : `${channelGifts[0].gift.short_name} & Br...`;
      
      // Add corner badges for variety (simulate different gift types)
      let cornerBadge: 'blue' | 'orange' | null = null;
      if (index % 3 === 0) cornerBadge = 'blue';
      else if (index % 5 === 0) cornerBadge = 'orange';
      
      // Add Fast Sale banners for some items
      const isFastSale = index % 4 === 1 || index % 7 === 0;
      
      // Add time badges for some items
      const timeBadge = index % 6 === 2 ? '2h' : null;
      
      return {
        id: channel.id.toString(),
        title,
        giftNumber: `#${channel.id}`,
        price: Math.round(channel.price),
        isFastSale,
        timeBadge,
        cornerBadge,
        items: channelGifts.slice(0, 4).map(({ gift, quantity }) => ({
          id: gift.id,
          name: gift.full_name,
          icon: gift.image_url || '/placeholder-gift.svg',
          quantity,
          type: gift.type === 'REGULAR' ? undefined : ('nft' as const)
        }))
      };
      })
      .filter((channel): channel is NonNullable<typeof channel> => channel !== null);

    return { channelGifts };
  },
  component: MarketPage,
});

function MarketPage() {
  const { channelGifts } = Route.useLoaderData();
  const [filters, setFilters] = useState({
    gift: 'All',
    channelType: 'All',
    sorting: 'All'
  });
  const [selected, setSelected] = useState<null | (typeof channelGifts[number])>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerDuration, setOfferDuration] = useState<'1d' | '1w' | 'forever'>('1d');

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Here you could implement actual filtering logic
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1A2026',
      color: '#ffffff',
      paddingBottom: '80px'
    }}>
      <MarketHeader 
        balance={243.16}
        onFilterChange={handleFilterChange}
      />

      {/* Gift Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px'
      }}>
        {channelGifts.map((gift) => (
          <Gift
            key={gift.id}
            items={gift.items}
            title={gift.title}
            giftNumber={gift.giftNumber}
            price={gift.price}
            isFastSale={gift.isFastSale}
            timeBadge={gift.timeBadge}
            cornerBadge={gift.cornerBadge}
            onClick={() => setSelected(gift)}
          />
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
            <div  style={{borderTop: '0'}} className="product-sheet__actions">
              <button className="product-sheet__btn" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.05056 11.514L5.64389 9.65599C5.31689 9.98059 4.9011 10.2011 4.44895 10.2897C3.9968 10.3784 3.52853 10.3312 3.10317 10.1541C2.67782 9.97695 2.31442 9.67787 2.05879 9.29453C1.80316 8.91119 1.66675 8.46075 1.66675 7.99999C1.66675 7.53924 1.80316 7.08879 2.05879 6.70545C2.31442 6.32211 2.67782 6.02304 3.10317 5.84593C3.52853 5.66882 3.9968 5.6216 4.44895 5.71024C4.9011 5.79888 5.31689 6.01939 5.64389 6.34399L9.05056 4.48599C8.93372 3.93782 9.01811 3.3659 9.28829 2.87483C9.55847 2.38376 9.99638 2.00635 10.522 1.81161C11.0475 1.61688 11.6256 1.61784 12.1506 1.81432C12.6755 2.01079 13.1121 2.38965 13.3807 2.88162C13.6492 3.37358 13.7317 3.94578 13.6131 4.49356C13.4944 5.04135 13.1826 5.52812 12.7345 5.86486C12.2864 6.2016 11.7321 6.36581 11.173 6.32746C10.6138 6.2891 10.0871 6.05075 9.68922 5.65599L6.28256 7.51399C6.3507 7.83419 6.3507 8.16513 6.28256 8.48533L9.68922 10.344C10.0871 9.94923 10.6138 9.71088 11.173 9.67253C11.7321 9.63418 12.2864 9.79838 12.7345 10.1351C13.1826 10.4719 13.4944 10.9586 13.6131 11.5064C13.7317 12.0542 13.6492 12.6264 13.3807 13.1184C13.1121 13.6103 12.6755 13.9892 12.1506 14.1857C11.6256 14.3821 11.0475 14.3831 10.522 14.1884C9.99638 13.9936 9.55847 13.6162 9.28829 13.1252C9.01811 12.6341 8.93372 12.0622 9.05056 11.514Z" fill="currentColor"/>
                </svg>
                Share Channel
              </button>
              <button className="product-sheet__btn product-sheet__btn--primary" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.81481 14.6667L1.33333 5.77778H14.6667L13.1852 14.6667H2.81481ZM6.51852 10.2222H9.48148C9.69136 10.2222 9.86741 10.1511 10.0096 10.0089C10.1519 9.86667 10.2226 9.69136 10.2222 9.48148C10.2217 9.27161 10.1506 9.09629 10.0089 8.95407C9.86716 8.81185 9.69136 8.74074 9.48148 8.74074H6.51852C6.30864 8.74074 6.13321 8.81185 5.99111 8.95407C5.84901 9.09629 5.77827 9.27161 5.77778 9.48148C5.77728 9.69136 5.84839 9.86692 5.99111 10.0096C6.13383 10.1523 6.30963 10.2232 6.51852 10.2222ZM3.55556 5.03704C3.34568 5.03704 3.16988 4.96593 3.02778 4.8237C2.88568 4.68148 2.81531 4.50568 2.81481 4.2963C2.81432 4.08691 2.88543 3.91111 3.02778 3.76889C3.17012 3.62667 3.34568 3.55556 3.55556 3.55556H12.4444C12.6543 3.55556 12.8304 3.62667 12.9726 3.76889C13.1148 3.91111 13.1856 4.08691 13.1852 4.2963C13.1847 4.50568 13.1136 4.68173 12.9715 4.82444C12.8294 4.96716 12.6543 5.03802 12.4444 5.03704H3.55556ZM5.03704 2.81481C4.82716 2.81481 4.65136 2.7437 4.50926 2.60148C4.36716 2.45926 4.29679 2.28346 4.2963 2.07407C4.2958 1.86469 4.36691 1.68889 4.50926 1.54667C4.65161 1.40444 4.82716 1.33333 5.03704 1.33333H10.9629C10.9629 1.33333 11.1562 1.40444 11.2978 1.54667C11.4393 1.68889 11.5099 1.86469 11.5096 2.07407C11.5093 2.28346 11.4382 2.45951 11.296 2.60222C11.1538 2.74494 10.9778 2.81579 10.7681 2.81481H5.03704Z" fill="currentColor"/>
                </svg>
                Open Channel
              </button>
            </div>
            <div className="product-sheet__actions">
              <button className="product-sheet__btn" type="button" onClick={() => setShowOffer(true)}>Make Offer</button>
              <button className="product-sheet__btn product-sheet__btn--primary" style={{display: 'inline-block'}} type="button">Buy Channel
                <span className="product-sheet__price">{selected.price} TON</span>
              </button>
            </div>
          </div>
        </div>, document.body)}
      {showOffer && createPortal(
        <div className="offer-modal-overlay" onClick={() => setShowOffer(false)}>
          <div className="offer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="offer-modal__header">
              <div className="offer-modal__title">Your suggestion</div>
              <button className="offer-modal__close" type="button" onClick={() => setShowOffer(false)}>✕</button>
            </div>
            <div className="offer-modal__block">
              <div className="offer-modal__label">OFFER PRICE IN TON</div>
              <input className="offer-modal__input" placeholder="Enter offer price" value={offerPrice} onChange={(e)=> setOfferPrice(e.target.value)} />
              <div className="offer-modal__balance">YOUR BALANCE: 0 TON</div>
            </div>
            <div className="offer-modal__block">
              <div className="offer-modal__label">OFFER DURATION</div>
              <div className="offer-modal__segmented">
                <button type="button" className={offerDuration === '1d' ? 'is-active' : ''} onClick={()=> setOfferDuration('1d')}>1 Day</button>
                <button type="button" className={offerDuration === '1w' ? 'is-active' : ''} onClick={()=> setOfferDuration('1w')}>1 Week</button>
                <button type="button" className={offerDuration === 'forever' ? 'is-active' : ''} onClick={()=> setOfferDuration('forever')}>Forever</button>
              </div>
            </div>
            <button className="offer-modal__submit" type="button" onClick={() => setShowOffer(false)}>Send Offer</button>
          </div>
        </div>, document.body)}
    </div>
  );
}
