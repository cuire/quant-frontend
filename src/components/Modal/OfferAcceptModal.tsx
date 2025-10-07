import { useRespondOffer } from '@/lib/api-hooks';
import { useToast } from '@/hooks/useToast';

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
  const respondOfferMutation = useRespondOffer();
  const { success: showSuccessToast, block: showErrorToast } = useToast();

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
        type="button" 
        onClick={async () => {
          if (!offer?.id) return;
          try {
            await respondOfferMutation.mutateAsync({ offerId: offer.id, action: 'accept' });
            onClose();
            showSuccessToast({ message: 'Offer accepted successfully' });
          } catch (e) {
            console.error(e);
            showErrorToast({ message: 'Failed to accept offer' });
          }
        }}
        disabled={respondOfferMutation.isPending}
      >
        {respondOfferMutation.isPending ? 'Accepting...' : 'Accept Offer'}
      </button>
    </div>
  );
};



