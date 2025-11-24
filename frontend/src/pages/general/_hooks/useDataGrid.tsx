import { useState, useCallback, useEffect, useRef } from "react";

type ExtractQuery<F> = F extends (params?: infer Q) => any ? Q : never;

type ExtractItems<F> = F extends (...args: any[]) => Promise<infer R>
  ? R extends { items: (infer T)[] }
    ? T
    : R extends (infer T)[]
      ? T
      : never
  : never;

export function useDataGrid<
  GetAllFn extends (...args: any[]) => Promise<any>,
  DeleteFn extends (id: any) => Promise<any>,
  T = ExtractItems<GetAllFn>,
  Q = ExtractQuery<GetAllFn>,
  K extends keyof T = keyof T,
>(getAll: GetAllFn, deleteById: DeleteFn, keyId: K) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const getIdValue = useCallback((row: T) => row[keyId], [keyId]);

  // -----------------------------
  // 1) یک ref برای نگه‌داشتن fetchData
  // -----------------------------
  const fetchRef = useRef<(params?: Q) => void>(() => {});

  const fetchData = useCallback(
    async (params?: Q) => {
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
    [getAll]
  );

  // ref همیشه نسخه جدید fetchData را نگه می‌دارد
  useEffect(() => {
    fetchRef.current = fetchData;
  }, [fetchData]);

  // -----------------------------
  // 2) یک handleRefresh که تغییر نمی‌کند
  // -----------------------------
  const handleRefresh = useCallback(() => {
    fetchRef.current();
  }, []); // هیچ وابستگی → همیشه ثابت

  // -----------------------------
  // حذف، ذخیره و آپدیت ردیف‌ها
  // -----------------------------
  const handleDelete = useCallback(
    async (row: T) => {
      const id = getIdValue(row);
      setLoading(true);
      await deleteById(id);
      setRows((prev) => prev.filter((x) => getIdValue(x) !== id));
      setLoading(false);
    },
    [deleteById, getIdValue]
  );

  const handleFormSuccess = useCallback(
    (record: T) => {
      const id = getIdValue(record);
      setRows((prev) => {
        const exists = prev.some((x) => getIdValue(x) === id);
        return exists
          ? prev.map((x) => (getIdValue(x) === id ? record : x))
          : [record, ...prev];
      });
    },
    [getIdValue]
  );

  // بارگذاری اولیه
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh, // stable forever
  };
}
