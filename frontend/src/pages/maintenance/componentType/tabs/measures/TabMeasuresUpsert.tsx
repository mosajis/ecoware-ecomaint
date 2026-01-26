import * as z from "zod";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/NumberField";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import {
  tblCompTypeMeasurePoint,
  tblCounterType,
  tblUnit,
  TypeTblCompTypeMeasurePoint,
} from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";

/* === Schema === */
const schema = z.object({
  counterType: z.object({
    counterTypeId: z.number(),
    name: z.string().optional(),
  }),
  unit: z.object({
    unitId: z.number(),
    name: z.string().optional(),
  }),
  setValue: z.number().nullable(),
  operationalMinValue: z.number().nullable(),
  operationalMaxValue: z.number().nullable(),
  orderNo: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compTypeId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeMeasurePoint) => void;
};

function MeasurePointUpsert({
  open,
  mode,
  recordId,
  compTypeId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FormValues = {
    counterType: null as any,
    unit: null as any,
    setValue: null,
    operationalMinValue: null,
    operationalMaxValue: null,
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
      const res = await tblCompTypeMeasurePoint.getById(recordId, {
        include: { tblCounterType: true, tblUnit: true },
      });

      reset({
        counterType: res.tblCounterType
          ? {
              counterTypeId: res.tblCounterType.counterTypeId,
              name: res.tblCounterType.name ?? undefined,
            }
          : undefined,

        unit: res.tblUnit
          ? {
              unitId: res.tblUnit.unitId,
              name: res.tblUnit.name ?? undefined,
            }
          : undefined,

        setValue: res.setValue ?? null,
        operationalMinValue: res.operationalMinValue ?? null,
        operationalMaxValue: res.operationalMaxValue ?? null,
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

        const payload = {
          setValue: parsed.data.setValue,
          operationalMinValue: parsed.data.operationalMinValue,
          operationalMaxValue: parsed.data.operationalMaxValue,
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            "tblCounterType",
            "counterTypeId",
            parsed.data.counterType.counterTypeId,
          ),
          ...buildRelation("tblUnit", "unitId", parsed.data.unit.unitId),
          ...buildRelation("tblCompType", "compTypeId", compTypeId),
        };

        let result: TypeTblCompTypeMeasurePoint;

        if (mode === "create") {
          result = await tblCompTypeMeasurePoint.create(payload);
        } else {
          result = await tblCompTypeMeasurePoint.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compTypeId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Measure Point" : "Edit Measure Point"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Measure (Counter Type) */}
        <Controller
          name="counterType"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Measure *"
              value={field.value}
              onChange={field.onChange}
              request={() => tblCounterType.getAll({ filter: { type: 3 } })}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.counterTypeId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        {/* Unit */}
        <Controller
          name="unit"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Unit *"
              value={field.value}
              onChange={field.onChange}
              request={tblUnit.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.unitId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="setValue"
          control={control}
          render={({ field }) => <NumberField {...field} label="Set Value" />}
        />

        <Box display={"flex"} gap={1.5}>
          <Controller
            name="operationalMinValue"
            control={control}
            render={({ field }) => (
              <NumberField
                sx={{ flex: 1 }}
                {...field}
                label="Operational Min"
              />
            )}
          />

          <Controller
            name="operationalMaxValue"
            control={control}
            render={({ field }) => (
              <NumberField
                sx={{ flex: 1 }}
                {...field}
                label="Operational Max"
              />
            )}
          />
        </Box>

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => <NumberField {...field} label="Order No" />}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(MeasurePointUpsert);
