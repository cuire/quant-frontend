import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { GiftDetailsModal } from './GiftDetailsModal';
import { OfferModal } from './OfferModal';
import { AcceptOfferModal } from './OfferAcceptModal';
import { AcceptOfferConfirmModal } from './OfferAcceptConfirmModal';
import { CancelOfferModal } from './OfferCancelModal';
import { AddChannelModal } from './AddChannelModal';
import { SubscriptionModal } from './SubscriptionModal';
import { SuccessModal } from './SuccessModal';
import { ErrorModal } from './ErrorModal';
import { ParticipatingModal } from './ParticipatingModal';
import './Modal.css';

export const Modal = () => {
  const { modalType, modalData, closeModal, openModal } = useModal();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalType) {
      // Store original styles
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = window.getComputedStyle(document.body).position;
      
      // Prevent scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.classList.add('modal-open');
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.classList.remove('modal-open');
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [modalType]);

  if (!modalType) return null;

  const renderModal = () => {
    switch (modalType) {
      case 'gift-details':
        return <GiftDetailsModal data={modalData} onClose={closeModal} />;
      case 'offer':
        return <OfferModal onClose={closeModal} />;
      case 'accept-offer':
        return <AcceptOfferModal data={modalData} onClose={closeModal} />;
      case 'accept-offer-confirm':
        return <AcceptOfferConfirmModal data={modalData} onClose={closeModal} />;
      case 'cancel-offer':
        return <CancelOfferModal data={modalData} onClose={closeModal} />;
      case 'add-channel':
        return <AddChannelModal onClose={closeModal} />;
      case 'subscription':
        return (
          <SubscriptionModal 
            onClose={closeModal} 
            onNext={() => {
              // Handle next action - open success modal
              openModal('success', { ticketCount: 25 });
            }}
            onSubscribe={(subscriptionId) => {
              // Handle subscribe action
              console.log('Subscribe to:', subscriptionId);
            }}
            subscriptions={modalData?.subscriptions}
          />
        );
      case 'success':
        return (
          <SuccessModal 
            onClose={closeModal}
            ticketCount={modalData?.ticketCount}
          />
        );
      case 'error':
        return (
          <ErrorModal 
            onClose={closeModal}
          />
        );
      case 'participating':
        return (
          <ParticipatingModal 
            onClose={closeModal}
            ticketCount={modalData?.ticketCount}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <div className="market-header__sheet-overlay" onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()}>
        {renderModal()}
      </div>
    </div>,
    document.body
  );
};
