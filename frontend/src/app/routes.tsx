// import AppLayout from '@/shared/components/layout/AppLayout'
// import AppAuthorization from '@/shared/components/AppAthorization'
// import { Outlet, redirect } from '@tanstack/react-router'
// import { createRoute, createRootRoute } from '@tanstack/react-router'
// import { lazy } from 'react'
// import { LOCAL_STORAGE } from '@/const'
// import { NotFound } from '@/pages/NotFound'
// import { LazyRoute } from './routes/_lazyRoute'

// // --- Lazy pages ---
// const PageLogin = lazy(() => import('@/pages/auth/login/login.page'))
// const PageDashboard = lazy(() => import('@/pages/dashboard/Dashboard'))
// const PageAddress = lazy(() => import('@/pages/general/address/Address'))
// const PageLocation = lazy(() => import('@/pages/general/location/Location'))
// const PageEmployee = lazy(() => import('@/pages/general/employee/Employee'))
// const PageDiscipline = lazy(
//   () => import('@/pages/general/discipline/Discipline')
// )
// const PageCounterType = lazy(
//   () => import('@/pages/general/counterType/CounterType')
// )
// const PageMaintClass = lazy(
//   () => import('@/pages/general/maintClass/MaintClass')
// )
// const PageFollowStatus = lazy(
//   () => import('@/pages/general/followStatus/FollowStatus')
// )
// const PagePendingType = lazy(
//   () => import('@/pages/general/pendingType/PendingType')
// )
// const PageJobClass = lazy(() => import('@/pages/general/jobClass/JobClass'))
// const PageJobDescription = lazy(
//   () => import('@/pages/general/jobDescription/JobDescription')
// )
// const PageComponentUnitList = lazy(
//   () => import('@/pages/maintenance/componentUnit/ComponentUnit')
// )
// const PageComponentUnitTree = lazy(
//   () => import('@/pages/maintenance/componentUnit/ComponentUnitTree')
// )
// const PageComponentTypeList = lazy(
//   () => import('@/pages/maintenance/componentType/ComponentType')
// )
// const PageComponentTypeTree = lazy(
//   () => import('@/pages/maintenance/componentType/ComponentTypeTree')
// )
// const ComponentTypeJob = lazy(
//   () => import('@/pages/maintenance/componentType/pages/ComponentTypeJob')
// )
// const PageFunction = lazy(() => import('@/pages/maintenance/function/Function'))
// const PageFunctionTree = lazy(
//   () => import('@/pages/maintenance/function/FunctionTree')
// )
// const PageComponentJobList = lazy(
//   () => import('@/pages/maintenance/componentJob/ComponentJob')
// )
// const PageComponentWorkOrder = lazy(
//   () => import('@/pages/maintenance/workOrder/WorkOrder')
// )
// const PageRound = lazy(() => import('@/pages/maintenance/round/Round'))
// const PageMeasurePoints = lazy(
//   () => import('@/pages/maintenance/measurePoints/MeasurePoints')
// )
// const PageMeasurePointsLogs = lazy(
//   () => import('@/pages/maintenance/measurePointsLogs/MeasurePointsLogs')
// )
// const PageCountersLog = lazy(
//   () => import('@/pages/maintenance/counterLog/CounterLog')
// )
// const PageMaintLog = lazy(() => import('@/pages/maintenance/maintLog/MaintLog'))
// const PageStockItem = lazy(() => import('@/pages/stock/stockItem/StockItem'))
// const PageStockType = lazy(() => import('@/pages/stock/stockType/StockType'))
// const PageStockUsed = lazy(() => import('@/pages/stock/stockUsed/StockUsed'))
// const PageUsers = lazy(() => import('@/pages/users/Users'))
// const PageCounterUpdate = lazy(
//   () => import('@/pages/maintenance/counterUpdate/CountersUpdate')
// )
// const PageReportDaily = lazy(
//   () => import('@/pages/report/reportDaily/ReportDaily')
// )
// const PageReportFailure = lazy(
//   () => import('@/pages/report/reportFailure/ReportFailure')
// )
// const PageReportJob = lazy(() => import('@/pages/report/reportJob/ReportJob'))
// const PageReportMonthly = lazy(
//   () => import('@/pages/report/reportMounthly/ReportMounthly')
// )

// // --- Root ---
// export const rootRoute = createRootRoute({
//   notFoundComponent: NotFound,
//   component: () => <Outlet />,
// })

