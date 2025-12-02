import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblPendingType, TypeTblPendingType } from "@/core/api/generated/api";

const schema = z.object({
  pendTypeName: z.string().min(1, "Name is required").nullable(),
  groupId: z.number().nullable(),
  description: z.string().nullable(),
});

export type PendingTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblPendingType) => void;
};

function PendingTypeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: PendingTypeFormValues = useMemo(
    () => ({
      pendTypeName: "",
      groupId: null,
      sortId: null,
      description: "",
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PendingTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblPendingType.getById(recordId);
        reset({
          pendTypeName: res?.pendTypeName ?? "",
          groupId: res?.groupId ?? null,
          description: res?.description ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch Pending Type", err);
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
    async (values: PendingTypeFormValues) => {
      setSubmitting(true);
      try {
        const payload = {
          pendTypeName: values.pendTypeName ?? "",
          description: values.description ?? "",
          groupId: values.groupId ?? 0,
        };

        let result: TypeTblPendingType;
        if (mode === "create") {
          result = await tblPendingType.create(payload);
        } else if (mode === "update" && recordId) {
          result = await tblPendingType.update(recordId, payload);
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
      title={mode === "create" ? "Create Pending Type" : "Edit Pending Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="pendTypeName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.pendTypeName}
              helperText={errors.pendTypeName?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="groupId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Group Id"
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
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(PendingTypeFormDialog);
