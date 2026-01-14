import { createRoute } from '@tanstack/react-router'
import { protectedRoute } from './protected.routes'
import { lazy } from 'react'

// --- Lazy pages ---
export const PageUsers = lazy(() => import('@/pages/users/Users'))

// --- General parent route ---
export const UsersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'users',
  component: () => <PageUsers />,
  beforeLoad: () => ({ breadcrumb: 'Users' }),
})

// --- Add all children to parent ---
export const usersRoutesTree = UsersRoute
