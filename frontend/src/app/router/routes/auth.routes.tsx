import { createRoute } from '@tanstack/react-router'
import { LazyRoute } from './_components/lazyRoute'
import { lazy } from 'react'
import { rootRoute } from './_components/rootRoute'

const PageLogin = lazy(() => import('@/pages/auth/login/login.page'))

export const AuthLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/login',
  component: () => <LazyRoute Component={PageLogin} />,
  beforeLoad: () => ({ breadcrumb: 'Login' }),
})
