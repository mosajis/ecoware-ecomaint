import { useTree } from '@headless-tree/react'
import { TreeDataMapper } from '@/shared/hooks/useDataTree'
import { Box } from '@mui/material'
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
  SetStateFn,
  TreeState,
} from '@headless-tree/core'
import TreeHeader from './TreeHeader'
import TreeContent from './TreeContent'

interface GenericTreeProps<T> {
  label?: string
  data: TreeDataMapper<T>
  onItemSelect?: (item: T) => void
  getItemName: (item: T) => string
  getItemId: (item: T) => string | number
  onAdd?: () => void
  onRefresh?: () => void
  loading?: boolean

  initialState?: Partial<TreeState<T>> | undefined
}

export function GenericTree<T>({
  label,
  data,
  initialState,
  onItemSelect,
  getItemName,
  getItemId,
  onAdd,
  onRefresh,
  loading = false,
}: GenericTreeProps<T>) {
  const { itemsMap, childrenMap, rootIds } = data

  const tree = !loading
    ? useTree<T>({
        rootItemId: 'root',
        initialState,
        getItemName: item => getItemName(item.getItemData()),
        isItemFolder: item => {
          const id = getItemId(item.getItemData())
          return (childrenMap.get(Number(id))?.length ?? 0) > 0
        },
        dataLoader: {
          getItem: itemId => {
            if (itemId === 'root') return {} as T
            const id = Number(itemId)
            const item = itemsMap.get(id)
            if (!item) throw new Error(`Tree item not found: ${itemId}`)
            return item
          },
          getChildren: itemId => {
            if (itemId === 'root') return rootIds.map(id => String(id))
            const id = Number(itemId)
            return (childrenMap.get(id) || []).map(childId => String(childId))
          },
        },
        features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
        indent: 20,
      })
    : null

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <TreeHeader
        label={label || 'Tree View'}
        loading={loading}
        onAdd={onAdd}
        onRefresh={onRefresh}
        onExpandAll={() => tree && tree.getItems().forEach(i => i.expand())}
        onCollapseAll={() => tree && tree.getItems().forEach(i => i.collapse())}
      />

      {!loading && tree && (
        <TreeContent
          tree={tree}
          getItemName={getItemName}
          getItemId={getItemId}
          onItemSelect={onItemSelect}
          rootIds={rootIds}
        />
      )}
    </Box>
  )
}
