import { useModal } from '@/contexts/ModalContext';
import { Link } from '../Link/Link';
import { CountdownTimer } from '../CountdownTimer';
import { getChannelPrice } from '@/helpers/priceUtils';
import { shareChannel } from '@/helpers/shareUtils';

interface GiftDetailsModalProps {
  data: any;
  onClose: () => void;
}

export const GiftDetailsModal = ({ data, onClose }: GiftDetailsModalProps) => {
  const { openModal } = useModal();

  const handleMakeOffer = () => {
    openModal('offer', { channel, gifts });
  };

  const handleBuyChannel = () => {
    openModal('purchase-confirm', { channel, gifts });
  };

  // Extract channel and gifts data
  const channel = data.channel || data;
  const gifts = data.gifts || [];
  
  // Transform gifts object to items array if needed
  const items = channel.items || (channel.gifts ? (() => {
    const channelGifts = channel.gifts || {};
    const itemsArray = [];
    
    // Check if gifts has upgraded structure at root level
    if ('upgraded' in channelGifts && typeof channelGifts === 'object') {
      // Structure: { upgraded: { modelId: [backdropIds] } }
      for (const [modelId, backdropIds] of Object.entries(channelGifts.upgraded || {})) {
        const foundGift = gifts.find((gift: any) => gift.id === modelId);
        
        // Ensure backdropIds is an array and get its length safely
        const quantity = Array.isArray(backdropIds) ? backdropIds.length : 1;
        
        itemsArray.push({
          id: modelId,
          name: foundGift?.short_name || foundGift?.full_name || `Gift ${modelId}`,
          icon: `https://FlowersRestricted.github.io/gifts/${modelId}/default.png`,
          quantity: quantity,
          type: 'nft'
        });
      }
    } else {
      // Simple structure: { giftId: quantity }
      for (const [gift_id, quantity] of Object.entries(channelGifts)) {
        if (typeof quantity === 'number') {
          const foundGift = gifts.find((gift: any) => gift.id === gift_id);
          itemsArray.push({
            id: gift_id,
            name: foundGift?.short_name || foundGift?.full_name || `Gift ${gift_id}`,
            icon: `https://FlowersRestricted.github.io/gifts/${gift_id}/default.png`,
            quantity: quantity,
            type: 'item'
          });
        }
      }
    }
    
    return itemsArray;
  })() : []);
  
  // Generate title and other properties like in the routes file
  const generateChannelTitle = (gifts: any[], isModal = false) => {
    if (!gifts || gifts.length === 0) return "Empty Channel";

    const maxDisplay = 2;
    const displayGifts = gifts.slice(0, maxDisplay);

    let parts = [];

    for (let i = 0; i < displayGifts.length; i++) {
      const gift = displayGifts[i];
      const giftName = gift.name || "Unknown";
      
      // Ensure quantity is a number
      const quantity = typeof gift.quantity === 'number' ? gift.quantity : 1;
      const giftText = `${giftName} x${quantity}`;

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


  const title = generateChannelTitle(items, true);
  const giftNumber = `#${channel.id}`;
  const price = getChannelPrice(channel.price);
  const showPurchaseActions = data?.showPurchaseActions ?? true;

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div className="product-sheet__gallery">
          {(() => {
            const count = items.length;
            const gridClass = count === 1 ? 'single' : count === 2 ? 'double' : count === 3 ? 'triple' : 'multiple';
            const visible = gridClass === 'multiple' ? items.slice(0, 4) : items.slice(0, count);
            return (
              <div className={`product-sheet__grid product-sheet__grid--${gridClass}`}>
                {visible.map((it: any) => (
                  <div className="product-sheet__cell" key={it.id}>
                    <img src={it.icon} alt={it.name || 'Gift'} />
                    <span className="product-sheet__q">x{typeof it.quantity === 'number' ? it.quantity : 1}</span>
                  </div>
                ))}
                {count > 4 && (
                  <div className="product-sheet__more-badge">+{count - 4} more</div>
                )}
              </div>
            );
          })()}
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>
      <div className="product-sheet__title">
        <div className="product-sheet__name">{title}</div>
        <div className="product-sheet__num">{giftNumber}</div>
      </div>
      
      {channel?.status === 'transferring' && (
        <div className="product-sheet__list">
          <div className="product-sheet__row">
              <div className="product-sheet__row-main">
                <div className="product-sheet__row-timer">
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.9989 9.99986C17.2538 10.0001 17.4989 10.0977 17.6843 10.2727C17.8696 10.4477 17.9811 10.6868 17.9961 10.9413C18.011 11.1957 17.9282 11.4462 17.7646 11.6417C17.601 11.8371 17.369 11.9628 17.1159 11.9929L16.9989 11.9999H3.41289L5.70589 14.2929C5.88524 14.4728 5.98937 14.7143 5.99712 14.9682C6.00488 15.2222 5.91568 15.4696 5.74764 15.6601C5.57961 15.8507 5.34534 15.9702 5.09242 15.9943C4.8395 16.0184 4.58688 15.9453 4.38589 15.7899L4.29189 15.7069L0.461892 11.8769C-0.203108 11.2129 0.222892 10.0939 1.12489 10.0059L1.23989 9.99986H16.9989ZM12.2919 0.292861C12.4641 0.120685 12.6932 0.0172534 12.9362 0.00197221C13.1792 -0.013309 13.4195 0.06061 13.6119 0.209861L13.7059 0.292861L17.5359 4.12286C18.2009 4.78686 17.7749 5.90586 16.8729 5.99386L16.7579 5.99986H0.998892C0.744012 5.99958 0.49886 5.90198 0.313524 5.72701C0.128188 5.55204 0.0166572 5.31291 0.00172004 5.05847C-0.0132171 4.80403 0.0695667 4.55348 0.233157 4.35803C0.396747 4.16258 0.628796 4.03697 0.881892 4.00686L0.998892 3.99986H14.5849L12.2919 1.70686C12.1044 1.51933 11.9991 1.26503 11.9991 0.999861C11.9991 0.734697 12.1044 0.480389 12.2919 0.292861Z" fill="white"/>
                  </svg>
                  <CountdownTimer endTime={channel.transferring_end_at} className="small"/>
                </div>
                {!channel.my_channel ? (
                  <div className="product-sheet__row-note">
                    Waiting for receiving channel.
                  </div>
                ) : (
                <div className="product-sheet__row-note">
                  Waiting for the channel to be transferred from you to {channel.transferring_to_full_name} <Link href={`https://t.me/${channel.transferring_to_username}`}>@{channel.transferring_to_username}</Link> [{channel.transferring_to_id}].
                </div>
                )}
              </div>
          </div>
        </div>
      )}

      <div className="product-sheet__list">
        {items.map((it: any) => (
          <div key={it.id} className="product-sheet__row">
            <div className="product-sheet__row-icon"><img src={it.icon} alt={it.name} /></div>
            <div className="product-sheet__row-main">
              <div className="product-sheet__row-title">{it.name}</div>
              <div className="product-sheet__row-note">Quantity: {it.quantity}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{borderTop: '0'}} className="product-sheet__actions">
        <button 
          className="product-sheet__btn" 
          type="button"
          onClick={() => shareChannel(channel.id, { gifts: channel.gifts, price: channel.price })}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.05056 11.514L5.64389 9.65599C5.31689 9.98059 4.9011 10.2011 4.44895 10.2897C3.9968 10.3784 3.52853 10.3312 3.10317 10.1541C2.67782 9.97695 2.31442 9.67787 2.05879 9.29453C1.80316 8.91119 1.66675 8.46075 1.66675 7.99999C1.66675 7.53924 1.80316 7.08879 2.05879 6.70545C2.31442 6.32211 2.67782 6.02304 3.10317 5.84593C3.52853 5.66882 3.9968 5.6216 4.44895 5.71024C4.9011 5.79888 5.31689 6.01939 5.64389 6.34399L9.05056 4.48599C8.93372 3.93782 9.01811 3.3659 9.28829 2.87483C9.55847 2.38376 9.99638 2.00635 10.522 1.81161C11.0475 1.61688 11.6256 1.61784 12.1506 1.81432C12.6755 2.01079 13.1121 2.38965 13.3807 2.88162C13.6492 3.37358 13.7317 3.94578 13.6131 4.49356C13.4944 5.04135 13.1826 5.52812 12.7345 5.86486C12.2864 6.2016 11.7321 6.36581 11.173 6.32746C10.6138 6.2891 10.0871 6.05075 9.68922 5.65599L6.28256 7.51399C6.3507 7.83419 6.3507 8.16513 6.28256 8.48533L9.68922 10.344C10.0871 9.94923 10.6138 9.71088 11.173 9.67253C11.7321 9.63418 12.2864 9.79838 12.7345 10.1351C13.1826 10.4719 13.4944 10.9586 13.6131 11.5064C13.7317 12.0542 13.6492 12.6264 13.3807 13.1184C13.1121 13.6103 12.6755 13.9892 12.1506 14.1857C11.6256 14.3821 11.0475 14.3831 10.522 14.1884C9.99638 13.9936 9.55847 13.6162 9.28829 13.1252C9.01811 12.6341 8.93372 12.0622 9.05056 11.514Z" fill="currentColor"/>
          </svg>
          Share Channel
        </button>

        <a className="product-sheet__btn product-sheet__btn--primary" href={channel.invite_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.81481 14.6667L1.33333 5.77778H14.6667L13.1852 14.6667H2.81481ZM6.51852 10.2222H9.48148C9.69136 10.2222 9.86741 10.1511 10.0096 10.0089C10.1519 9.86667 10.2226 9.69136 10.2222 9.48148C10.2217 9.27161 10.1506 9.09629 10.0089 8.95407C9.86716 8.81185 9.69136 8.74074 9.48148 8.74074H6.51852C6.30864 8.74074 6.13321 8.81185 5.99111 8.95407C5.84901 9.09629 5.77827 9.27161 5.77778 9.48148C5.77728 9.69136 5.84839 9.86692 5.99111 10.0096C6.13383 10.1523 6.30963 10.2232 6.51852 10.2222ZM3.55556 5.03704C3.34568 5.03704 3.16988 4.96593 3.02778 4.8237C2.88568 4.68148 2.81531 4.50568 2.81481 4.2963C2.81432 4.08691 2.88543 3.91111 3.02778 3.76889C3.17012 3.62667 3.34568 3.55556 3.55556 3.55556H12.4444C12.6543 3.55556 12.8304 3.62667 12.9726 3.76889C13.1148 3.91111 13.1856 4.08691 13.1852 4.2963C13.1847 4.50568 13.1136 4.68173 12.9715 4.82444C12.8294 4.96716 12.6543 5.03802 12.4444 5.03704H3.55556ZM5.03704 2.81481C4.82716 2.81481 4.65136 2.7437 4.50926 2.60148C4.36716 2.45926 4.29679 2.28346 4.2963 2.07407C4.2958 1.86469 4.36691 1.68889 4.50926 1.54667C4.65161 1.40444 4.82716 1.33333 5.03704 1.33333H10.9629C10.9629 1.33333 11.1562 1.40444 11.2978 1.54667C11.4393 1.68889 11.5099 1.86469 11.5096 2.07407C11.5093 2.28346 11.4382 2.45951 11.296 2.60222C11.1538 2.74494 10.9778 2.81579 10.7681 2.81481H5.03704Z" fill="currentColor"/>
          </svg>
          Open Channel
        </a>
      </div>

      {showPurchaseActions && (
        <div className="product-sheet__actions">
          {channel?.status === 'reserved' ? (
            <>
              <button className="product-sheet__btn" type="button" onClick={onClose}>Close</button>
              <button className="product-sheet__btn product-sheet__btn--primary" style={{display: 'inline-block'}} type="button">Sell Channel
              </button>
            </>
          ) : channel?.status === 'active' ? (
            <>
              <button className="product-sheet__btn" type="button" onClick={onClose}>Close</button>
              <button className="product-sheet__btn product-sheet__btn--primary" style={{display: 'inline-block'}} type="button">Change Price
                <span className="product-sheet__price">{price} TON</span>
              </button>
            </>
          ) : (
            <>
              <button className="product-sheet__btn" type="button" onClick={handleMakeOffer}>Make Offer</button>
              <button className="product-sheet__btn product-sheet__btn--primary" style={{display: 'inline-block'}} type="button" onClick={handleBuyChannel}>Buy Channel
                <span className="product-sheet__price">{price} TON</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
