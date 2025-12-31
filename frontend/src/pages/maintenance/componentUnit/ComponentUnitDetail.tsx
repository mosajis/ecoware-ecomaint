import Spinner from '@/shared/components/Spinner'
import ComponentUnitTabs from './ComponentUnitTabs'
import { useEffect, useState } from 'react'
import { routeComponentUnitDetail } from './ComponentUnitRoutes'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

const ComponentTypeDetail = () => {
  const { id } = routeComponentUnitDetail.useParams()
  const { breadcrumb } = routeComponentUnitDetail.useSearch()

  const [loading, setLoading] = useState(true)
  const [componentUnit, setComponentUnit] =
    useState<TypeTblComponentUnit | null>(null)

  // ===== Fetch Component Type =====
  useEffect(() => {
    if (!id) return

    setLoading(true)

    tblComponentUnit
      .getById(id)
      .then(setComponentUnit)
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  // ===== Spinner =====
  if (loading) return <Spinner />

  // ===== Safety =====
  if (!componentUnit) return null

  return <ComponentUnitTabs label={breadcrumb} componentUnit={componentUnit} />
}

export default ComponentTypeDetail
