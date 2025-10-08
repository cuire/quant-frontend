import { useState } from 'react';

interface AddGiftPreMarketModalProps {
  onClose: () => void;
}

export const AddGiftPreMarketModal = ({ onClose }: AddGiftPreMarketModalProps) => {
  const [giftLink, setGiftLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftLink.trim()) {
      setError('Please paste a gift link');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // For now, no API call – just console log
      console.log('Pre-Market add gift link:', giftLink);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="market-header__sheet">
      <div className="product-sheet__header">
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h2 className="product-sheet__title" style={{ textAlign: 'left', padding: '0px' }}>Pre-Market</h2>
        </div>
        <button className="product-sheet__close" onClick={onClose}>✕</button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: '#2A3541',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ color: '#E7EEF7', fontSize: 12, lineHeight: 1.5 }}>
            Send a link to our bot or paste it here and hit Send. The gift should appear in your inventory within 3 minutes.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="giftLink" style={{ display: 'block', marginBottom: 8, color: '#E7EEF7', fontSize: 14, fontWeight: 500 }}>PASTE GIFT LINK</label>
            <input
              id="giftLink"
              type="text"
              value={giftLink}
              onChange={(e) => setGiftLink(e.target.value)}
              placeholder="t.me/nft/HeartLocket-4"
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
              <p style={{ color: '#FF3939', fontSize: '12px', marginTop: '8px' }}>{error}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
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
              Cancel
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
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


