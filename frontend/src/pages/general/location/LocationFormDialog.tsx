import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";

// === Validation Schema with Zod ===
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  locationCode: z.string(),
  parentLocationId: z.number().nullable().optional(),
  orderId: z.number().nullable().optional(),
});

export type LocationFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblLocation) => void;
};

function LocationFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: LocationFormValues = useMemo(
    () => ({
      name: "",
      locationCode: "",
      parentLocationId: null,
      orderId: null,
    }),
    []
  );

  const { control, handleSubmit, reset } = useForm<LocationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data for update ===
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblLocation.getById(recordId);
        reset({
          name: res?.name ?? "",
          locationCode: res?.locationCode ?? "",
          parentLocationId: res?.parentLocationId ?? null,
          orderId: res?.orderId ?? null,
        });
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

  // === Handle form submit ===
  const handleFormSubmit = useCallback(
    async (values: LocationFormValues) => {
      try {
        setSubmitting(true);

        // ✅ Validate with Zod
        const validated = schema.parse(values);

        let result: TypeTblLocation;
        if (mode === "create") {
          result = await tblLocation.create(validated);
        } else if (mode === "update" && recordId) {
          result = await tblLocation.update(recordId, validated);
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
      title={mode === "create" ? "Create Location" : "Edit Location"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="locationCode"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Code *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Name *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
        <Controller
          name="parentLocationId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Parent Id"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
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
          name="orderId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Order"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
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

export default memo(LocationFormDialog);
