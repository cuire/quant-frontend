import { createFileRoute } from '@tanstack/react-router';
import { TONConnectPage } from '@/pages/TONConnectPage/TONConnectPage';

export const Route = createFileRoute('/ton-connect')({
  component: TONConnect,
});

function TONConnect() {
  return <TONConnectPage />;
}
