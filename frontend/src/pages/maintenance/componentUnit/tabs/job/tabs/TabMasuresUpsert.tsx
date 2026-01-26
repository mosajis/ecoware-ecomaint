import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/NumberField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";
import {
  tblCompJobMeasurePoint,
  tblCompMeasurePoint,
} from "@/core/api/generated/api";

/* ================= Schema ================= */

const schema = z.object({
  compMeasurePoint: z
    .object({
      compMeasurePointId: z.number(),
    })
    .nullable()
    .refine(Boolean, { message: "Measure Point is required" }),

  minValue: z.number().nullable(),
  maxValue: z.number().nullable(),
  useOperationalValues: z.boolean(),
  updateOnReport: z.boolean(),
  orderNo: z.number().nullable(),
});

type FormValues = z.infer<typeof schema>;

/* ================= Props ================= */

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compJobId: number;
  compId: number;
  onClose: () => void;
  onSuccess: () => void;
};

/* ================= Component ================= */

function TabMasuresUpsert({
  open,
  mode,
  recordId,
  compJobId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* -------- defaultValues -------- */

  const defaultValues: FormValues = {
    compMeasurePoint: null,
    minValue: null,
    maxValue: null,
    useOperationalValues: false,
    updateOnReport: false,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* -------- Load edit data -------- */

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblCompJobMeasurePoint.getById(recordId, {
        include: {
          tblCompMeasurePoint: {
            include: {
              tblCounterType: true,
            },
          },
        },
      });

      reset({
        compMeasurePoint: res.tblCompMeasurePoint ?? null,
        minValue: res.minValue ?? null,
        maxValue: res.maxValue ?? null,
        useOperationalValues: Boolean(res.useOperationalValues),
        updateOnReport: Boolean(res.updateOnReport),
        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  /* -------- Submit -------- */

  const onSubmit = useCallback(
    async (values: FormValues) => {
      setSubmitting(true);
      try {
        const payload = {
          minValue: values.minValue,
          maxValue: values.maxValue,
          useOperationalValues: values.useOperationalValues ? 1 : 0,
          updateOnReport: values.updateOnReport ? 1 : 0,
          orderNo: values.orderNo,
          ...buildRelation(
            "tblCompMeasurePoint",
            "compMeasurePointId",
            values.compMeasurePoint!.compMeasurePointId,
          ),
          ...buildRelation("tblCompJob", "compJobId", compJobId),
        };

        mode === "create"
          ? await tblCompJobMeasurePoint.create(payload)
          : await tblCompJobMeasurePoint.update(recordId!, payload);

        onSuccess();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compJobId, onSuccess, onClose],
  );

  /* ================= Render ================= */

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Measure" : "Edit Measure"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Measure Point */}
        <Controller
          name="compMeasurePoint"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Measure Point *"
              value={field.value}
              onChange={field.onChange}
              request={() =>
                tblCompMeasurePoint.getAll({
                  include: { tblCounterType: true },
                  filter: { compId },
                })
              }
              getOptionLabel={(row: any) => row?.tblCounterType?.name}
              getRowId={(row) => row.compMeasurePointId}
              columns={[
                {
                  field: "name",
                  headerName: "Measure Name",
                  flex: 1,
                  valueGetter: (_: any, row: any) => row?.tblCounterType?.name,
                },
              ]}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Box display={"flex"} gap={1.5}>
          <Controller
            name="minValue"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth {...field} label="Min Value" />
            )}
          />

          <Controller
            name="maxValue"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth {...field} label="Max Value" />
            )}
          />
        </Box>

        <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} gap={1.5}>
          <Controller
            name="orderNo"
            control={control}
            render={({ field }) => <NumberField {...field} label="Order No" />}
          />
          <Controller
            name="useOperationalValues"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Use Operational Values"
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    inputRef={field.ref}
                  />
                }
              />
            )}
          />

          <Controller
            name="updateOnReport"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Update On Report"
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    inputRef={field.ref}
                  />
                }
              />
            )}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(TabMasuresUpsert);
