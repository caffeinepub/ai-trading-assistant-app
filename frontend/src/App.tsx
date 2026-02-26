import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Watchlist } from './pages/Watchlist';
import { Portfolio } from './pages/Portfolio';
import { AIAssistant } from './pages/AIAssistant';

// Root route with Layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const watchlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watchlist',
  component: Watchlist,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: Portfolio,
});

const aiAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-assistant',
  component: AIAssistant,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  watchlistRoute,
  portfolioRoute,
  aiAssistantRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
