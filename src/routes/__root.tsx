import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { BottomNav } from '@/components/Navigation';
import { Modal } from '@/components/Modal';
import { ModalProvider } from '@/contexts/ModalContext';
import { useEffect } from 'react';
import { miniApp } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const location = useLocation();
  
  useEffect(() => {
    if ( miniApp.setHeaderColor.isAvailable()) {
        miniApp.setHeaderColor('#1A2026');
    }
  }, []);

  // Show back button if we're not on the root path
  const canGoBack = location.pathname !== '/';

  // Hide BottomNav for wallet routes
  const isWalletRoute = location.pathname.startsWith('/wallet');

  return (
    <ModalProvider>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Page back={canGoBack}>
          <Outlet />
        </Page>
        {!isWalletRoute && <BottomNav />}
        <Modal />
      </div>
    </ModalProvider>
  );
}
