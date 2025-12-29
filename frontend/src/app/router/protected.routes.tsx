import { createRoute } from '@tanstack/react-router'
import { Outlet, redirect } from '@tanstack/react-router'
import AppLayout from '@/shared/components/layout/AppLayout'
import AppAuthorization from '@/shared/components/AppAthorization'
import { LOCAL_STORAGE } from '@/const'
import { NotFound } from '@/pages/NotFound'
import { rootRoute } from './_rootRoute'

// --- Protected Route ---
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  path: '',
  component: () => (
    <AppAuthorization>
      <AppLayout />
      <Outlet /> {/* children route ها اینجا رندر می‌شوند */}
    </AppAuthorization>
  ),
  notFoundComponent: NotFound,
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY)
    if (!token) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href },
      })
    }
  },
})
