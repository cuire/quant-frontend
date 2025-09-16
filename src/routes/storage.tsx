import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { MarketTopBar } from '@/components/MarketHeader';
import { useModal } from '@/contexts/ModalContext';

export const Route = createFileRoute('/storage')({
  component: StorageLayout,
});

function StorageLayout() {
  const location = useLocation();
  const { openModal } = useModal();
  
  // Check if we're on the channels page
  const isOnChannelsPage = location.pathname === '/storage/channels';
  
  const handleAddChannel = () => {
    // Open the add channel modal or navigate to add channel page
    openModal('add-channel', {});
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketTopBar 
        showAddChannel={isOnChannelsPage}
        onAddChannel={handleAddChannel}
      />
      <Outlet />
    </div>
  );
}

