import type { RouteObject } from 'react-router-dom';

import { Layout } from './components';
import { Home } from './pages';
import { CreatePage } from './pages/create';
import { DashboardPage } from './pages/dashboard';
import { SecretsEnginePage } from './pages/dashboard/engine';
import { NewSecretPage } from './pages/dashboard/engine/new';
import { SecretsPage } from './pages/dashboard/engine/secret';
import { LoginPage } from './pages/login';

const withLayout = (Component: React.JSX.Element) => {
  return <Layout>{Component}</Layout>;
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: withLayout(<Home />),
  },
  {
    path: '/create',
    element: withLayout(<CreatePage />),
  },
  {
    path: '/login',
    element: withLayout(<LoginPage />),
  },
  {
    path: '/dashboard',
    element: withLayout(<DashboardPage />),
  },
  {
    path: '/dashboard/engine',
    element: withLayout(<SecretsEnginePage />),
  },
  {
    path: '/dashboard/engine/new',
    element: withLayout(<NewSecretPage />),
  },
  {
    path: '/dashboard/engine/secret/:id',
    element: withLayout(<SecretsPage />),
  },
];
