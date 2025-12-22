// ...existing code...
import { lazy } from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import AttachFile from '@mui/icons-material/AttachFile'
import Inventory from '@mui/icons-material/Inventory'
import Build from '@mui/icons-material/Build'
import ReportProblem from '@mui/icons-material/ReportProblem'
import Straighten from '@mui/icons-material/Straighten'

import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'

// Lazy imports (updated)
const TabGeneral = lazy(() => import('./tabs/TabGeneral'))
const TabResourceUsed = lazy(() => import('./tabs/TabResourceUsed'))
const TabStockUsed = lazy(() => import('./tabs/TabStockUsed'))
const TabAttachments = lazy(() => import('./tabs/TabAttachments'))
const TabMeasurePoints = lazy(() => import('./tabs/TabMeasurePoints'))

// Tabs (new order)
const tabs: ReusableTabItem[] = [
  { label: 'General', icon: <AccountTree />, component: TabGeneral },
  { label: 'Resource Used', icon: <Build />, component: TabResourceUsed },
  { label: 'Stock Used', icon: <Inventory />, component: TabStockUsed },
  { label: 'Attachments', icon: <AttachFile />, component: TabAttachments },
  { label: 'Messurepoints', icon: <Straighten />, component: TabMeasurePoints },
]

type Props = {
  selectedMaintLogId?: number | undefined | null
}

const TabsComponent = ({ selectedMaintLogId }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey='tab'
      fillHeight
      tabProps={{ selected: selectedMaintLogId }}
    />
  )
}

export default TabsComponent
