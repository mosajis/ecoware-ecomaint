import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useEffect, useState, useCallback } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";

import {
  tblCompTypeJob,
  tblJobDescription,
  tblDiscipline,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  TypeTblCompTypeJob,
} from "@/core/api/generated/api";

// ========= Schema =========
const schema = z.object({
  jobDescId: z
    .object({
      jobDescId: z.number(),
      jobDescTitle: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  discId: z
    .object({
      discId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintClass: z
    .object({
      maintClassId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintCause: z
    .object({
      maintCauseId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  maintType: z
    .object({
      maintTypeId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  frequency: z.number().nullable().optional(),
  priority: z.number().nullable().optional(),
  window: z.number().nullable().optional(),

  statusNone: z.boolean().nullable().optional(),
  statusAvailable: z.boolean().nullable().optional(),
  statusInUse: z.boolean().nullable().optional(),
  statusRepair: z.boolean().nullable().optional(),

  planningMethod: z.string().nullable().optional(),
});

export type JobFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeJob) => void;
};

function TabJobFormDialog({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: JobFormValues = {
    jobDescId: null,
    discId: null,

    maintClass: null,
    maintCause: null,
    maintType: null,

    frequency: null,
    priority: null,
    window: null,

    statusNone: false,
    statusAvailable: false,
    statusInUse: false,
    statusRepair: false,

    planningMethod: "Variable",
  };

  const { control, handleSubmit, reset } = useForm<JobFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // ===== Load data in edit mode =====
  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);

    try {
      const res = await tblCompTypeJob.getById(recordId, {
        include: {
          tblJobDescription: true,
          tblDiscipline: true,
          tblMaintClass: true,
          tblMaintCause: true,
          tblMaintType: true,
        },
      });

      reset({
        jobDescId: res?.tblJobDescription ?? null,
        discId: res?.tblDiscipline ?? null,

        maintClass: res?.tblMaintClass ?? null,
        maintCause: res?.tblMaintCause ?? null,
        maintType: res?.tblMaintType ?? null,

        frequency: res?.frequency ?? null,
        priority: res?.priority ?? null,
        window: res?.window ?? null,

        statusNone: !!res?.statusNone,
        statusAvailable: !!res?.statusAvailable,
        statusInUse: !!res?.statusInUse,
        statusRepair: !!res?.statusRepair,

        planningMethod: res?.planningMethod === 1 ? "Fixed" : "Variable",
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // ========= Submit Handler =========
  const handleFormSubmit = useCallback(
    async (values: JobFormValues) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const v = parsed.data;

      try {
        setSubmitting(true);

        const body = {
          jobDescId: v.jobDescId?.jobDescId ?? null,
          discId: v.discId?.discId ?? null,

          maintClassId: v.maintClass?.maintClassId ?? null,
          maintCauseId: v.maintCause?.maintCauseId ?? null,
          maintTypeId: v.maintType?.maintTypeId ?? null,

          frequency: v.frequency ?? null,
          priority: v.priority ?? null,
          window: v.window ?? null,

          statusNone: v.statusNone ? 1 : 0,
          statusAvailable: v.statusAvailable ? 1 : 0,
          statusInUse: v.statusInUse ? 1 : 0,
          statusRepair: v.statusRepair ? 1 : 0,

          planningMethod: v.planningMethod === "Fixed" ? 1 : 0,
        };

        let result: TypeTblCompTypeJob;

        if (mode === "create") {
          result = await tblCompTypeJob.create(body);
        } else {
          result = await tblCompTypeJob.update(recordId!, body);
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
      maxWidth="lg"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Job" : "Edit Job"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        {/* Job Description */}
        <Controller
          name="jobDescId"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Job Description"
              value={field.value}
              selectionMode="single"
              request={() => tblJobDescription.getAll().then((r) => r.items)}
              columns={[
                { field: "jobDescTitle", headerName: "Title", flex: 1 },
              ]}
              getRowId={(row) => row.jobDescId}
              onChange={field.onChange}
            />
          )}
        />

        {/* Discipline */}
        <Controller
          name="discId"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Discipline"
              value={field.value}
              selectionMode="single"
              request={() => tblDiscipline.getAll().then((r) => r.items)}
              columns={[{ field: "descr", headerName: "Discipline", flex: 1 }]}
              getRowId={(row) => row.discId}
              onChange={field.onChange}
            />
          )}
        />

        {/* Maint Class */}
        <Controller
          name="maintClass"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Maint Class"
              value={field.value}
              selectionMode="single"
              request={() => tblMaintClass.getAll().then((r) => r.items)}
              columns={[{ field: "descr", headerName: "Maint Class", flex: 1 }]}
              getRowId={(row) => row.maintClassId}
              onChange={field.onChange}
            />
          )}
        />

        {/* Maint Cause */}
        <Controller
          name="maintCause"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Maint Cause"
              value={field.value}
              selectionMode="single"
              request={() => tblMaintCause.getAll().then((r) => r.items)}
              columns={[{ field: "descr", headerName: "Maint Cause", flex: 1 }]}
              getRowId={(row) => row.maintCauseId}
              onChange={field.onChange}
            />
          )}
        />

        {/* Maint Type */}
        <Controller
          name="maintType"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Maint Type"
              value={field.value}
              selectionMode="single"
              request={() => tblMaintType.getAll().then((r) => r.items)}
              columns={[{ field: "descr", headerName: "Maint Type", flex: 1 }]}
              getRowId={(row) => row.maintTypeId}
              onChange={field.onChange}
            />
          )}
        />

        {/* Frequency */}
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Frequency"
              size="small"
              disabled={isDisabled}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />

        {/* Priority */}
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Priority"
              size="small"
              disabled={isDisabled}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />

        {/* Window */}
        <Controller
          name="window"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Window"
              size="small"
              disabled={isDisabled}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
      </Box>

      {/* Status Checkboxes */}
      <Box mt={2}>
        <Controller
          name="statusNone"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              label="None"
            />
          )}
        />
        <Controller
          name="statusAvailable"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              label="Available"
            />
          )}
        />
        <Controller
          name="statusInUse"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              label="In Use"
            />
          )}
        />
        <Controller
          name="statusRepair"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={!!field.value} />}
              label="Repair"
            />
          )}
        />
      </Box>

      {/* Planning Method Radio */}
      <Box mt={2}>
        <Controller
          name="planningMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} row>
              <FormControlLabel
                value="Variable"
                control={<Radio />}
                label="Variable"
              />
              <FormControlLabel
                value="Fixed"
                control={<Radio />}
                label="Fixed"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(TabJobFormDialog);
