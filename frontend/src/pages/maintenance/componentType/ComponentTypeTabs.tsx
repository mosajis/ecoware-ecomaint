import { lazy } from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import BarChart from '@mui/icons-material/BarChart'
import ContentCopy from '@mui/icons-material/ContentCopy'
import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'

// Lazy imports
const TabJob = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabJob')
)
const TabCounter = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabCounter')
)
const TabComponentUnit = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabComponentUnit')
)

// Define tabs using the reusable format
const tabs: ReusableTabItem[] = [
  { label: 'Component', icon: <ContentCopy />, component: TabComponentUnit },
  { label: 'Job', icon: <AccountTree />, component: TabJob },
  { label: 'Counter', icon: <BarChart />, component: TabCounter },
]

type Props = {
  compTypeId?: number | undefined | null
  label?: string | undefined | null
}

const ComponentTypeTabs = ({ compTypeId, label }: Props) => {
  return (
    <TabsContainer
      persistInUrl
      tabs={tabs}
      queryParamKey='tab'
      fillHeight={true}
      tabProps={{ selected: compTypeId, label }}
    />
  )
}

export default ComponentTypeTabs
