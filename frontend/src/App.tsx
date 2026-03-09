import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/user/LandingPage';
import DashboardPage from './pages/admin/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'booking', element: <div className="pt-32 p-8 text-center">Booking Flow Component</div> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'queue', element: <div className="p-4">Live Queue Management</div> },
      { path: 'clients', element: <div className="p-4">Client CRM</div> },
      { path: 'analytics', element: <div className="p-4">Business Analytics</div> },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;