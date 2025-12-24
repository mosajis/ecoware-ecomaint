import React from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import Build from '@mui/icons-material/Build'
import Inventory from '@mui/icons-material/Inventory'
import AttachFile from '@mui/icons-material/AttachFile'
import Straighten from '@mui/icons-material/Straighten'

const TabGeneral = React.lazy(() => import('./steps/StepGeneral'))
const TabResourceUsed = React.lazy(() => import('./steps/StepResourceUsed'))
const TabStockUsed = React.lazy(() => import('./steps/StepStockUsed'))
const TabAttachments = React.lazy(() => import('./steps/StepAttachments'))
const TabMeasurePoints = React.lazy(() => import('./steps/StepMeasurePoints'))

export type ReportWorkStep = {
  label: string
  icon: React.ReactNode
  component: React.LazyExoticComponent<React.ComponentType<any>>
}

export const reportWorkSteps: ReportWorkStep[] = [
  {
    label: 'General',
    icon: <AccountTree />,
    component: TabGeneral,
  },
  { label: 'Resource Used', icon: <Build />, component: TabResourceUsed },
  { label: 'Stock Used', icon: <Inventory />, component: TabStockUsed },
  { label: 'Attachments', icon: <AttachFile />, component: TabAttachments },
  {
    label: 'Measure Points',
    icon: <Straighten />,
    component: TabMeasurePoints,
  },
]
