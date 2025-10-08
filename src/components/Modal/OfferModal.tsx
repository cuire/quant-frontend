import { useUser } from '@/lib/api-hooks';
import { createOffer } from '@/lib/api';
import { useState } from 'react';

interface OfferModalProps {
  onClose: () => void;
  data?: any;
}

export const OfferModal = ({ onClose, data }: OfferModalProps) => {
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerDuration, setOfferDuration] = useState<'1d' | '1w' | 'forever'>('1w');
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();
  
  // Check if offer is valid
  const isOfferValid = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) return false;
    const offerPriceNum = Number(offerPrice);
    const channelPrice = data?.channel?.price;
    const userBalance = user?.balance || 0;
    
    return channelPrice && 
           offerPriceNum >= 1 && // Minimum 1 TON
           offerPriceNum < channelPrice && 
           offerPriceNum <= userBalance;
  };
  
  const handleSendOffer = async () => {
    if (!data?.channel?.id) {
      console.error('No channel ID provided');
      return;
    }

    if (!offerPrice || isNaN(Number(offerPrice))) {
      console.error('Invalid price');
      return;
    }

    const offerPriceNum = Number(offerPrice);
    const channelPrice = data.channel.price;

    if (offerPriceNum < 1) {
      console.error('Offer price must be at least 1 TON');
      return;
    }

    if (offerPriceNum >= channelPrice) {
      console.error('Offer price must be less than channel price');
      return;
    }

    const userBalance = user?.balance || 0;
    if (offerPriceNum > userBalance) {
      console.error('Insufficient balance');
      return;
    }

    const durationDays = offerDuration === '1d' ? 1 : offerDuration === '1w' ? 7 : 365;

    const gifts = data.channel.gifts || {};

    setIsLoading(true);
    try {
      await createOffer(
        data.channel.id,
        offerPriceNum,
        gifts,
        'Europe/Moscow',
        durationDays
      );
    } catch (error) {
      console.error('Failed to create offer:', error);
      // TODO: Send a toast with error message
    } finally {
      setIsLoading(false);
      onClose();
    }
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
          placeholder="Enter offer price (min 1 TON)" 
          value={offerPrice} 
          onChange={(e) => setOfferPrice(e.target.value)} 
          type="number"
          min="1"
          step="0.1"
        />
        <div className="offer-modal__balance">YOUR BALANCE:{" "}
          <span style={{color:'#2F82C7'}}>{user?.balance} TON</span></div>
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
      <button 
        className="offer-modal__submit" 
        type="button" 
        onClick={handleSendOffer}
        disabled={isLoading || !isOfferValid()}
      >
        {isLoading ? 'Sending...' : 'Send Offer'}
      </button>
    </div>
  );
};
