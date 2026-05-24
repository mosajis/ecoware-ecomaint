import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BorderedBox } from "@/shared/components/BorderedBox";
import { buildRelation } from "@/core/helper";
import {
  tblCompTypeJob,
  tblJobDescription,
  tblDiscipline,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  TypeTblCompTypeJob,
  tblPeriod,
} from "@/core/api/generated/api";

// ========= Schema =========
const schema = z.object({
  lastDone: z.string().nullable().optional(),
  nextDueDate: z.string().nullable().optional(),
  jobDesc: z
    .object({
      jobDescId: z.number(),
      jobDescTitle: z.string().nullable().optional(),
    })
    .nullable()
    .optional()
    .refine((val) => !!val, {
      message: "Job Description is required",
    }),

  disc: z
    .object({
      discId: z.number(),
      name: z.string().nullable().optional(),
    })
    .optional()
    .nullable()
    .refine((val) => !!val, {
      message: "Discipline is required",
    }),

  maintClass: z
    .object({
      maintClassId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional()
    .refine((val) => !!val, {
      message: "required",
    }),

  maintCause: z
    .object({
      maintCauseId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional()
    .refine((val) => !!val, {
      message: "required",
    }),

  maintType: z
    .object({
      maintTypeId: z.number(),
      descr: z.string().nullable().optional(),
    })
    .nullable()
    .optional()
    .refine((val) => val !== null, {
      message: "required",
    }),

  frequency: z.number().nullable().optional(),

  frequencyPeriod: z
    .object({
      periodId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  priority: z.number().nullable().optional(),
  window: z.number().nullable().optional(),

  statusNone: z.boolean().optional(),
  statusAvailable: z.boolean().optional(),
  statusInUse: z.boolean().optional(),
  statusRepair: z.boolean().optional(),

  planningMethod: z.enum(["Variable", "Fixed"]).optional(),

  active: z.boolean().optional(),
  mandatoryHistory: z.boolean().optional(),
});

type JobFormValues = z.input<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeJob) => void;
  compType?: {
    compTypeId: number;
    compName: string;
  };
};

const DEFAULT_VALUES: JobFormValues = {
  lastDone: null,
  nextDueDate: null,
  jobDesc: undefined,
  disc: undefined,
  maintClass: undefined,
  maintCause: undefined,
  maintType: undefined,
  frequency: null,
  frequencyPeriod: undefined,
  priority: null,
  window: null,
  statusNone: true,
  statusAvailable: true,
  statusInUse: true,
  statusRepair: true,
  planningMethod: "Variable",
  active: true,
  mandatoryHistory: false,
};

function ComponentTypeJobUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compType,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo(
    () => ({ ...DEFAULT_VALUES, compType: compType ?? null }),
    [compType],
  );

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
          tblPeriod: true,
        },
      });

      reset({
        jobDesc: res?.tblJobDescription,
        disc: res?.tblDiscipline,
        maintClass: res?.tblMaintClass,
        maintCause: res?.tblMaintCause,
        maintType: res?.tblMaintType,
        frequency: res?.frequency,
        frequencyPeriod: res.tblPeriod,
        priority: res?.priority,
        window: res?.window,
        statusNone: !!res?.statusNone,
        statusAvailable: !!res?.statusAvailable,
        statusInUse: !!res?.statusInUse,
        statusRepair: !!res?.statusRepair,
        planningMethod: res?.planningMethod === 1 ? "Fixed" : "Variable",
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset, defaultValues]);

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
          frequency: v.frequency,
          priority: v.priority,
          window: v.window,
          planningMethod: v.planningMethod === "Fixed" ? 1 : 0,
          statusNone: v.statusNone ? 1 : 0,
          statusAvailable: v.statusAvailable ? 1 : 0,
          statusInUse: v.statusInUse ? 1 : 0,
          statusRepair: v.statusRepair ? 1 : 0,
          active: v.active ? 1 : 0,
          mandatoryHistory: v.mandatoryHistory ? 1 : 0,
          ...buildRelation("tblCompType", "compTypeId", compType),
          ...buildRelation("tblPeriod", "periodId", v.frequencyPeriod),
          ...buildRelation("tblJobDescription", "jobDescId", v.jobDesc),
          ...buildRelation("tblDiscipline", "discId", v.disc),
          ...buildRelation("tblMaintClass", "maintClassId", v.maintClass),
          ...buildRelation("tblMaintCause", "maintCauseId", v.maintCause),
          ...buildRelation("tblMaintType", "maintTypeId", v.maintType),
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
    [mode, recordId, compType?.compTypeId, onSuccess, onClose],
  );

  return (
    <FormDialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "CompType Job" : "Edit CompType Job"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Component Type */}
        <TextField
          label="Component Type"
          value={compType?.compName ?? ""}
          size="small"
          fullWidth
          slotProps={{ input: { readOnly: isDisabled } }}
        />

        {/* Job Description */}
        <Controller
          name="jobDesc"
          control={control}
          render={({ field, fieldState }) => (
            <Box width="60%">
              <FieldAsyncSelectGrid
                disableRowNumber
                dialogMaxWidth="sm"
                label="Job Description *"
                getOptionLabel={(row) => row.jobDescTitle}
                value={field.value}
                selectionMode="single"
                request={tblJobDescription.getAll}
                columns={[
                  { field: "jobDescCode", headerName: "Code", width: 100 },
                  { field: "jobDescTitle", headerName: "Title", flex: 1 },
                ]}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                getRowId={(row) => row.jobDescId}
                onChange={field.onChange}
                disabled={isDisabled || mode === "update"}
              />
            </Box>
          )}
        />

        {/* Discipline */}
        <Controller
          name="disc"
          control={control}
          render={({ field, fieldState }) => (
            <Box width="45%">
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Discipline *"
                value={field.value}
                selectionMode="single"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                request={tblDiscipline.getAll}
                columns={[{ field: "name", headerName: "Discipline", flex: 1 }]}
                getRowId={(row) => row.discId}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            </Box>
          )}
        />

        {/* Frequency & Period */}
        <Box display="flex" gap={1.5} width="66%">
          <Controller
            name="frequency"
            control={control}
            render={({ field, fieldState }) => (
              <FieldNumber
                {...field}
                fullWidth
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                label="Frequency"
                size="small"
                disabled={isDisabled}
              />
            )}
          />
          <Controller
            name="frequencyPeriod"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Frequency Period"
                value={field.value}
                selectionMode="single"
                request={tblPeriod.getAll}
                columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                getOptionLabel={(row) => row.name}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                getRowId={(row) => row.periodId}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        {/* Maintenance Fields */}
        <Box display="flex" gap={1.5}>
          <Controller
            name="maintClass"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Maint Class *"
                value={field.value}
                selectionMode="single"
                request={tblMaintClass.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Class", flex: 1 },
                ]}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                getRowId={(row) => row.maintClassId}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />
          <Controller
            name="maintCause"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Maint Cause *"
                value={field.value}
                selectionMode="single"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                request={tblMaintCause.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Cause", flex: 1 },
                ]}
                getRowId={(row) => row.maintCauseId}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />
          <Controller
            name="maintType"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                dialogMaxWidth="sm"
                label="Maint Type *"
                value={field.value}
                selectionMode="single"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                request={tblMaintType.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Type", flex: 1 },
                ]}
                getRowId={(row) => row.maintTypeId}
                onChange={field.onChange}
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        {/* Priority & Window */}
        <Box display="flex" width="66%" gap={1.5}>
          <Controller
            name="priority"
            control={control}
            render={({ field, fieldState }) => (
              <FieldNumber
                {...field}
                label="Priority"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
                disabled={isDisabled}
              />
            )}
          />
          <Controller
            name="window"
            control={control}
            render={({ field, fieldState }) => (
              <FieldNumber
                {...field}
                label="Window"
                fullWidth
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
                size="small"
                disabled={isDisabled}
              />
            )}
          />
        </Box>
      </Box>

      {/* Status Checkboxes */}
      <BorderedBox label="Component Status" mt={2} width="80%">
        <Box display="flex" gap={2}>
          <Controller
            name="statusNone"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    disabled={isDisabled}
                    checked={!!field.value}
                  />
                }
                label="None"
              />
            )}
          />
          <Controller
            name="statusAvailable"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    disabled={isDisabled}
                    checked={!!field.value}
                  />
                }
                label="Available"
              />
            )}
          />
          <Controller
            name="statusInUse"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    disabled={isDisabled}
                    checked={!!field.value}
                  />
                }
                label="In Use"
              />
            )}
          />
          <Controller
            name="statusRepair"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    disabled={isDisabled}
                    checked={!!field.value}
                  />
                }
                label="Repair"
              />
            )}
          />
        </Box>
      </BorderedBox>

      {/* Bottom Section */}
      <Box display="flex" gap={1.5} width="100%">
        {/* Planning Method */}
        <BorderedBox label="Planning Method" mt={2}>
          <Controller
            name="planningMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="Variable"
                  control={<Radio disabled={isDisabled} />}
                  label="Variable"
                />
                <FormControlLabel
                  value="Fixed"
                  control={<Radio disabled={isDisabled} />}
                  label="Fixed"
                />
              </RadioGroup>
            )}
          />
        </BorderedBox>

        {/* Advanced Options */}
        <BorderedBox label="Advanced Option" mt={2} direction="row">
          <Box display={"flex"} gap={1.5}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={isDisabled}
                      {...field}
                      checked={!!field.value}
                    />
                  }
                  label="Active"
                />
              )}
            />
            <Controller
              name="mandatoryHistory"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={isDisabled}
                      {...field}
                      checked={!!field.value}
                    />
                  }
                  label="Mandatory History"
                />
              )}
            />
          </Box>
        </BorderedBox>
      </Box>
    </FormDialog>
  );
}

export default memo(ComponentTypeJobUpsert);
