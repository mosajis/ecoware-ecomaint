import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useEffect, useState, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tblLocation, TypeTblLocation } from "@/core/api/generated/api";

// === Validation Schema with Zod ===
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  locationCode: z.string(),
  parentLocationId: z.number(),
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

  const defaultValues: LocationFormValues = {
    name: "",
    locationCode: "",
    parentLocationId: 0,
    orderId: null,
  };

  const { control, handleSubmit, reset } = useForm<LocationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data for update with AbortController ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    const controller = new AbortController();

    try {
      const res = await tblLocation.getById(recordId);
      if (!controller.signal.aborted) {
        reset({
          name: res?.name ?? "",
          locationCode: res?.locationCode ?? "",
          parentLocationId: res?.parentLocationId ?? 0,
          orderId: res?.orderId ?? null,
        });
      }
    } finally {
      setLoadingInitial(false);
    }

    return () => controller.abort();
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Handle form submit ===
  const handleFormSubmit = useCallback(
    async (values: LocationFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        console.error("Validation failed", parsed.error.format());
        return;
      }

      try {
        setSubmitting(true);
        let result: TypeTblLocation;

        const parentId =
          parsed.data.parentLocationId &&
          Number(parsed.data.parentLocationId) > 0
            ? Number(parsed.data.parentLocationId)
            : null;

        if (mode === "create") {
          result = await tblLocation.create({
            name: parsed.data.name,
            locationCode: parsed.data.locationCode,

            ...(parentId
              ? {
                  tblLocation: {
                    connect: { locationId: parentId },
                  },
                }
              : {}),
          });
        } else if (mode === "update" && recordId) {
          result = await tblLocation.update(recordId, {
            name: parsed.data.name,
            locationCode: parsed.data.locationCode,

            ...(parentId
              ? {
                  tblLocation: {
                    connect: { locationId: parentId },
                  },
                }
              : {
                  tblLocation: { disconnect: true },
                }),
          });
        } else {
          return;
        }

        onSuccess(result);
        onClose();
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
