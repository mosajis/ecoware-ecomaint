import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import NumberField from "@/shared/components/fields/FieldNumber";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { buildRelation } from "@/core/helper";
import {
  tblCompTypeJobCounter,
  tblCompTypeCounter,
  TypeTblCompTypeJobCounter,
  TypeTblCompTypeJob,
} from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  compTypeCounter: z
    .object({
      compTypeCounterId: z.number(),
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
  recordId?: number;
  compTypeJobId: number;
  compTypeId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeJobCounter) => void;
};

function JobCounterUpsert({
  open,
  mode,
  recordId,
  compTypeJobId,
  compTypeId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: FormValues = {
    compTypeCounter: null as any,
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

    setLoadingInitial(true);
    try {
      const res = await tblCompTypeJobCounter.getById(recordId, {
        include: {
          tblCompTypeCounter: {
            include: {
              tblCounterType: true,
            },
          },
        },
      });

      reset({
        compTypeCounter: res.tblCompTypeCounter,
        frequency: res.frequency ?? null,
        window: res.window ?? null,
        showInAlert: res.showInAlert ?? false,
        updateByFunction: res.updateByFunction ?? false,
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
          frequency: parsed.data.frequency,
          window: parsed.data.window,
          showInAlert: parsed.data.showInAlert,
          updateByFunction: parsed.data.updateByFunction,
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            "tblCompTypeCounter",
            "compTypeCounterId",
            parsed.data?.compTypeCounter?.compTypeCounterId,
          ),
          ...buildRelation("tblCompTypeJob", "compTypeJobId", compTypeJobId),
        };

        let result: TypeTblCompTypeJobCounter;

        if (mode === "create") {
          result = await tblCompTypeJobCounter.create(payload);
          // const jobDescId = compTypeJob?.jobDescId
          // const compTypeId = compTypeJob?.compTypeId

          // const units = await tblComponentUnit.getAll({
          //   filter: {
          //     compTypeId: compTypeId
          //   }
          // })

          // const compIds = units.items.map(u => u.compId)

          // tblCompJob.getAll({
          //   filter: {
          //     jobDescId: jobDescId,
          //   },
          // })
        } else {
          result = await tblCompTypeJobCounter.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compTypeJobId, onSuccess, onClose],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job Counter" : "Edit Job Counter"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* Counter */}
        <Controller
          name="compTypeCounter"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Counter *"
              value={field.value}
              onChange={field.onChange}
              getOptionLabel={(row: any) => row?.tblCounterType?.name}
              request={() =>
                tblCompTypeCounter.getAll({
                  include: {
                    tblCounterType: true,
                  },
                  filter: {
                    compTypeId: compTypeId,
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
              getRowId={(row) => row.compTypeCounterId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Box display={"flex"} gap={1.5}>
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
        <Box display={"grid"} gridTemplateColumns={"2fr 3fr"} gap={1.5}>
          <Controller
            name="orderNo"
            control={control}
            render={({ field }) => <NumberField {...field} label="Order No" />}
          />
          <Box display={"flex"} gap={1.5}>
            <Controller
              name="showInAlert"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ m: 0 }}
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
                  sx={{ m: 0 }}
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
