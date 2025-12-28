import { lazy } from 'react'
import TabsContainer, {
  type ReusableTabItem,
} from '@/shared/components/TabsContainer'
import AttachFile from '@mui/icons-material/AttachFile'
import Build from '@mui/icons-material/Build'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Tune from '@mui/icons-material/Tune'
import AddBox from '@mui/icons-material/AddBox'

// Lazy-loaded tab components
const TabMaintLog = lazy(() => import('./tabs/TabMaintLog'))
const TabAttachment = lazy(() => import('./tabs/TabAttachment'))
const TabComponentUnit = lazy(() => import('./tabs/TabComponentUnit'))
const TabTriggers = lazy(() => import('./tabs/TabTriggers'))
const TabRevision = lazy(() => import('./tabs/TabRevision'))

// Define tabs in reusable format
const JobDescTabs: ReusableTabItem[] = [
  { label: 'MaintLog', icon: <CheckCircle />, component: TabMaintLog },
  { label: 'Component Unit', icon: <Build />, component: TabComponentUnit },
  { label: 'Triggers (not set)', icon: <Tune />, component: TabTriggers },
  { label: 'Attachment', icon: <AttachFile />, component: TabAttachment },
  { label: 'Revision (not set)', icon: <AddBox />, component: TabRevision },
]

type Props = {
  jobDescriptionId?: number | undefined | null
  label?: string | null
}

export function JobDescriptionTabs(props: Props) {
  const { jobDescriptionId, label } = props
  return (
    <TabsContainer
      tabs={JobDescTabs}
      queryParamKey='tab'
      tabProps={{ jobDescriptionId, label }}
    />
  )
}
