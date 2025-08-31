interface AcceptOfferConfirmModalProps {
  data?: { id?: string; giftNumber?: string; price?: number };
  onClose: () => void;
}

export const AcceptOfferConfirmModal = ({ data, onClose }: AcceptOfferConfirmModalProps) => {
  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Accept The Offer</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>

      <div className="market-header__panel">
        <div className="market-header__toggle-row" style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:'12px', alignItems:'start'}}>
          <div className="market-header__card-icon" style={{width:24, height:24}}>⏱️</div>
          <div>
            <div className="market-header__row-title" style={{fontWeight:600}}>Are you sure?</div>
            <div className="market-header__row-note">
              Are you sure you want to send an offer for <span style={{color:'#2F82C7', fontWeight:700}}>100 TON</span> for <span style={{color:'#2F82C7', fontWeight:700}}>CHANNEL {data?.giftNumber ?? (data?.id ? `#${data.id}` : '')}</span>, which will last for <span style={{color:'#2F82C7', fontWeight:700}}>7 DAYS</span>?
            </div>
          </div>
        </div>
      </div>

      <div className="market-header__panel" style={{borderColor:'rgba(93, 62, 63, 1)'}}>
        <div className="market-header__toggle-row" style={{display:'grid', gridTemplateColumns:'24px 1fr', gap:'12px', alignItems:'start'}}>
          <div className="market-header__card-icon" style={{width:24, height:24}}>🛄</div>
          <div>
            <div className="market-header__row-title" style={{fontWeight:600}}>Manual transfer is required</div>
            <div className="market-header__row-note" style={{color:'rgba(174, 127, 128, 1)'}}>The channel owner will transfer the owner's rights to you within 1 hour. Please ensure that you are subscribed to this channel.</div>
          </div>
        </div>
      </div>

      <button className="offer-modal__submit" type="button" style={{marginTop:8}}>Open Channel</button>

      <div className="product-sheet__actions" style={{padding:'12px 0 0 0px', borderTop:0}}>
        <button className="product-sheet__btn" type="button" onClick={onClose}>Close</button>
        <button className="product-sheet__btn product-sheet__btn--primary" type="button" onClick={onClose}>Accept Offer</button>
      </div>
    </div>
  );
};



