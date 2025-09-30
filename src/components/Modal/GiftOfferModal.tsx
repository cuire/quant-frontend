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
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();
  const offerGiftMutation = useOfferGift();
  const { success: showSuccessToast, block: showErrorToast } = useToast();
  
  // Check if offer is valid
  const isOfferValid = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) return false;
    const offerPriceNum = Number(offerPrice);
    const giftPrice = data?.price || 0;
    const userBalance = user?.balance || 0;
    
    return offerPriceNum > 0 && 
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
    
    if (offerPriceNum > userBalance) {
      showErrorToast({ message: 'Insufficient balance' });
      return;
    }

    setIsLoading(true);
    try {
      await offerGiftMutation.mutateAsync({
        giftId: data.giftId,
        price: offerPriceNum
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
          placeholder="Enter offer price" 
          value={offerPrice} 
          onChange={(e) => setOfferPrice(e.target.value)} 
        />
        <div className="offer-modal__balance">YOUR BALANCE:{" "}
          <span style={{color:'#2F82C7'}}>{user?.balance} TON</span></div>
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
