import { createRootRoute, Outlet } from '@tanstack/react-router';
import { BottomNav } from '@/components/Navigation';
import { Modal } from '@/components/Modal';
import { ModalProvider } from '@/contexts/ModalContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useEffect } from 'react';
import { miniApp, swipeBehavior } from '@telegram-apps/sdk-react';
import { Page } from '@/components/Page';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { publicUrl } from '@/helpers/publicUrl';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
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


  return (
    <TonConnectUIProvider manifestUrl={publicUrl('tonconnect-manifest.json')}>
      <ThemeProvider>
        <FilterProvider>
          <ModalProvider>
            <div style={{ minHeight: '100vh', position: 'relative' }}>
              <Page back={canGoBack}>
                <Outlet />
              </Page>
              <BottomNav />
              <Modal />
            </div>
          </ModalProvider>
        </FilterProvider>
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}
