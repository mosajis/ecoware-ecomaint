import { useCallback, useEffect, useState } from "react";

// Helper: extract payload type from updater function
type ExtractUpdaterPayload<T> = T extends (id: any, payload: infer P) => any
  ? P
  : never;

interface UseEditorOptions<
  T,
  U extends (id: any, payload: any) => any,
  ID extends string | number = number,
> {
  id?: ID | null;
  fetcher: (id: ID) => Promise<T>;
  updater: U;
}

export function useEditor<T, U extends (id: any, payload: any) => any>(
  options: UseEditorOptions<T, U>,
) {
  const { id, fetcher, updater } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher(id);
        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [id, fetcher]);

  const save = useCallback(
    async (payload: ExtractUpdaterPayload<U>) => {
      if (!id) return;
      setError(null);
      try {
        await updater(id, payload);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Update failed"));
        throw err;
      }
    },
    [id, updater],
  );

  const refetch = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const result = await fetcher(id);

      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Fetch failed"));
      throw err;
    }
  }, [id, fetcher]);

  return {
    data,
    loading,
    error,
    save,
    refetch,
    setData,
  };
}
