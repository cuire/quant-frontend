
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

export const CancelOfferModal = ({ data, onClose }: CancelOfferModalProps) => {
  const offer = data?.offer;
  const offerPrice = offer?.price || data?.price || 0;
  const isGiftOffer = offer?.type === 'user_gift';
  const offerTitle = isGiftOffer 
    ? `Gift Offer #${offer?.gift_id}` 
    : `Channel Offer #${offer?.channel_id}`;
  const respondOfferMutation = useRespondOffer();
  const cancelOfferMutation = useCancelOffer();

  return (
    <div className="offer-modal">
      <div className="offer-modal__header">
        <div className="offer-modal__title">Cancel The Offer {data?.giftNumber ?? offerTitle}</div>
        <button className="offer-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      <div className="offer-modal__block">
        <div className="offer-modal__label">OFFER AMOUNT:</div>
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
        <div className="offer-modal__balance">YOU WILL RECEIVE: <span style={{color:'#2F82C7'}}>{offerPrice} TON</span></div>
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
            } else {
              await respondOfferMutation.mutateAsync({ offerId: offer.id, action: 'reject' });
            }
            onClose();
          } catch (e) {
            console.error(e);
          }
        }}
        disabled={respondOfferMutation.isPending || cancelOfferMutation.isPending}
      >
        {respondOfferMutation.isPending || cancelOfferMutation.isPending ? 'Cancelling...' : 'Cancel Offer'}
      </button>
    </div>
  );
};



