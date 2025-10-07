import type { FC } from 'react';
import { config } from '@/lib/config';
import './SettingsModal.css';
import './GuideModal.css';

export interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: FC<GuideModalProps> = ({ onClose }) => {
  const guideItems = config.guide.items;

  const handleOpenGuide = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className="market-header__sheet guide-modal">
      <button 
        className="guide-modal__close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="guide-modal__icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="40" y="60" fontSize="84" textAnchor="middle" fill="white" fontWeight="500">?</text>
        </svg>
      </div>

      <div className="market-header__sheet-content">
        {guideItems.map((item, index) => (
          <div key={index} className="guide-modal__item market-header__row">
            <div className="guide-modal__item-content">
              <h3 className="guide-modal__item-title">{item.title}</h3>
              <p className="guide-modal__item-description">{item.description}</p>
            </div>
            <button 
              className="guide-modal__item-button"
              onClick={() => handleOpenGuide(item.link)}
            >
              Open
            </button>
          </div>
        ))}
      </div>

      <div className="market-header__sheet-footer">
        <button className="market-header__btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

