import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WixPatternsProvider } from '@wix/patterns/provider';
import { JewelsCollectionPage } from './pages/collection';
import { JewelEntityPage } from './pages/entity';
import '@wix/design-system/styles.global.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <JewelsCollectionPage />,
    },
    {
      path: '/:entityId',
      element: <JewelEntityPage />,
    },
  ],
  {
    basename:
      '/wix/html/dashboard-asset/7a09bd5e-9992-4ad8-b3d2-e179774468ff.html',
  }
);

// Wrapping the router with withDashboard to provide the context for the SDK
// Wrapping the router with WixPatternsProvider to provide the context for the patterns
export default function JewelsAppRouter() {
  return (
    <WixPatternsProvider>
      <RouterProvider router={router} />
    </WixPatternsProvider>
  );
}
