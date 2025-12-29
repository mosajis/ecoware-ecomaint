import { lazy } from 'react'
import { createRoute, Outlet } from '@tanstack/react-router'
import { protectedRoute } from './protected.routes'
import { LazyRoute } from './_components/lazyRoute'
import ComponentTypeJob from '@/pages/maintenance/componentType/pages/ComponentTypeJob'

// --- Lazy pages ---
export const PageFunction = lazy(
  () => import('@/pages/maintenance/function/Function')
)
export const PageFunctionTree = lazy(
  () => import('@/pages/maintenance/function/FunctionTree')
)
export const PageComponentUnitList = lazy(
  () => import('@/pages/maintenance/componentUnit/ComponentUnit')
)
export const PageComponentUnitTree = lazy(
  () => import('@/pages/maintenance/componentUnit/ComponentUnitTree')
)
export const PageComponentTypeList = lazy(
  () => import('@/pages/maintenance/componentType/ComponentType')
)
export const PageComponentTypeTree = lazy(
  () => import('@/pages/maintenance/componentType/ComponentTypeTree')
)
export const PageComponentTypeJob = lazy(
  () => import('@/pages/maintenance/componentType/pages/ComponentTypeJob')
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

// --- Component Unit ---
export const routeComponentUnit = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'component-unit',
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: 'Component Unit' }),
})
export const routeComponentUnitList = createRoute({
  getParentRoute: () => routeComponentUnit,
  path: 'list-view',
  component: () => <LazyRoute Component={PageComponentUnitList} />,
  beforeLoad: () => ({ breadcrumb: 'List View' }),
})
export const routeComponentUnitTree = createRoute({
  getParentRoute: () => routeComponentUnit,
  path: 'tree-view',
  component: () => <LazyRoute Component={PageComponentUnitTree} />,
  beforeLoad: () => ({ breadcrumb: 'Tree View' }),
})
routeComponentUnit.addChildren([routeComponentUnitList, routeComponentUnitTree])

export const routeComponentType = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'component-type',
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: 'Component Type' }),
})

export const routeComponentTypeList = createRoute({
  getParentRoute: () => routeComponentType,
  path: 'list-view',
  component: () => <LazyRoute Component={PageComponentTypeList} />,
  beforeLoad: () => ({ breadcrumb: 'List View' }),
})

export const routeComponentTypeJob = createRoute({
  getParentRoute: () => routeComponentType,
  path: 'list-view/$id/job',
  component: () => <LazyRoute Component={ComponentTypeJob} />,
  beforeLoad: () => ({ breadcrumb: 'jobs' }),
})

// --- Component Job ---
export const routeComponentJob = createRoute({
  getParentRoute: () => routeMaintenance,
  path: 'component-job',
  component: () => <LazyRoute Component={PageComponentJob} />,
  beforeLoad: () => ({ breadcrumb: 'Component Job' }),
})

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

// --- Component Type routes ---
routeComponentType.addChildren([routeComponentTypeList, routeComponentTypeJob])

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
