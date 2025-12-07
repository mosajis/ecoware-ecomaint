import FormDialog from "@/shared/components/formDialog/FormDialog";
import * as z from "zod";
import { memo, useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/api/helper";
import {
  tblJobDescription,
  tblJobClass,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

// === Validation Schema ===
const schema = z.object({
  jobDescCode: z.string().optional().nullable(),
  jobDesc: z.string().min(1, "Job Description is required"),
  jobClassId: z
    .object({
      jobClassId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  changeReason: z.string().optional().nullable(),
});

export type JobDescriptionFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblJobDescription) => void;
};

function JobDescriptionFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: JobDescriptionFormValues = {
    jobDescCode: "",
    jobDesc: "",
    jobClassId: null,
    changeReason: "",
  };

  const { control, handleSubmit, reset } = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Load record in edit mode ===
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const res = await tblJobDescription.getById(recordId, {
        include: { tblJobClass: true },
      });

      reset({
        jobDescCode: res?.jobDescCode ?? "",
        jobDesc: res?.jobDesc ?? "",
        jobClassId: res?.tblJobClass
          ? {
              jobClassId: res.tblJobClass.jobClassId,
              name: res.tblJobClass.name,
            }
          : null,
        changeReason: res?.changeReason ?? "",
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: JobDescriptionFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      try {
        setSubmitting(true);

        const jobClassRelation = buildRelation(
          "tblJobClass",
          "jobClassId",
          parsed.data.jobClassId?.jobClassId ?? null
        );

        let result: TypeTblJobDescription;

        if (mode === "create") {
          result = await tblJobDescription.create({
            jobDescCode: parsed.data.jobDescCode ?? "",
            jobDesc: parsed.data.jobDesc,
            changeReason: parsed.data.changeReason ?? "",
            ...jobClassRelation,
          });
        } else {
          result = await tblJobDescription.update(recordId!, {
            jobDescCode: parsed.data.jobDescCode ?? "",
            jobDesc: parsed.data.jobDesc,
            changeReason: parsed.data.changeReason ?? "",
            ...jobClassRelation,
          });
        }

        onSuccess(result);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose]
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={
        mode === "create" ? "Create Job Description" : "Edit Job Description"
      }
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        {/* Code */}
        <Controller
          name="jobDescCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        {/* Job Description */}
        <Controller
          name="jobDesc"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Job Description *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        {/* Job Class */}
        <Controller
          name="jobClassId"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Job Class"
              selectionMode="single"
              value={field.value}
              request={tblJobClass.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.jobClassId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              dialogMaxWidth="sm"
            />
          )}
        />

        {/* Change Reason */}
        <Controller
          name="changeReason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Change Reason"
              size="small"
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobDescriptionFormDialog);