// // --- Protected Route ---
// export const protectedRoute = createRoute({
//   id: 'protected',
//   getParentRoute: () => rootRoute,
//   component: () => (
//     <AppAuthorization>
//       <AppLayout />
//     </AppAuthorization>
//   ),
//   notFoundComponent: NotFound,
//   beforeLoad: async ({ location }) => {
//     const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_KEY)
//     if (!token) {
//       throw redirect({
//         to: '/auth/login',
//         search: { redirect: location.href },
//       })
//     }
//   },
// })

// // --- Index redirect "/" → "/dashboard" ---
// export const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/',
//   beforeLoad: async () => {
//     throw redirect({ to: '/dashboard' })
//   },
// })

// // --- Auth Login ---
// export const AuthLoginRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/auth/login',
//   component: () => <LazyRoute Component={PageLogin} />,
//   beforeLoad: () => ({ breadcrumb: 'Login' }),
// })

// // --- Dashboard ---
// export const dashboardRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'dashboard',
//   component: () => <LazyRoute Component={PageDashboard} />,
//   beforeLoad: () => ({ breadcrumb: 'Dashboard' }),
// })

// // --- General routes ---
// export const generalRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'general',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'General' }),
// })

// export const generalAddressRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'address',
//   component: () => <LazyRoute Component={PageAddress} />,
//   beforeLoad: () => ({ breadcrumb: 'Address' }),
// })
// export const generalLocationRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'location',
//   component: () => <LazyRoute Component={PageLocation} />,
//   beforeLoad: () => ({ breadcrumb: 'Location' }),
// })
// export const generalEmployeeRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'employee',
//   component: () => <LazyRoute Component={PageEmployee} />,
//   beforeLoad: () => ({ breadcrumb: 'Employee' }),
// })
// export const generalDisciplineRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'discipline',
//   component: () => <LazyRoute Component={PageDiscipline} />,
//   beforeLoad: () => ({ breadcrumb: 'Discipline' }),
// })
// export const generalCounterTypeRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'counter-type',
//   component: () => <LazyRoute Component={PageCounterType} />,
//   beforeLoad: () => ({ breadcrumb: 'Counter Type' }),
// })
// export const generalMaintClassRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'maint-class',
//   component: () => <LazyRoute Component={PageMaintClass} />,
//   beforeLoad: () => ({ breadcrumb: 'Maint Class' }),
// })
// export const generalFollowStatusRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'follow-status',
//   component: () => <LazyRoute Component={PageFollowStatus} />,
//   beforeLoad: () => ({ breadcrumb: 'Follow Status' }),
// })
// export const generalPendingTypeRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'pending-type',
//   component: () => <LazyRoute Component={PagePendingType} />,
//   beforeLoad: () => ({ breadcrumb: 'Pending Type' }),
// })
// export const generalJobClassRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'job-class',
//   component: () => <LazyRoute Component={PageJobClass} />,
//   beforeLoad: () => ({ breadcrumb: 'Job Class' }),
// })
// export const generalJobDescriptionRoute = createRoute({
//   getParentRoute: () => generalRoute,
//   path: 'job-description',
//   component: () => <LazyRoute Component={PageJobDescription} />,
//   beforeLoad: () => ({ breadcrumb: 'Job Description' }),
// })

// // --- Maintenance routes ---
// export const maintenanceRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'maintenance',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Maintenance' }),
// })

// // Functions
// export const maintFunctionRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'function',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Function' }),
// })
// export const maintFunctionListRoute = createRoute({
//   getParentRoute: () => maintFunctionRoute,
//   path: '',
//   component: () => <LazyRoute Component={PageFunction} />,
//   beforeLoad: () => ({ breadcrumb: 'List View' }),
// })
// export const maintFunctionTreeRoute = createRoute({
//   getParentRoute: () => maintFunctionRoute,
//   path: 'tree-view',
//   component: () => <LazyRoute Component={PageFunctionTree} />,
//   beforeLoad: () => ({ breadcrumb: 'Tree View' }),
// })

// // Component Unit
// export const maintComponentUnitRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'component-unit',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Component Unit' }),
// })
// export const maintComponentUnitListRoute = createRoute({
//   getParentRoute: () => maintComponentUnitRoute,
//   path: '',
//   component: () => <LazyRoute Component={PageComponentUnitList} />,
//   beforeLoad: () => ({ breadcrumb: 'List View' }),
// })
// export const maintComponentUnitTreeRoute = createRoute({
//   getParentRoute: () => maintComponentUnitRoute,
//   path: 'tree-view',
//   component: () => <LazyRoute Component={PageComponentUnitTree} />,
//   beforeLoad: () => ({ breadcrumb: 'Tree View' }),
// })

