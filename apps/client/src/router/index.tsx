import { createBrowserRouter, Outlet } from 'react-router-dom';
import App from '../app/app';
import {
  Signup,
  Connect,
  Home,
  Signin,
  RootLayout,
  Post,
  Verify,
  Logout,
  Auth,
} from '@client/pages';
import { Loading, SuspenseWrapper } from '@client/lib/components';

export enum Routes {
  ROOT = '/',
  AUTH = '/auth',
  HOME = '/',
  CONNECT = '/connect',
  POST = '/post',
  LOGOUT = '/logout',
  CALLBACK = '/callback',
}

export const router = createBrowserRouter([
  {
    //any routes that should not passed via <App/>
    path: Routes.CALLBACK,
    element: <SuspenseWrapper />,
    children: [
      {
        path: 'verify',
        element: <Verify />,
      },
    ],
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: Routes.AUTH,
        element: <Auth />,
        // element: <SuspenseWrapper />,
        children: [
          {
            path: '',
            element: <Signin />,
          },
          {
            path: 'signup',
            element: <Signup />,
          },
          {
            path: 'signin',
            element: <Signin />,
          },
          {
            path: 'verify',
            element: <Verify />,
          },
        ],
      },
      {
        path: Routes.ROOT,
        element: <RootLayout />,
        children: [
          {
            path: '',
            element: <Home />,
          },
          {
            path: Routes.CONNECT,
            element: <Connect />,
            // children: [{ path: '/:provider' }],
          },
          {
            path: Routes.POST,
            element: <Post />,
          },
          {
            path: Routes.LOGOUT,
            element: <Logout />,
          },
        ],
      },
      {
        path: '/check',
        element: <Loading />,
      },
    ],
  },
]);
