import { routeComponentTypeDetail } from './ComponentTypeRoutes'
import ComponentTypeTabs from './ComponentTypeTabs'

const ComponentTypeDetail = () => {
  const { id } = routeComponentTypeDetail.useParams()
  const { breadcrumb } = routeComponentTypeDetail.useSearch()

  return <ComponentTypeTabs label={breadcrumb} compTypeId={id} />
}

export default ComponentTypeDetail