// export const maintComponentTypeRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'component-type',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Component Type' }),
// })
// // Parent route for List view
// export const maintComponentTypeListRoute = createRoute({
//   getParentRoute: () => maintComponentTypeRoute,
//   path: 'list-view',
//   component: () => <LazyRoute Component={PageComponentTypeList} />,
//   beforeLoad: () => ({ breadcrumb: 'List View' }),
// })

// // Detail parent under List view
// export const maintComponentTypeListDetailRoute = createRoute({
//   getParentRoute: () => maintComponentTypeListRoute,
//   path: '$id',
//   component: () => <Outlet />,
//   beforeLoad: ({ params }) => ({ breadcrumb: `${params.id}` }),
// })

// // Job under List Detail
// export const maintComponentTypeListJobRoute = createRoute({
//   getParentRoute: () => maintComponentTypeListDetailRoute,
//   path: 'job',
//   // component: () => <LazyRoute Component={ComponentTypeJob} />,
//   beforeLoad: () => ({ breadcrumb: 'Job' }),
// })
// // --- Tree view ---
// // Parent route for Tree view
// export const maintComponentTypeTreeRoute = createRoute({
//   getParentRoute: () => maintComponentTypeRoute,
//   path: 'tree-view',
//   component: () => <LazyRoute Component={PageComponentTypeTree} />,
//   beforeLoad: () => ({ breadcrumb: 'Tree View' }),
// })

// // Detail parent under Tree view
// export const maintComponentTypeTreeDetailRoute = createRoute({
//   getParentRoute: () => maintComponentTypeTreeRoute,
//   path: '$id',
//   component: () => <Outlet />,
//   beforeLoad: ({ params }) => ({ breadcrumb: `${params.id}` }),
// })

// // Job under Tree Detail
// export const maintComponentTypeTreeJobRoute = createRoute({
//   getParentRoute: () => maintComponentTypeTreeDetailRoute,
//   path: 'job',
//   component: () => <LazyRoute Component={ComponentTypeJob} />,
//   beforeLoad: () => ({ breadcrumb: 'Job' }),
// })

// // Component Job
// export const maintComponentJobRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'component-job',
//   component: () => <LazyRoute Component={PageComponentJobList} />,
//   beforeLoad: () => ({ breadcrumb: 'Component Job' }),
// })

// // Work Order
// export const maintWorkOrderRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'work-order',
//   component: () => <LazyRoute Component={PageComponentWorkOrder} />,
//   beforeLoad: () => ({ breadcrumb: 'Work Order' }),
// })

// // Round
// export const maintRoundRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'round',
//   component: () => <LazyRoute Component={PageRound} />,
//   beforeLoad: () => ({ breadcrumb: 'Round' }),
// })

// // Measure Points
// export const maintMeasurePointsRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'measure-points',
//   component: () => <LazyRoute Component={PageMeasurePoints} />,
//   beforeLoad: () => ({ breadcrumb: 'Measure Points' }),
// })
// export const maintMeasurePointsLogsRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'measure-points-logs',
//   component: () => <LazyRoute Component={PageMeasurePointsLogs} />,
//   beforeLoad: () => ({ breadcrumb: 'Measure Points Logs' }),
// })
// export const maintMeasureCountersLogRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'counters-log',
//   component: () => <LazyRoute Component={PageCountersLog} />,
//   beforeLoad: () => ({ breadcrumb: 'Counters Logs' }),
// })
// export const maintMaintLogRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'maint-log',
//   component: () => <LazyRoute Component={PageMaintLog} />,
//   beforeLoad: () => ({ breadcrumb: 'Maint Logs' }),
// })
// export const maintCounterUpdateRoute = createRoute({
//   getParentRoute: () => maintenanceRoute,
//   path: 'update-counter',
//   component: () => <LazyRoute Component={PageCounterUpdate} />,
//   beforeLoad: () => ({ breadcrumb: 'Update Counter' }),
// })

