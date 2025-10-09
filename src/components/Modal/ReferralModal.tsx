import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/lib/api-hooks';
import { config } from '@/lib/config';
import './ReferralModal.css';
import { copyTextToClipboard } from '@telegram-apps/sdk';
import { shareURL } from '@telegram-apps/sdk-react';
import { useToast } from '@/hooks/useToast';

export interface ReferralModalProps {
  onClose: () => void;
}

export const ReferralModal: FC<ReferralModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { data: userProfile, isLoading } = useUserProfile();
  const { success: showSuccessToast, warning: showErrorToast } = useToast();
  
  // Get data from API
  const currentLevel = userProfile?.referral_level || 1;
  const nextLevel = currentLevel + 1;
  const currentProgress = userProfile?.referrals_volume || 0;
  const targetProgress = userProfile?.referrals_volume_max || 0;
  const commissionRate = userProfile?.referrals_percent || 0;
  const referralCode = userProfile?.referrals_code || '';

  const progressPercentage = targetProgress > 0 ? (currentProgress / targetProgress) * 100 : 0;

  const handleCopyReferralLink = async () => {
    const referralLink = `https://t.me/${config.telegram.botUsername}?start=${referralCode}`;
    try {
      await copyTextToClipboard(referralLink);
      showSuccessToast({
        message: t('referral.linkCopied'),
      });
    } catch (err) {
      showErrorToast({
        message: t('referral.linkCopyFailed'),
      });
    }
  };

  const handleShare = () => {
    const referralLink = `https://t.me/${config.telegram.botUsername}?start=${referralCode}`;
    const shareText = t('referral.joinMessage', { link: referralLink });
    
    try {
      // Use Telegram SDK shareURL
      shareURL(referralLink, shareText);
    } catch (error) {
      console.error('Failed to share referral link:', error);
      // Fallback to copying to clipboard
      copyTextToClipboard(shareText).catch(() => {
        showErrorToast({
          message: t('referral.linkCopyFailed'),
        });
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="market-header__sheet referral-modal">
        <div className="market-header__sheet-header">
          <div>
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
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {t('common.loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="market-header__sheet referral-modal">
      <div className="market-header__sheet-header">
        <div>
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
          <div className="referral-modal__progress-indicator">
            <div className="referral-modal__progress-bubble">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05066 11.5142L5.644 9.65624C5.31699 9.98083 4.90121 10.2014 4.44906 10.29C3.99691 10.3786 3.52864 10.3314 3.10328 10.1543C2.67792 9.97719 2.31452 9.67811 2.0589 9.29477C1.80327 8.91143 1.66685 8.46099 1.66685 8.00024C1.66685 7.53948 1.80327 7.08904 2.0589 6.7057C2.31452 6.32236 2.67792 6.02328 3.10328 5.84617C3.52864 5.66906 3.99691 5.62185 4.44906 5.71048C4.90121 5.79912 5.31699 6.01964 5.644 6.34424L9.05066 4.48624C8.93383 3.93806 9.01821 3.36614 9.28839 2.87507C9.55857 2.384 9.99649 2.00659 10.5221 1.81186C11.0476 1.61713 11.6257 1.61809 12.1507 1.81456C12.6756 2.01104 13.1123 2.3899 13.3808 2.88186C13.6494 3.37383 13.7318 3.94602 13.6132 4.49381C13.4945 5.04159 13.1827 5.52836 12.7346 5.8651C12.2865 6.20185 11.7323 6.36605 11.1731 6.3277C10.6139 6.28935 10.0872 6.051 9.68933 5.65624L6.28266 7.51424C6.3508 7.83443 6.3508 8.16538 6.28266 8.48557L9.68933 10.3442C10.0872 9.94947 10.6139 9.71112 11.1731 9.67277C11.7323 9.63442 12.2865 9.79863 12.7346 10.1354C13.1827 10.4721 13.4945 10.9589 13.6132 11.5067C13.7318 12.0545 13.6494 12.6266 13.3808 13.1186C13.1123 13.6106 12.6756 13.9894 12.1507 14.1859C11.6257 14.3824 11.0476 14.3833 10.5221 14.1886C9.99649 13.9939 9.55857 13.6165 9.28839 13.1254C9.01821 12.6343 8.93383 12.0624 9.05066 11.5142Z" fill="white"/>
              </svg>
              <span>{formatNumber(currentProgress)} / {formatNumber(targetProgress)}</span>
            </div>
          </div>

          <div className="referral-modal__levels">
            <div className="referral-modal__level referral-modal__level--active">{t('referral.level')} {currentLevel}</div>
            <div className="referral-modal__level referral-modal__level--next">{t('referral.level')} {nextLevel}</div>
            <div className="referral-modal__levels-track" />
            <div className="referral-modal__levels-fill" style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }} />
          </div>

          <div className="referral-modal__commission-rate">
            {t('referral.commissionRate', { rate: commissionRate })}
          </div>
        </div>

        {/* Referral Instructions */}
        <div className="referral-modal__instructions">
          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">{t('referral.shareYourLink')}</div>
            <div className="referral-modal__instruction-description">
              {t('referral.shareYourLinkDescription')}
            </div>
          </div>

          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">{t('referral.percentDependsOnLevel')}</div>
            <div className="referral-modal__instruction-description">
              {t('referral.percentDependsOnLevelDescription')}
            </div>
          </div>

          <div className="referral-modal__instruction-block">
            <div className="referral-modal__instruction-title">{t('referral.instantReward')}</div>
            <div className="referral-modal__instruction-description">
              {t('referral.instantRewardDescription')}
            </div>
          </div>
        </div>
      </div>

      <div className="market-header__sheet-footer">
        <button 
          className="market-header__btn-secondary"
          onClick={handleCopyReferralLink}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_18_256)">
          <path d="M2.4375 0.75H7.6875C8.13505 0.75 8.56427 0.92779 8.88074 1.24426C9.19721 1.56073 9.375 1.98995 9.375 2.4375V7.6875C9.375 8.13505 9.19721 8.56427 8.88074 8.88074C8.56427 9.19721 8.13505 9.375 7.6875 9.375H2.4375C1.98995 9.375 1.56073 9.19721 1.24426 8.88074C0.92779 8.56427 0.75 8.13505 0.75 7.6875V2.4375C0.75 1.98995 0.92779 1.56073 1.24426 1.24426C1.56073 0.92779 1.98995 0.75 2.4375 0.75Z" fill="white"/>
          <path d="M8.25 10.125H2.72156C2.83824 10.4538 3.05378 10.7384 3.33862 10.9398C3.62346 11.1412 3.96364 11.2496 4.3125 11.25H9.5625C10.0101 11.25 10.4393 11.0722 10.7557 10.7557C11.0722 10.4393 11.25 10.0101 11.25 9.5625V4.3125C11.2496 3.96364 11.1412 3.62346 10.9398 3.33862C10.7384 3.05378 10.4538 2.83824 10.125 2.72156V8.25C10.125 8.74728 9.92746 9.22419 9.57583 9.57583C9.22419 9.92746 8.74728 10.125 8.25 10.125Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_18_256">
          <rect width="12" height="12" fill="white" transform="matrix(-1 0 0 -1 12 12)"/>
          </clipPath>
          </defs>
          </svg>

          <span>{t('referral.copyReferralLink')}</span>
        </button>
        
        <button 
          className="market-header__btn-primary"
          onClick={handleShare}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.05066 11.5142L5.644 9.65624C5.31699 9.98083 4.90121 10.2014 4.44906 10.29C3.99691 10.3786 3.52864 10.3314 3.10328 10.1543C2.67792 9.97719 2.31452 9.67811 2.0589 9.29477C1.80327 8.91143 1.66685 8.46099 1.66685 8.00024C1.66685 7.53948 1.80327 7.08904 2.0589 6.7057C2.31452 6.32236 2.67792 6.02328 3.10328 5.84617C3.52864 5.66906 3.99691 5.62185 4.44906 5.71048C4.90121 5.79912 5.31699 6.01964 5.644 6.34424L9.05066 4.48624C8.93383 3.93806 9.01821 3.36614 9.28839 2.87507C9.55857 2.384 9.99649 2.00659 10.5221 1.81186C11.0476 1.61713 11.6257 1.61809 12.1507 1.81456C12.6756 2.01104 13.1123 2.3899 13.3808 2.88186C13.6494 3.37383 13.7318 3.94602 13.6132 4.49381C13.4945 5.04159 13.1827 5.52836 12.7346 5.8651C12.2865 6.20185 11.7323 6.36605 11.1731 6.3277C10.6139 6.28935 10.0872 6.051 9.68933 5.65624L6.28266 7.51424C6.3508 7.83443 6.3508 8.16538 6.28266 8.48557L9.68933 10.3442C10.0872 9.94947 10.6139 9.71112 11.1731 9.67277C11.7323 9.63442 12.2865 9.79863 12.7346 10.1354C13.1827 10.4721 13.4945 10.9589 13.6132 11.5067C13.7318 12.0545 13.6494 12.6266 13.3808 13.1186C13.1123 13.6106 12.6756 13.9894 12.1507 14.1859C11.6257 14.3824 11.0476 14.3833 10.5221 14.1886C9.99649 13.9939 9.55857 13.6165 9.28839 13.1254C9.01821 12.6343 8.93383 12.0624 9.05066 11.5142Z" fill="white"/>
          </svg>

          <span>{t('referral.share')}</span>
        </button>
      </div>
    </div>
  );
};
