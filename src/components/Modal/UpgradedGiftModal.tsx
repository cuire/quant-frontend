// import { useModal } from '@/contexts/ModalContext';
import { UpgradedGiftSlugIcon } from '@/components/GiftIcon';
import type { GiftAttribute } from '@/lib/api';
import { getGiftModelIcon } from '@/lib/images';

interface UpgradedGiftModalProps {
  data: {
    giftId: string;
    giftSlug: string;
    model: GiftAttribute;
    backdrop: GiftAttribute;
    symbol: GiftAttribute;
  };
  onClose: () => void;
}

export const UpgradedGiftModal = ({ data, onClose }: UpgradedGiftModalProps) => {
  // const { openModal } = useModal();
  const { giftId, giftSlug, model, backdrop, symbol } = data;

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share gift:', giftSlug);
  };

  const handleView = () => {
    // TODO: Implement view functionality
    console.log('View gift:', giftSlug);
  };

  const handleMakeOffer = () => {
    // TODO: Implement make offer functionality
    console.log('Make offer for gift:', giftSlug);
  };

  const handleBuyGifts = () => {
    // TODO: Implement buy gifts functionality
    console.log('Buy gifts:', giftSlug);
  };

  // Convert rarity from per mille to percentage
  const rarityPercent = ((model.rarity_per_mille / 10) || 0).toFixed(2);

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div className="upgraded-gift-modal__gallery">
          <UpgradedGiftSlugIcon 
            giftSlug={giftSlug}
            size="200"
            className="upgraded-gift-modal__icon"
          />
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>

      {/* Gift Info Section */}
      <div className="upgraded-gift-modal__info">
        <div className="upgraded-gift-modal__info-row">
          <div className="upgraded-gift-modal__info-item">
            <div className="upgraded-gift-modal__info-label">model</div>
            <div className="upgraded-gift-modal__info-value">
              <img 
                src={getGiftModelIcon(giftId, model.value)}
                alt={model.value}
                className="upgraded-gift-modal__info-icon"
              />
            </div>
          </div>
          
          <div className="upgraded-gift-modal__info-item">
            <div className="upgraded-gift-modal__info-label">rarity</div>
            <div className="upgraded-gift-modal__info-value">{rarityPercent}%</div>
          </div>
          
          <div className="upgraded-gift-modal__info-item">
            <div className="upgraded-gift-modal__info-label">floor price</div>
            <div className="upgraded-gift-modal__info-value">
              {model.floor}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#0088CC"/>
                <path d="M5.5 8.5L7.5 6.5L8.5 7.5L10.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 10.5H10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="upgraded-gift-modal__model-name">{model.value}</div>
      </div>

      {/* Backdrop Section */}
      <div className="product-sheet__list">
        <div className="product-sheet__row">
          <div className="product-sheet__row-icon">
            <div 
              className="upgraded-gift-modal__backdrop-preview"
              style={{
                background: `radial-gradient(circle, ${backdrop.value}, ${backdrop.value})`,
              }}
            />
          </div>
          <div className="product-sheet__row-main">
            <div className="product-sheet__row-title">{backdrop.value}</div>
            <div className="product-sheet__row-note">Backdrop • {((backdrop.rarity_per_mille / 10) || 0).toFixed(2)}% • Floor: {backdrop.floor} TON</div>
          </div>
        </div>

        {/* Symbol Section */}
        <div className="product-sheet__row">
          <div className="product-sheet__row-icon">
            <img 
              src={symbol.value} 
              alt={symbol.value}
              className="upgraded-gift-modal__symbol-icon"
            />
          </div>
          <div className="product-sheet__row-main">
            <div className="product-sheet__row-title">{symbol.value}</div>
            <div className="product-sheet__row-note">Symbol • {((symbol.rarity_per_mille / 10) || 0).toFixed(2)}% • Floor: {symbol.floor} TON</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="upgraded-gift-modal__actions">
        <button 
          className="upgraded-gift-modal__btn" 
          type="button"
          onClick={handleView}
        >
          View
        </button>
        
        <button 
          className="upgraded-gift-modal__btn" 
          type="button"
          onClick={handleShare}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.05056 11.514L5.64389 9.65599C5.31689 9.98059 4.9011 10.2011 4.44895 10.2897C3.9968 10.3784 3.52853 10.3312 3.10317 10.1541C2.67782 9.97695 2.31442 9.67787 2.05879 9.29453C1.80316 8.91119 1.66675 8.46075 1.66675 7.99999C1.66675 7.53924 1.80316 7.08879 2.05879 6.70545C2.31442 6.32211 2.67782 6.02304 3.10317 5.84593C3.52853 5.66882 3.9968 5.6216 4.44895 5.71024C4.9011 5.79888 5.31689 6.01939 5.64389 6.34399L9.05056 4.48599C8.93372 3.93782 9.01811 3.3659 9.28829 2.87483C9.55847 2.38376 9.99638 2.00635 10.522 1.81161C11.0475 1.61688 11.6256 1.61784 12.1506 1.81432C12.6755 2.01079 13.1121 2.38965 13.3807 2.88162C13.6492 3.37358 13.7317 3.94578 13.6131 4.49356C13.4944 5.04135 13.1826 5.52812 12.7345 5.86486C12.2864 6.2016 11.7321 6.36581 11.173 6.32746C10.6138 6.2891 10.0871 6.05075 9.68922 5.65599L6.28256 7.51399C6.3507 7.83419 6.3507 8.16513 6.28256 8.48533L9.68922 10.344C10.0871 9.94923 10.6138 9.71088 11.173 9.67253C11.7321 9.63418 12.2864 9.79838 12.7345 10.1351C13.1826 10.4719 13.4944 10.9586 13.6131 11.5064C13.7317 12.0542 13.6492 12.6264 13.3807 13.1184C13.1121 13.6103 12.6755 13.9892 12.1506 14.1857C11.6256 14.3821 11.0475 14.3831 10.522 14.1884C9.99638 13.9936 9.55847 13.6162 9.28829 13.1252C9.01811 12.6341 8.93372 12.0622 9.05056 11.514Z" fill="currentColor"/>
          </svg>
          Share
        </button>
        
        <button 
          className="upgraded-gift-modal__btn" 
          type="button"
          onClick={handleMakeOffer}
        >
          Make Offer
        </button>
        
        <button 
          className="upgraded-gift-modal__btn upgraded-gift-modal__btn--primary" 
          type="button"
          onClick={handleBuyGifts}
        >
          Buy Gifts
        </button>
      </div>
    </div>
  );
};
