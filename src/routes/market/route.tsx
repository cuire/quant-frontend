import { MarketTopBar } from '@/components/MarketHeader';
import { createFileRoute, Link, Outlet, useLocation, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useLastTab } from '@/hooks/useLastTab';

export const Route = createFileRoute('/market')({
  beforeLoad: ({ location }) => {
    // Only redirect if we're exactly on /market (not on a sub-route)
    if (location.pathname === '/market') {
      // Get the last opened tab from localStorage, default to channels
      const lastTab = localStorage.getItem('market-last-tab') || 'channels';
      const defaultPath = `/market/${lastTab}`;
      
      // Redirect to the last opened tab or channels by default
      throw redirect({ to: defaultPath });
    }
  },
  component: MarketIndexPage,
});

function MarketIndexPage() {
  const location = useLocation();
  const [, setLastTab] = useLastTab('market-last-tab', 'channels');
  const { t } = useTranslation();

  // Save the current tab to localStorage when it changes
  useEffect(() => {
    const currentTab = location.pathname.split('/').pop();
    if (currentTab && ['gifts', 'channels', 'stickers'].includes(currentTab)) {
      setLastTab(currentTab);
    }
  }, [location.pathname, setLastTab]);

  return (
    <> 
      <MarketTopBar />
      <div className="storage-tabs">
        <div className="storage-segment">
          {[
            { path: '/market/gifts', label: t('tabs.gifts'), disabled: false },
            { path: '/market/channels', label: t('tabs.channels'), disabled: false },
            { path: '/market/stickers', label: t('tabs.stickers'), disabled: true },
          ].map(({ path, label, disabled }) => (
              <Link 
                key={path}
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
