import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import {
  buildTree,
  findNodeInTree,
  removeNodeFromTree,
  TreeNode,
  updateNodeInTree,
} from '../components/tree/treeUtil'

export type QueryParams = {
  page?: number
  perPage?: number
  sort?: string
  filter?: string
  include?: string
  paginate?: boolean
  force?: boolean
}

export interface UseCustomizedTreeOptions<T> {
  getAll: (...args: any[]) => Promise<{ items: T[] }>
  deleteById: (id: any) => Promise<any>
  keyId: keyof T
  mapper: (row: T) => Omit<TreeNode<T>, 'children'>
  parentKeyId?: keyof T
}

export function useCustomizedTree<T extends Record<string, any>>({
  getAll,
  deleteById,
  keyId,
  mapper,
  parentKeyId,
}: UseCustomizedTreeOptions<T>) {
  const [treeItems, setTreeItems] = useState<TreeNode<T>[]>([])
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  const idCacheRef = useRef<Map<T, string>>(new Map())

  const memoizedMapper = useCallback((item: T) => mapper(item), [mapper])

  const getIdValue = useCallback(
    (row: T) => {
      const cached = idCacheRef.current.get(row)
      if (cached) return cached

      const id = String(row[keyId])
      idCacheRef.current.set(row, id)
      return id
    },
    [keyId]
  )

  const fetchData = useCallback(
    async (params?: QueryParams) => {
      setLoading(true)
      try {
        const res = await getAll(params)
        const items = res.items ?? []

        const nodes: TreeNode<T>[] = items.map(item => ({
          ...memoizedMapper(item),
          children: [],
        }))

        setTreeItems(buildTree(nodes, parentKeyId))
        setRows(res.items)
        idCacheRef.current.clear()
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load data'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [getAll, memoizedMapper, parentKeyId]
  )

  const handleDelete = useCallback(
    async (row: T) => {
      setLoading(true)
      const id = getIdValue(row)

      try {
        await deleteById(id)
        setTreeItems(prev => removeNodeFromTree(prev, id))
        idCacheRef.current.delete(row)
        toast.success('Item deleted successfully')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [deleteById, getIdValue]
  )

  const handleFormSuccess = useCallback(
    (updatedRecord: T) => {
      setLoading(true)
      try {
        const id = getIdValue(updatedRecord)
        const newNode: TreeNode<T> = {
          ...memoizedMapper(updatedRecord),
          children: [],
        }

        setTreeItems(prev => {
          const existingNode = findNodeInTree(prev, id)

          if (existingNode) {
            return updateNodeInTree(prev, id, {
              ...newNode,
              children: existingNode.children,
            })
          } else {
            return [newNode, ...prev]
          }
        })

        idCacheRef.current.set(updatedRecord, id)
        toast.success('Item updated successfully')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [getIdValue, memoizedMapper]
  )

  const handleRefresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    treeItems,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
    rows,
  }
}
