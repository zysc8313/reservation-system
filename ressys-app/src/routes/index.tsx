import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthRoute } from '../common/AuthRoute';
import { PrivateRoute } from '../common/PrivateRoute';
import { AppLayout } from '../layout/AppLayout';
import { BaseLayout } from '../layout/BaseLayout';
import { RootError } from '../layout/RootError';

const Login = lazy(() => import('./auth/Login'));
const Checkout = lazy(() => import('./checkout/Checkout'));
const Orders = lazy(() => import('./order/Orders'));

export const router = createBrowserRouter([
  {
    path: '',
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [{ path: 'sign-in', element: <AuthRoute as={Login} /> }],
  },
  {
    path: '',
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Checkout /> },
      { path: 'orders', element: <PrivateRoute as={Orders} /> },
    ],
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
