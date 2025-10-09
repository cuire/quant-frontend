import { useTranslation } from 'react-i18next';

interface CancelOfferModalProps {
  data?: { 
    id?: string; 
    giftNumber?: string; 
    price?: number;
    offer?: any; // The full offer object
    offerSide?: 'received' | 'placed';
  };
  onClose: () => void;
}

import { useCancelOffer, useRespondOffer } from '@/lib/api-hooks';
import { useToast } from '@/hooks/useToast';

export const CancelOfferModal = ({ data, onClose }: CancelOfferModalProps) => {
  const { t } = useTranslation();
  const offer = data?.offer;
  const offerPrice = offer?.price || data?.price || 0;
  const isGiftOffer = offer?.type === 'user_gift';
  const offerTitle = isGiftOffer 
    ? `${t('modalsOfferCancel.giftOffer')} #${offer?.gift_id}` 
    : `${t('modalsOfferCancel.channelOffer')} #${offer?.channel_id}`;
  const respondOfferMutation = useRespondOffer();
  const cancelOfferMutation = useCancelOffer();
  const { success: showSuccessToast, block: showErrorToast } = useToast();

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">{t('modalsOfferCancel.cancelTheOffer')} {data?.giftNumber ?? offerTitle}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">{t('modalsOfferAccept.offerAmount')}</div>
        <div 
          style={{
            background: '#344655',
            height: '50px',
            width: '100%',
            borderRadius: '12px',
            color: '#FFFFFF',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            boxSizing: 'border-box',
            marginTop: '6px'
          }}
        >
          {offerPrice} TON
        </div>
        <div className="offer-modal__balance">{t('modalsOfferAccept.youWillReceive')} <span style={{color:'#2F82C7'}}>{offerPrice} TON</span></div>
      </div>
      <button 
        className="offer-modal__submit" 
        style={{background:'rgba(80, 52, 52, 1)', color:'rgba(255, 125, 127, 1)'}} 
        type="button" 
        onClick={async () => {
          if (!offer?.id) return;
          try {
            if (data?.offerSide === 'placed') {
              await cancelOfferMutation.mutateAsync(offer.id);
              showSuccessToast({ message: t('modalsOfferCancel.offerCancelledSuccess') });
            } else {
              await respondOfferMutation.mutateAsync({ offerId: offer.id, action: 'reject' });
              showSuccessToast({ message: t('modalsOfferCancel.offerRejectedSuccess') });
            }
            onClose();
          } catch (e) {
            console.error(e);
            const errorMessage = (e as any)?.message || t('modalsOfferCancel.offerCancelFailed');
            showErrorToast({ message: errorMessage });
          }
        }}
        disabled={respondOfferMutation.isPending || cancelOfferMutation.isPending}
      >
        {respondOfferMutation.isPending || cancelOfferMutation.isPending ? t('modalsOfferCancel.cancelling') : t('modalsOfferCancel.cancelOffer')}
      </button>
    </div>
  );
};



