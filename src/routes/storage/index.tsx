import { createFileRoute, Link, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/storage/')({
  beforeLoad: () => {
    throw redirect({
      to: '/storage/offers/received',
    });
  },
  component: StorageIndexPage,
});

function StorageIndexPage() {
  return (
    <div className="storage-tabs">
      <div className="storage-segment">
        <Link to="/storage/channels" className="storage-tab-link">
          Channels
        </Link>
        <Link to="/storage/offers/received" className="storage-tab-link">
          Offers
        </Link>
        <Link to="/storage/activity" search={{ page: 1, limit: 20, gift_id: [], sort_by: 'date_new_to_old' } as any} className="storage-tab-link">
          Activity
        </Link>
      </div>
    </div>
  );
}
