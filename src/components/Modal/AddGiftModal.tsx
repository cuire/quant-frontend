import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';

interface AddGiftModalProps {
  onClose: () => void;
}

export const AddGiftModal = ({ onClose }: AddGiftModalProps) => {
  const { openModal } = useModal();
  const [addType, setAddType] = useState<'upgraded' | 'pre-market' | 'new'>('upgraded');

  const Icon = () => (
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
          <Icon />
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
          <h2 className="product-sheet__title" style={{ textAlign: 'left', padding: '0px' }}>Select the gift type</h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '4px 0 0 0', textAlign: 'left' }}>
            Choose the method to add your gift:
          </p>
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>

      <div className="product-sheet__list" style={{ marginTop: 8 }}>
        <Option
          value="upgraded"
          title="Upgraded"
          description="Just send your gift to @QuantRelayer and it will show in our marketplace. You can withdraw your gift at any time"
        />
        <Option
          value="pre-market"
          title="Pre-Market"
          description="Send a link to the bot or paste it here and it will show in your inventory"
        />
        <Option
          value="new"
          title="New Gift"
          description="Just send a new gift to @QuantRelayer and you can sell it in our marketplace"
        />
      </div>

      <div className="product-sheet__actions">
        <button className="product-sheet__btn" type="button" onClick={onClose}>Close</button>
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
          {addType === 'pre-market' ? 'Next: Pre-Market' : addType === 'upgraded' ? 'Next: Upgraded' : 'Next: New Gift'}
        </button>
      </div>
    </div>
  );
};


