import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export type QueryParams = {
  page?: number
  perPage?: number
  sort?: string
  filter?: string
  include?: string
  paginate?: boolean
  force?: boolean
}

export type TreeNodeData<T> = {
  id: string
  parentId: string | null
  label: string
  data?: T
  children?: TreeNodeData<T>[]
}

export function useDataTree<
  GetAllFn extends (...args: any[]) => Promise<{ items: T[] }>,
  DeleteFn extends (id: any) => Promise<any>,
  T,
  K extends keyof T
>(
  getAll: GetAllFn,
  deleteById: DeleteFn,
  keyId: K,
  mapper: (row: T) => TreeNodeData<T>
) {
  const [rows, setRows] = useState<T[]>([])
  const [treeData, setTreeData] = useState<TreeNodeData<T>[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [checkedIds, setCheckedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const getIdValue = useCallback((row: T) => row[keyId] as any, [keyId])

  const fetchData = useCallback(
    async (params?: QueryParams) => {
      setLoading(true)
      try {
        const res = await getAll({ ...params })
        setRows(res.items)

        // Map data to tree nodes and update treeData
        const nodes = res.items.map(mapper)
        setTreeData(nodes)
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load data'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [getAll, mapper, toast]
  )

  const handleDelete = useCallback(
    async (row: T) => {
      setLoading(true)
      const id = getIdValue(row)

      try {
        await deleteById(id)
        setRows(prev => prev.filter(r => getIdValue(r) !== id))

        // Remove node from treeData
        setTreeData(prev => prev.filter(node => node.id !== id.toString()))
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [deleteById, getIdValue, toast]
  )

  const handleFormSuccess = useCallback(
    (updatedRecord: T) => {
      setLoading(true)
      try {
        const id = getIdValue(updatedRecord)

        // Update rows and tree data
        setRows(prev => {
          const exists = prev.some(r => getIdValue(r) === id)
          return exists
            ? prev.map(r => (getIdValue(r) === id ? updatedRecord : r))
            : [updatedRecord, ...prev]
        })

        setTreeData(prev => {
          const idx = prev.findIndex(n => n.id === id.toString())
          const newNode = mapper(updatedRecord)

          if (idx > -1) prev[idx] = newNode
          else prev.unshift(newNode)

          return prev
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [mapper, getIdValue, toast]
  )

  const handleNodeToggle = useCallback((ids: string[]) => {
    setExpandedIds(ids)
  }, [])

  const handleNodeSelect = useCallback((ids: string[]) => {
    setSelectedIds(ids)
  }, [])

  const handleNodeCheck = useCallback((ids: string[]) => {
    setCheckedIds(ids)
  }, [])

  const handleRefresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    rows,
    treeData,
    selectedIds,
    expandedIds,
    checkedIds,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleNodeToggle,
    handleNodeSelect,
    handleNodeCheck,
    handleRefresh,
  }
}
