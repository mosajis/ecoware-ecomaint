import { useState, useCallback, useEffect, useRef } from "react";

// Extract query type
type ExtractQuery<F extends (...args: any) => any> = F extends (
  params?: infer Q
) => any
  ? Q
  : never;

// Extract items type
type ExtractItems<F extends (...args: any) => any> =
  Awaited<ReturnType<F>> extends { items: (infer T)[] } ? T : never;

export function useDataGrid<
  GetAllFn extends (...args: any[]) => Promise<any>,
  DeleteFn extends (id: any) => Promise<any>,
  T = ExtractItems<GetAllFn>,
  Q = Parameters<GetAllFn>[0],
  K extends keyof T = keyof T,
>(getAll: GetAllFn, deleteById: DeleteFn, keyId: K, isEnabled: boolean = true) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);
  const fetchRef = useRef<(params?: Q) => Promise<void>>(() =>
    Promise.resolve()
  );

  const fetchData = useCallback(
    async (params?: Q) => {
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
