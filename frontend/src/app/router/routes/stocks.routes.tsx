import { createRoute, Outlet } from '@tanstack/react-router'
import { LazyRoute } from './_components/lazyRoute'
import { protectedRoute } from './protected.routes'
import { lazy } from 'react'

// --- Lazy pages ---
export const PageStockItem = lazy(
  () => import('@/pages/stock/stockItem/StockItem')
)
export const PageStockType = lazy(
  () => import('@/pages/stock/stockType/StockType')
)

export const PageStockUsed = lazy(
  () => import('@/pages/stock/stockUsed/StockUsed')
)

export const PageAddress = lazy(() => import('@/pages/general/address/Address'))

// --- General parent route ---
export const StockRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: 'stock',
  component: () => <Outlet />,
  beforeLoad: () => ({ breadcrumb: 'Stock' }),
})

// --- General children ---
export const StockItemRoute = createRoute({
  getParentRoute: () => StockRoute,
  path: '/item',
  component: () => <LazyRoute Component={PageStockItem} />,
  beforeLoad: () => ({ breadcrumb: 'Item' }),
})

export const StockTypeRoute = createRoute({
  getParentRoute: () => StockRoute,
  path: '/type',
  component: () => <LazyRoute Component={PageStockType} />,
  beforeLoad: () => ({ breadcrumb: 'Type' }),
})

export const StockusedRoute = createRoute({
  getParentRoute: () => StockRoute,
  path: '/used',
  component: () => <LazyRoute Component={PageStockUsed} />,
  beforeLoad: () => ({ breadcrumb: 'Used' }),
})

// --- Add all children to parent ---
export const stockRouteTree = StockRoute.addChildren([
  StockItemRoute,
  StockTypeRoute,
  StockusedRoute,
])
