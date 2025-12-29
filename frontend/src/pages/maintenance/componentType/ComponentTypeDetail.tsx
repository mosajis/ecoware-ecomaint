import ComponentTypeTabs from './ComponentTypeTabs'
import { routeComponentTypeDetail } from '@/app/router/routes/maintenance.routes'

const ComponentTypeDetail = () => {
  const { id } = routeComponentTypeDetail.useParams()
  const { breadcrumb } = routeComponentTypeDetail.useSearch()

  return <ComponentTypeTabs label={breadcrumb} compTypeId={id} />
}

export default ComponentTypeDetail
