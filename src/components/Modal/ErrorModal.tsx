import React from 'react';
import './Modal.css';

interface ErrorModalProps {
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  onClose
}) => {
  return (
    <div className="success-modal__sheet">
      <div className="success-modal__sheet-content">
        <div className="success-modal__character">
          <img src="/src/icons/cross_red.svg" alt="Pepe with sad" className="success-modal__character-img" />
        </div>
        
        <div className="success-modal__text">
          <h2 className="success-modal__title">No purchases or sales</h2>
          <p className="success-modal__subtitle">To participate in this contest, you must make purchases or sales of at least 10 TON since the start of the contest.</p>
        </div>
      </div>
      
      <div className="success-modal__sheet-footer">
        <button 
          className="success-modal__close-btn"
          onClick={onClose}
        >
          <span className="success-modal__close-icon">✕</span>
          Close
        </button>
      </div>
    </div>
  );
};
