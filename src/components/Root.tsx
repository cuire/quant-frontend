import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { QueryClientProvider } from '@tanstack/react-query';

import { App } from '@/components/App.tsx';
import { ErrorBoundary } from '@/components/ErrorBoundary.tsx';
import { publicUrl } from '@/helpers/publicUrl.ts';
import { queryClient } from '@/lib/queryClient.ts';

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <QueryClientProvider client={queryClient}>
        <TonConnectUIProvider
          manifestUrl={publicUrl('tonconnect-manifest.json')}
        >
          <App/>
        </TonConnectUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
