import { useTranslation } from 'react-i18next';

interface AcceptOfferConfirmModalProps {
  data?: { 
    id?: string; 
    giftNumber?: string; 
    price?: number;
    offer?: any; // The full offer object
  };
  onClose: () => void;
}

export const AcceptOfferConfirmModal = ({ data, onClose }: AcceptOfferConfirmModalProps) => {
  const { t } = useTranslation();
  const offer = data?.offer;
  const offerPrice = offer?.price || data?.price || 0;
  const isGiftOffer = offer?.type === 'user_gift';
  const offerTitle = isGiftOffer 
    ? `${t('modalsOfferCancel.giftOffer').toUpperCase()} #${offer?.gift_id}` 
    : `${t('modalsOfferCancel.channelOffer').toUpperCase()} #${offer?.channel_id}`;

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">{t('modalsOfferAccept.acceptTheOffer')}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>

      <div className="market-header__panel">
        <div className="market-header__toggle-row" style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:'12px', alignItems:'start'}}>
          <div className="market-header__card-icon" style={{width:24, height:24}}>⏱️</div>
          <div>
            <div className="market-header__row-title" style={{fontWeight:600}}>{t('modalsOfferAccept.areYouSure')}</div>
            <div className="market-header__row-note">
              {t('modalsOfferAccept.acceptOfferConfirm')} <span style={{color:'#2F82C7', fontWeight:700}}>{offerPrice} TON</span> {t('modalsOfferAccept.for')} <span style={{color:'#2F82C7', fontWeight:700}}>{offerTitle}</span>?
            </div>
          </div>
        </div>
      </div>

      <div className="market-header__panel" style={{borderColor:'rgba(93, 62, 63, 1)'}}>
        <div className="market-header__toggle-row" style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:'12px', alignItems:'start'}}>
          <div className="market-header__card-icon" style={{width:24, height:24}}>🛄</div>
          <div>
            <div className="market-header__row-title" style={{fontWeight:600}}>
              {isGiftOffer ? t('modalsOfferAccept.giftTransferRequired') : t('modalsOfferAccept.manualTransferRequired')}
            </div>
            <div className="market-header__row-note" style={{color:'rgba(174, 127, 128, 1)'}}>
              {isGiftOffer 
                ? t('modalsOfferAccept.giftTransferNote')
                : t('modalsOfferAccept.manualTransferNote')
              }
            </div>
          </div>
        </div>
      </div>

      {!isGiftOffer && (
        <button className="offer-modal__submit" type="button" style={{marginTop:8}}>{t('modalsPurchase.openChannel')}</button>
      )}

      <div className="product-sheet__actions" style={{padding:'12px 0 0 0px', borderTop:0}}>
        <button className="product-sheet__btn" type="button" onClick={onClose}>{t('common.close')}</button>
        <button className="product-sheet__btn product-sheet__btn--primary" type="button" onClick={onClose}>{t('modalsOfferAccept.acceptOffer')}</button>
      </div>
    </div>
  );
};



