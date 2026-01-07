import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface TreeDataMapper<T> {
  itemsMap: Map<number, T>
  childrenMap: Map<number, number[]>
  rootIds: number[]
}

interface UseTreeDataOptions<T> {
  request: () => Promise<{ items: T[] }>
  mapper: (items: T[]) => TreeDataMapper<T>
}

interface UseTreeDataReturn<T> {
  dataTreeItems: TreeDataMapper<T>
  loading: boolean
  error: Error | null
  rows: T[] | []
  refetch: () => Promise<void>
}

export function useTreeData<T>({
  request,
  mapper,
}: UseTreeDataOptions<T>): UseTreeDataReturn<T> {
  const [rows, setRows] = useState<T[]>([])
  const [dataTreeItems, setDataTreeItems] = useState<TreeDataMapper<T>>({
    itemsMap: new Map(),
    childrenMap: new Map(),
    rootIds: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await request()
      const mappedData = mapper(response.items)
      setRows(response.items)
      setDataTreeItems(mappedData)
    } catch (err) {
      toast.error('Error in Get/Map data to create tree')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    dataTreeItems,
    loading,
    error,
    refetch: fetchData,
    rows,
  }
}
