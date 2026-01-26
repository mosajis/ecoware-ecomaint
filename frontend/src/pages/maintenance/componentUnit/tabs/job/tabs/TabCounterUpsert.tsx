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
  TypeTblCompJobCounter,
  tblCompCounter,
  tblCompJobCounter,
} from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  compCounter: z
    .object({
      compCounterId: z.number(),
    })
    .nullable()
    .refine(Boolean, { message: "Counter is required" }),

  frequency: z.number().nullable(),
  window: z.number().nullable(),
  showInAlert: z.boolean(),
  updateByFunction: z.boolean(),
  orderNo: z.number().nullable(),
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

  const defaultValues: FormValues = {
    compCounter: null as any,
    frequency: null,
    window: null,
    showInAlert: true,
    updateByFunction: false,
    orderNo: null,
  };

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load edit ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoading(true);
    try {
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
        compCounter: res.tblCompCounter,
        frequency: res.frequency ?? null,
        window: res.window ?? null,
        showInAlert: res.showInAlert ?? false,
        updateByFunction: res.updateByFunction ?? false,
        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoading(false);
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
          frequency: parsed.data.frequency,
          window: parsed.data.window,
          showInAlert: parsed.data.showInAlert,
          updateByFunction: parsed.data.updateByFunction,
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            "tblCompCounter",
            "compCounterId",
            parsed.data.compCounter?.compCounterId,
          ),
          ...buildRelation("tblCompJob", "compJobId", compJobId),
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

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job Counter" : "Edit Job Counter"}
      loadingInitial={loading}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Counter */}
        <Controller
          name="compCounter"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Counter *"
              value={field.value}
              onChange={field.onChange}
              getOptionLabel={(row: any) => row?.tblCounterType?.name}
              request={() =>
                tblCompCounter.getAll({
                  include: {
                    tblCounterType: true,
                  },
                  filter: {
                    compId: compId,
                  },
                })
              }
              columns={[
                {
                  field: "tblCounterType.name",
                  headerName: "Counter Type",
                  flex: 1,
                  valueGetter: (_: any, row: any) => row?.tblCounterType?.name,
                },
              ]}
              getRowId={(row) => row.compCounterId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={1.5}>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth {...field} label="Frequency" />
            )}
          />
          <Controller
            name="window"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth {...field} label="Window" />
            )}
          />
        </Box>
        <Box display={"grid"} gridTemplateColumns={"2fr 3fr"} gap={2}>
          <Controller
            name="orderNo"
            control={control}
            render={({ field }) => (
              <NumberField fullWidth {...field} label="Order No" />
            )}
          />
          <Box display={"flex"} flexDirection={"row"} gap={3}>
            <Controller
              name="showInAlert"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ margin: 0 }}
                  control={<Checkbox checked={field.value} {...field} />}
                  label="Show In Alert"
                />
              )}
            />
            <Controller
              name="updateByFunction"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ margin: 0 }}
                  control={<Checkbox checked={field.value} {...field} />}
                  label="Update By Function"
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
