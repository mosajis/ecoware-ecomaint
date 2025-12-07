import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";

// === Zod schema ===
const schema = z.object({
  code: z.string().nullable(),
  name: z.string().min(1, "Name is required").nullable(),
  type: z.number().nullable(),
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
      type: null,
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
            type: res.type ?? null,
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
      <Box display="flex" flexDirection={"column"} gap={1.5}>
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
              sx={{ width: "70%" }}
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
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Type"
              size="small"
              disabled={isDisabled}
              sx={{ width: "50%" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            >
              <MenuItem value={3}>Measure</MenuItem>
              <MenuItem value={0}>Counter</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CounterTypeFormDialog);
