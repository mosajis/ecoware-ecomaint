import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/NumberField";
import DateField from "@/shared/components/DateField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblCompCounter,
  tblCounterType,
  TypeTblCompCounter,
} from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  counterType: z.object({
    counterTypeId: z.number(),
    name: z.string().optional().nullable(),
  }),
  currentValue: z.number().nullable(),
  currentDate: z.string().nullable(),
  startDate: z.string().nullable(),
  startValue: z.number().nullable(),
  averageCountRate: z.number().nullable(),
  useCalcAverage: z.number().nullable(),
  orderNo: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompCounter) => void;
};

function CompCounterUpsert({
  open,
  mode,
  recordId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FormValues = {
    counterType: null as any,
    currentValue: null,
    currentDate: null,
    startDate: null,
    startValue: null,
    averageCountRate: null,
    useCalcAverage: null,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load in edit ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompCounter.getById(recordId, {
        include: { tblCounterType: true },
      });

      reset({
        counterType: { ...res.tblCounterType },
        currentValue: res.currentValue ?? null,
        currentDate: res.currentDate ?? null,
        startDate: res.startDate ?? null,
        startValue: res.startValue ?? null,
        averageCountRate: res.averageCountRate ?? null,
        useCalcAverage: res.useCalcAverage ?? null,
        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // === Submit ===
  const onSubmit = useCallback(
    async (values: FormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        const counterTypeRelation = buildRelation(
          "tblCounterType",
          "counterTypeId",
          parsed.data.counterType.counterTypeId,
        );

        const compRelation = buildRelation(
          "tblComponentUnit",
          "compId",
          compId,
        );

        const payload = {
          currentValue: parsed.data.currentValue,
          currentDate: parsed.data.currentDate,
          startDate: parsed.data.startDate,
          startValue: parsed.data.startValue,
          averageCountRate: parsed.data.averageCountRate,
          useCalcAverage: parsed.data.useCalcAverage,
          orderNo: parsed.data.orderNo,
          ...counterTypeRelation,
          ...compRelation,
        };

        let result: TypeTblCompCounter;

        if (mode === "create") {
          result = await tblCompCounter.create(payload);
        } else {
          result = await tblCompCounter.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Counter" : "Edit Counter"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Counter Type */}
        <Controller
          name="counterType"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Counter Type *"
              value={field.value}
              onChange={field.onChange}
              request={() => tblCounterType.getAll({ filter: { type: 0 } })}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.counterTypeId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Box display={"flex"} gap={1.5}>
          {/* Current Value */}
          <Controller
            name="currentValue"
            control={control}
            render={({ field }) => (
              <NumberField
                fullWidth
                {...field}
                label="Current Value"
                size="small"
              />
            )}
          />

          {/* Current Date */}
          <Controller
            name="currentDate"
            control={control}
            render={({ field }) => (
              <DateField label="Current Date" field={field} type="DATETIME" />
            )}
          />
        </Box>

        <Box display={"flex"} gap={1.5}>
          {/* Start Value */}
          <Controller
            name="startValue"
            control={control}
            render={({ field }) => (
              <NumberField
                fullWidth
                {...field}
                label="Start Value"
                size="small"
              />
            )}
          />

          {/* Start Date */}
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateField label="Start Date" field={field} type="DATETIME" />
            )}
          />
        </Box>

        {/* Average Count Rate */}
        <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={1.5}>
          <Controller
            name="averageCountRate"
            control={control}
            render={({ field }) => (
              <NumberField
                {...field}
                fullWidth
                label="Average Count Rate"
                size="small"
                disabled
              />
            )}
          />

          <Controller
            name="useCalcAverage"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ margin: 0 }}
                control={
                  <Checkbox
                    checked={Boolean(field.value)}
                    onChange={field.onChange}
                  />
                }
                label="Use Calc Average"
              />
            )}
          />
        </Box>

        {/* Order */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              sx={{ width: "40%" }}
              {...field}
              label="Order No"
              size="small"
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CompCounterUpsert);
