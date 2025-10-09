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
import { AddGiftModal } from './AddGiftModal.tsx';
import { AddGiftPreMarketModal } from './AddGiftPreMarketModal.tsx';
import { AddGiftInstructionsModal } from './AddGiftInstructionsModal.tsx';
import { PurchaseConfirmModal } from './PurchaseConfirmModal';
import { SubscriptionModal } from './SubscriptionModal';
import { SuccessModal } from './SuccessModal';
import { ErrorModal } from './ErrorModal';
import { ParticipatingModal } from './ParticipatingModal';
import { GiftOfferModal } from './GiftOfferModal';
import { SellModal, SendGiftModal, ReceiveGiftModal } from './StorageModals';
import { SettingsModal } from './SettingsModal';
import { ReferralModal } from './ReferralModal';
import { GuideModal } from './GuideModal';
import { ProfileStatsModal } from './ProfileStatsModal.tsx';
import './Modal.css';

export const Modal = () => {
  const { modalType, modalData, closeModal, openModal } = useModal();
  const [pointerStart, setPointerStart] = useState<{ x: number; y: number; fromHeader: boolean } | null>(null);
  const [pointerEnd, setPointerEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Minimum distance for swipe to close modal (increased to prevent accidental closes)
  const minSwipeDistance = 100;
  
  // Animation thresholds for different visual feedback levels
  const animationThresholds = {
    start: 20,      // Start showing subtle animation
    progress: 50,   // More noticeable animation
    commit: 80,     // Strong visual feedback indicating close will happen
    close: 100      // Actual close threshold
  };

  // Debug option to show/hide swipe progress indicator
  const showSwipeProgressDebug = false;

  // Handle pointer start
  const handlePointerStart = (e: React.PointerEvent) => {
    // Only handle primary pointer (left mouse button or first touch)
    if (e.isPrimary) {
      // Check if the pointer started from the modal header
      const target = e.target as HTMLElement;
      const isFromHeader = target.closest('.product-sheet__header') !== null;
      
      setPointerStart({ x: e.clientX, y: e.clientY, fromHeader: isFromHeader });
      setPointerEnd(null);
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent) => {
    // Only handle primary pointer and only if started from header
    if (e.isPrimary && pointerStart && pointerStart.fromHeader) {
      setPointerEnd({ x: e.clientX, y: e.clientY });
      
      // Calculate swipe progress for visual feedback
      const deltaY = e.clientY - pointerStart.y;
      const deltaX = e.clientX - pointerStart.x;
      
      // Only show progress for downward swipes
      if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX)) {
        // Calculate progress based on thresholds
        let progress = 0;
        
        if (deltaY >= animationThresholds.start) {
          // Start with subtle animation
          progress = Math.min((deltaY - animationThresholds.start) / (animationThresholds.progress - animationThresholds.start), 0.3);
        }
        
        if (deltaY >= animationThresholds.progress) {
          // More noticeable animation
          progress = 0.3 + Math.min((deltaY - animationThresholds.progress) / (animationThresholds.commit - animationThresholds.progress), 0.4) * 0.7;
        }
        
        if (deltaY >= animationThresholds.commit) {
          // Strong visual feedback
          progress = 0.7 + Math.min((deltaY - animationThresholds.commit) / (animationThresholds.close - animationThresholds.commit), 0.3);
        }
        
        setSwipeProgress(Math.min(progress, 1));
      } else {
        setSwipeProgress(0);
      }
    }
  };

  // Handle pointer end and detect swipe
  const handlePointerEnd = (e: React.PointerEvent) => {
    // Only handle primary pointer and only if started from header
    if (!e.isPrimary || !pointerStart || !pointerEnd || !pointerStart.fromHeader) {
      // Reset states even if conditions aren't met
      setPointerStart(null);
      setPointerEnd(null);
      setSwipeProgress(0);
      return;
    }

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
      case 'add-gift':
        return <AddGiftModal onClose={closeModal} />;
      case 'add-gift-premarket':
        return <AddGiftPreMarketModal onClose={closeModal} />;
      case 'add-gift-instructions':
        return <AddGiftInstructionsModal onClose={closeModal} type={modalData?.type || 'upgraded'} />;
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
      case 'send-gift':
        return (
          <SendGiftModal
            giftId={modalData?.giftId || ''}
            giftName={modalData?.giftName || ''}
            onClose={closeModal}
            onSuccess={modalData?.onSuccess || (() => {})}
          />
        );
      case 'receive-gift':
        return (
          <ReceiveGiftModal
            giftId={modalData?.giftId || ''}
            giftName={modalData?.giftName || ''}
            onClose={closeModal}
            onSuccess={modalData?.onSuccess || (() => {})}
          />
        );
      case 'settings':
        return <SettingsModal onClose={closeModal} />;
      case 'referral':
        return <ReferralModal onClose={closeModal} />;
      case 'profile-stats':
        return <ProfileStatsModal onClose={closeModal} data={modalData} />;
      case 'guide':
        return <GuideModal onClose={closeModal} />;
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
          transform: `translateY(${swipeProgress * 30}px) scale(${1 - (swipeProgress * 0.05)})`,
          opacity: 1 - (swipeProgress * 0.4),
          filter: `blur(${swipeProgress * 2}px)`,
          paddingBottom: 50,
          backgroundColor: '#212A33',
          borderRadius: '50px 50px 0 0',
          transition: swipeProgress === 0 ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, filter 0.3s ease' : 'none'
        }}
      >
        {/* Swipe progress indicator - only shown in debug mode */}
        {showSwipeProgressDebug && swipeProgress > 0 && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, #248BDA 0%, #248BDA ${swipeProgress * 100}%, rgba(36, 139, 218, 0.3) ${swipeProgress * 100}%, rgba(36, 139, 218, 0.3) 100%)`,
              borderRadius: '0 0 4px 4px',
              zIndex: 1,
              transition: 'opacity 0.2s ease'
            }}
          />
        )}
        {renderModal()}
      </div>
    </div>,
    document.body
  );
};
