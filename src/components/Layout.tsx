import { Outlet } from '@tanstack/react-router';
import { BottomNav } from '@/components/Navigation';

export const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <main style={{ paddingBottom: '80px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
