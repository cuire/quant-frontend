import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MarketHeader } from '@/components/MarketHeader';

export const Route = createFileRoute('/storage')({
  component: StorageLayout,
});

function StorageLayout() {
  return (
    <div style={{ minHeight: '100vh', background: '#1A2026', color: '#E7EEF7', paddingBottom: 80 }}>
      <MarketHeader balance={243.16} onFilterChange={() => {}} hideFilters={true} />
      <Outlet />
    </div>
  );
}

