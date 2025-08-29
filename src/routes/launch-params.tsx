import { createFileRoute } from '@tanstack/react-router';
import { LaunchParamsPage } from '@/pages/LaunchParamsPage';

export const Route = createFileRoute('/launch-params')({
  component: LaunchParams,
});

function LaunchParams() {
  return <LaunchParamsPage />;
}
