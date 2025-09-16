import React, { useState } from 'react';
import './Modal.css';

interface Subscription {
  id: string;
  name: string;
  avatar: string;
  isSubscribed?: boolean;
}

interface SubscriptionModalProps {
  onClose: () => void;
  onNext: () => void;
  onSubscribe: (subscriptionId: string) => void;
  subscriptions?: Subscription[];
}

const defaultSubscriptions: Subscription[] = [
  {
    id: 'alexsandro',
    name: 'Alexsandro',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzE3LjUyIDIgMjIgNi40OCAyMiAxMkMyMiAxNy41MiAxNy41MiAyMiAxMiAyMkM2LjQ4IDIyIDIgMTcuNTIgMiAxMkMyIDYuNDggNi40OCAyIDEyIDJaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTggMTJMMTIgOEwxNiAxMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo='
  },
  {
    id: 'david-t',
    name: 'David T.',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAiIHkyPSI0MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY2QjAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGMDAwMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='
  },
  {
    id: 'quantmarket',
    name: 'QuantMarket',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxRjI5MzciLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzE3LjUyIDIgMjIgNi40OCAyMiAxMkMyMiAxNy41MiAxNy41MiAyMiAxMiAyMkM2LjQ4IDIyIDIgMTcuNTIgMiAxMkMyIDYuNDggNi40OCAyIDEyIDJaIiBzdHJva2U9IiM0QkZGRkYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNOCAxMkwxMiA4TDE2IDEyIiBzdHJva2U9IiM0QkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K'
  }
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  onNext,
  onSubscribe,
  subscriptions = defaultSubscriptions
}) => {
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());

  const handleSubscribe = (subscriptionId: string) => {
    setSubscribedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriptionId)) {
        newSet.delete(subscriptionId);
      } else {
        newSet.add(subscriptionId);
      }
      return newSet;
    });
    onSubscribe(subscriptionId);
  };

  const hasAllSubscriptions = subscribedIds.size === subscriptions.length;

  return (
    <div className="market-header__sheet">
      <div className="market-header__sheet-header">
        <div>
          <div className="market-header__sheet-title">Subscriptions are required</div>
          <div className="market-header__sheet-subtitle">To participate, subscribe</div>
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
        <div className="subscription-modal__list">
          {subscriptions.map((subscription) => {
            const isSubscribed = subscribedIds.has(subscription.id);
            return (
              <div key={subscription.id} className="subscription-modal__item">
                <div className="subscription-modal__item-avatar">
                  <img 
                    src={subscription.avatar} 
                    alt={subscription.name}
                    className="subscription-modal__avatar-img"
                  />
                </div>
                <div className="subscription-modal__item-name">
                  {subscription.name}
                </div>
                <button 
                  className={`subscription-modal__subscribe-btn ${
                    isSubscribed ? 'subscription-modal__subscribe-btn--subscribed' : ''
                  }`}
                  onClick={() => handleSubscribe(subscription.id)}
                >
                  {isSubscribed ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="market-header__sheet-footer">
        <button 
          className={`market-header__btn-primary ${!hasAllSubscriptions ? 'market-header__btn-primary--disabled' : ''}`}
          onClick={onNext}
          disabled={!hasAllSubscriptions}
        >
          Next
        </button>
      </div>
    </div>
  );
};
