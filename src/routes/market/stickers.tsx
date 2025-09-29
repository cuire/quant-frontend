import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/market/stickers')({
  component: StickersPage,
});

function StickersPage() {
  return (
    <>
      <div className="px-4 py-6">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Stickers Coming Soon</h3>
          <p className="text-gray-400">This feature is currently under development</p>
        </div>
      </div>
    </>
  );
}
