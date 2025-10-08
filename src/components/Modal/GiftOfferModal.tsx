import { useUser } from '@/lib/api-hooks';
import { useOfferGift } from '@/lib/api-hooks';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

interface GiftOfferModalProps {
  onClose: () => void;
  data?: {
    giftId: string;
    giftSlug: string;
    price: number;
  };
}

export const GiftOfferModal = ({ onClose, data }: GiftOfferModalProps) => {
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerDuration, setOfferDuration] = useState<'1d' | '1w' | 'forever'>('1w');
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();
  const offerGiftMutation = useOfferGift();
  const { success: showSuccessToast, block: showErrorToast } = useToast();
  
  // Check if offer is valid
  const isOfferValid = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) return false;
    const offerPriceNum = Number(offerPrice);
    const userBalance = user?.balance || 0;
    
    return offerPriceNum >= 1 && // Minimum 1 TON
           offerPriceNum <= userBalance;
  };
  
  const handleSendOffer = async () => {
    if (!data?.giftId) {
      console.error('No gift ID provided');
      return;
    }

    if (!offerPrice || isNaN(Number(offerPrice))) {
      console.error('Invalid price');
      return;
    }

    const offerPriceNum = Number(offerPrice);
    const userBalance = user?.balance || 0;
    
    if (offerPriceNum < 1) {
      showErrorToast({ message: 'Offer price must be at least 1 TON' });
      return;
    }
    
    if (offerPriceNum > userBalance) {
      showErrorToast({ message: 'Insufficient balance' });
      return;
    }

    const durationDays = offerDuration === '1d' ? 1 : offerDuration === '1w' ? 7 : 365;

    setIsLoading(true);
    try {
      await offerGiftMutation.mutateAsync({
        giftId: data.giftId,
        price: offerPriceNum,
        duration_days: durationDays
      });
      showSuccessToast({ message: 'Offer sent successfully!' });
      onClose();
    } catch (error) {
      console.error('Failed to create offer:', error);
      showErrorToast({ message: 'Failed to send offer. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Make an offer</div>
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
