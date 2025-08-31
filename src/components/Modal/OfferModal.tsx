import { useState } from 'react';

interface OfferModalProps {
  data: any;
  onClose: () => void;
}

export const OfferModal = ({ data, onClose }: OfferModalProps) => {
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerDuration, setOfferDuration] = useState<'1d' | '1w' | 'forever'>('1d');

  const handleSendOffer = () => {
    // Handle offer submission logic here
    onClose();
  };

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Your suggestion</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">OFFER PRICE IN TON</div>
        <input 
          className="offer-modal__input" 
          placeholder="Enter offer price" 
          value={offerPrice} 
          onChange={(e) => setOfferPrice(e.target.value)} 
        />
        <div className="offer-modal__balance">YOUR BALANCE: 0 TON</div>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">OFFER DURATION</div>
        <div className="offer-modal__segmented">
          <button 
            type="button" 
            className={offerDuration === '1d' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('1d')}
          >
            1 Day
          </button>
          <button 
            type="button" 
            className={offerDuration === '1w' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('1w')}
          >
            1 Week
          </button>
          <button 
            type="button" 
            className={offerDuration === 'forever' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('forever')}
          >
            Forever
          </button>
        </div>
      </div>
      <button className="offer-modal__submit" type="button" onClick={handleSendOffer}>
        Send Offer
      </button>
    </div>
  );
};
