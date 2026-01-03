import Splitter from '@/shared/components/Splitter'
import CustomizedTree from '@/shared/components/tree/CustomeTree'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ComponentUnitUpsert from './ComponentUnitUpsert'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useCallback, useMemo, useState } from 'react'
import { useDataTree } from '@/shared/hooks/useDataTree'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import { useRouter } from '@tanstack/react-router'
import { routeComponentUnitDetail } from './ComponentUnitRoutes'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageComponentUnit() {
  const [selected, setSelected] = useState<TypeTblComponentUnit | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  // === Stable callbacks ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      paginate: false,
      include: {
        tblCompType: true,
        tblCompStatus: true,
        tblLocation: true,
      },
    })
  }, [])

  const mapper = useCallback(
    (row: TypeTblComponentUnit) => ({
      id: row.compId.toString(),
      label: row.compNo || '',
      parentId: row.parentCompId?.toString() ?? null,
      data: row,
    }),
    []
  )

  const { rows, loading, handleDelete, handleRefresh } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    'compId'
  )

  // ✅ memoized
  const handleRowClick = useCallback(
    (params: { row: TypeTblComponentUnit }) => {
      setSelected(params.row)
    },
    []
  )

  const handleCreate = useCallback(() => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblComponentUnit) => {
    setSelected(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setOpenForm(false)
    setSelected(null)
  }, [])

  const handleFormSuccess = useCallback(
    (data: TypeTblComponentUnit) => {
      handleRefresh()
      handleCloseForm()
    },
    [handleRefresh, handleCloseForm]
  )

  // ✅ stable getRowId
  const getRowId = useCallback((row: TypeTblComponentUnit) => row.compId, [])

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblComponentUnit>[]>(
    () => [
      { field: 'compNo', headerName: 'Component No', width: 300 },
      {
        field: 'compType',
        headerName: 'Component Type Model',
        flex: 1,
        valueGetter: (_, row) => row.tblCompType?.compType,
      },
      { field: 'model', headerName: 'Model/Type', flex: 1 },
      {
        field: 'locationId',
        headerName: 'Location',
        flex: 1,
        valueGetter: (_, row) => row.tblLocation?.name ?? '',
      },
      { field: 'serialNo', headerName: 'Serial No', flex: 1 },
      {
        field: 'statusId',
        headerName: 'Status',
        width: 80,
        valueGetter: (_, row) => row.tblCompStatus?.compStatusName ?? '',
      },
      { field: 'orderNo', headerName: 'OrderNO', width: 100 },

      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    ],
    [handleEdit, handleDelete]
  )

  const router = useRouter()
  const handleDoubleClick = (row: TypeTblComponentUnit) => {
    router.navigate({
      to: routeComponentUnitDetail.to,
      params: {
        id: row?.compId,
      },
      search: {
        breadcrumb: row.compNo,
      },
    })
  }

  return (
    <>
      <Splitter initialPrimarySize='1%'>
        {/* <CustomizedTree
          label='Component Unit Tree'
          items={treeItems}
          loading={loading}
          onRefresh={handleRefresh}
          getRowId={getRowId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        /> */}
        tree
        <CustomizedDataGrid
          getRowId={getRowId}
          label='Component Unit'
          showToolbar
          disableDensity
          disableRowNumber
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          loading={loading}
          onRowDoubleClick={({ row }) => handleDoubleClick(row)}
          onRowClick={handleRowClick}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
        />
      </Splitter>

      {/* Upsert Modal */}
      <ComponentUnitUpsert
        open={openForm}
        mode={mode}
        recordId={selected?.compId ?? null}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
