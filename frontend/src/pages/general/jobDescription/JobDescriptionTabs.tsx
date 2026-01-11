import Edit from '@mui/icons-material/Edit'
import AttachFile from '@mui/icons-material/AttachFile'
import Build from '@mui/icons-material/Build'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Tune from '@mui/icons-material/Tune'
import TabsContainer, {
  type ReusableTabItem,
} from '@/shared/components/TabsContainer'
import { lazy } from 'react'

// Lazy-loaded tab components
const TabMaintLog = lazy(() => import('./tabs/TabMaintLog'))
const TabAttachment = lazy(() => import('./tabs/TabAttachment'))
const TabComponentUnit = lazy(() => import('./tabs/TabComponentUnit'))
const TabTriggers = lazy(() => import('./tabs/TabTriggers'))
const TabJobDescription = lazy(() => import('./tabs/TabJobDescription'))

// Define tabs in reusable format
const tabs: ReusableTabItem[] = [
  {
    label: 'Description',
    icon: <Edit />,
    component: TabJobDescription,
  },
  { label: 'MaintLog', icon: <CheckCircle />, component: TabMaintLog },
  { label: 'Component Unit', icon: <Build />, component: TabComponentUnit },
  { label: 'Triggers (not set)', icon: <Tune />, component: TabTriggers },
  { label: 'Attachment', icon: <AttachFile />, component: TabAttachment },
]

type Props = {
  jobDescriptionId?: number | undefined | null
  label?: string | null
}

export function Tabs(props: Props) {
  const { jobDescriptionId, label } = props
  return <TabsContainer tabs={tabs} tabProps={{ jobDescriptionId, label }} />
}
