import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';
import { NotFound } from './components/NotFound.tsx';

// Create the router
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
