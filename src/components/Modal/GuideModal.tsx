import type { FC } from 'react';
import './SettingsModal.css';

export interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="market-header__sheet">
      <div className="market-header__sheet-header">
        <div>
          <div className="market-header__sheet-title">Guide</div>
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
        {/* Guide content will go here */}
        <div className="market-header__panel">
          <div className="market-header__row">
            <div className="market-header__row-main">
              <p>Guide content coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

