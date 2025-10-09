import { purchaseChannel } from '@/lib/api';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/useToast';
import { Link } from '../Link/Link';
import './Modal.css';

interface PurchaseConfirmModalProps {
  onClose: () => void;
  data?: any;
}

export const PurchaseConfirmModal = ({ onClose, data }: PurchaseConfirmModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { warning: showErrorToast } = useToast();

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
      const errorMessage = (error as any)?.message || t('modalsPurchase.purchaseFailed');
      showErrorToast({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const channelPrice = data?.channel?.price || 0;
  const channelInviteLink = data?.channel?.invite_link || '';

  return (
    <div className="purchase-confirm-modal">
      <div className="" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="purchase-confirm-modal__header">
          <div className="purchase-confirm-modal__title">{t('modalsPurchase.confirmPurchase')}</div>
          <button className="purchase-confirm-modal__close" type="button" onClick={onClose}>✕</button>
        </div>
        <div className="purchase-confirm-modal__subtitle">
          {t('modalsPurchase.areYouSure')} <span>{channelPrice} TON</span>?
        </div>
      </div>
      
      <div className="purchase-confirm-modal__content">
        <div className="purchase-confirm-modal__note">
          <div className="purchase-confirm-modal__note-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0002 2H14.0002C14.5307 2 15.0394 2.21071 15.4145 2.58579C15.7895 2.96086 16.0002 3.46957 16.0002 4V6H20.0002C20.5307 6 21.0394 6.21071 21.4145 6.58579C21.7895 6.96086 22.0002 7.46957 22.0002 8V13.53C20.902 12.5429 19.4769 11.9978 18.0002 12C16.9473 12.0008 15.9131 12.2785 15.0013 12.8052C14.0895 13.3319 13.3323 14.0891 12.8055 15.0008C12.2788 15.9125 12.001 16.9468 12.0001 17.9997C11.9991 19.0527 12.2751 20.0874 12.8002 21H4.00024C3.46981 21 2.9611 20.7893 2.58603 20.4142C2.21096 20.0391 2.00024 19.5304 2.00024 19V8C2.00024 6.89 2.89024 6 4.00024 6H8.00024V4C8.00024 2.89 8.89024 2 10.0002 2ZM14.0002 6V4H10.0002V6H14.0002ZM19.0002 18.5V17H15.0002V15H19.0002V13.5L22.0002 16L19.0002 18.5ZM17.0002 19H21.0002V21H17.0002V22.5L14.0002 20L17.0002 17.5V19Z" fill="white"/>
            </svg>
            {t('modalsPurchase.manualTransferRequired')}
          </div>
          
          <div className="purchase-confirm-modal__note-text">
            {t('modalsPurchase.manualTransferNote')}
          </div>
        </div>
        
        <Link 
          className="product-sheet__btn product-sheet__btn--primary" 
          to={channelInviteLink as any}
        >
          {t('modalsPurchase.openChannel')}
        </Link>
      </div>
      
      <div className="purchase-confirm-modal__actions">
        <button 
          className="product-sheet__btn" 
          type="button" 
          onClick={onClose}
        >
          {t('common.close')}
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
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            flexDirection: 'column',
            gap: '0px',
            textAlign: 'center',
          }}
        >
          {isLoading ? t('modalsPurchase.processing') : t('modalsPurchase.buyChannel')}
          <span className="product-sheet__price">{channelPrice} TON</span>
        </a>
      </div>
    </div>
  );
};
