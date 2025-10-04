import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { GiftDetailsModal } from './GiftDetailsModal';
import { UpgradedGiftModal } from './UpgradedGiftModal';
import { OfferModal } from './OfferModal';
import { AcceptOfferModal } from './OfferAcceptModal';
import { AcceptOfferConfirmModal } from './OfferAcceptConfirmModal';
import { CancelOfferModal } from './OfferCancelModal';
import { AddChannelModal } from './AddChannelModal';
import { PurchaseConfirmModal } from './PurchaseConfirmModal';
import { SubscriptionModal } from './SubscriptionModal';
import { SuccessModal } from './SuccessModal';
import { ErrorModal } from './ErrorModal';
import { ParticipatingModal } from './ParticipatingModal';
import { GiftOfferModal } from './GiftOfferModal';
import { SellModal } from './StorageModals';
import { SettingsModal } from './SettingsModal';
import { ReferralModal } from './ReferralModal';
import './Modal.css';

export const Modal = () => {
  const { modalType, modalData, closeModal, openModal } = useModal();
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number } | null>(null);
  const [pointerEnd, setPointerEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Minimum distance for swipe to close modal
  const minSwipeDistance = 50;

  // Handle pointer start
  const handlePointerStart = (e: React.PointerEvent) => {
    // Only handle primary pointer (left mouse button or first touch)
    if (e.isPrimary) {
      setPointerStart({ x: e.clientX, y: e.clientY });
      setPointerEnd(null);
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    // Only handle primary pointer
    if (e.isPrimary && pointerStart) {
      setPointerEnd({ x: e.clientX, y: e.clientY });
      
      // Calculate swipe progress for visual feedback
      const deltaY = e.clientY - pointerStart.y;
      const deltaX = e.clientX - pointerStart.x;
      
      // Only show progress for downward swipes
      if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX)) {
        const progress = Math.min(deltaY / 100, 1); // Normalize to 0-1
        setSwipeProgress(progress);
      } else {
        setSwipeProgress(0);
      }
    }
  };

  // Handle pointer end and detect swipe
  const handlePointerEnd = (e: React.PointerEvent) => {
    // Only handle primary pointer
    if (!e.isPrimary || !pointerStart || !pointerEnd) return;

    const deltaX = pointerEnd.x - pointerStart.x;
    const deltaY = pointerEnd.y - pointerStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check if it's a downward swipe (common for closing modals)
    const isDownwardSwipe = deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX);
    
    // Check if it's a significant swipe gesture
    if (distance > minSwipeDistance && isDownwardSwipe) {
      closeModal();
    }

    // Reset pointer states
    setPointerStart(null);
    setPointerEnd(null);
    setSwipeProgress(0);
  };

  // Reset swipe progress when modal opens
  useEffect(() => {
    if (modalType) {
      setSwipeProgress(0);
      setPointerStart(null);
      setPointerEnd(null);
    }
  }, [modalType]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalType) {
      // Store original styles and scroll position
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = window.getComputedStyle(document.body).position;
      const scrollY = window.scrollY;
      
      // Prevent scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('modal-open');
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.classList.remove('modal-open');
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [modalType]);

  if (!modalType) return null;

  const renderModal = () => {
    switch (modalType) {
      case 'gift-details':
        return <GiftDetailsModal data={modalData} onClose={closeModal} />;
      case 'upgraded-gift':
        return <UpgradedGiftModal data={modalData} onClose={closeModal} />;
      case 'gift-offer':
        return <GiftOfferModal data={modalData} onClose={closeModal} />;
      case 'offer':
        return <OfferModal data={modalData} onClose={closeModal} />;
      case 'accept-offer':
        return <AcceptOfferModal data={modalData} onClose={closeModal} />;
      case 'accept-offer-confirm':
        return <AcceptOfferConfirmModal data={modalData} onClose={closeModal} />;
      case 'cancel-offer':
        return <CancelOfferModal data={modalData} onClose={closeModal} />;
      case 'add-channel':
        return <AddChannelModal onClose={closeModal} />;
      case 'purchase-confirm':
        return <PurchaseConfirmModal data={modalData} onClose={closeModal} />;
      
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
      case 'sell-channel':
        return (
          <SellModal
            itemId={modalData?.itemId || ''}
            itemName={modalData?.itemName || ''}
            floorPrice={modalData?.floorPrice}
            shouldShowDuration={modalData?.shouldShowDuration ?? false}
            defaultPrice={modalData?.defaultPrice}
            changePrice={modalData?.changePrice ?? false}
            onClose={closeModal}
            onSubmit={modalData?.onSubmit || (() => {})}
            type={modalData?.type ?? 'channel'}
          />
        );
      case 'settings':
        return <SettingsModal onClose={closeModal} />;
      case 'referral':
        return <ReferralModal onClose={closeModal} />;
      default:
        return null;
    }
  };

  return createPortal(
    <div 
      ref={overlayRef}
      className="market-header__sheet-overlay" 
      onClick={closeModal}
      onPointerDown={handlePointerStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translateY(${swipeProgress * 20}px)`,
          opacity: 1 - (swipeProgress * 0.3),
          transition: swipeProgress === 0 ? 'transform 0.2s ease, opacity 0.2s ease' : 'none'
        }}
      >
        {renderModal()}
      </div>
    </div>,
    document.body
  );
};
