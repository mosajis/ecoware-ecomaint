import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";

// === Validation Schema with Yup ===
const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  locationCode: Yup.string().required("Code is required"),
  parentLocationId: Yup.number().nullable(),
  orderId: Yup.number().nullable(),
});

export type LocationFormValues = Yup.InferType<typeof schema>;

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
    resolver: yupResolver(schema),
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
        let result: TypeTblLocation;

        if (mode === "create") {
          result = await tblLocation.create(values);
        } else if (mode === "update" && recordId) {
          result = await tblLocation.update(recordId, values);
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
      open={true}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
