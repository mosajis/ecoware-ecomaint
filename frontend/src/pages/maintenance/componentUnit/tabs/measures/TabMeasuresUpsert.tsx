import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  tblCompMeasurePoint,
  tblCounterType,
  tblUnit,
  TypeTblCompMeasurePoint,
} from "@/core/api/generated/api";

/* ===================== Schema ===================== */

const counterTypeSchema = z.object({
  counterTypeId: z.number(),
  name: z.string().optional(),
});

const unitSchema = z.object({
  unitId: z.number(),
  name: z.string().optional(),
});

const schema = z.object({
  counterType: counterTypeSchema,
  unit: unitSchema,
  setValue: z.number().nullable(),
  operationalMinValue: z.number().nullable(),
  operationalMaxValue: z.number().nullable(),
  orderNo: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

/* ===================== Types ===================== */

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompMeasurePoint) => void;
};

/* ===================== Defaults ===================== */

const defaultValues: Partial<FormValues> = {
  setValue: null,
  operationalMinValue: null,
  operationalMaxValue: null,
  orderNo: null,
};

/* ===================== Component ===================== */

function CompMeasurePointUpsert({
  open,
  mode,
  recordId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormValues,
  });

  /* ===================== Load (Edit Mode) ===================== */

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues as FormValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompMeasurePoint.getById(recordId, {
        include: { tblCounterType: true, tblUnit: true },
      });

      reset({
        counterType: {
          counterTypeId: res?.tblCounterType?.counterTypeId,
          name: res?.tblCounterType?.name ?? undefined,
        },
        unit: {
          unitId: res?.tblUnit?.unitId,
          name: res?.tblUnit?.name ?? undefined,
        },
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

  /* ===================== Submit ===================== */

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitting(true);
      try {
        const payload = {
          setValue: values.setValue,
          operationalMinValue: values.operationalMinValue,
          operationalMaxValue: values.operationalMaxValue,
          orderNo: values.orderNo,

          ...buildRelation(
            "tblCounterType",
            "counterTypeId",
            values.counterType.counterTypeId,
          ),
          ...buildRelation("tblUnit", "unitId", values.unit.unitId),
          ...buildRelation("tblComponentUnit", "compId", compId),
        };
        console.log(payload);
        const result =
          mode === "create"
            ? await tblCompMeasurePoint.create(payload)
            : await tblCompMeasurePoint.update(recordId!, payload);

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compId, onSuccess, onClose],
  );

  /* ===================== Render ===================== */

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
        {/* Counter Type */}
        <Controller
          name="counterType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Measure *"
              value={field.value}
              disabled={mode === "update"}
              onChange={field.onChange}
              request={() =>
                tblCounterType.getAll({
                  filter: {
                    type: 3,
                    NOT: {
                      tblCompMeasurePoints: {
                        some: { compId },
                      },
                    },
                  },
                })
              }
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
            <FieldAsyncSelectGrid
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
          render={({ field }) => <FieldNumber {...field} label="Set Value" />}
        />

        <Box display="flex" gap={1.5}>
          <Controller
            name="operationalMinValue"
            control={control}
            render={({ field }) => (
              <FieldNumber
                {...field}
                sx={{ flex: 1 }}
                label="Operational Min"
              />
            )}
          />
          <Controller
            name="operationalMaxValue"
            control={control}
            render={({ field }) => (
              <FieldNumber
                {...field}
                sx={{ flex: 1 }}
                label="Operational Max"
              />
            )}
          />
        </Box>

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <FieldNumber {...field} sx={{ width: "40%" }} label="Order No" />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CompMeasurePointUpsert);
