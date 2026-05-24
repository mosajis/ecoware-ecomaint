import { memo, useCallback, useEffect, useMemo, useState } from "react";
import * as z from "zod";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

import { buildRelation } from "@/core/helper";

import { tblCompCounter, tblCompJobCounter } from "@/core/api/generated/api";

/* =========================================================
 * Schema
 * =======================================================*/

const schema = z
  .object({
    compCounter: z
      .object({
        compCounterId: z.number(),
      })
      .nullable(),

    frequency: z.nullable(z.number()),
    window: z.nullable(z.number()),
    orderNo: z.nullable(z.number()),

    showInAlert: z.boolean(),
    updateByFunction: z.boolean(),
  })
  .refine((data) => data.compCounter !== null, {
    message: "Counter is required",
    path: ["compCounter"],
  });

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compJobId: number;
  compId: number;
  onClose: () => void;
  onSuccess: () => void;
};

/* =========================================================
 * Component
 * =======================================================*/

function JobCounterUpsert({
  open,
  mode,
  recordId,
  compJobId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo<FormValues>(
    () => ({
      compCounter: null,

      frequency: null,
      window: null,
      orderNo: null,

      showInAlert: false,
      updateByFunction: true,
    }),
    [],
  );

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* =========================================================
   * Load Update Data
   * =======================================================*/

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    try {
      setLoading(true);

      const res = await tblCompJobCounter.getById(recordId, {
        include: {
          tblCompCounter: {
            include: {
              tblCounterType: true,
            },
          },
        },
      });

      reset({
        compCounter: res.tblCompCounter || null,
        frequency: res.frequency,
        window: res.window,
        orderNo: res.orderNo,
        showInAlert: Boolean(res.showInAlert),
        updateByFunction: Boolean(res.updateByFunction),
      });
    } finally {
      setLoading(false);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (!open) return;

    fetchData();
  }, [open, fetchData]);

  /* =========================================================
   * Submit
   * =======================================================*/

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (values) => {
      const parsed = schema.safeParse(values);

      if (!parsed.success) {
        return;
      }

      try {
        setSubmitting(true);

        const payload = {
          frequency: parsed.data.frequency,
          window: parsed.data.window,
          orderNo: parsed.data.orderNo,

          showInAlert: parsed.data.showInAlert,
          updateByFunction: parsed.data.updateByFunction,

          ...buildRelation(
            "tblCompCounter",
            "compCounterId",
            parsed.data.compCounter,
          ),

          ...buildRelation("tblCompJob", "compJobId", { compJobId }),
        };

        if (mode === "create") {
          await tblCompJobCounter.create(payload);
        } else {
          await tblCompJobCounter.update(recordId!, payload);
        }

        onSuccess();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compJobId, onSuccess, onClose],
  );

  /* =========================================================
   * Render
   * =======================================================*/

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job Counter" : "Edit Job Counter"}
      loadingInitial={loading}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={2}>
        {/* =====================================================
         * Counter
         * ===================================================*/}

        <Controller
          name="compCounter"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Counter *"
              value={field.value}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              getRowId={(row: any) => row.compCounterId}
              getOptionLabel={(row: any) => row?.tblCounterType?.name ?? ""}
              request={() =>
                tblCompCounter.getAll({
                  include: {
                    tblCounterType: true,
                  },
                  filter: {
                    compId,
                  },
                })
              }
              columns={[
                {
                  field: "tblCounterType.name",
                  headerName: "Counter Type",
                  flex: 1,
                  valueGetter: (_: any, row: any) =>
                    row?.tblCounterType?.name ?? "",
                },
              ]}
            />
          )}
        />

        {/* =====================================================
         * Numbers
         * ===================================================*/}

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth label="Frequency" {...field} />
            )}
          />

          <Controller
            name="window"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth label="Window" {...field} />
            )}
          />
        </Box>

        {/* =====================================================
         * Order + Checkboxes
         * ===================================================*/}

        <Box
          display="grid"
          gridTemplateColumns="1fr auto"
          gap={2}
          alignItems="center"
        >
          <Controller
            name="orderNo"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth label="Order No" {...field} />
            )}
          />

          <Box display="flex" gap={3}>
            <Controller
              name="showInAlert"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ m: 0 }}
                  label="Show In Alert"
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                />
              )}
            />

            <Controller
              name="updateByFunction"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ m: 0 }}
                  label="Update By Function"
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(JobCounterUpsert);
