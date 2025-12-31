import { createDetailRoute } from '@/app/router/routes/_components/DetailRoute'
import { LazyRoute } from '@/app/router/routes/_components/lazyRoute'
import { routeMaintenance } from '@/app/router/routes/maintenance.routes'
import { createRoute, Outlet } from '@tanstack/react-router'
import { lazy } from 'react'

export const PageComponentType = lazy(
  () => import('@/pages/maintenance/componentType/ComponentType')
)
export const PageComponentTypeDetail = lazy(
  () => import('@/pages/maintenance/componentType/ComponentTypeDetail')
)

// export const PageComponentTypeJob = lazy(
//   () => import('@/pages/maintenance/componentType/pages/ComponentTypeJob')
// )

export const routeComponentType = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'component-type',
  component: Outlet,
  beforeLoad: () => ({
    breadcrumb: 'Component Type',
  }),
})
export const routeComponentTypeList = createRoute({
  getParentRoute: () => routeComponentType,
  path: '/',
  beforeLoad: () => ({
    breadcrumb: 'List',
  }),
  component: () => <LazyRoute Component={PageComponentType} />,
})
export const routeComponentTypeDetail = createDetailRoute({
  parent: routeComponentType,
  path: '/$id',
  Component: Outlet,
})
export const routeComponentTypeDetailPage = createRoute({
  getParentRoute: () => routeComponentTypeDetail,
  path: '/',
  beforeLoad: () => ({
    breadcrumb: 'View',
  }),
  component: () => <LazyRoute Component={PageComponentTypeDetail} />,
})
// export const routeComponentTypeJob = createRoute({
//   getParentRoute: () => routeComponentTypeDetail,
//   path: 'job',
//   beforeLoad: () => ({
//     breadcrumb: 'Job',
//   }),
//   component: () => <LazyRoute Component={PageComponentTypeJob} />,
// })

routeComponentType.addChildren([
  routeComponentTypeList,
  routeComponentTypeDetail.addChildren([
    routeComponentTypeDetailPage,
    // routeComponentTypeJob,
  ]),
])
