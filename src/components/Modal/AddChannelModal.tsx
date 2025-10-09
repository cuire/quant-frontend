import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddChannel } from '@/lib/api-hooks';
import { Link } from '../Link/Link';
import { useToast } from '@/hooks/useToast';

interface AddChannelModalProps {
  onClose: () => void;
}

export const AddChannelModal = ({ onClose }: AddChannelModalProps) => {
  const { t } = useTranslation();
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const addChannelMutation = useAddChannel();
  const { success: showSuccessToast, block: showErrorToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteLink.trim()) {
      setError(t('modalsAddChannel.pleaseEnterLink'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addChannelMutation.mutateAsync(inviteLink);
      showSuccessToast({ message: t('modalsAddChannel.channelAddedSuccess') });
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || t('modalsAddChannel.failedToAdd');
      setError(errorMsg);
      showErrorToast({ message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 className="product-sheet__title" style={{ textAlign: 'left', padding: '0px' }}>{t('modalsAddChannel.addChannel')}</h2>
          <p style={{ 
            color: '#9CA3AF', 
            fontSize: '14px', 
            margin: '4px 0 0 0',
            textAlign: 'left'
          }}>
            {t('modalsAddChannel.withWaitingNote')}
          </p>
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>
      
      <div style={{ padding: '20px' }}>
        {/* Instructions Section */}
        <div style={{
          backgroundColor: '#2A3541',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>{t('modalsAddChannel.instructions')}</span>
          </div>
          <ol style={{ 
            color: '#E7EEF7', 
            fontSize: '11px', 
            margin: '0 0 16px 0',
            paddingLeft: '20px'
          }}>
            <li style={{ marginBottom: '8px' }}>
              {t('modalsAddChannel.instruction1')}
            </li>
            <li style={{ marginBottom: '8px' }}>
              {t('modalsAddChannel.instruction2')}
            </li>
          </ol>
          <Link
            href="https://t.me/QuantMarketRobot?startchannel&admin=invite_users"
          >
            <div style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#248BDA',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'center'
            }}>

            {t('modalsAddChannel.quickAddBot')}
            </div>
          </Link>
        </div>

        {/* Important Section */}
        <div style={{
          backgroundColor: '#2A3541',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid #5D3E3F'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>{t('modalsAddChannel.important')}</span>
          </div>
          <ul style={{ 
            color: '#AE7F80', 
            fontSize: '11px', 
            margin: '0',
            paddingLeft: '20px',
            opacity: 0.8
          }}>
            <li style={{ marginBottom: '8px' }}>
              {t('modalsAddChannel.important1')}
            </li>
            <li style={{ marginBottom: '8px' }}>
              {t('modalsAddChannel.important2')}
            </li>
            <li style={{ marginBottom: '8px' }}>
              {t('modalsAddChannel.important3')}
            </li>
          </ul>
        </div>

        {/* Channel Link Input Section */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="inviteLink" style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#E7EEF7',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {t('modalsAddChannel.pasteChannelLink')}
            </label>
            <input
              id="inviteLink"
              type="text"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder={t('modalsAddChannel.usernamePlaceholder')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #2F3C49',
                borderRadius: '8px',
                backgroundColor: '#212A33',
                color: '#E7EEF7',
                fontSize: '14px',
                outline: 'none'
              }}
              disabled={isLoading}
            />
            {error && (
              <p style={{ 
                color: '#FF3939', 
                fontSize: '12px', 
                marginTop: '8px' 
              }}>
                {error}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #2F3C49',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#E7EEF7',
                fontSize: '14px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#248BDA',
                color: '#FFFFFF',
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
              disabled={isLoading}
            >
              {isLoading ? t('modalsAddChannel.adding') : t('modalsAddChannel.addChannel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
