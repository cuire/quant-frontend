import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';

interface AcceptOfferModalProps {
  data?: { 
    id?: string; 
    giftNumber?: string; 
    price?: number;
    offer?: any; // The full offer object
  };
  onClose: () => void;
}

export const AcceptOfferModal = ({ data, onClose }: AcceptOfferModalProps) => {
  const [amount, setAmount] = useState<string>('500');
  const { openModal } = useModal();

  const offer = data?.offer;
  const offerPrice = offer?.price || data?.price || 0;
  const isGiftOffer = offer?.type === 'user_gift';
  const offerTitle = isGiftOffer 
    ? `Gift Offer #${offer?.gift_id}` 
    : `Channel Offer #${offer?.channel_id}`;

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Accept The Offer {data?.giftNumber ?? offerTitle}</div>
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
      <button className="offer-modal__submit" type="button" onClick={() => openModal('accept-offer-confirm', data)}>
        Accept Offer
      </button>
    </div>
  );
};



