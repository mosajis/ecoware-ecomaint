import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredStringField } from "@/core/helper";
import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";

// === Validation Schema with Zod ===
const schema = z.object({
  descr: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data: TypeTblJobTrigger) => void;
};

function JobTriggerUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FormValues = useMemo(
    () => ({
      descr: "",
      orderNo: null,
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      const res = await tblJobTrigger.getById(recordId);
      if (res) {
        reset({
          descr: res.descr ?? "",
          orderNo: res.orderNo,
        });
      }
      setLoadingInitial(false);
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
    async (values: FormValues) => {
      setSubmitting(true);

      let result: TypeTblJobTrigger | undefined;
      if (mode === "create") {
        result = await tblJobTrigger.create(values);
      } else if (mode === "update" && recordId) {
        result = await tblJobTrigger.update(recordId, values);
      }

      if (result) {
        onSuccess?.(result);
        onClose();
      }

      setSubmitting(false);
    },
    [mode, recordId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job Trigger" : "Edit Job Trigger"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="descr"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description *"
              size="small"
              error={!!errors.descr}
              helperText={errors.descr?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <FieldNumber
              {...field}
              label="Order No"
              size="small"
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2 " }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobTriggerUpsert);
