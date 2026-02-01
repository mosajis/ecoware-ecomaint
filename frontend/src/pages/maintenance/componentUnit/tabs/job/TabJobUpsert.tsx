import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BorderedBox } from "@/shared/components/BorderedBox";
import { buildRelation } from "@/core/helper";
import {
  tblCompJob,
  tblJobDescription,
  tblDiscipline,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  tblPeriod,
  TypeTblCompJob,
  TypeTblDiscipline,
} from "@/core/api/generated/api";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";

/* ================= Schema ================= */

const schema = z.object({
  lastDone: z.string().nullable().optional(),
  nextDueDate: z.string().nullable().optional(),
  jobDesc: z
    .object({
      jobDescId: z.number(),
      jobDescTitle: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Job Description is required",
    }),

  disc: z
    .object({
      discId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Discipline is required",
    }),

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

  frequencyPeriod: z
    .object({
      periodId: z.number(),
      name: z.string(),
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

export type JobFormValues = z.input<typeof schema>;

/* ================= Props ================= */

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compId: number;
  onClose: () => void;
  onSuccess: (data: TypeTblCompJob) => void;
};

/* ================= Defaults ================= */

const DEFAULT_VALUES: JobFormValues = {
  lastDone: null,
  nextDueDate: null,
  jobDesc: null,
  disc: null,
  maintClass: null,
  maintCause: null,
  maintType: null,
  frequency: null,
  frequencyPeriod: null,
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

/* ================= Component ================= */

function ComponentJobUpsert({
  open,
  mode,
  recordId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo(() => DEFAULT_VALUES, []);

  const { control, handleSubmit, reset } = useForm<JobFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* ===== Load data in update mode ===== */

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(defaultValues);
      return;
    }

    setLoadingInitial(true);
    try {
      const row = await tblCompJob.getById(recordId, {
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
        lastDone: row.lastDone ?? null,
        nextDueDate: row.nextDueDate ?? null,
        jobDesc: row.tblJobDescription ?? null,
        disc: row.tblDiscipline ?? null,
        maintClass: row.tblMaintClass ?? null,
        maintCause: row.tblMaintCause ?? null,
        maintType: row.tblMaintType ?? null,
        frequency: row.frequency ?? null,
        frequencyPeriod: row.tblPeriod ?? null,
        priority: row.priority ?? null,
        window: row.window ?? null,
        statusNone: !!row.statusNone,
        statusAvailable: !!row.statusAvailable,
        statusInUse: !!row.statusInUse,
        statusRepair: !!row.statusRepair,
        planningMethod: row.planningMethod ? "Fixed" : "Variable",
        active: !!row.active,
        mandatoryHistory: !!row.mandatoryHistory,
      });
    } finally {
      setLoadingInitial(false);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  /* ================= Submit ================= */

  const handleFormSubmit = useCallback(
    async (values: JobFormValues) => {
      const body = {
        lastDone: values.lastDone,
        nextDueDate: values.nextDueDate,

        frequency: values.frequency ?? null,
        priority: values.priority ?? null,
        window: values.window ?? null,

        planningMethod: values.planningMethod === "Fixed" ? 1 : 0,

        statusNone: values.statusNone ? 1 : 0,
        statusAvailable: values.statusAvailable ? 1 : 0,
        statusInUse: values.statusInUse ? 1 : 0,
        statusRepair: values.statusRepair ? 1 : 0,

        active: values.active ? 1 : 0,
        mandatoryHistory: values.mandatoryHistory ? 1 : 0,

        ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation(
          "tblJobDescription",
          "jobDescId",
          values.jobDesc?.jobDescId,
        ),
        ...buildRelation("tblDiscipline", "discId", values.disc?.discId),
        ...buildRelation(
          "tblMaintClass",
          "maintClassId",
          values.maintClass?.maintClassId,
        ),
        ...buildRelation(
          "tblMaintCause",
          "maintCauseId",
          values.maintCause?.maintCauseId,
        ),
        ...buildRelation(
          "tblMaintType",
          "maintTypeId",
          values.maintType?.maintTypeId,
        ),
        ...buildRelation(
          "tblPeriod",
          "periodId",
          values.frequencyPeriod?.periodId,
        ),
      };

      setSubmitting(true);
      try {
        const res =
          mode === "create"
            ? await tblCompJob.create(body)
            : await tblCompJob.update(recordId!, body);

        onSuccess(res);
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, compId, onSuccess, onClose],
  );

  /* ================= UI ================= */

  return (
    <FormDialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Component Job" : "Edit Component Job"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Job Description */}
        <Controller
          name="jobDesc"
          control={control}
          render={({ field, fieldState }) => (
            <Box width="60%">
              <FieldAsyncSelectGrid
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Job Description *"
                value={field.value}
                selectionMode="single"
                request={tblJobDescription.getAll}
                columns={[
                  { field: "jobDescTitle", headerName: "Title", flex: 1 },
                ]}
                getOptionLabel={(row) => row.jobDescTitle}
                getRowId={(row) => row.jobDescId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            </Box>
          )}
        />

        <Controller
          name="disc"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelect<TypeTblDiscipline>
              label="Discipline *"
              disabled={isDisabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              request={tblDiscipline.getAll}
              getOptionLabel={(row) => row.name || ""}
              value={field.value}
              onChange={field.onChange}
            />
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
                label="Frequency"
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="frequencyPeriod"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Frequency Period"
                value={field.value}
                selectionMode="single"
                request={tblPeriod.getAll}
                columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                getOptionLabel={(row) => row.name}
                getRowId={(row) => row.periodId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
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
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Maint Class"
                value={field.value}
                selectionMode="single"
                request={tblMaintClass.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Class", flex: 1 },
                ]}
                getRowId={(row) => row.maintClassId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="maintCause"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Maint Cause"
                value={field.value}
                selectionMode="single"
                request={tblMaintCause.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Cause", flex: 1 },
                ]}
                getRowId={(row) => row.maintCauseId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="maintType"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Maint Type"
                value={field.value}
                selectionMode="single"
                request={tblMaintType.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Type", flex: 1 },
                ]}
                getRowId={(row) => row.maintTypeId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
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
                fullWidth
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
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
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        <Box display={"flex"} gap={2}>
          <Controller
            name="lastDone"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                disabled={isDisabled}
                label="Last Done"
                field={field}
                type="DATETIME"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="nextDueDate"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                disabled={isDisabled}
                label="Next Due Date"
                field={field}
                type="DATETIME"
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* Status */}
      <BorderedBox label="Component Status" mt={2} width="80%">
        <Box display="flex" gap={2}>
          {(
            [
              "statusNone",
              "statusAvailable",
              "statusInUse",
              "statusRepair",
            ] as const
          ).map((name) => (
            <Controller
              key={name}
              name={name}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  disabled={isDisabled}
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      disabled={isDisabled}
                    />
                  }
                  label={name.replace("status", "")}
                />
              )}
            />
          ))}
        </Box>
      </BorderedBox>

      {/* Bottom */}
      <Box display="flex" gap={1.5}>
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

        <BorderedBox label="Advanced Option" mt={2}>
          <Box gap={1.5} display={"flex"} alignItems={"center"}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  disabled={isDisabled}
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      disabled={isDisabled}
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
                  disabled={isDisabled}
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      disabled={isDisabled}
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

export default memo(ComponentJobUpsert);
