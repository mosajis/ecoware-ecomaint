import { lazy } from 'react'
import { createRoute, Outlet } from '@tanstack/react-router'
import { protectedRoute } from './protected.routes'
import { LazyRoute } from './_components/lazyRoute'
import { routeComponentType } from '@/pages/maintenance/componentType/ComponentTypeRoutes'
import { routeComponentUnit } from '@/pages/maintenance/componentUnit/ComponentUnitRoutes'
import { NotFound } from '@/pages/NotFound'

// --- Lazy pages ---
export const PageFunction = lazy(
  () => import('@/pages/maintenance/function/Function')
)
export const PageFunctionTree = lazy(
  () => import('@/pages/maintenance/function/FunctionTree')
)

export const PageComponentJob = lazy(
  () => import('@/pages/maintenance/componentJob/ComponentJob')
)
export const PageWorkOrder = lazy(
  () => import('@/pages/maintenance/workOrder/WorkOrder')
)
export const PageRound = lazy(() => import('@/pages/maintenance/round/Round'))
export const PageMeasurePoints = lazy(
  () => import('@/pages/maintenance/measurePoints/MeasurePoints')
)
export const PageMeasurePointsLogs = lazy(
  () => import('@/pages/maintenance/measurePointsLogs/MeasurePointsLogs')
)
export const PageCountersLog = lazy(
  () => import('@/pages/maintenance/counterLog/CounterLog')
)
export const PageMaintLog = lazy(
  () => import('@/pages/maintenance/maintLog/MaintLog')
)
export const PageCounterUpdate = lazy(
  () => import('@/pages/maintenance/counterUpdate/CountersUpdate')
)

// --- Maintenance root ---
export const routeMaintenance = createRoute({
  notFoundComponent: () => <NotFound />,
  getParentRoute: () => protectedRoute,
  path: 'maintenance',
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: 'Maintenance' }),
})

// --- Function ---
export const routeFunction = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'function',
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: 'Function' }),
})
export const routeFunctionList = createRoute({
  getParentRoute: () => routeFunction,
  path: 'list-view',
  component: () => <LazyRoute Component={PageFunction} />,
  beforeLoad: () => ({ breadcrumb: 'List View' }),
})
export const routeFunctionTree = createRoute({
  getParentRoute: () => routeFunction,
  path: 'tree-view',
  component: () => <LazyRoute Component={PageFunctionTree} />,
  beforeLoad: () => ({ breadcrumb: 'Tree View' }),
})
routeFunction.addChildren([routeFunctionList, routeFunctionTree])

// --- Work Order ---
export const routeWorkOrder = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'work-order',
  component: () => <LazyRoute Component={PageWorkOrder} />,
  beforeLoad: () => ({ breadcrumb: 'Work Order' }),
})

// --- Round ---
export const routeRound = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'round',
  component: () => <LazyRoute Component={PageRound} />,
  beforeLoad: () => ({ breadcrumb: 'Round' }),
})

// --- Measure Points ---
export const routeMeasurePoints = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'measure-points',
  component: () => <LazyRoute Component={PageMeasurePoints} />,
  beforeLoad: () => ({ breadcrumb: 'Measure Points' }),
})
export const routeMeasurePointsLogs = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'measure-points-logs',
  component: () => <LazyRoute Component={PageMeasurePointsLogs} />,
  beforeLoad: () => ({ breadcrumb: 'Measure Points Logs' }),
})

// --- Counters & Maint Logs ---
export const routeCountersLog = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'counters-log',
  component: () => <LazyRoute Component={PageCountersLog} />,
  beforeLoad: () => ({ breadcrumb: 'Counters Logs' }),
})
export const routeMaintLog = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'maint-log',
  component: () => <LazyRoute Component={PageMaintLog} />,
  beforeLoad: () => ({ breadcrumb: 'Maint Logs' }),
})

// --- Counter Update ---
export const routeCounterUpdate = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'update-counter',
  component: () => <LazyRoute Component={PageCounterUpdate} />,
  beforeLoad: () => ({ breadcrumb: 'Update Counter' }),
})

export const routeComponentJob = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'component-job',
  component: () => <LazyRoute Component={PageComponentJob} />,
  beforeLoad: () => ({ breadcrumb: 'Component Job' }),
})
// --- Maintenance root ---
export const maintenanceRoutesTree = routeMaintenance.addChildren([
  routeFunction,
  routeComponentUnit,
  routeComponentType,
  routeComponentJob,
  routeWorkOrder,
  routeRound,
  routeMeasurePoints,
  routeMeasurePointsLogs,
  routeCountersLog,
  routeCounterUpdate,
  routeMaintLog,
])
