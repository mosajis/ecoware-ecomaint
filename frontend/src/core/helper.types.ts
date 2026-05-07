type UpsertProps = {
  entityName: string;
  open: boolean;
  mode: "create" | "update" | "view";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data?: any) => void;
};
