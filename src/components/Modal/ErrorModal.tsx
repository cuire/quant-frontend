import React from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';

interface ErrorModalProps {
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  onClose
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="success-modal__sheet">
      <div className="success-modal__sheet-content">
        <div className="success-modal__character">
          <img src="/src/icons/cross_red.svg" alt="Pepe with sad" className="success-modal__character-img" />
        </div>
        
        <div className="success-modal__text">
          <h2 className="success-modal__title">{t('modalsContest.errorTitle')}</h2>
          <p className="success-modal__subtitle">{t('modalsContest.errorSubtitle')}</p>
        </div>
      </div>
      
      <div className="success-modal__sheet-footer">
        <button 
          className="success-modal__close-btn"
          onClick={onClose}
        >
          <span className="success-modal__close-icon">✕</span>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};
