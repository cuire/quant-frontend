import { useModal } from '@/contexts/ModalContext';
import { UpgradedGiftSlugIcon } from '@/components/GiftIcon';
import type { GiftAttribute } from '@/lib/api';
import { getGiftModelIcon, getSymbolIcon } from '@/lib/images';
import { usePurchaseGift } from '@/lib/api-hooks';
import { useToast } from '@/hooks/useToast';
import { CountdownTimer } from '@/components/CountdownTimer';
import './Modal.css';
import { shareGift } from '@/helpers/shareUtils';
import { getChannelPrice } from '@/helpers/priceUtils';

interface UpgradedGiftModalProps {
  data: {
    id: string;
    giftId: string;
    giftSlug: string;
    price: number;
    model: GiftAttribute;
    backdrop: GiftAttribute & { centerColor: string; edgeColor: string };
    symbol: GiftAttribute;
    name: string;
    num: string;
    gift_frozen_until?: string;
    hideActions?: boolean;
  };
  onClose: () => void;
}

export const UpgradedGiftModal = ({ data, onClose }: UpgradedGiftModalProps) => {
  const { openModal } = useModal();
  const { id, giftId, giftSlug, price, model, backdrop, symbol } = data;
  const purchaseGiftMutation = usePurchaseGift();
  const { success: showSuccessToast, block: showErrorToast } = useToast();
  
  // Check if gift is not upgraded
  const isNotUpgraded = giftSlug === 'None-None';
  const formattedPrice = getChannelPrice(price);

  const handleMakeOffer = () => {
    openModal('gift-offer', {
      giftId: id,
      giftSlug,
      price
    });
  };

  const handleBuyGifts = async () => {
    try {
      await purchaseGiftMutation.mutateAsync({ giftId: id, price });
      showSuccessToast({ message: 'Gift purchased successfully!' });
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      showErrorToast({ message: 'Failed to purchase gift. Please try again.' });
    }
  };

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div className="upgraded-gift-modal__gallery">
          {giftSlug && giftSlug !== 'None-None' ? (
            <UpgradedGiftSlugIcon 
              giftSlug={giftSlug}
              size="200"
              className="upgraded-gift-modal__icon"
              title={data.name}
              subtitle={'#' + data.num}
            />
          ) : (
            <div className="upgraded-gift-modal__icon" style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={`https://FlowersRestricted.github.io/gifts/${giftId}/default.png`}
                alt={data.name}
                width="140"
                height="140"
                
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-gift.svg';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 14,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: '100%',
                padding: '4px'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.2
                }}>
                  {data.name}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#ffffff65',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  marginTop: '2px'
                }}>
                  {'#' + data.num}
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>

      <div className="product-sheet__list">
        {/* Model Section */}
        {!isNotUpgraded && (
        <div className="product-sheet__row">
          <div className="product-sheet__row-icon">
            <img 
              src={getGiftModelIcon(giftId, model.value)}
              alt={model.value}
              className="upgraded-gift-modal__model-icon"
            />
          </div>
          <div className="product-sheet__row-main">
            <div className="product-sheet__row-note">Model</div>
            <div className="product-sheet__row-title">
              {model.value}
              <span className="product-sheet__row-rarity">{((model.rarity_per_mille / 10) || 0).toFixed(2)}%</span>
            </div>
          </div>
          <div className="upgraded-gift-modal__row-price">
            <div className="upgraded-gift-modal__row-price">
              {model.floor}
            </div>
            <svg className={'diamond-icon'} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
            </svg>
          </div>
        </div>
        )}
    
        {/* Backdrop Section */}
        {!isNotUpgraded && (
        <div className="product-sheet__row">
          <div className="product-sheet__row-icon">
            <div 
              className="upgraded-gift-modal__backdrop-preview"
              style={{
                background: `radial-gradient(circle, #${backdrop.centerColor}, #${backdrop.edgeColor})`,
              }}
            />
          </div>
          <div className="product-sheet__row-main">
            <div className="product-sheet__row-note">Backdrop</div>
            <div className="product-sheet__row-title">
              {backdrop.value}
              <span className="product-sheet__row-rarity">{((backdrop.rarity_per_mille / 10) || 0).toFixed(2)}%</span>
            </div>
          </div>
          <div className="upgraded-gift-modal__row-price">
            <div className="upgraded-gift-modal__row-price">
              {backdrop.floor}
            </div>
            <svg className={'diamond-icon'} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
            </svg>
          </div>
        </div>
        )}
        
        {/* Symbol Section */}
        {!isNotUpgraded && (
        <div className="product-sheet__row">
          <div className="product-sheet__row-icon">
              <img 
                src={getSymbolIcon(symbol.value)} 
                alt={symbol.value}
                className="upgraded-gift-modal__symbol-icon"
              />
          </div>
          <div className="product-sheet__row-main">
            <div className="product-sheet__row-note">Symbol</div>
            <div className="product-sheet__row-title">
              {symbol.value}
              <span className="product-sheet__row-rarity">{((symbol.rarity_per_mille / 10) || 0).toFixed(2)}%</span>
            </div>
          </div>
          <div className="upgraded-gift-modal__row-price">
            <div className="upgraded-gift-modal__row-price">
              {symbol.floor}
            </div>
            <svg className={'diamond-icon'} width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.915 2.31099L6.62167 10.7402C6.5571 10.8426 6.46755 10.9269 6.36145 10.9852C6.25534 11.0435 6.13616 11.0738 6.0151 11.0734C5.89403 11.073 5.77506 11.0418 5.66936 10.9828C5.56366 10.9238 5.4747 10.8388 5.41083 10.736L0.221667 2.30765C0.0765355 2.07125 -0.000196165 1.79922 3.76621e-07 1.52182C0.0065815 1.11219 0.175416 0.721902 0.469449 0.436618C0.763481 0.151334 1.15869 -0.00563721 1.56833 0.000154777H10.5825C11.4433 0.000154777 12.1433 0.679321 12.1433 1.51849C12.1428 1.7988 12.0637 2.07335 11.915 2.31099ZM1.49667 2.02932L5.3575 7.98265V1.42932H1.9C1.5 1.42932 1.32167 1.69349 1.49667 2.02932ZM6.78583 7.98265L10.6467 2.02932C10.825 1.69349 10.6433 1.42932 10.2433 1.42932H6.78583V7.98265Z" fill="white"/>
            </svg>
          </div>
        </div>
        )}

        {/* Frozen/Unlock Section */}
        {data.gift_frozen_until && new Date(data.gift_frozen_until) > new Date() && (
          <div className="product-sheet__row">
            <div className="product-sheet__row-icon">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9998 5.00006C28.2843 5.00006 34.9998 11.7156 34.9998 20.0001C34.9998 28.2846 28.2843 35.0001 19.9998 35.0001C11.7153 35.0001 4.99976 28.2846 4.99976 20.0001C4.99976 11.7156 11.7153 5.00006 19.9998 5.00006ZM19.9998 11.0001C19.6019 11.0001 19.2204 11.1581 18.9391 11.4394C18.6578 11.7207 18.4998 12.1022 18.4998 12.5001V20.0001C18.4998 20.3979 18.6579 20.7793 18.9393 21.0606L23.4393 25.5606C23.7222 25.8338 24.1011 25.985 24.4944 25.9816C24.8877 25.9782 25.2639 25.8204 25.542 25.5423C25.8201 25.2642 25.9778 24.888 25.9813 24.4947C25.9847 24.1014 25.8335 23.7225 25.5603 23.4396L21.4998 19.3791V12.5001C21.4998 12.1022 21.3417 11.7207 21.0604 11.4394C20.7791 11.1581 20.3976 11.0001 19.9998 11.0001Z" fill="white"/>
              </svg>
            </div>
            <div className="product-sheet__row-main">
              <div className="product-sheet__row-note">Unlock</div>
              <div className="product-sheet__row-title">
                <CountdownTimer endTime={data.gift_frozen_until} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="product-sheet__actions">
        {!isNotUpgraded && (
          <a 
            className="product-sheet__btn" 
            type="button"
            href={`https://t.me/nft/${giftSlug}`}
            style={{textDecoration: 'none'}}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        )}
        
        <button 
          className="product-sheet__btn" 
          type="button"
          onClick={() => {
            shareGift(id);
          }}
          style={isNotUpgraded  ? { gridColumn: '1 / -1' } : undefined}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.05056 11.514L5.64389 9.65599C5.31689 9.98059 4.9011 10.2011 4.44895 10.2897C3.9968 10.3784 3.52853 10.3312 3.10317 10.1541C2.67782 9.97695 2.31442 9.67787 2.05879 9.29453C1.80316 8.91119 1.66675 8.46075 1.66675 7.99999C1.66675 7.53924 1.80316 7.08879 2.05879 6.70545C2.31442 6.32211 2.67782 6.02304 3.10317 5.84593C3.52853 5.66882 3.9968 5.6216 4.44895 5.71024C4.9011 5.79888 5.31689 6.01939 5.64389 6.34399L9.05056 4.48599C8.93372 3.93782 9.01811 3.3659 9.28829 2.87483C9.55847 2.38376 9.99638 2.00635 10.522 1.81161C11.0475 1.61688 11.6256 1.61784 12.1506 1.81432C12.6755 2.01079 13.1121 2.38965 13.3807 2.88162C13.6492 3.37358 13.7317 3.94578 13.6131 4.49356C13.4944 5.04135 13.1826 5.52812 12.7345 5.86486C12.2864 6.2016 11.7321 6.36581 11.173 6.32746C10.6138 6.2891 10.0871 6.05075 9.68922 5.65599L6.28256 7.51399C6.3507 7.83419 6.3507 8.16513 6.28256 8.48533L9.68922 10.344C10.0871 9.94923 10.6138 9.71088 11.173 9.67253C11.7321 9.63418 12.2864 9.79838 12.7345 10.1351C13.1826 10.4719 13.4944 10.9586 13.6131 11.5064C13.7317 12.0542 13.6492 12.6264 13.3807 13.1184C13.1121 13.6103 12.6755 13.9892 12.1506 14.1857C11.6256 14.3821 11.0475 14.3831 10.522 14.1884C9.99638 13.9936 9.55847 13.6162 9.28829 13.1252C9.01811 12.6341 8.93372 12.0622 9.05056 11.514Z" fill="currentColor"/>
          </svg>
          Share
        </button>
        
        {!data.hideActions && (
          <>
            <button 
              className="product-sheet__btn" 
              type="button"
              onClick={handleMakeOffer}
            >
              Make Offer
            </button>
            
            <button 
              className="product-sheet__btn product-sheet__btn--primary" 
              style={{display: 'inline-block'}}
              type="button"
              onClick={handleBuyGifts}
              disabled={purchaseGiftMutation.isPending}
            >
              {purchaseGiftMutation.isPending ? 'Purchasing...' : 'Buy Gifts'}
              <span className="product-sheet__price">{formattedPrice} TON</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
