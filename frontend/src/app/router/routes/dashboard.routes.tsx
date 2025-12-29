import { createRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import { protectedRoute } from './protected.routes'
import { LazyRoute } from './_components/lazyRoute'

const PageDashboard = lazy(() => import('@/pages/dashboard/Dashboard'))

export const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'dashboard',
  component: () => <LazyRoute Component={PageDashboard} />,
  beforeLoad: () => ({ breadcrumb: 'Dashboard' }),
})

export const dashboardRoutesTree = dashboardRoute
