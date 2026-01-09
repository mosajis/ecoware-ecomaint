import Splitter from '@/shared/components/Splitter/Splitter'
import FunctionFormDialog from './FunctionUpsert'
import TabsComponent from './FunctionTabs'

import { tblFunctions, TypeTblFunctions } from '@/core/api/generated/api'
import { useCallback, useMemo, useState } from 'react'
import { useDataTree } from '@/shared/hooks/useDataTree'
import { mapToTree } from '@/shared/components/tree/TreeUtil'
import { GenericTree } from '@/shared/components/tree/Tree'

export default function PageFunctionTree() {
  const [selected, setSelected] = useState<TypeTblFunctions | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [mode, setMode] = useState<'create' | 'update'>('create')

  const mapper = useCallback(
    (items: TypeTblFunctions[]) =>
      mapToTree(items, 'functionId', 'parentFunctionId'),
    []
  )

  const { tree, rows, loading, refetch, handleDelete } =
    useDataTree<TypeTblFunctions>({
      getAll: tblFunctions.getAll,
      deleteById: tblFunctions.deleteById,
      getId: item => item.functionId,
      mapper,
    })

  // const { treeItems, loading, handleDelete, handleFormSuccess, handleRefresh } =
  //   useDataTree(
  //     tblFunctions.getAll,
  //     tblFunctions.deleteById,
  //     'functionId',
  //     mapper
  //   )

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
        {/* <GenericTree

        data={tree}
        getItemId={row => row.functionId}
          label='Function Tree'
          loading={loading}
        /> */}
        tree
        <TabsComponent />
      </Splitter>

      <FunctionFormDialog
        open={openForm}
        mode={mode}
        recordId={selected?.functionId}
        onClose={() => setOpenForm(false)}
        onSuccess={refetch}
      />
    </>
  )
}
