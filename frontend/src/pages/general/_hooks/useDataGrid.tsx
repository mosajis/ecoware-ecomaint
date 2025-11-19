import { useState, useCallback, useEffect } from "react";

export type QueryParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: string;
  include?: string;
  paginate?: boolean;
  force?: boolean;
};

export function useDataGrid<T, K extends string | number>(
  api: {
    getAll: (params?: QueryParams) => Promise<{ items: T[] }>;
    deleteById: (id: K) => Promise<any>;
  },
  getId: (row: T) => K
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(
    async (params?: QueryParams) => {
      setLoading(true);
      try {
        const res = await api.getAll({
          ...params,
          paginate: false, // safe و کاملاً type-safe
        });
        setRows(res.items);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const handleDelete = useCallback(
    async (row: T) => {
      setLoading(true);
      const id = getId(row);
      await api.deleteById(id);
      setRows((prev) => prev.filter((x) => getId(x) !== id));
      setLoading(false);
    },
    [api, getId]
  );

  const handleFormSuccess = useCallback(
    (record: T) => {
      const id = getId(record);
      setRows((prev) => {
        const exists = prev.some((x) => getId(x) === id);
        return exists
          ? prev.map((x) => (getId(x) === id ? record : x))
          : [record, ...prev]; // اگر جدید بود به اول لیست اضافه می‌شود
      });
    },
    [getId]
  );

  // === Refresh ===
  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rows,
    loading,
    fetchData,
    handleDelete,
    handleFormSuccess,
    handleRefresh, // اضافه شد
  };
}
