import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblMaintType, TypeTblMaintType } from "@/core/api/generated/api";

const schema = z.object({
  description: z.string().min(1, "Description is required").nullable(),
});

export type MaintTypeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblMaintType) => void;
};

function MaintTypeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: MaintTypeFormValues = useMemo(
    () => ({ description: "" }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintTypeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblMaintType.getById(recordId);
        reset({ description: res?.descr ?? "" });
      } catch (err) {
        console.error("Failed to fetch MaintType", err);
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
    async (values: MaintTypeFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblMaintType;
        if (mode === "create") {
          result = await tblMaintType.create({
            descr: values.description,
          });
        } else if (mode === "update" && recordId) {
          result = await tblMaintType.update(recordId, {
            descr: values.description,
          });
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
      title={mode === "create" ? "Create Maint Type" : "Edit Maint Type"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description *"
              size="small"
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(MaintTypeFormDialog);
