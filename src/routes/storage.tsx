import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { MarketHeader } from '@/components/MarketHeader';
import { BottomNav } from '@/components/Navigation';

export const Route = createFileRoute('/storage')({
  component: StoragePage,
});

function StoragePage() {
  const [section, setSection] = useState<'Channels' | 'Offers' | 'Activity'>('Offers');
  const [offersTab, setOffersTab] = useState<'Received' | 'Placed'>('Received');

  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketHeader balance={243.16} onFilterChange={() => {}} />

      <div className="storage-tabs">
        <div className="storage-segment">
          {(['Channels','Offers','Activity'] as const).map((name) => (
            <button key={name} type="button" className={section === name ? 'is-active' : ''} onClick={() => setSection(name)}>
              {name}
            </button>
          ))}
        </div>

        <div className="storage-subsegment">
          {(['Received','Placed'] as const).map((name) => (
            <button key={name} type="button" className={offersTab === name ? 'is-active' : ''} onClick={() => setOffersTab(name)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="storage-empty">
        <div className="storage-empty__icon" aria-hidden>
          <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 10c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4h-16z" fill="#E0B85A"/>
            <path d="M14 22c0-3.3 2.7-6 6-6h24c3.3 0 6 2.7 6 6v2c0 1.1-.9 2-2 2H16c-1.1 0-2-.9-2-2v-2z" fill="#D1A542"/>
            <rect x="12" y="24" width="40" height="28" rx="8" fill="#F0C96C" stroke="#D1A542"/>
            <path d="M32 48c-5 0-9-3-9-6h6c0 1 1.6 2 3 2s3-1 3-2c0-1.2-1.4-1.9-4.2-2.7C27 37.6 24 36.6 24 32c0-3 2.3-5.7 6-6.6V24h4v1.3c3.7.8 6 3.6 6 6.7h-6c0-1.3-1.4-2-3-2s-3 .8-3 2c0 1 .9 1.6 4 2.4 3.6.9 8 2.2 8 6.6 0 3.6-3.3 7-8 7z" fill="#9A6A00"/>
          </svg>
        </div>
        <div className="storage-empty__title">No Received Offers</div>
        <div className="storage-empty__subtitle">Received offers will appear here</div>
      </div>

      <BottomNav />
    </div>
  );
}

