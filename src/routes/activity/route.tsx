import { createFileRoute, Link, Outlet, useLocation, redirect } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { MarketTopBar } from '@/components/MarketHeader';
import { useLastTab } from '@/hooks/useLastTab';

export const Route = createFileRoute('/activity')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/activity') {
      const lastTab = localStorage.getItem('market-last-tab') || 'gifts';
      const defaultPath = `/activity/${lastTab}`;
      throw redirect({ to: defaultPath });
    }
  },
  component: ActivityIndexPage,
});

function ActivityIndexPage() {
  const location = useLocation();
  const [, setLastTab] = useLastTab('market-last-tab', 'gifts');
  const { t } = useTranslation();

  useEffect(() => {
    const currentTab = location.pathname.split('/').pop();
    if (currentTab && ['gifts', 'channels'].includes(currentTab)) {
      setLastTab(currentTab);
    }
  }, [location.pathname, setLastTab]);

  return (
    <>
      <MarketTopBar />
      <div className="storage-tabs">
        <div className="storage-segment">
          {[
            { path: '/activity/gifts', label: t('tabs.gifts'), disabled: false },
            { path: '/activity/channels', label: t('tabs.channels'), disabled: false },
            { path: '/activity/stickers', label: t('tabs.stickers'), disabled: true },
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
