import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { initData } from '@telegram-apps/sdk-react';

/**
 * Hook to handle Telegram startParam redirects
 * Supports:
 * - market → /market/channels
 * - activity → /activity/gifts
 * - inventory → /storage
 * - profile → /profile
 */
export const useStartParamRedirect = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasProcessed.current) return;

    try {
      // Get startParam from Telegram initData
      initData.restore();
      const startParam = initData.startParam();

      if (!startParam) return;

      hasProcessed.current = true;
      console.log('Processing startParam:', startParam);

      // Handle simple page redirects
      const pageRoutes: Record<string, string> = {
        market: '/market/channels',
        activity: '/activity/gifts',
        inventory: '/storage',
        profile: '/profile',
      };

      if (pageRoutes[startParam.toLowerCase()]) {
        navigate({ to: pageRoutes[startParam.toLowerCase()] });
        return;
      }

      console.warn('Unknown startParam:', startParam);
    } catch (error) {
      console.error('Error processing startParam:', error);
    }
  }, [navigate]);
};

