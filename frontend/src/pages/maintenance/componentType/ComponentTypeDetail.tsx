import Spinner from '@/shared/components/Spinner'
import ComponentTypeTabs from './ComponentTypeTabs'
import { useEffect, useState } from 'react'
import { routeComponentTypeDetail } from './ComponentTypeRoutes'
import { tblCompType } from '@/core/api/generated/api'

const ComponentTypeDetail = () => {
  const { id } = routeComponentTypeDetail.useParams()
  const { breadcrumb } = routeComponentTypeDetail.useSearch()

  const [loading, setLoading] = useState(true)
  const [compType, setCompType] = useState<any>(null)

  // ===== Fetch Component Type =====
  useEffect(() => {
    if (!id) return

    setLoading(true)

    tblCompType
      .getById(id)
      .then(setCompType)
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // ===== Spinner =====
  if (loading) return <Spinner />

  // ===== Safety =====
  if (!compType) return null

  return <ComponentTypeTabs label={breadcrumb} compType={compType} />
}

export default ComponentTypeDetail
