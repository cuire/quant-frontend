import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { GiftDetailsModal } from './GiftDetailsModal';
import { OfferModal } from './OfferModal';
import './Modal.css';

export const Modal = () => {
  const { modalType, modalData, closeModal } = useModal();

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
      default:
        return null;
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {renderModal()}
      </div>
    </div>,
    document.body
  );
};
