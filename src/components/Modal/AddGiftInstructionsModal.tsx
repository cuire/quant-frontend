interface AddGiftInstructionsModalProps {
  onClose: () => void;
  type: 'upgraded' | 'new';
}

import { InfoBackground } from '../Graphics/InfoBackground';

export const AddGiftInstructionsModal = ({ onClose, type }: AddGiftInstructionsModalProps) => {
  const items: Array<{ title: string; note?: string }> = type === 'upgraded'
    ? [
        { title: 'Click the button to access the bot', note: 'The username of the @QuantRelayer' },
        { title: 'Send a gift to the bot', note: 'In any quantity' },
        { title: 'The gift will appear in the "Storage"', note: 'The gift should appear within 3 minutes.' },
      ]
    : [
        { title: 'Click the button to access the bot', note: 'The username of the @QuantRelayer' },
        { title: 'Send a gift to the bot', note: 'In any quantity' },
        { title: 'You can sell it in our marketplace', note: 'The gift should appear within 3 minutes.' },
      ];

  return (
    <div className="market-header__sheet">
      <div style={{ padding: 0 }}>
        <div style={{ position: 'relative', height: 176, overflow: 'hidden', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <InfoBackground width="100%" height="176" />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%)'
          }}>
            <img src="/src/assets/pepe.png" alt="Gift" width={80} height={80} style={{ borderRadius: '50%', background: 'rgba(0,0,0,0.2)', border: '2px solid #FFFFFF' }} />
            <svg width="70" height="16" viewBox="0 0 70 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V8V7ZM69.7071 8.70711C70.0976 8.31658 70.0976 7.68342 69.7071 7.29289L63.3431 0.928932C62.9526 0.538408 62.3195 0.538408 61.9289 0.928932C61.5384 1.31946 61.5384 1.95262 61.9289 2.34315L67.5858 8L61.9289 13.6569C61.5384 14.0474 61.5384 14.6805 61.9289 15.0711C62.3195 15.4616 62.9526 15.4616 63.3431 15.0711L69.7071 8.70711ZM1 8V9H69V8V7H1V8Z" fill="white"/>
            </svg>
            <img src="/src/assets/quant.png" alt="Quant" width={80} height={80} style={{ borderRadius: '50%', background: 'rgba(0,0,0,0.2)', border: '2px solid #FFFFFF' }} />
          </div>
          <div style={{ position: 'absolute', top: 10, left: 12, right: 12, display: 'flex', alignItems: 'center' }}>
            <button className="product-sheet__close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="product-sheet__list" style={{ margin: 16 }}>
          <div style={{ background: '#2A3541', borderRadius: 12, padding: 12 }}>
            {items.map((s, i) => (
              <div key={i} className="product-sheet__row" style={{ padding: '12px 8px' }}>
                <div className="product-sheet__row-main">
                  <div className="product-sheet__row-title">{s.title}</div>
                  {s.note && (
                    <div className="product-sheet__row-note" style={{ opacity: 0.7 }}>{s.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="product-sheet__list" style={{ margin: 16 }}>
          <a
            href="https://t.me/QuantRelayer"
            target="_blank"
            className="product-sheet__btn product-sheet__btn--primary"
            style={{ textDecoration: 'none' }}
          >
            Open @QuantRelayer
          </a>
        </div>
      </div>
    </div>
  );
};


