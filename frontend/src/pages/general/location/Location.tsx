import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import LocationUpsert from './LocationUpsert'
import { tblLocation, TypeTblLocation } from '@/core/api/generated/api'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { GridColDef } from '@mui/x-data-grid'
import { useTreeData } from '@/shared/hooks/useDataTree'
import { useState, useCallback, useMemo } from 'react'
import { GenericTree } from '@/shared/components/tree/Tree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'

export default function PageLocation() {
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const { dataTreeItems, loading, refetch, rows } = useTreeData({
    request: tblLocation.getAll,
    mapper: items => mapToTree(items, 'locationId', 'parentLocationId'),
  })

  const handleTreeItemSelect = useCallback(() => {
    // Implementation
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedRowId(null)
    setMode('create')
    setOpenForm(true)
  }, [])

  const handleEdit = useCallback((row: TypeTblLocation) => {
    setSelectedRowId(row.locationId)
    setMode('update')
    setOpenForm(true)
  }, [])

  const handleFormSuccess = useCallback(() => {
    setOpenForm(false)
    refetch()
  }, [refetch])

  // ✅ 3. Memoize columns
  const columns: GridColDef<TypeTblLocation>[] = useMemo(
    () => [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'parentLocationId', headerName: 'Parent ID', width: 100 },
      dataGridActionColumn({
        onEdit: handleEdit,
        onDelete: () => {
          // TODO: implement delete with refetch
        },
      }),
    ],
    [handleEdit]
  )

  console.log(dataTreeItems)
  return (
    <>
      <Splitter initialPrimarySize='35%'>
        <GenericTree<TypeTblLocation>
          loading={loading}
          data={dataTreeItems}
          getItemName={item => item.name || '-'}
          getItemId={item => item.locationId}
          onRefresh={refetch}
          onAdd={handleCreate}
          onItemSelect={handleTreeItemSelect}
        />

        <CustomizedDataGrid
          showToolbar
          disableRowNumber
          label='List View'
          loading={loading}
          rows={rows}
          columns={columns}
          onRefreshClick={refetch}
          onAddClick={handleCreate}
          getRowId={row => row.locationId}
        />
      </Splitter>

      <LocationUpsert
        open={openForm}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
