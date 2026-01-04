import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import TreeToolbar from './TreeToolbar'
import { RsTree, RsTreeProps } from 'rstree-ui'
import {
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
  useEffect,
} from 'react'

import 'rstree-ui/style.css'
import {
  buildDataMap,
  buildIdSet,
  createDebounce,
  filterTree,
  getSelectedData,
  TreeNode,
} from './treeUtil'

export interface CustomizedTreeProps<T = any> extends Partial<RsTreeProps> {
  label?: string
  loading?: boolean
  onRefresh?: () => void
  toolbarActions?: ReactNode
  onAddClick?: () => void
  onSelectionChange?: (selectedItems: T[], selectedIds: string[]) => void
  onDoubleClick?: (row: T) => void
  items: TreeNode<T>[]
  searchDebounceMs?: number
}

/* ---- Main Component ---- */
export default function Tree<T = any>({
  label,
  loading,
  toolbarActions,
  onRefresh,
  onAddClick,
  onSelectionChange,
  onDoubleClick,
  items,
  searchDebounceMs = 300,
  ...rsTreeProps
}: CustomizedTreeProps<T>) {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')
  const [height, setHeight] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useRef(
    createDebounce(setDebouncedSearchText, searchDebounceMs)
  )
  const onSelectionChangeRef = useRef(onSelectionChange)

  // ✅ Keep callback ref up to date without causing re-renders
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  }, [onSelectionChange])

  const handleSearch = useCallback((text: string) => {
    setSearchText(text)
    debouncedSearch.current(text)
  }, [])

  /* ---- Filter Tree ---- */
  const filteredTree = useMemo(
    () => filterTree(items, debouncedSearchText),
    [items, debouncedSearchText]
  )

  /* ---- ResizeObserver ---- */
  useLayoutEffect(() => {
    if (!containerRef.current) return

    const el = containerRef.current

    const observer = new ResizeObserver(entries => {
      const h = entries[0].contentRect.height
      setHeight(Math.floor(h))
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
      <TreeToolbar
        label={label}
        actions={toolbarActions}
        onRefresh={onRefresh}
        onSearch={handleSearch}
        onAdd={onAddClick}
      />

      {loading && <LinearProgress />}

      <Box sx={{ flex: 1, overflow: 'auto' }} ref={containerRef}>
        <RsTree
          showTreeLines
          data={filteredTree as any}
          height={height}
          showIcons={false}
          virtualizeEnabled={false}
          {...rsTreeProps}
        />
      </Box>
    </Box>
  )
}
