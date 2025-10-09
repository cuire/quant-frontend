import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/contexts/ModalContext';

interface AddGiftModalProps {
  onClose: () => void;
}

export const AddGiftModal = ({ onClose }: AddGiftModalProps) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const [addType, setAddType] = useState<'upgraded' | 'pre-market' | 'new'>('upgraded');

  const GiftIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_870_312)">
        <path d="M2.18667 16.36V22.7867C2.19018 23.1097 2.32096 23.4183 2.55063 23.6454C2.78029 23.8726 3.0903 24 3.41333 24H10.9067V16.36H2.18667ZM13.0933 24H20.5867C20.9097 24 21.2197 23.8726 21.4494 23.6454C21.679 23.4183 21.8098 23.1097 21.8133 22.7867V16.36H13.0933V24ZM22.8 5.45333H20.3467C20.598 4.94296 20.7302 4.38221 20.7333 3.81333C20.7298 2.80075 20.3251 1.83084 19.6078 1.11609C18.8906 0.401329 17.9193 -6.14661e-06 16.9067 0C15.8489 0.0501656 14.8268 0.39854 13.9586 1.00489C13.0903 1.61123 12.4113 2.45082 12 3.42667C11.5887 2.45082 10.9097 1.61123 10.0414 1.00489C9.17319 0.39854 8.15115 0.0501656 7.09333 0C6.08074 -6.14661e-06 5.10943 0.401329 4.39217 1.11609C3.67492 1.83084 3.27019 2.80075 3.26667 3.81333C3.26983 4.38221 3.40204 4.94296 3.65333 5.45333H1.2C0.533333 5.45333 0 6.24 0 7.2V12.44C0 13.4 0.533333 14.1867 1.2 14.1867H10.9067V5.45333H13.0933V14.1867H22.8C23.4667 14.1867 24 13.4 24 12.44V7.2C24 6.24 23.4667 5.45333 22.8 5.45333ZM7.09333 5.45333C6.86644 5.47386 6.63776 5.44688 6.42186 5.37412C6.20597 5.30136 6.00761 5.18442 5.83942 5.03076C5.67122 4.87709 5.53689 4.69006 5.44498 4.4816C5.35308 4.27314 5.30561 4.04782 5.30561 3.82C5.30561 3.59218 5.35308 3.36686 5.44498 3.1584C5.53689 2.94994 5.67122 2.76291 5.83942 2.60924C6.00761 2.45558 6.20597 2.33864 6.42186 2.26588C6.63776 2.19312 6.86644 2.16615 7.09333 2.18667C8.96 2.18667 10.0133 4.10667 10.5333 5.45333H7.09333ZM16.9067 5.45333H13.4667C13.9867 4.12 15.04 2.18667 16.9067 2.18667C17.1336 2.16615 17.3622 2.19312 17.5781 2.26588C17.794 2.33864 17.9924 2.45558 18.1606 2.60924C18.3288 2.76291 18.4631 2.94994 18.555 3.1584C18.6469 3.36686 18.6944 3.59218 18.6944 3.82C18.6944 4.04782 18.6469 4.27314 18.555 4.4816C18.4631 4.69006 18.3288 4.87709 18.1606 5.03076C17.9924 5.18442 17.794 5.30136 17.5781 5.37412C17.3622 5.44688 17.1336 5.47386 16.9067 5.45333Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_870_312">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_870_318)">
        <rect width="24" height="24" rx="12" fill="white"/>
        <path d="M8 12.05L12.05 8L16.1 12.05M12.05 8.5625V16.775" stroke="#212A33" strokeWidth="2.34375" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_870_318">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const HourglassIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.5 3H6V9.3105L8.6895 12L6 14.6895V21H4.5V22.5H19.5V21H18V14.6895L15.3105 12L18 9.3105V3H19.5V1.5H4.5V3ZM10.5 9H13.5V7.5H10.5V9ZM9 18H15V16.5H9V18Z" fill="white"/>
    </svg>
  );

  const Option = ({
    value,
    title,
    description,
  }: { value: 'upgraded' | 'pre-market' | 'new'; title: string; description: string }) => {
    const isActive = addType === value;
    const select = (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      setAddType(value);
    };
    
    const IconComponent = value === 'upgraded' ? GiftIcon : value === 'new' ? UploadIcon : HourglassIcon;
    
    return (
      <div
        role="radio"
        aria-checked={isActive}
        tabIndex={0}
        onMouseDown={(e) => { e.stopPropagation(); }}
        onPointerDown={(e) => { e.stopPropagation(); }}
        onPointerUp={(e) => { e.stopPropagation(); select(e); }}
        onClickCapture={select}
        onClick={(e) => { e.stopPropagation(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(e); } }}
        className="product-sheet__row"
        style={{
          border: `1px solid ${isActive ? '#248BDA' : 'transparent'}`,
          borderRadius: 12,
          margin: 2
        }}
      >
        <div className="product-sheet__row-icon" style={{ height: 40, width: 40, borderRadius: 10, background: 'rgba(231, 238, 247, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComponent />
        </div>
        <div className="product-sheet__row-main">
          <div className="product-sheet__row-title">{title}</div>
          <div className="product-sheet__row-note" style={{ color: '#AEB6C2' }}>{description}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 className="product-sheet__title" style={{ textAlign: 'left', padding: '0px' }}>{t('modalsAddGift.selectGiftType')}</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0 0', textAlign: 'left' }}>
            {t('modalsAddGift.chooseMethod')}
          </p>
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>

      <div className="product-sheet__list" style={{ marginTop: 8 }}>
        <Option
          value="upgraded"
          title={t('modalsAddGift.upgraded')}
          description={t('modalsAddGift.upgradedDescription')}
        />
        <Option
          value="pre-market"
          title={t('modalsAddGift.preMarket')}
          description={t('modalsAddGift.preMarketDescription')}
        />
        <Option
          value="new"
          title={t('modalsAddGift.newGift')}
          description={t('modalsAddGift.newGiftDescription')}
        />
      </div>

      <div className="product-sheet__actions">
        <button className="product-sheet__btn" type="button" onClick={onClose}>{t('common.close')}</button>
        <button
          className="product-sheet__btn product-sheet__btn--primary"
          style={{ display: 'inline-block' }}
          type="button"
          onClick={() => {
            if (addType === 'pre-market') {
              openModal('add-gift-premarket');
            } else if (addType === 'upgraded') {
              openModal('add-gift-instructions', { type: 'upgraded' });
            } else {
              openModal('add-gift-instructions', { type: 'new' });
            }
          }}
        >
          {addType === 'pre-market' ? t('modalsAddGift.nextPreMarket') : addType === 'upgraded' ? t('modalsAddGift.nextUpgraded') : t('modalsAddGift.nextNewGift')}
        </button>
      </div>
    </div>
  );
};


