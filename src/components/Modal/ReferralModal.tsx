import type { FC } from 'react';
import { useState } from 'react';
import { useUser } from '@/lib/api-hooks';
import './ReferralModal.css';

export interface ReferralModalProps {
  onClose: () => void;
}

export const ReferralModal: FC<ReferralModalProps> = ({ onClose }) => {
  const user = useUser();
  
  // Mock data - in real implementation, these would come from API
  const [currentLevel] = useState(2);
  const [nextLevel] = useState(3);
  const [currentProgress] = useState(100600); // 100.6K
  const [targetProgress] = useState(200000); // 200K
  const [commissionRate] = useState(25);
  const [referralCode] = useState(user?.data?.referral_code || 'REF123456');

  const progressPercentage = (currentProgress / targetProgress) * 100;

  const handleCopyReferralLink = async () => {
    const referralLink = `https://t.me/your_bot?start=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      // Could show a toast notification here
      console.log('Referral link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy referral link:', err);
    }
  };

  const handleShare = () => {
    const referralLink = `https://t.me/your_bot?start=${referralCode}`;
    const shareText = `Join me on this amazing platform! Use my referral link: ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join with my referral',
        text: shareText,
        url: referralLink,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="market-header__sheet">
      <div className="market-header__sheet-header">
        <div>
          <div className="referral-modal__ref-label">ref</div>
        </div>
        <button 
          className="market-header__sheet-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="market-header__sheet-content">
        {/* Progress Section */}
        <div className="referral-modal__progress-section">
          <div className="referral-modal__progress-bar">
            <div className="referral-modal__progress-fill" style={{ width: `${progressPercentage}%` }}>
              <span className="referral-modal__level-label">Уровень {currentLevel}</span>
            </div>
            <div className="referral-modal__progress-remaining">
              <span className="referral-modal__level-label">Уровень {nextLevel}</span>
            </div>
          </div>
          
          <div className="referral-modal__progress-indicator">
            <div className="referral-modal__progress-bubble">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14C11.866 14 15 10.866 15 7C15 3.134 11.866 0 8 0C4.134 0 1 3.134 1 7C1 10.866 4.134 14 8 14Z" fill="white"/>
              </svg>
              <span>{formatNumber(currentProgress)} / {formatNumber(targetProgress)}</span>
            </div>
          </div>
          
          <div className="referral-modal__commission-rate">
            NOW COMMISSION RATE IS {commissionRate}%
          </div>
        </div>

        {/* Referral Instructions */}
        <div className="referral-modal__instructions">
          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">Заработать на продвижении</div>
            <div className="referral-modal__instruction-description">
              Рекомендуйте рефералку своим друзьям и получайте долю их прибыли.
            </div>
          </div>
          
          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">Заработать на продвижении</div>
            <div className="referral-modal__instruction-description">
              Рекомендуйте рефералку своим друзьям и получайте долю их прибыли.
            </div>
          </div>
          
          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">Заработать на продвижении</div>
            <div className="referral-modal__instruction-description">
              Рекомендуйте рефералку своим друзьям и получайте долю их прибыли.
            </div>
          </div>
        </div>
      </div>

      <div className="market-header__sheet-footer">
        <button 
          className="market-header__btn-secondary"
          onClick={handleCopyReferralLink}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 10V4C4 2.89543 4.89543 2 6 2H10" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>Copy Referral Link</span>
        </button>
        
        <button 
          className="market-header__btn-primary"
          onClick={handleShare}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="4" cy="4" r="2" fill="currentColor"/>
            <circle cx="12" cy="4" r="2" fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <circle cx="4" cy="12" r="2" fill="currentColor"/>
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
