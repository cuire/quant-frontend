import { MarketTopBar } from '@/components/MarketHeader';
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';

export const Route = createFileRoute('/market')({
  component: MarketIndexPage,
});

function MarketIndexPage() {
  const location = useLocation();

  return (
    <> 
      <MarketTopBar />
      <div className="storage-tabs">
        <div className="storage-segment">
          {[
            { path: '/market/gifts', label: 'Gifts', disabled: false },
            { path: '/market/channels', label: 'Channels', disabled: false },
            { path: '/market/stickers', label: 'Stickers', disabled: true },
          ].map(({ path, label, disabled }) => (
              <Link 
                to={path}
                className={`storage-tab-link ${location.pathname === path ? 'is-active' : ''}`}
                disabled={disabled}
              >
                {label}
              </Link>
          ))}
        </div>
      </div>
      <Outlet />
    </>
  );
}
