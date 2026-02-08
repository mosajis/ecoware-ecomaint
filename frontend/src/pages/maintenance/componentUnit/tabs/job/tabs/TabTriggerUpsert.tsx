import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation } from "@/core/helper";
import { tblCompJobTrigger, tblJobTrigger } from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  jobTrigger: z
    .object({
      jobTriggerId: z.number(),
      descr: z.string().nullable(),
    })
    .nullable()
    .refine(Boolean, { message: "Trigger is required" }),

  orderNo: z.number().nullable(),
});

type FormValues = z.input<typeof schema>;

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
    jobTrigger: null,
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
      const res = await tblCompJobTrigger.getById(recordId, {
        include: {
          tblJobTrigger: true,
        },
      });

      reset({
        jobTrigger: res.tblJobTrigger,
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
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            "tblJobTrigger",
            "jobTriggerId",
            parsed.data.jobTrigger?.jobTriggerId,
          ),
          ...buildRelation("tblCompJob", "compJobId", compJobId),
        };

        if (mode === "create") {
          await tblCompJobTrigger.create(payload);
        } else {
          await tblCompJobTrigger.update(recordId!, payload);
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
      title={mode === "create" ? "Create Job Trigger" : "Edit Job Trigger"}
      loadingInitial={loading}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display={"flex"} flexDirection={"column"} gap={1.5}>
        {/* Counter */}
        <Controller
          name="jobTrigger"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Trigger *"
              value={field.value}
              onChange={field.onChange}
              request={() =>
                tblJobTrigger.getAll({
                  filter: {
                    tblCompJobTriggers: {
                      none: {
                        compJobId,
                      },
                    },
                  },
                })
              }
              columns={[
                {
                  field: "descr",
                  headerName: "Description",
                  flex: 1,
                },
              ]}
              getRowId={(row) => row.jobTriggerId}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField sx={{ width: "35%" }} {...field} label="Order No" />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobCounterUpsert);
