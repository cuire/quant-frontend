import { createFileRoute } from '@tanstack/react-router';
import { IndexPage } from '@/pages/IndexPage/IndexPage';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <IndexPage />;
}
