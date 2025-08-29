import { createFileRoute } from '@tanstack/react-router';
import { ThemeParamsPage } from '@/pages/ThemeParamsPage';

export const Route = createFileRoute('/theme-params')({
  component: ThemeParams,
});

function ThemeParams() {
  return <ThemeParamsPage />;
}
