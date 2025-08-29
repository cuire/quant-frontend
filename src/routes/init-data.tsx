import { createFileRoute } from '@tanstack/react-router';
import { InitDataPage } from '@/pages/InitDataPage';

export const Route = createFileRoute('/init-data')({
  component: InitData,
});

function InitData() {
  return <InitDataPage />;
}
