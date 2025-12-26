import { lazy } from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import AttachFile from '@mui/icons-material/AttachFile'
import Timeline from '@mui/icons-material/Timeline'
import Inventory from '@mui/icons-material/Inventory'
import TrackChanges from '@mui/icons-material/TrackChanges'
import ReportProblem from '@mui/icons-material/ReportProblem'
import Build from '@mui/icons-material/Build'
import Speed from '@mui/icons-material/Speed'
import Straighten from '@mui/icons-material/Straighten'
import Work from '@mui/icons-material/Work'
import Comment from '@mui/icons-material/Comment'
import Folder from '@mui/icons-material/Folder'

import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'
import { TypeTblMaintLog } from '@/core/api/generated/api'

// Lazy imports
const TabHistory = lazy(() => import('./tabs/TabHistory'))
const TabStockUsed = lazy(() => import('./tabs/TabStockUsed'))
const TabFollow = lazy(() => import('./tabs/TabFollow'))
const TabFailureReport = lazy(() => import('./tabs/TabFailureReport'))
const TabResourceUsed = lazy(() => import('./tabs/TabResourceUsed'))
const TabLogCounter = lazy(() => import('./tabs/TabLogCounter'))
const TabMeasurePoint = lazy(() => import('./tabs/TabMeasurePoint'))
const TabWorkOrders = lazy(() => import('./tabs/TabWorkOrders'))
const TabComments = lazy(() => import('./tabs/TabComments'))
const TabCompAttach = lazy(() => import('./tabs/TabCompAttach'))
const TabAttachment = lazy(() => import('./tabs/TabAttachment'))

// Tabs
const tabs: ReusableTabItem[] = [
  { label: 'History', icon: <AccountTree />, component: TabHistory },
  { label: 'Stocks Used', icon: <Inventory />, component: TabStockUsed },
  { label: 'Follow', icon: <TrackChanges />, component: TabFollow },
  {
    label: 'Failure Report',
    icon: <ReportProblem />,
    component: TabFailureReport,
  },
  { label: 'Resource Used', icon: <Build />, component: TabResourceUsed },
  { label: 'Log Counter', icon: <Speed />, component: TabLogCounter },
  { label: 'Measure Point', icon: <Straighten />, component: TabMeasurePoint },
  { label: 'WorkOrders', icon: <Work />, component: TabWorkOrders },
  {
    label: 'Comment (OverDue Rea.)',
    icon: <Comment />,
    component: TabComments,
  },
  { label: 'Comp Attach', icon: <Folder />, component: TabCompAttach },
  { label: 'Attachment', icon: <AttachFile />, component: TabAttachment },
]

type Props = {
  selectedMaintLog?: TypeTblMaintLog | null
}

const TabsComponent = ({ selectedMaintLog }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey='tab'
      fillHeight
      tabProps={{
        selected: selectedMaintLog,
        label: selectedMaintLog?.tblComponentUnit?.compNo,
      }}
    />
  )
}

export default TabsComponent
