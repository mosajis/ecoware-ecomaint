import { useState, useCallback, useEffect, useRef } from "react";

type ExtractQuery<F> = F extends (params?: infer Q) => any ? Q : never;
type ExtractItems<F, R> = F extends (...args: any[]) => Promise<R>
  ? R extends { items: (infer T)[] }
    ? T
    : R extends (infer T)[]
      ? T
      : never
  : never;

export function useDataGrid<
  GetAllFn extends (...args: any[]) => Promise<any>,
  DeleteFn extends (id: any) => Promise<any>,
  T = ExtractItems<GetAllFn, Awaited<ReturnType<GetAllFn>>>,
  Q = ExtractQuery<GetAllFn>,
  K extends keyof T = keyof T,
>(getAll: GetAllFn, deleteById: DeleteFn, keyId: K, isEnabled: boolean = true) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);

  // -----------------------------
  // 1) یک ref برای نگه‌داشتن fetchData
  // -----------------------------
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
          setRows(res);
        } else if ("items" in res && Array.isArray(res.items)) {
          setRows(res.items);
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

  // ref همیشه نسخه جدید fetchData را نگه می‌دارد
  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  // -----------------------------
  // 2) یک handleRefresh که تغییر نمی‌کند
  // -----------------------------
  const handleRefresh = useCallback(() => {
    if (isEnabled) {
      fetchRef.current();
    }
  }, [isEnabled]);

  // -----------------------------
  // حذف، ذخیره و آپدیت ردیف‌ها
  // -----------------------------
  const handleDelete = useCallback(
    async (row: T) => {
      if (!isEnabled) return;

      const id = getIdValue(row);
      setLoading(true);
      await deleteById(id);
      setRows((prev) => prev.filter((x) => getIdValue(x) !== id));
      setLoading(false);
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
