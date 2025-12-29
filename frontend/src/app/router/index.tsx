import { createRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { protectedRoute } from './protected.routes'
import { AuthLoginRoute } from './auth.routes'
import { rootRoute } from './_rootRoute'

// --- Index redirect "/" → "/dashboard" ---
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: async () => {
    throw redirect({ to: '/dashboard' })
  },
})

// --- Route Tree ---
export const routeTree = rootRoute.addChildren([
  indexRoute,
  AuthLoginRoute,
  protectedRoute,
])
