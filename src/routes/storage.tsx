import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { MarketTopBar } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/storage')({
  component: StorageLayout,
});

function StorageLayout() {
  const location = useLocation();
  const { openModal } = useModal();
  const { t } = useTranslation();
  
  // Check if we're on the channels page
  const isOnChannelsPage = location.pathname === '/storage/channels';
  
  // State to track active subtab
  const [activeSubTab, setActiveSubTab] = useState(
    localStorage.getItem('storage_channels_subtab') || 'channels'
  );
  
  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newSubTab = localStorage.getItem('storage_channels_subtab') || 'channels';
      setActiveSubTab(newSubTab);
    };

    // Listen for custom storage event (same-tab changes from useLastTab hook)
    window.addEventListener('localStorageChange', handleStorageChange);
    
    // Listen for storage event (cross-tab changes)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localStorageChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const addButtonText = activeSubTab === 'channels' ? t('storage.addChannel') : t('storage.addGift');
  
  const handleAddChannel = () => {
    // Decide action based on active sub-tab saved by useLastTab hook
    if (activeSubTab === 'channels') {
      openModal('add-channel', {});
    } else {
      openModal('add-gift', {});
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketTopBar 
        showAddChannel={isOnChannelsPage}
        onAddChannel={handleAddChannel}
        addButtonText={addButtonText}
      />
      <Outlet />
    </div>
  );
}

