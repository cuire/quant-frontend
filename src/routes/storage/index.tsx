import { createFileRoute, redirect } from '@tanstack/react-router';
import { StorageTabs } from '@/components/StorageTabs';

export const Route = createFileRoute('/storage/')({
  beforeLoad: () => {
    throw redirect({
      to: '/storage/offers/received',
    });
  },
  component: StorageIndexPage,
});

function StorageIndexPage() {
  return <StorageTabs activeTab="offers" />;
}
