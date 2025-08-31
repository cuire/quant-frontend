import { createFileRoute, Link } from '@tanstack/react-router';
import { MarketHeader } from '@/components/MarketHeader';

export const Route = createFileRoute('/storage/activity')({
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <>
      <div className="storage-tabs">
        <div className="storage-segment">
          <Link to="/storage/channels" className="storage-tab-link">
            Channels
          </Link>
          <Link to="/storage/offers/received" className="storage-tab-link">
            Offers
          </Link>
          <Link to="/storage/activity" className="storage-tab-link is-active">
            Activity
          </Link>
        </div>
      </div>

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <h2>Activity</h2>
        <p>Your storage activity history will appear here</p>
      </div>
    </>
  );
}
