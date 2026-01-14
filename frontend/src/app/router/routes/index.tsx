import { createRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { protectedRoute } from './protected.routes'
import { AuthLoginRoute } from './auth.routes'
import { rootRoute } from './_components/rootRoute'
import { generalRouteTree } from './general.routes'
import { maintenanceRoutesTree } from './maintenance.routes'
import { dashboardRoutesTree } from './dashboard.routes'
import { usersRoutesTree } from './users.routes'
import { stockRouteTree } from './stocks.routes'
import { reportRouteTree } from './report.routes'

// --- Index redirect "/" → "/dashboard" ---
export const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  beforeLoad: async () => {
    throw redirect({ to: '/dashboard' })
  },
})

// --- Route Tree ---
export const routesTree = rootRoute.addChildren([
  indexRoute,
  AuthLoginRoute,
  protectedRoute.addChildren([
    reportRouteTree,
    stockRouteTree,
    usersRoutesTree,
    dashboardRoutesTree,
    generalRouteTree,
    maintenanceRoutesTree,
  ]),
])
