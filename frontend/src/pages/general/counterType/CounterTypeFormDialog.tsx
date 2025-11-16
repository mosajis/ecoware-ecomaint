import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";

// === Zod schema ===
const schema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1, "Name is required").nullable(),
  maxDailyValue: z.number().nullable(),
  type: z.number().nullable(),
  deptId: z.number().nullable(),
  exportMarker: z.number().nullable(),
});

export type CounterTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCounterType) => void;
};

function CounterTypeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: CounterTypeFormValues = useMemo(
    () => ({
      code: "",
      name: "",
      maxDailyValue: null,
      type: null,
      deptId: null,
      exportMarker: null,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CounterTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch data for update ===
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblCounterType.getById(recordId);
        if (res) {
          reset({
            code: res.code ?? "",
            name: res.name ?? "",
            maxDailyValue: res.maxDailyValue ?? null,
            type: res.type ?? null,
            deptId: res.deptId ?? null,
            exportMarker: res.exportMarker ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch CounterType", err);
        reset(defaultValues);
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset(defaultValues);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  const handleFormSubmit = useCallback(
    async (values: CounterTypeFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblCounterType;
        if (mode === "create") {
          result = await tblCounterType.create(values);
        } else if (mode === "update" && recordId) {
          result = await tblCounterType.update(recordId, values);
        } else {
          return;
        }
        onSuccess(result);
        onClose();
      } catch (err) {
        console.error("Submit failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose]
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Counter Type" : "Edit Counter Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              size="small"
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
        <Controller
          name="maxDailyValue"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Max Daily Value"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 1" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Type"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 1" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
        <Controller
          name="deptId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Dept ID"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 1" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
        <Controller
          name="exportMarker"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Export Marker"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 1" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CounterTypeFormDialog);
