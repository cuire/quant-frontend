import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { BottomNav } from '@/components/Navigation';
import { Modal } from '@/components/Modal';
import { ModalProvider } from '@/contexts/ModalContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { useEffect } from 'react';
import { miniApp, swipeBehavior } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const location = useLocation();
  // const lp = useLaunchParams();

  useEffect(() => {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();

    if ( miniApp.setHeaderColor.isAvailable()) {
        miniApp.setHeaderColor('#1A2026');
    }

    // if (viewport.requestFullscreen.isAvailable() && lp.tgWebAppPlatform === 'android' || lp.tgWebAppPlatform === 'ios') {
      // viewport.requestFullscreen();
    // }
  }, []);

  const canGoBack = false;

  // Hide BottomNav for wallet routes
  const isWalletRoute = location.pathname.startsWith('/wallet');

  return (
    <FilterProvider>
      <ModalProvider>
        <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: 'env(safe-area-inset-bottom, 100px)' }}>
          <Page back={canGoBack}>
            <Outlet />
          </Page>
          {!isWalletRoute && <BottomNav />}
          <Modal />
        </div>
      </ModalProvider>
    </FilterProvider>
  );
}
