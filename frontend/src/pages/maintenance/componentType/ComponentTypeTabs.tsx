import { lazy } from 'react'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import BarChartIcon from '@mui/icons-material/BarChart'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import InventoryIcon from '@mui/icons-material/Inventory'
import StraightenIcon from '@mui/icons-material/Straighten'

import TabsContainer, {
  ReusableTabItem,
} from '@/shared/components/TabsContainer'
import { TypeTblCompType } from '@/core/api/generated/api'

// ===== Lazy Tabs =====
const TabJob = lazy(
  () => import('@/pages/maintenance/componentType/tabs/job/TabJob')
)

const TabCounter = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabCounter')
)

const TabComponentUnit = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabComponentUnit')
)

const TabAttachment = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabAttachment')
)

const TabMeasure = lazy(
  () => import('@/pages/maintenance/componentType/tabs/TabMeasures')
)

// ===== Tabs Config =====
const tabs: ReusableTabItem[] = [
  {
    label: 'Jobs',
    icon: <AccountTreeIcon />,
    component: TabJob,
  },
  {
    label: 'Counter Crud',
    icon: <BarChartIcon />,
    component: TabCounter,
  },

  {
    label: 'Measure Point Crud',
    icon: <StraightenIcon />,
    component: TabMeasure,
  },
  {
    label: 'Components',
    icon: <PrecisionManufacturingIcon />,
    component: TabComponentUnit,
  },
  {
    label: 'Attachments',
    icon: <AttachFileIcon />,
    component: TabAttachment,
  },
]

// ===== Props =====
type Props = {
  compType?: TypeTblCompType | null
  label?: string | null
}

// ===== Component =====
const ComponentTypeTabs = ({ compType, label }: Props) => {
  return (
    <TabsContainer
      persistInUrl
      tabs={tabs}
      queryParamKey='tab'
      fillHeight
      tabProps={{
        compType,
        label,
      }}
    />
  )
}

export default ComponentTypeTabs
