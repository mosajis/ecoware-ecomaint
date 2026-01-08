import { useEffect, useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

export interface TreeDataMapper<T> {
  itemsMap: Map<number, T>
  childrenMap: Map<number, number[]>
  rootIds: number[]
}

interface UseTreeDataOptions<T> {
  getAll: (params?: any) => Promise<{ items: T[] } | T[]>
  deleteById?: (id: number) => Promise<any>
  mapper: (items: T[]) => TreeDataMapper<T>
  getId: (item: T) => number
  isEnabled?: boolean
}

export function useDataTree<T>({
  getAll,
  deleteById,
  mapper,
  getId,
  isEnabled = true,
}: UseTreeDataOptions<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [tree, setTree] = useState<TreeDataMapper<T>>({
    itemsMap: new Map(),
    childrenMap: new Map(),
    rootIds: [],
  })
  const [loading, setLoading] = useState(false)

  const fetchRef = useRef<(params?: any) => Promise<void>>(() =>
    Promise.resolve()
  )

  const buildTree = useCallback(
    (items: T[]) => {
      const mapped = mapper(items)
      setRows(items)
      setTree(mapped)
    },
    [mapper]
  )

  const fetchData = useCallback(
    async (params?: any) => {
      if (!isEnabled) return
      setLoading(true)
      try {
        const res = await getAll(params)
        const items = Array.isArray(res) ? res : res.items
        buildTree(items)
      } catch (err) {
        toast.error('Failed to load tree data')
      } finally {
        setLoading(false)
      }
    },
    [getAll, buildTree, isEnabled]
  )

  useEffect(() => {
    fetchRef.current = fetchData
  }, [fetchData])

  const refetch = useCallback(() => {
    if (isEnabled) fetchRef.current()
  }, [isEnabled])

  /**
   * Delete + Refetch (مهم‌ترین تغییر اینجاست)
   */
  const handleDelete = useCallback(
    async (id: number) => {
      if (!deleteById || !isEnabled) return

      setLoading(true)
      const prevRows = rows

      // Optimistic update
      const nextRows = rows.filter(x => getId(x) !== id)
      buildTree(nextRows)

      try {
        await deleteById(id)
      } catch (err) {
        // Rollback on error
        buildTree(prevRows)
        toast.error('Failed to delete item')
      } finally {
        setLoading(false)
      }
    },
    [deleteById, getId, rows, buildTree, isEnabled]
  )

  /**
   * Create / Update (local)
   */
  const handleUpsert = useCallback(
    (record: T) => {
      if (!isEnabled) return
      const id = getId(record)

      setRows(prev => {
        const exists = prev.some(x => getId(x) === id)
        const next = exists
          ? prev.map(x => (getId(x) === id ? record : x))
          : [record, ...prev]

        setTree(mapper(next))
        return next
      })
    },
    [getId, mapper, isEnabled]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    rows,
    tree,
    loading,
    fetchData,
    refetch,
    handleDelete,
    handleUpsert,
  }
}
