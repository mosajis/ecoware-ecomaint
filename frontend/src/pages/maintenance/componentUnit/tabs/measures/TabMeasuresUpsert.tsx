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
  compId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompMeasurePoint) => void;
};

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
      const res = await tblCompMeasurePoint.getById(recordId, {
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
          ...buildRelation("tblComponentUnit", "compId", compId),
        };

        let result: TypeTblCompMeasurePoint;

        if (mode === "create") {
          result = await tblCompMeasurePoint.create(payload);
        } else {
          result = await tblCompMeasurePoint.update(recordId!, payload);
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
      title={mode === "create" ? "Create Measure Point" : "Edit Measure Point"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Measure (Counter Type) */}
        {compId}
        <Controller
          name="counterType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Measure *"
              value={field.value}
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
        <Box display={"flex"} gap={1.5}>
          <Controller
            name="operationalMinValue"
            control={control}
            render={({ field }) => (
              <FieldNumber
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
              <FieldNumber
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
          render={({ field }) => (
            <FieldNumber sx={{ width: "40%" }} {...field} label="Order No" />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CompMeasurePointUpsert);
