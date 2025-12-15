import { useState, useCallback, useEffect, useRef } from "react";

export function useDataGrid<T, K extends keyof T = keyof T>(
  getAll: (params?: any) => Promise<{ items: T[] } | T[]>,
  deleteById: (id: any) => Promise<any>,
  keyId: K,
  isEnabled: boolean = true
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);
  const fetchRef = useRef<(params?: any) => Promise<void>>(() =>
    Promise.resolve()
  );

  const fetchData = useCallback(
    async (params?: any) => {
      if (!isEnabled) return;
      setLoading(true);
      try {
        const res = await getAll(params);
        if (Array.isArray(res)) {
          setRows(res as T[]);
        } else if ("items" in res && Array.isArray(res.items)) {
          setRows(res.items as T[]);
        } else {
          console.warn("Unexpected getAll result:", res);
          setRows([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [getAll, isEnabled]
  );

  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    if (isEnabled) fetchRef.current();
  }, [isEnabled]);

  const handleDelete = useCallback(
    async (row: T) => {
      if (!isEnabled) return;
      const id = getIdValue(row);
      setLoading(true);
      try {
        await deleteById(id);
        setRows((prev) => prev.filter((x) => getIdValue(x) !== id));
      } finally {
        setLoading(false);
      }
    },
    [deleteById, getIdValue, isEnabled]
  );

  const handleFormSuccess = useCallback(
    (record: T) => {
      if (!isEnabled) return;
      const id = getIdValue(record);
      setRows((prev) => {
        const exists = prev.some((x) => getIdValue(x) === id);
        return exists
          ? prev.map((x) => (getIdValue(x) === id ? record : x))
          : [record, ...prev];
      });
    },
    [getIdValue, isEnabled]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh,
  };
}

// ✅ استفاده:
// const { rows, loading, handleRefresh } = useDataGrid<TypeTblWorkOrderWithRels>(
//     getAll,
//     tblWorkOrder.deleteById,
//     "workOrderId"
// );
