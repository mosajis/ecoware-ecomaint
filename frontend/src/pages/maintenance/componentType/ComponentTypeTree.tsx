import ComponentTypeFormDialog from './ComponentTypeUpsert'
import TabsComponent from './ComponentTypeTabs'
import Splitter from '@/shared/components/Splitter'
import CustomizedDataGrid from '@/shared/components/dataGrid/DataGrid'
import { useCallback, useMemo, useState } from 'react'
import { dataGridActionColumn } from '@/shared/components/dataGrid/DataGridActionsColumn'
import { tblCompType, TypeTblCompType } from '@/core/api/generated/api'
import { type GridColDef } from '@mui/x-data-grid'
import CustomizedTree from '@/shared/components/tree/CustomeTree'
import { useDataTree } from '@/shared/hooks/useDataTree'

export default function PageComponentTypeTree() {
  const [selectedRow, setSelectedRow] = useState<null | TypeTblCompType>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

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

  // === Mapping Transformer ===
  const mapper = useCallback(
    (row: TypeTblCompType) => ({
      id: row.compTypeId.toString(),
      label: row.compName ?? '',
      parentId: row.parentCompTypeId?.toString() ?? null,
      data: row,
    }),
    []
  )

  // === useDataTree ===
  const { treeItems, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataTree(
      tblCompType.getAll,
      tblCompType.deleteById,
      'compTypeId',
      mapper
    )

  const handleSelectTreeItem = (
    selectedData: TypeTblCompType[],
    selectedIds: string[]
  ) => {
    // const item = selectedData[0]
    // if (!item) return
    // setSelectedRow(item)
  }

  return (
    <>
      <Splitter initialPrimarySize='35%'>
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
        <TabsComponent
          label={selectedRow?.compTypeNo}
          selectedCompTypeId={selectedRow?.compTypeId}
        />
      </Splitter>

      <ComponentTypeFormDialog
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
