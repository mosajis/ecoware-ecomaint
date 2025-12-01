import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblFollowStatus, TypeTblFollowStatus } from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  fsName: z.string().min(1, "Name is required").nullable(),
  fsDesc: z.string().nullable(),
  sortId: z.number().nullable(),
});

export type FollowStatusFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function FollowStatusFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // === Default Values
  const defaultValues: FollowStatusFormValues = useMemo(
    () => ({
      fsName: "",
      fsDesc: "",
      sortId: null,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FollowStatusFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch data for update mode
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId != null) {
      setLoadingInitial(true);
      try {
        const res = await tblFollowStatus.getById(recordId);
        if (res) {
          reset({
            fsName: res.fsName ?? "",
            fsDesc: res.fsDesc ?? "",
            sortId: res.sortId ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch FollowStatus", err);
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

  // === Form submit handler
  const handleFormSubmit = useCallback(
    async (values: FollowStatusFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblFollowStatus;
        if (mode === "create") {
          result = await tblFollowStatus.create(values);
        } else if (mode === "update" && recordId != null) {
          result = await tblFollowStatus.update(recordId, values);
        } else {
          return;
        }
        onSuccess();
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
      title={mode === "create" ? "Create Follow Status" : "Edit Follow Status"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="fsName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.fsName}
              helperText={errors.fsName?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
        <Controller
          name="fsDesc"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              error={!!errors.fsDesc}
              helperText={errors.fsDesc?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
        <Controller
          name="sortId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Sort ID"
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

export default memo(FollowStatusFormDialog);
