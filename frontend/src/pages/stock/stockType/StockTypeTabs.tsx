import { lazy } from 'react'
import AccountTree from '@mui/icons-material/AccountTree'
import Build from '@mui/icons-material/Build'

import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'

// Lazy imports (updated)
const TabComponentUnit = lazy(() => import('./tabs/tabCompUnit'))
const TabCompType = lazy(() => import('./tabs/tabCompType'))

// Tabs (new order)
const tabs: ReusableTabItem[] = [
  {
    label: 'Component Unit',
    icon: <AccountTree />,
    component: TabComponentUnit,
  },
  { label: 'Component Type', icon: <Build />, component: TabCompType },
]

type Props = {
  partTypeId?: number | undefined | null
}

const TabsComponent = ({ partTypeId }: Props) => {
  return (
    <TabsContainer
      tabs={tabs}
      queryParamKey='tab'
      fillHeight
      tabProps={{ selected: partTypeId }}
    />
  )
}

export default TabsComponent
