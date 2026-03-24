import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { BillingPage } from '@/pages/billing/BillingPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { EventsPage } from '@/pages/events/EventsPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { UserDetailsPage } from '@/pages/users/UserDetailsPage'
import { UsersPage } from '@/pages/users/UsersPage'

import { AppLayout } from '../layouts/AppLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/users', element: <UsersPage /> },
      { path: '/users/:userId', element: <UserDetailsPage /> },
      { path: '/billing', element: <BillingPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