// // --- Stock ---
// export const stockRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'stock',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Stock' }),
// })
// export const stockStockTypeRoute = createRoute({
//   getParentRoute: () => stockRoute,
//   path: 'type',
//   component: () => <LazyRoute Component={PageStockType} />,
//   beforeLoad: () => ({ breadcrumb: 'Stock Types' }),
// })
// export const stockStockItemRoute = createRoute({
//   getParentRoute: () => stockRoute,
//   path: 'item',
//   component: () => <LazyRoute Component={PageStockItem} />,
//   beforeLoad: () => ({ breadcrumb: 'Stock Items' }),
// })
// export const stockStockUsedRoute = createRoute({
//   getParentRoute: () => stockRoute,
//   path: 'used',
//   component: () => <LazyRoute Component={PageStockUsed} />,
//   beforeLoad: () => ({ breadcrumb: 'Stock Used' }),
// })

// // --- Users ---
// export const usersRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'users',
//   component: () => <LazyRoute Component={PageUsers} />,
//   beforeLoad: () => ({ breadcrumb: 'Users' }),
// })

// // --- Reports ---
// export const reportRoute = createRoute({
//   getParentRoute: () => protectedRoute,
//   path: 'report',
//   component: () => <Outlet />,
//   beforeLoad: () => ({ breadcrumb: 'Reports' }),
// })
// export const reportDailyRoute = createRoute({
//   getParentRoute: () => reportRoute,
//   path: 'daily',
//   component: () => <LazyRoute Component={PageReportDaily} />,
//   beforeLoad: () => ({ breadcrumb: 'Daily Report' }),
// })
// export const reportFailureRoute = createRoute({
//   getParentRoute: () => reportRoute,
//   path: 'failure',
//   component: () => <LazyRoute Component={PageReportFailure} />,
//   beforeLoad: () => ({ breadcrumb: 'Failure Report' }),
// })
// export const reportJobRoute = createRoute({
//   getParentRoute: () => reportRoute,
//   path: 'job',
//   component: () => <LazyRoute Component={PageReportJob} />,
//   beforeLoad: () => ({ breadcrumb: 'Job Report' }),
// })
// export const reportMonthlyRoute = createRoute({
//   getParentRoute: () => reportRoute,
//   path: 'monthly',
//   component: () => <LazyRoute Component={PageReportMonthly} />,
//   beforeLoad: () => ({ breadcrumb: 'Monthly Report' }),
// })

// // --- Route Tree ---
// export const routeTree = rootRoute.addChildren([
//   indexRoute,
//   AuthLoginRoute,
//   protectedRoute.addChildren([
//     dashboardRoute,
//     generalRoute.addChildren([
//       generalAddressRoute,
//       generalLocationRoute,
//       generalEmployeeRoute,
//       generalDisciplineRoute,
//       generalCounterTypeRoute,
//       generalMaintClassRoute,
//       generalFollowStatusRoute,
//       generalPendingTypeRoute,
//       generalJobClassRoute,
//       generalJobDescriptionRoute,
//     ]),
//     maintenanceRoute.addChildren([
//       maintComponentTypeRoute.addChildren([
//         // List view
//         maintComponentTypeListRoute.addChildren([
//           maintComponentTypeListDetailRoute.addChildren([
//             maintComponentTypeListJobRoute,
//             // می‌تونی اینجا counter یا childهای دیگه هم اضافه کنی
//           ]),
//         ]),
//         // // Tree view
//         // maintComponentTypeTreeRoute.addChildren([
//         //   maintComponentTypeTreeDetailRoute.addChildren([
//         //     maintComponentTypeTreeJobRoute,
//         //     // می‌تونی اینجا counter یا childهای دیگه هم اضافه کنی
//         //   ]),
//         // ]),
//       ]),
//       maintComponentJobRoute,
//       maintWorkOrderRoute,
//       maintRoundRoute,
//       maintMeasurePointsRoute,
//       maintMeasurePointsLogsRoute,
//       maintMeasureCountersLogRoute,
//       maintMaintLogRoute,
//       maintCounterUpdateRoute,
//     ]),
//     // stockRoute.addChildren([
//     //   stockStockTypeRoute,
//     //   stockStockItemRoute,
//     //   stockStockUsedRoute,
//     // ]),
//     // usersRoute,
//     // reportRoute.addChildren([
//     //   reportDailyRoute,
//     //   reportFailureRoute,
//     //   reportJobRoute,
//     //   reportMonthlyRoute,
//     // ]),
//   ]),
// ])
