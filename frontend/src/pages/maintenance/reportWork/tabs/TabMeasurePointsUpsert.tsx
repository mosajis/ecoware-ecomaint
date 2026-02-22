// MeasureValueFormDialog.tsx
import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import NumberField from "@/shared/components/fields/FieldNumber";
import { useForm, Controller } from "react-hook-form";
import { memo, useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblCompMeasurePoint,
  tblCompMeasurePointLog,
  TypeTblCompJobMeasurePoint,
} from "@/core/api/generated/api";

const schema = z.object({
  currentValue: z.number(),
});

export type MeasureValueFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  row: TypeTblCompJobMeasurePoint | null;
  maintLogDate?: string;
  userId: number;
  onClose: () => void;
  onSuccess: (newValue: number, currentDate: string) => void;
};

function StepMeasurePointUpsert({
  open,
  row,
  maintLogDate,
  userId,
  onClose,
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: MeasureValueFormValues = {
    currentValue: 0,
  };

  const { control, handleSubmit, reset } = useForm<MeasureValueFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Load initial value when dialog opens
  useEffect(() => {
    if (open && row) {
      reset({
        currentValue: row.tblCompMeasurePoint?.currentValue ?? 0,
      });
    }
  }, [open, row, reset]);

  const handleFormSubmit = useCallback(
    async (values: MeasureValueFormValues) => {
      if (!row?.tblCompMeasurePoint?.compMeasurePointId) {
        console.error("compMeasurePointId is required");
        return;
      }

      try {
        setSubmitting(true);

        const compMeasurePointId = row.tblCompMeasurePoint.compMeasurePointId;
        // @ts-ignore
        const unitId = row?.tblCompMeasurePoint?.tblUnit?.unitId;
        const currentDate = maintLogDate || new Date().toISOString();

        // Update measure point
        await tblCompMeasurePoint.update(compMeasurePointId, {
          currentDate: currentDate,
          currentValue: values.currentValue,
        });

        // Create log entry
        await tblCompMeasurePointLog.create({
          tblUsers: {
            connect: {
              userId,
            },
          },
          changedDate: new Date().toISOString(),
          currentDate: currentDate,
          currentValue: values.currentValue,
          lastupdate: new Date().toISOString(),
          tblCompMeasurePoint: {
            connect: {
              compMeasurePointId: compMeasurePointId,
            },
          },
          ...(unitId && {
            tblUnit: {
              connect: {
                unitId: unitId,
              },
            },
          }),
        });

        // Pass new value and date to parent for optimistic update
        onSuccess(values.currentValue, currentDate);
        onClose();
      } catch (error) {
        console.error("Error updating measure value:", error);
      } finally {
        setSubmitting(false);
      }
    },
    [row, maintLogDate, userId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Update Measure Value"
      submitting={submitting}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Current Value */}
        <Controller
          name="currentValue"
          control={control}
          render={({ field, fieldState }) => (
            <NumberField
              {...field}
              label="Current Value *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={submitting}
              value={field.value}
              onChange={(value) => field.onChange(value)}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(StepMeasurePointUpsert);
