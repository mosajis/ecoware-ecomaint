import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import ComponentUnitUpsert from './ComponentUnitUpsert'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useCallback, useMemo, useState } from 'react'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import { useRouter } from '@tanstack/react-router'
import { routeComponentUnitDetail } from './ComponentUnitRoutes'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'
import { GenericTree } from '@/shared/components/tree/Tree'

export default function PageComponentUnit() {
  const router = useRouter()

  const [selected, setSelected] = useState<TypeTblComponentUnit | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  // ======================
  // Stable API
  // ======================
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

  // ✅ VERY IMPORTANT (loop-safe)
  const treeMapper = useCallback(
    (items: TypeTblComponentUnit[]) =>
      mapToTree(items, 'compId', 'parentCompId'),
    []
  )

  const { rows, tree, loading, refetch, handleDelete, handleUpsert } =
    useDataTree<TypeTblComponentUnit>({
      getAll,
      deleteById: tblComponentUnit.deleteById,
      getId: item => item.compId,
      mapper: treeMapper,
    })

  // ======================
  // Handlers
  // ======================
  const handleTreeSelect = useCallback((item: TypeTblComponentUnit) => {
    setSelected(item)
  }, [])

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
    (record?: TypeTblComponentUnit) => {
      setOpenForm(false)

      if (record) {
        handleUpsert(record) // ✅ local tree + grid update
      } else {
        refetch()
      }
    },
    [handleUpsert, refetch]
  )

  const handleRowDoubleClick = useCallback(
    (row: TypeTblComponentUnit) => {
      router.navigate({
        to: routeComponentUnitDetail.to,
        params: { id: row.compId },
        search: { breadcrumb: row.compNo },
      })
    },
    [router]
  )

  const getRowId = useCallback((row: TypeTblComponentUnit) => row.compId, [])

  // ======================
  // Columns
  // ======================
  const columns = useMemo<GridColDef<TypeTblComponentUnit>[]>(
    () => [
      { field: 'compNo', headerName: 'Component No', width: 280 },
      {
        field: 'compType',
        headerName: 'Component Type',
        flex: 1,
        valueGetter: (_, row) => row.tblCompType?.compType ?? '',
      },
      { field: 'model', headerName: 'Model / Type', flex: 1 },
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
        width: 120,
        valueGetter: (_, row) => row.tblCompStatus?.compStatusName ?? '',
      },
      { field: 'orderNo', headerName: 'Order No', width: 100 },

      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: handleDelete, // ✅ optimistic
      }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <Splitter initialPrimarySize='30%'>
        {/* 🌳 TREE */}
        <GenericTree<TypeTblComponentUnit>
          label='Component Unit Tree'
          loading={loading}
          data={tree}
          getItemId={item => item.compId}
          getItemName={item => item.compNo || '-'}
          onItemSelect={handleTreeSelect}
          onAdd={handleCreate}
          onRefresh={refetch}
        />

        {/* 📋 GRID */}
        <CustomizedDataGrid
          label='Component Unit'
          showToolbar
          disableRowNumber
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          onRowDoubleClick={({ row }) => handleRowDoubleClick(row)}
          onAddClick={handleCreate}
          onRefreshClick={refetch}
        />
      </Splitter>

      {/* 📝 UPSERT */}
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
