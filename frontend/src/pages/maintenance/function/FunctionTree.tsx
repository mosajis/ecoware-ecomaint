import Splitter from '@/shared/components/Splitter/Splitter'
import CustomizedTree from '@/shared/components/tree/Tree'
import FunctionFormDialog from './FunctionUpsert'
import TabsComponent from './FunctionTabs'

import { tblFunctions, TypeTblFunctions } from '@/core/api/generated/api'
import { useCallback, useMemo, useState } from 'react'
import { useDataTree } from '@/shared/hooks/useDataTree'

export default function PageFunctionTree() {
  const [selected, setSelected] = useState<TypeTblFunctions | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const mapper = useCallback(
    (row: TypeTblFunctions) => ({
      id: row.functionId.toString(),
      label: row.funcDescr ?? row.funcNo ?? '',
      parentId: row.parentFunctionId?.toString() ?? null,
      data: row,
    }),
    []
  )

  const { treeItems, loading, handleDelete, handleFormSuccess, handleRefresh } =
    useDataTree(
      tblFunctions.getAll,
      tblFunctions.deleteById,
      'functionId',
      mapper
    )

  // --- Handlers ---
  const handleCreate = () => {
    setSelected(null)
    setMode('create')
    setOpenForm(true)
  }

  const handleEdit = (row: TypeTblFunctions) => {
    setSelected(row)
    setMode('update')
    setOpenForm(true)
  }

  return (
    <>
      <Splitter initialPrimarySize='40%'>
        <CustomizedTree
          label='Function Tree'
          items={treeItems}
          loading={loading}
          onRefresh={handleRefresh}
          getRowId={row => row.functionId}
          onAddClick={handleCreate}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />

        <TabsComponent />
      </Splitter>

      <FunctionFormDialog
        open={openForm}
        mode={mode}
        recordId={selected?.functionId}
        onClose={() => setOpenForm(false)}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
