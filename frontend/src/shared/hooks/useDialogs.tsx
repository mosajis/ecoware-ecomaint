import { useState, useCallback, useMemo } from "react";

/**
 * Hook for managing multiple dialogs with high performance.
 *
 * All dialogs must be boolean.
 */
export function useDialogs<T extends Record<string, boolean>>(
  initialDialogs: T,
) {
  const [dialogs, setDialogs] = useState<T>(initialDialogs);

  const openDialog = useCallback((key: keyof T) => {
    setDialogs((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  const closeDialog = useCallback((key: keyof T) => {
    setDialogs((prev) => (!prev[key] ? prev : { ...prev, [key]: false }));
  }, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs((prev) => {
      let changed = false;
      const next = {} as T;
      for (const key in prev) {
        next[key] = false as any;
        if (prev[key]) changed = true;
      }
      return changed ? next : prev;
    });
  }, []);

  const isAnyOpen = useMemo(
    () => Object.values(dialogs).some(Boolean),
    [dialogs],
  );

  return {
    dialogs,
    openDialog,
    closeDialog,
    closeAllDialogs,
    isAnyOpen,
  };
}
