import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import NumberField from "@/shared/components/fields/FieldNumber";
import { memo, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation } from "@/core/helper";
import {
  tblCompTypeJobTrigger,
  tblJobTrigger,
  TypeTblCompTypeJobTrigger,
} from "@/core/api/generated/api";

/* === Schema === */
const schema = z.object({
  jobTrigger: z
    .object({
      jobTriggerId: z.number(),
    })
    .nullable()
    .refine(Boolean, { message: "trigger is required" }),
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
  onSuccess: (data: TypeTblCompTypeJobTrigger) => void;
};

function JobTriggerUpsert({
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

    setLoadingInitial(true);
    try {
      const res = await tblCompTypeJobTrigger.getById(recordId, {
        include: {
          tblJobTrigger: true,
        },
      });

      reset({
        jobTrigger: res.tblJobTrigger,
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
          orderNo: parsed.data.orderNo,
          ...buildRelation(
            "tblJobTrigger",
            "jobTriggerId",
            parsed.data.jobTrigger?.jobTriggerId,
          ),
          ...buildRelation("tblCompTypeJob", "compTypeJobId", compTypeJobId),
        };

        let result: TypeTblCompTypeJobTrigger;

        if (mode === "create") {
          result = await tblCompTypeJobTrigger.create(payload);
        } else {
          result = await tblCompTypeJobTrigger.update(recordId!, payload);
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compTypeJobId, onSuccess, onClose],
  );

  const isDisabled = loadingInitial || submitting;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job trigger" : "Edit Job trigger"}
      loadingInitial={loadingInitial}
      submitting={submitting}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box display="grid" gap={1.5}>
        {/* trigger */}
        <Controller
          name="jobTrigger"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Trigger *"
              value={field.value}
              onChange={field.onChange}
              disabled={isDisabled || mode === "update"}
              getOptionLabel={(row: any) => row?.descr}
              request={tblJobTrigger.getAll}
              columns={[
                {
                  field: "descr",
                  headerName: "Trigger",
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
            <NumberField
              sx={{ width: "35%" }}
              disabled={isDisabled}
              {...field}
              label="Order No"
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobTriggerUpsert);
