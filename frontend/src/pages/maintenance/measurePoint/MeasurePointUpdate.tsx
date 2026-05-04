import * as z from "zod";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";

import {
  tblCompMeasurePoint,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";

/* ================= Schema ================= */
const schema = z.object({
  currentValue: z.number(),
  currentDate: z.string().or(z.date()),
});

export type CompMeasurePointCurrentFormValues = z.infer<typeof schema>;

/* ================= Props ================= */
type Props = {
  open: boolean;
  recordId: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCompMeasurePoint) => void;
};

function MeasurePointsUpdate({ open, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: CompMeasurePointCurrentFormValues = useMemo(
    () => ({
      currentValue: 0,
      currentDate: new Date(),
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompMeasurePointCurrentFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* ================= Fetch data (edit) ================= */
  const fetchData = useCallback(async () => {
    if (!recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompMeasurePoint.getById(recordId);
      if (res) {
        reset({
          currentValue: res.currentValue ?? 0,
          currentDate: res.currentDate ?? new Date(),
        });
      }
    } catch (err) {
      console.error("Failed to fetch CompMeasurePoint", err);
      reset(defaultValues);
    } finally {
      setLoadingInitial(false);
    }
  }, [recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  /* ================= Submit ================= */
  const onSubmit = useCallback(
    async (values: CompMeasurePointCurrentFormValues) => {
      if (!recordId) return;

      setSubmitting(true);
      try {
        const result = await tblCompMeasurePoint.update(recordId, {
          currentValue: values.currentValue,
          currentDate: values.currentDate.toString(),
        });

        onSuccess(result);
        onClose();
      } catch (err) {
        console.error("Update CompMeasurePoint failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [recordId, onSuccess, onClose],
  );

  return (
    <FormDialog
      maxWidth="xs"
      open={open}
      onClose={onClose}
      title="Update Counter Value"
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Current Date */}
        <Controller
          name="currentDate"
          control={control}
          render={({ field }) => (
            <FieldDateTime
              label="Current Date"
              field={field}
              type="DATETIME"
              disabled={isDisabled}
              error={!!errors.currentDate}
              helperText={errors.currentDate?.message}
            />
          )}
        />

        {/* Current Value */}
        <Controller
          name="currentValue"
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              label="Current Value"
              size="small"
              disabled={isDisabled}
              error={!!errors.currentValue}
              helperText={errors.currentValue?.message}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(MeasurePointsUpdate);
