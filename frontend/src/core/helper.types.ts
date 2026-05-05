type UpsertProps<T> = {
  entityName: string;
  open: boolean;
  mode: "create" | "update" | "view";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data?: T) => void;
};
