import cn from 'classnames'
import { AssistiveTreeDescription, useTree } from '@headless-tree/react'

// ===== TreeContent =====
interface TreeContentProps<T> {
  tree: ReturnType<typeof useTree<T>>
  getItemName: (item: T) => string
  getItemId: (item: T) => string | number
  onItemSelect?: (item: T) => void
  rootIds: (string | number)[]
}

function TreeContent<T>({
  tree,
  getItemName,
  getItemId,
  onItemSelect,
}: TreeContentProps<T>) {
  const cancelToken = { current: false }

  const handleExpandAll = () => {
    if (!tree) return
    cancelToken.current = false
    tree.getItems().forEach(item => {
      if (!cancelToken.current && item.isFolder() && !item.isExpanded()) {
        item.expand()
      }
    })
  }

  const handleCollapseAll = () => {
    if (!tree) return
    tree.getItems().forEach(item => {
      if (item.isFolder() && item.isExpanded()) {
        item.collapse()
      }
    })
  }

  return (
    <div
      {...tree.getContainerProps()}
      className='tree'
      style={{ flex: 1, overflow: 'auto' }}
    >
      <AssistiveTreeDescription tree={tree} />
      {tree.getItems().map(item => (
        <button
          key={getItemId(item.getItemData())}
          {...item.getProps()}
          style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
          onClick={e => {
            item.getProps().onClick?.(e)
            onItemSelect?.(item.getItemData())
          }}
        >
          <div
            className={cn('treeitem', {
              focused: item.isFocused(),
              expanded: item.isExpanded(),
              selected: item.isSelected(),
              folder: item.isFolder(),
            })}
          >
            {getItemName(item.getItemData())}
          </div>
        </button>
      ))}
      {/* برای Toolbar کنترل expand/collapse */}
      <div style={{ display: 'none' }}>
        <button onClick={handleExpandAll}>expandAll</button>
        <button onClick={handleCollapseAll}>collapseAll</button>
      </div>
    </div>
  )
}

export default TreeContent
