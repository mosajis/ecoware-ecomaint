import ComponentTypeUpsert from './ComponentTypeUpsert'
import TabsComponent from './ComponentTypeTabs'
import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'
import { type GridColDef } from '@mui/x-data-grid'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageComponentTypeList() {
  const [selectedRow, setSelectedRow] = useState<null | TypeTblCompType>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const getAll = useCallback(() => {
    return tblCompType.getAll({
      include: {
        tblAddress: true,
      },
    })
  }, [])

  const { rows, loading, handleRefresh, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblCompType.deleteById, 'compTypeId')

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
      { field: 'model', headerName: 'Model', flex: 1 },
      {
        field: 'maker',
        headerName: 'Maker',
        flex: 1,
        valueGetter: (value, row) => row.tblAddress?.name,
      },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <Splitter horizontal>
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
          onRowClick={params => setSelectedRow(params.row)}
        />

        <TabsComponent
          label={selectedRow?.compName}
          selectedCompTypeId={selectedRow?.compTypeId}
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
