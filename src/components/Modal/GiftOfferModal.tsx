import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [offerDuration, setOfferDuration] = useState<'1d' | '1w' | 'forever'>('1w');
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUser();
  const offerGiftMutation = useOfferGift();
  const { success: showSuccessToast, warning: showErrorToast } = useToast();
  
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
      showErrorToast({ message: t('modalsOffer.offerPriceMin') });
      return;
    }
    
    if (offerPriceNum > userBalance) {
      showErrorToast({ message: t('modalsOffer.insufficientBalance') });
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
      showSuccessToast({ message: t('modalsOffer.offerSentSuccess') });
      onClose();
    } catch (error) {
      console.error('Failed to create offer:', error);
      const errorMessage = (error as any)?.message || t('modalsOffer.offerSendFailed');
      showErrorToast({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">{t('modalsOffer.makeAnOffer')}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">{t('modalsOffer.offerPriceInTon')}</div>
        <input 
          className="offer-modal__input" 
          placeholder={t('modalsOffer.enterOfferPriceMin')}
          value={offerPrice} 
          onChange={(e) => setOfferPrice(e.target.value)} 
          type="number"
          min="1"
          step="0.1"
        />
        <div className="offer-modal__balance">{t('modalsOffer.yourBalance')}{" "}
          <span style={{color:'#2F82C7'}}>{user?.balance} TON</span></div>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">{t('modalsOffer.offerDuration')}</div>
        <div className="offer-modal__segmented">
          <button 
            type="button" 
            className={offerDuration === '1d' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('1d')}
          >
            {t('modalsOffer.oneDay')}
          </button>
          <button 
            type="button" 
            className={offerDuration === '1w' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('1w')}
          >
            {t('modalsOffer.oneWeek')}
          </button>
          <button 
            type="button" 
            className={offerDuration === 'forever' ? 'is-active' : ''} 
            onClick={() => setOfferDuration('forever')}
          >
            {t('modalsOffer.forever')}
          </button>
        </div>
      </div>
      <button 
        className="offer-modal__submit" 
        type="button" 
        onClick={handleSendOffer}
        disabled={isLoading || !isOfferValid()}
      >
        {isLoading ? t('modalsStorage.sending') : t('modalsOffer.sendOffer')}
      </button>
    </div>
  );
};
