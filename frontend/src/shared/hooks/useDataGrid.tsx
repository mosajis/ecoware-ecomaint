import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

type GetAllResult<T> = {
  items: T[];
};

export function useDataGrid<T, K extends keyof T = keyof T>(
  getAll: (params?: any) => Promise<GetAllResult<T>>,
  deleteById: (id: any) => Promise<unknown>,
  keyId: K,
  isEnabled: boolean = true,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRef = useRef<(params?: any, silent?: boolean) => Promise<void>>(
    async () => {},
  );

  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);

  const fetchData = useCallback(
    async (params?: any, silent: boolean = false) => {
      if (!isEnabled) return;

      if (!silent) setLoading(true);

      try {
        const res = await getAll(params);
        setRows(res.items);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load data");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [getAll, isEnabled],
  );

  /**
   * ذخیره fetch برای refresh
   */
  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  /**
   * refresh دیتا (awaitable)
   */
  const handleRefresh = useCallback(
    async (params?: any) => {
      if (!isEnabled) return;
      return fetchRef.current(params);
    },
    [isEnabled],
  );

  /**
   * delete + refresh
   */
  const handleDelete = useCallback(
    async (rowId: number) => {
      if (!isEnabled || !rowId) return;

      setLoading(true);
      try {
        await deleteById(rowId);
        await handleRefresh();
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete");
      } finally {
        setLoading(false);
      }
    },
    [deleteById, isEnabled],
  );

  /**
   * optimistic update یک ردیف
   */
  const optimisticUpdate = useCallback(
    (rowId: T[K], patch: Partial<T>) => {
      setRows((prev) =>
        prev.map((row) =>
          getIdValue(row) === rowId ? { ...row, ...patch } : row,
        ),
      );
    },
    [getIdValue],
  );

  /**
   * جایگزینی کامل ردیف (وقتی API رکورد کامل برمی‌گردونه)
   */
  const optimisticReplace = useCallback(
    (row: T) => {
      setRows((prev) =>
        prev.map((r) => (getIdValue(r) === getIdValue(row) ? row : r)),
      );
    },
    [getIdValue],
  );

  /**
   * حذف optimistic
   */
  const optimisticRemove = useCallback(
    (rowId: T[K]) => {
      setRows((prev) => prev.filter((r) => getIdValue(r) !== rowId));
    },
    [getIdValue],
  );

  /**
   * fetch اولیه
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    loading,
    fetchData,
    handleRefresh,
    handleDelete,
    getIdValue,
    optimisticRemove,
    optimisticReplace,
    optimisticUpdate,
  };
}
