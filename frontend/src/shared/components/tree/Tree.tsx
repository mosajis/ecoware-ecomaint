import { useTree } from '@headless-tree/react'
import { useEffect, useMemo, useCallback } from 'react'
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
  TreeState,
} from '@headless-tree/core'
import TreeHeader from './TreeHeader'
import TreeContent from './TreeContent'
import { TreeDataMapper } from '@/shared/hooks/useDataTree'
import './tree.css'

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

  // کش کردن tree config
  const treeConfig = useMemo(
    () => ({
      rootItemId: 'root',
      initialState,
      getItemName: (item: any) => getItemName(item.getItemData()),
      isItemFolder: (item: any) => {
        const id = getItemId(item.getItemData())
        return (childrenMap.get(Number(id))?.length ?? 0) > 0
      },
      dataLoader: {
        getItem: (itemId: string | number) => {
          if (itemId === 'root') return {} as T
          const id = Number(itemId)
          const item = itemsMap.get(id)
          if (!item) throw new Error(`Tree item not found: ${itemId}`)
          return item
        },
        getChildren: (itemId: string | number) => {
          if (itemId === 'root') return rootIds.map(id => String(id))
          const id = Number(itemId)
          return (childrenMap.get(id) || []).map(childId => String(childId))
        },
      },
      features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
      indent: 20,
    }),
    [itemsMap, childrenMap, rootIds, initialState, getItemName, getItemId]
  )

  const tree = useTree(treeConfig)

  useEffect(() => {
    tree.rebuildTree()
  }, [itemsMap, childrenMap, rootIds, tree])

  const handleExpandAll = useCallback(() => {
    const items = tree.getItems()
    for (let i = 0, len = items.length; i < len; i++) {
      items[i].expand()
    }
  }, [tree])

  const handleCollapseAll = useCallback(() => {
    const items = tree.getItems()
    for (let i = 0, len = items.length; i < len; i++) {
      items[i].collapse()
    }
  }, [tree])

  return (
    <div className='tree-container'>
      <TreeHeader
        label={label || 'Tree View'}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
        onAdd={onAdd}
        onRefresh={onRefresh}
      />
      <TreeContent
        tree={tree}
        getItemName={getItemName}
        getItemId={getItemId}
        onItemSelect={onItemSelect}
        rootIds={rootIds}
      />
    </div>
  )
}
