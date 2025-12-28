import TabsComponent from './ComponentUnitTabs'
import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { useDataGrid } from '@/shared/hooks/useDataGrid'
import { useCallback, useMemo, useState } from 'react'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'
import ComponentUnitUpsert from './ComponentUnitUpsert'

export default function PageComponentUnit() {
  const [selected, setSelected] = useState<TypeTblComponentUnit | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  // === API CALL ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      include: {
        tblCompType: true,
        tblCompStatus: true,
        tblLocation: true,
      },
    })
  }, [])

  // === useDataGrid HOOK ===
  const { rows, loading, fetchData, handleDelete, handleFormSuccess } =
    useDataGrid(getAll, tblComponentUnit.deleteById, 'compId')

  const handleRowClick = (params: any) => {
    setSelected(params.row)
  }

  // === Handlers ===
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

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblComponentUnit>[]>(
    () => [
      { field: 'compNo', headerName: 'Component No', flex: 1 },
      {
        field: 'compTypeId',
        headerName: 'Component Type',
        width: 160,
        valueGetter: (_, row) => row.tblCompType?.compTypeNo,
      },
      {
        field: 'locationId',
        headerName: 'Location',
        width: 160,
        valueGetter: (_, row) => row.tblLocation?.name ?? '',
      },
      { field: 'serialNo', headerName: 'Serial No', width: 150 },
      { field: 'model', headerName: 'Model', width: 150 },
      {
        field: 'statusId',
        headerName: 'Status',
        width: 150,
        valueGetter: (_, row) => row.tblCompStatus?.compStatusName ?? '',
      },

      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          label='Component Unit'
          showToolbar
          disableDensity
          disableRowNumber
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          onRefreshClick={fetchData}
          getRowId={row => row.compId}
        />

        <TabsComponent label={selected?.compNo} componentUnit={selected} />
      </Splitter>
      <ComponentUnitUpsert
      // open={openForm}
      // mode={mode}
      // recordId={selectedRowId}
      // onClose={() => setOpenForm(false)}
      // onSuccess={record => {
      //   handleFormSuccess(record)
      //   setOpenForm(false)
      // }}
      />
    </>
  )
}
