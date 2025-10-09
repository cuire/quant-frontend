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
import { Loader } from '@/components/Loader';
import { useUser } from '@/lib/api-hooks';
import { useStartParamRedirect } from '@/hooks/useStartParamRedirect';
import { LanguageSync } from '@/components/LanguageSync';

export const Route = createRootRoute({
  component: Root,
});

// Component that handles startParam redirects - must be inside ModalProvider
function StartParamHandler() {
  useStartParamRedirect();
  return null;
}

function Root() {
  // const lp = useLaunchParams();
  const { isLoading: isUserLoading } = useUser();

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

  // Show loader during initial user data fetch
  if (isUserLoading) {
    return <Loader isLoading={true} />;
  }

  return (
    <TonConnectUIProvider manifestUrl={publicUrl('tonconnect-manifest.json')}>
      <ThemeProvider>
        <FilterProvider>
          <ModalProvider>
            <LanguageSync />
            <StartParamHandler />
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
