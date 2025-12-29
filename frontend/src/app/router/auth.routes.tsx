import { createRoute } from '@tanstack/react-router'
import { LazyRoute } from './_lazyRoute'
import { lazy } from 'react'
import { rootRoute } from './_rootRoute'

const PageLogin = lazy(() => require('@/pages/auth/login/login.page'))

export const AuthLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/login',
  component: () => <LazyRoute Component={PageLogin} />,
  beforeLoad: () => ({ breadcrumb: 'Login' }),
})
