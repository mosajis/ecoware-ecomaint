import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import IconEye from "@mui/icons-material/RemoveRedEye";
import {
  useForm,
  UseFormReturn,
  DefaultValues,
  FieldValues,
} from "react-hook-form";

type Mode = "create" | "update" | "view";

type UseUpsertFormOptions<TValues extends FieldValues, TResult> = {
  open: boolean;
  mode: Mode;
  recordId?: number | null;
  schema: ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;
  entityName: string;
  onFetch: (recordId: number) => Promise<Partial<TValues>>;
  onClose: () => void;
  onCreate?: (values: TValues) => Promise<TResult>;
  onUpdate?: (id: number, values: TValues) => Promise<TResult>;
  onSuccess?: (result: TResult) => void;
  errorMessage?: string;
};

type UseUpsertFormReturn<TValues extends FieldValues, TResult> = {
  form: UseFormReturn<TValues>;
  loadingInitial: boolean;
  submitting: boolean;
  isDisabled: boolean;
  readonly: boolean;
  handleFormSubmit: () => void;
  title: string;
};

export function useUpsertForm<TValues extends FieldValues, TResult>({
  open,
  mode,
  recordId,
  schema,
  defaultValues,
  entityName,
  onFetch,
  onClose,
  onCreate,
  onUpdate,
  onSuccess,
  errorMessage,
}: UseUpsertFormOptions<TValues, TResult>): UseUpsertFormReturn<
  TValues,
  TResult
> {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onFetchRef = useRef(onFetch);
  const onCloseRef = useRef(onClose);
  const onSuccessRef = useRef(onSuccess);
  const onCreateRef = useRef(onCreate);
  const onUpdateRef = useRef(onUpdate);
  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    onFetchRef.current = onFetch;
  }, [onFetch]);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  useEffect(() => {
    onCreateRef.current = onCreate;
  }, [onCreate]);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const form = useForm<TValues>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    if ((mode === "update" || mode === "view") && recordId) {
      setLoadingInitial(true);
      try {
        const values = await onFetchRef.current(recordId);
        form.reset(values as DefaultValues<TValues>);
      } finally {
        setLoadingInitial(false);
      }
    } else {
      form.reset(defaultValuesRef.current);
    }
  }, [mode, recordId]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleFormSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let result: TResult | undefined;

      if (mode === "create") {
        result = await onCreateRef.current?.(values);
      } else if (mode === "update" && recordId) {
        result = await onUpdateRef.current?.(recordId, values);
      }

      if (result) {
        onSuccessRef.current?.(result);
        onCloseRef.current();
      }
    } catch {
      toast.error("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  });

  const title = useMemo(
    () =>
      ({
        create: `Create ${entityName}`,
        update: `Edit ${entityName}`,
        view: `View ${entityName}`,
      })[mode],
    [mode, entityName],
  );

  return {
    form,
    loadingInitial,
    submitting,
    title,
    isDisabled: loadingInitial || submitting,
    readonly: mode === "view",
    handleFormSubmit,
  };
}
