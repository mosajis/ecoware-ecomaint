import EditNoteIcon from '@mui/icons-material/EditNote'
import BarChart from '@mui/icons-material/BarChart'
import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'
import { lazy } from 'react'
import { TypeTblCompTypeJob } from '@/core/api/generated/api'

// Lazy imports
const TabCounter = lazy(() => import('./tabs/TabCounter'))
const TabMeasures = lazy(() => import('./tabs/TabMasures'))
const TabJobDescription = lazy(() => import('./tabs/TabJobDescription'))

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  {
    label: 'Job Description',
    icon: <BarChart />,
    component: TabJobDescription,
  },
  { label: 'Job Counter', icon: <BarChart />, component: TabCounter },
  {
    label: 'Job Measure Points',
    icon: <EditNoteIcon />,
    component: TabMeasures,
  },
]

type Props = {
  compTypeJob?: TypeTblCompTypeJob | undefined | null
}

const Tabs = ({ compTypeJob }: Props) => {
  return <TabsContainer tabs={tabs} tabProps={{ compTypeJob }} />
}

export default Tabs
