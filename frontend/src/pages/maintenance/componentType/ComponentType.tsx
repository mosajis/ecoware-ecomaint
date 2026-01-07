import Splitter from '@/shared/components/Splitter/Splitter'
import DataGrid from '@/shared/components/dataGrid/DataGrid'
import Tree from '@/shared/components/tree/Tree'
import ComponentTypeUpsert from './ComponentTypeUpsert'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { GridColDef } from '@mui/x-data-grid'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'
import { routeComponentTypeDetail } from './ComponentTypeRoutes'
import { useCustomizedTree } from '@/shared/hooks/useDataTree'
import { TreeItem } from 'react-complex-tree'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageComponentTypeList() {
  const router = useRouter()

  const [selectedRow, setSelectedRow] = useState<TypeTblCompType | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const { rows, loading } = useDataGrid<TypeTblCompType>(
    tblCompType.getAll,
    tblCompType.deleteById,
    'compTypeId'
  )

  /* ---- Grid Columns ---- */
  const columns = useMemo<GridColDef<TypeTblCompType>[]>(
    () => [
      { field: 'compTypeNo', headerName: 'Code', width: 120 },
      { field: 'compName', headerName: 'Name', flex: 1 },
      { field: 'compType', headerName: 'Model/Type', width: 200 },
      { field: 'orderNo', headerName: 'OrderNo', width: 100 },
    ],
    []
  )

  /* ---- Actions ---- */
  const handleAddClick = useCallback(() => {
    setSelectedRow(null)
    setSelectedIds([])
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleDoubleClick = useCallback(
    (row: TypeTblCompType) => {
      router.navigate({
        to: routeComponentTypeDetail.to,
        params: { id: row.compTypeId },
        search: { breadcrumb: row.compName },
      })
    },
    [router]
  )

  return (
    <>
      {/* <Splitter initialPrimarySize='30%'> */}
      <DataGrid
        label='List View'
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={row => row.compTypeId}
        disableDensity
        disableRowNumber
        onAddClick={handleAddClick}
        onRowDoubleClick={({ row }) => handleDoubleClick(row)}
      />
      {/* <Tree
          items={treeItems}
          onSelectionChange={handleTreeSelection}
          onDoubleClick={handleDoubleClick}
          onAddClick={handleAddClick}
        />

        */}
      {/* </Splitter> */}

      <ComponentTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRow?.compTypeId}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {}}
      />
    </>
  )
}
