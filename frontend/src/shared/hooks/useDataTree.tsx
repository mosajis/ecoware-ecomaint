import { useState, useEffect, useCallback } from 'react'
import { TreeViewBaseItem } from '@mui/x-tree-view'
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

export type TreeNode<T> = TreeViewBaseItem & {
  parentId: string | null
  children?: TreeNode<T>[]
  data?: T
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
  mapper: (row: T) => TreeNode<T>
) {
  const [rows, setRows] = useState<T[]>([])
  const [treeItems, setTreeItems] = useState<TreeNode<T>[]>([])
  const [loading, setLoading] = useState(false)

  const getIdValue = useCallback((row: T) => row[keyId] as any, [keyId])

  const buildTree = useCallback((nodes: TreeNode<T>[]) => {
    const map = new Map<string, TreeNode<T>>()
    nodes.forEach(n => map.set(n.id.toString(), { ...n, children: [] }))

    const roots: TreeNode<T>[] = []
    map.forEach(node => {
      const parentId = node.parentId?.toString() ?? null

      if (parentId && map.has(parentId)) {
        ;(map.get(parentId)!.children ||= []).push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }, [])

  const flattenTree = useCallback((nodes: TreeNode<T>[]): TreeNode<T>[] => {
    return nodes.reduce<TreeNode<T>[]>((acc, n) => {
      const { children, ...rest } = n
      return [
        ...acc,
        rest as TreeNode<T>,
        ...(children ? flattenTree(children) : []),
      ]
    }, [])
  }, [])

  const fetchData = useCallback(
    async (params?: QueryParams) => {
      setLoading(true)
      try {
        const res = await getAll({
          ...params,
        })

        setRows(res.items)

        const nodes = res.items.map(mapper)
        setTreeItems(buildTree(nodes))
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load data'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [getAll, mapper, buildTree]
  )

  const handleDelete = useCallback(
    async (row: T) => {
      setLoading(true)
      const id = getIdValue(row)

      try {
        await deleteById(id)

        setRows(prev => prev.filter(r => getIdValue(r) !== id))

        const removeFromTree = (nodes: TreeNode<T>[]): TreeNode<T>[] =>
          nodes
            .filter(n => n.id !== id.toString())
            .map(n => ({
              ...n,
              children: n.children ? removeFromTree(n.children) : [],
            }))

        setTreeItems(prev => removeFromTree(prev))
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

        setRows(prev => {
          const exists = prev.some(r => getIdValue(r) === id)
          return exists
            ? prev.map(r => (getIdValue(r) === id ? updatedRecord : r))
            : [updatedRecord, ...prev]
        })

        setTreeItems(prev => {
          const flat = flattenTree(prev)
          const idx = flat.findIndex(n => n.id === id.toString())
          const newNode = mapper(updatedRecord)

          if (idx > -1) flat[idx] = newNode
          else flat.unshift(newNode)

          return buildTree(flat)
        })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [mapper, getIdValue, flattenTree, buildTree]
  )

  const handleRefresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    rows,
    treeItems,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  }
}
