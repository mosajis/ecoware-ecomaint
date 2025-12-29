import ComponentTypeUpsert from './ComponentTypeUpsert'
import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import CustomizedTree from '@/shared/components/tree/CustomeTree'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { type GridColDef } from '@mui/x-data-grid'
import { useRouter } from '@tanstack/react-router'
import { routeComponentTypeDetail } from '@/app/router/routes/maintenance.routes'

export default function PageComponentTypeList() {
  const [selectedRow, setSelectedRow] = useState<null | TypeTblCompType>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const router = useRouter()

  const mapper = useCallback(
    (row: TypeTblCompType) => ({
      id: row.compTypeId.toString(),
      label: row.compName ?? '',
      parentId: row.parentCompTypeId?.toString() ?? null,
      data: row,
    }),
    []
  )

  const {
    treeItems,
    loading,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
    rows,
  } = useDataTree(
    tblCompType.getAll,
    tblCompType.deleteById,
    'compTypeId',
    mapper
  )

  const handleCreate = useCallback(() => {
    setSelectedRow(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblCompType) => {
    setSelectedRow(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  const columns = useMemo<GridColDef<TypeTblCompType>[]>(
    () => [
      { field: 'compTypeNo', headerName: 'CompTypeNo', width: 120 },
      { field: 'compName', headerName: 'CompTypeName', flex: 1 },
      { field: 'model', headerName: 'Model', width: 200 },

      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  const handleSelectTreeItem = (
    selectedData: TypeTblCompType[],
    selectedIds: string[]
  ) => {
    // const item = selectedData[0]
    // if (!item) return
    // setSelectedRow(item)
  }

  const handleDoubleClick = ({ row }: { row: TypeTblCompType }) => {
    router.navigate({
      to: routeComponentTypeDetail.to,
      params: {
        id: row?.compTypeId,
      },
      search: {
        breadcrumb: row.compName,
      },
    })
  }

  return (
    <>
      <Splitter initialPrimarySize='30%'>
        <CustomizedTree
          onRefresh={handleRefresh}
          label='Tree View'
          multiSelect={false}
          onSelectionChange={handleSelectTreeItem}
          items={treeItems}
          loading={loading}
          getRowId={row => row.compTypeId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
        <CustomizedDataGrid
          label='Component Type'
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={row => row.compTypeId}
          disableDensity
          disableRowNumber
          disableRowSelectionOnClick
          onRowDoubleClick={handleDoubleClick}
          // onRowClick={params => setSelectedRow(params.row)}
        />
      </Splitter>

      <ComponentTypeUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRow?.compTypeId}
        onClose={() => setOpenForm(false)}
        onSuccess={record => {
          handleFormSuccess(record)
          setOpenForm(false)
        }}
      />
    </>
  )
}
