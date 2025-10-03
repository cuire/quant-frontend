import { useState } from 'react';

interface CancelOfferModalProps {
  data?: { 
    id?: string; 
    giftNumber?: string; 
    price?: number;
    offer?: any; // The full offer object
  };
  onClose: () => void;
}

export const CancelOfferModal = ({ data, onClose }: CancelOfferModalProps) => {
  const [amount, setAmount] = useState<string>('500');
  const offer = data?.offer;
  const offerPrice = offer?.price || data?.price || 0;
  const isGiftOffer = offer?.type === 'user_gift';
  const offerTitle = isGiftOffer 
    ? `Gift Offer #${offer?.gift_id}` 
    : `Channel Offer #${offer?.channel_id}`;

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Cancel The Offer {data?.giftNumber ?? offerTitle}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">OFFER AMOUNT:</div>
        <input 
          className="offer-modal__input" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="offer-modal__balance">YOU WILL RECEIVE: <span style={{color:'#2F82C7'}}>{offerPrice} TON</span></div>
      </div>
      <button className="offer-modal__submit" style={{background:'rgba(80, 52, 52, 1)', color:'rgba(255, 125, 127, 1)'}} type="button" onClick={onClose}>
        Cancel Offer
      </button>
    </div>
  );
};



