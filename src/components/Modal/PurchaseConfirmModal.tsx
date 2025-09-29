import { purchaseChannel } from '@/lib/api';
import { useState } from 'react';

interface PurchaseConfirmModalProps {
  onClose: () => void;
  data?: any;
}

export const PurchaseConfirmModal = ({ onClose, data }: PurchaseConfirmModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!data?.channel?.id) {
      console.error('No channel ID provided');
      return;
    }

    const channelPrice = data.channel.price;
    const gifts = data.channel.gifts || {};

    setIsLoading(true);
    try {
      await purchaseChannel(
        data.channel.id,
        channelPrice,
        gifts,
        'Europe/Moscow'
      );
      onClose();
    } catch (error) {
      console.error('Failed to purchase channel:', error);
      // TODO: Send a toast with error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChannel = () => {
    if (data?.channel?.username) {
      window.open(`https://t.me/${data.channel.username}`, '_blank');
    }
  };

  const channelPrice = data?.channel?.price || 0;

  return (
    <div className="purchase-confirm-modal">
      <div className="purchase-confirm-modal__header">
        <div className="purchase-confirm-modal__title">Confirm purchase</div>
        <button className="purchase-confirm-modal__close" type="button" onClick={onClose}>✕</button>
      </div>
      
      <div className="purchase-confirm-modal__content">
        <div className="purchase-confirm-modal__subtitle">
          Are you sure you want to buy this channel for {channelPrice} TON?
        </div>
        
        <div className="purchase-confirm-modal__text">
          Manual transfer is required. The channel owner will transfer the owner's rights to you within 1 hour. Please ensure that you are subscribed to this channel.
        </div>
        
        <button 
          className="product-sheet__btn" 
          type="button" 
          onClick={handleOpenChannel}
          style={{ marginBottom: '16px' }}
        >
          Open channel
        </button>
      </div>
      
      <div className="purchase-confirm-modal__actions">
        <button 
          className="product-sheet__btn" 
          type="button" 
          onClick={onClose}
        >
          Close
        </button>
        <a 
          className="product-sheet__btn product-sheet__btn--primary" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (!isLoading) {
              handlePurchase();
            }
          }}
          style={{ 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Processing...' : `Buy channel`}
          <span className="product-sheet__price">{channelPrice} TON</span>
        </a>
      </div>
    </div>
  );
};
