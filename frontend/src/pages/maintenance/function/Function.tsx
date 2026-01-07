import Splitter from '@/shared/components/Splitter/Splitter'
import TabsComponent from './FunctionTabs'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import FunctionUpsert from './FunctionUpsert'
import { tblFunctions, TypeTblFunctions } from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'
import { useDataGrid } from '@/shared/hooks/useDataGrid'

export default function PageFunction() {
  const [selectedRow, setSelectedRow] = useState<null | TypeTblFunctions>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const getAll = useCallback(
    () =>
      tblFunctions.getAll({
        include: {
          tblComponentUnit: true,
        },
      }),
    []
  )
  // === useDataGrid ===
  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblFunctions.deleteById,
    'functionId'
  )

  const handleRowClick = (params: any) => {
    setSelectedRow(params.row)
  }

  // === Handlers ===
  const handleCreate = useCallback(() => {
    setSelectedRow(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblFunctions) => {
    setSelectedRow(row)
    setMode('update')
    setOpenForm(true)
  }, [])

  // === Columns ===
  const columns = useMemo<GridColDef<TypeTblFunctions>[]>(
    () => [
      { field: 'funcNo', headerName: 'Function No', flex: 1 },
      { field: 'funcDescr', headerName: 'Function Descr', flex: 1 },
      { field: 'funcRef', headerName: 'Function Ref', flex: 1 },
      {
        field: 'component',
        headerName: 'Component',
        flex: 1,
        valueGetter: (_, row) => row.tblComponentUnit?.compNo,
      },
      dataGridActionColumn({ onEdit: handleEdit, onDelete: handleDelete }),
    ],
    [handleEdit, handleDelete]
  )

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          label='Functions'
          showToolbar
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={row => row.functionId}
          onRowClick={handleRowClick}
        />
        <TabsComponent
          label={selectedRow?.funcDescr}
          functionId={selectedRow?.functionId}
        />
      </Splitter>
      <FunctionUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRow?.functionId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleRefresh}
      />
    </>
  )
}
