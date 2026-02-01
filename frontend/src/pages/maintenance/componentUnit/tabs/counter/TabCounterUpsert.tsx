import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
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
  counterType: z
    .object({
      counterTypeId: z.number(),
      name: z.string().optional().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "counterType is required",
    }),

  dependOn: z
    .object({
      compCounterId: z.number(),
      name: z.string().optional().nullable(),
    })
    .nullable()
    .optional(),

  startDate: z.string().or(z.date()),
  startValue: z.number(),

  averageCountRate: z.number().nullable(),
  useCalcAverage: z.boolean().nullable(),

  orderNo: z.number().nullable(),
});

type FormValues = z.input<typeof schema>;

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

  const isDisabled = loadingInitial || submitting;

  const defaultValues: FormValues = {
    counterType: null,
    dependOn: null,
    startDate: new Date(),
    startValue: 0,
    averageCountRate: null,
    useCalcAverage: null,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* === Load in edit === */
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompCounter.getById(recordId, {
        include: {
          tblCounterType: true,
          tblCompCounter: {
            include: {
              tblCounterType: true,
            },
          },
        },
      });

      reset({
        counterType: res.tblCounterType ?? null,
        dependOn: res?.tblCompCounter ?? null,
        startDate: res.startDate ?? new Date(),
        startValue: res.startValue ?? 0,
        averageCountRate: res.averageCountRate ?? null,
        useCalcAverage: Boolean(res.useCalcAverage),
        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  /* === Submit === */
  const onSubmit = useCallback(
    async (values: FormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        const counterTypeRelation = buildRelation(
          "tblCounterType",
          "counterTypeId",
          parsed.data.counterType!.counterTypeId,
        );

        const dependOnRelation = parsed.data.dependOn
          ? buildRelation(
              "tblCompCounter",
              "compCounterId",
              parsed.data.dependOn.compCounterId,
            )
          : {};

        const compRelation = buildRelation(
          "tblComponentUnit",
          "compId",
          compId,
        );

        const payload = {
          startDate: parsed.data.startDate.toString(),
          startValue: parsed.data.startValue,
          averageCountRate: parsed.data.averageCountRate,
          useCalcAverage: parsed.data.useCalcAverage ? 1 : 0,
          orderNo: parsed.data.orderNo,
          ...counterTypeRelation,
          ...dependOnRelation,
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
            <FieldAsyncSelectGrid
              label="Counter Type *"
              value={field.value}
              onChange={field.onChange}
              request={() =>
                tblCounterType.getAll({
                  filter: {
                    type: 0,
                    NOT: {
                      tblCompCounters: {
                        some: { compId },
                      },
                    },
                  },
                })
              }
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.counterTypeId}
              disabled={isDisabled || mode === "update"}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Box display="flex" gap={1.5}>
          {/* Start Date */}
          <Controller
            name="startDate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                label="Start Date"
                field={field}
                type="DATETIME"
                disabled={isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Start Value */}
          <Controller
            name="startValue"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                fullWidth
                {...field}
                onChange={field.onChange}
                label="Start Value"
                size="small"
                disabled={isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Average */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Controller
            name="averageCountRate"
            control={control}
            render={({ field }) => (
              <NumberField
                {...field}
                fullWidth
                disabled={isDisabled}
                label="Average Count Rate"
                size="small"
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
                    disabled={isDisabled}
                    checked={Boolean(field.value)}
                    onChange={(_, checked) => field.onChange(checked)}
                  />
                }
                label="Use this average"
              />
            )}
          />
        </Box>

        {/* Depends On */}
        <Controller
          name="dependOn"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Depends On"
              value={field.value}
              disabled={isDisabled}
              getOptionLabel={(row) => row?.tblCounterType?.name}
              onChange={field.onChange}
              request={() =>
                tblCompCounter.getAll({
                  filter: {
                    compCounterId: {
                      not: recordId,
                    },
                  },
                  include: {
                    tblCounterType: true,
                  },
                })
              }
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) => row?.tblCounterType?.name,
                },
              ]}
              getRowId={(row) => row.counterTypeId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Order */}
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              sx={{ width: "40%" }}
              {...field}
              disabled={isDisabled}
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
