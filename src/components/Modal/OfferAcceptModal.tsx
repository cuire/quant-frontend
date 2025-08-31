import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';

interface AcceptOfferModalProps {
  data?: { id?: string; giftNumber?: string; price?: number };
  onClose: () => void;
}

export const AcceptOfferModal = ({ data, onClose }: AcceptOfferModalProps) => {
  const [amount, setAmount] = useState<string>('500');
  const { openModal } = useModal();

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Accept The Offer {data?.giftNumber ?? (data?.id ? `#${data.id}` : '')}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">OFFER AMOUNT:</div>
        <input 
          className="offer-modal__input" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="offer-modal__balance">YOU WILL RECEIVE: <span style={{color:'#2F82C7'}}>400 TON</span></div>
      </div>
      <button className="offer-modal__submit" type="button" onClick={() => openModal('accept-offer-confirm', data)}>
        Accept Offers
      </button>
    </div>
  );
};



