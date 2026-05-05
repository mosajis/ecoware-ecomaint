import { useState, useCallback } from "react";
import { useDialogs } from "@/shared/hooks/useDialogs";

type Mode = "create" | "update" | "view";
type Prop<T> = {
  onSuccess?: (data?: T) => void;
};

export function useUpsertDialog<T>({ onSuccess }: Prop<T>) {
  const [recordId, setRecordId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("create");

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const open = useCallback(
    (mode: Mode, id?: number | null) => {
      setMode(mode);
      setRecordId(id ?? null);
      openDialog("upsert");
    },
    [openDialog],
  );

  return {
    openCreate: () => open("create"),
    openEdit: (id: number) => open("update", id),
    openView: (id: number) => open("view", id),

    dialogProps: {
      mode,
      recordId,
      open: dialogs.upsert,
      onClose: () => closeDialog("upsert"),
      onSuccess,
    },
  };
}
