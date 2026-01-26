import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export function useDataGrid<T, K extends keyof T = keyof T>(
  getAll: (params?: any) => Promise<{ items: T[] }>,
  deleteById: (id: any) => Promise<any>,
  keyId: K,
  isEnabled: boolean = true,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);

  const fetchRef = useRef<(params?: any) => Promise<void>>(() =>
    Promise.resolve(),
  );

  const fetchData = useCallback(
    async (params?: any) => {
      if (!isEnabled) return;
      setLoading(true);

      try {
        const res = await getAll(params);

        setRows(res.items);
      } catch (error: any) {
        const message = error.message || "Failed to load data";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [getAll, isEnabled],
  );

  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    if (isEnabled) fetchRef.current();
  }, [isEnabled]);

  const handleDelete = useCallback(
    async (rowId: number) => {
      if (!isEnabled && !rowId) return;

      setLoading(true);
      try {
        await deleteById(rowId);
        await handleRefresh();
      } catch (error: any) {
        const message = error.message || "Failed to delete";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [deleteById, getIdValue, isEnabled],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    loading,
    fetchData,
    handleDelete,
    handleRefresh,
  };
}
