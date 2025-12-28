import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'
import { lazy } from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import AddBox from '@mui/icons-material/AddBox'
import AttachFile from '@mui/icons-material/AttachFile'
import BarChart from '@mui/icons-material/BarChart'
import BugReport from '@mui/icons-material/BugReport'
import Build from '@mui/icons-material/Build'
import CheckCircle from '@mui/icons-material/CheckCircle'
import ColorLens from '@mui/icons-material/ColorLens'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Description from '@mui/icons-material/Description'
import DoneAll from '@mui/icons-material/DoneAll'
import StackedLineChart from '@mui/icons-material/StackedLineChart'
import Tune from '@mui/icons-material/Tune'
import { TypeTblComponentUnit } from '@/core/api/generated/api'

// Lazy imports
const TabDetails = lazy(() => import('./tabs/TabDetails'))
const TabJob = lazy(() => import('./tabs/TabJob'))
const TabCounter = lazy(() => import('./tabs/TabCounter'))
const TabWorkOrder = lazy(() => import('./tabs/TabWorkOrder'))
const TabMaintLog = lazy(() => import('./tabs/TabMaintLog'))
const TabAttachment = lazy(() => import('./tabs/TabAttachment'))
const TabJobAttachment = lazy(() => import('./tabs/TabJobAttachment'))
const TabFailureReport = lazy(() => import('./tabs/TabFailureReport'))
const TabPerformed = lazy(() => import('./tabs/TabPerformed'))
const TabPart = lazy(() => import('./tabs/TabPart'))
const TabMeasures = lazy(() => import('./tabs/TabMeasures'))
const TabOilInfo = lazy(() => import('./tabs/TabOilInfo'))
const TabStockUsed = lazy(() => import('./tabs/TabStockUsed'))

type Props = {
  componentUnit?: TypeTblComponentUnit | undefined | null
  label?: string | null
}

// Define tabs
const tabs: ReusableTabItem[] = [
  { label: 'Details', icon: <Description />, component: TabDetails },
  { label: 'Job', icon: <AccountTree />, component: TabJob },
  { label: 'Counter', icon: <BarChart />, component: TabCounter },
  { label: 'Work Order', icon: <ContentCopy />, component: TabWorkOrder },
  { label: 'Maint Log', icon: <DoneAll />, component: TabMaintLog },
  { label: 'Attachment', icon: <AttachFile />, component: TabAttachment },
  { label: 'Job Attachment', icon: <AddBox />, component: TabJobAttachment },
  { label: 'Failure Report', icon: <BugReport />, component: TabFailureReport },
  { label: 'Performed', icon: <CheckCircle />, component: TabPerformed },
  { label: 'Part', icon: <Build />, component: TabPart },
  { label: 'Measures', icon: <Tune />, component: TabMeasures },
  { label: 'Oil Info', icon: <ColorLens />, component: TabOilInfo },
  { label: 'Stock Used', icon: <StackedLineChart />, component: TabStockUsed },
]

const ComponentUnitTabs = (props: Props) => {
  const { label, componentUnit } = props
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey='tab'
      tabProps={{
        label,
        componentUnit,
      }}
    />
  )
}

export default ComponentUnitTabs
