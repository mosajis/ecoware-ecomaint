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
  tblPeriod,
  TypeTblPeriod,
} from "@/core/api/generated/api";
import { buildRelation } from "@/core/api/helper";
import { logicTblCompTypeJob } from "./ComponentTypeJob.logic";

const boxStyle = {
  width: "100%",
  border: "1px solid #63656a",
  justifyContent: "space-between",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "0",
  paddingLeft: "10px",
  borderRadius: "8px",
};

// ========= Schema =========
const schema = z.object({
  compType: z
    .object({
      compTypeId: z.number(),
      compName: z.string(),
    })
    .nullable()
    .optional(),

  jobDesc: z
    .object({
      jobDescId: z.number(),
      jobDescTitle: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  disc: z
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
  frequencyPeriod: z
    .object({
      periodId: z.number(),
      name: z.string(),
    })
    .nullable()
    .optional(),

  priority: z.number().nullable().optional(),
  window: z.number().nullable().optional(),

  statusNone: z.boolean().nullable().optional(),
  statusAvailable: z.boolean().nullable().optional(),
  statusInUse: z.boolean().nullable().optional(),
  statusRepair: z.boolean().nullable().optional(),

  planningMethod: z.string().nullable().optional(),

  active: z.boolean().nullable().optional(),
  mandatoryHistory: z.boolean().nullable().optional(),
});

export type JobFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblCompTypeJob) => void;
  compType?: {
    compTypeId: number;
    compName: string;
  } | null;
};

function ComponentTypeJobFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compType,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: JobFormValues = {
    compType: compType ?? null,

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
        jobDesc: res?.tblJobDescription ?? null,
        disc: res?.tblDiscipline ?? null,

        maintClass: res?.tblMaintClass ?? null,
        maintCause: res?.tblMaintCause ?? null,
        maintType: res?.tblMaintType ?? null,

        frequency: res?.frequency ?? null,
        frequencyPeriod: res?.tblPeriod ?? null,
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
          // ======= فیلدهای اصلی =======
          frequency: v.frequency ?? null,
          priority: v.priority ?? null,
          window: v.window ?? null,
          planningMethod: v.planningMethod === "Fixed" ? 1 : 0,

          statusNone: v.statusNone ? 1 : 0,
          statusAvailable: v.statusAvailable ? 1 : 0,
          statusInUse: v.statusInUse ? 1 : 0,
          statusRepair: v.statusRepair ? 1 : 0,
          // ======= روابط =======
          ...buildRelation(
            "tblCompType",
            "compTypeId",
            compType?.compTypeId ?? null
          ),
          ...buildRelation(
            "tblPeriod",
            "periodId",
            v.frequencyPeriod?.periodId ?? null
          ),
          ...buildRelation(
            "tblJobDescription",
            "jobDescId",
            v.jobDesc?.jobDescId ?? null
          ),
          ...buildRelation("tblDiscipline", "discId", v.disc?.discId ?? null),
          ...buildRelation(
            "tblMaintClass",
            "maintClassId",
            v.maintClass?.maintClassId ?? null
          ),
          ...buildRelation(
            "tblMaintCause",
            "maintCauseId",
            v.maintCause?.maintCauseId ?? null
          ),
          ...buildRelation(
            "tblMaintType",
            "maintTypeId",
            v.maintType?.maintTypeId ?? null
          ),

          active: v.active ? 1 : 0,
          mandatoryHistory: v.mandatoryHistory ? 1 : 0,
        };

        let result: TypeTblCompTypeJob;

        if (mode === "create") {
          result = await tblCompTypeJob.create(body);

          // business Logic
          logicTblCompTypeJob.effect(result.compTypeJobId, 0);
        } else {
          result = await tblCompTypeJob.update(recordId!, body);
          logicTblCompTypeJob.effect(result.compTypeJobId, 1);
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
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Comp Type Job" : "Edit Comp Type Job "}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection={"column"} gap={1.5}>
        <TextField
          label="Component Type"
          value={compType?.compName ?? ""}
          size="small"
          fullWidth
          disabled
        />
        {/* Job Description */}
        <Controller
          name="jobDesc"
          control={control}
          render={({ field }) => (
            <Box width={"60%"}>
              <AsyncSelectField
                dialogMaxWidth="sm"
                label="Job Description"
                getOptionLabel={(row) => row.jobDescTitle}
                value={field.value}
                selectionMode="single"
                request={tblJobDescription.getAll}
                columns={[
                  { field: "jobDescTitle", headerName: "Title", flex: 1 },
                ]}
                getRowId={(row) => row.jobDescId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />
        {/* Discipline */}
        <Controller
          name="disc"
          control={control}
          render={({ field }) => (
            <Box width={"45%"}>
              <AsyncSelectField
                dialogMaxWidth="sm"
                label="Discipline"
                value={field.value}
                selectionMode="single"
                request={tblDiscipline.getAll}
                columns={[{ field: "name", headerName: "Discipline", flex: 1 }]}
                getRowId={(row) => row.discId}
                onChange={field.onChange}
              />
            </Box>
          )}
        />
        <Box display={"flex"} gap={1.5} width={"66%"}>
          {/* Frequency */}
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
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
          {/* Frequency */}
          <Controller
            name="frequencyPeriod"
            control={control}
            render={({ field, fieldState }) => (
              <AsyncSelectField
                dialogMaxWidth="sm"
                label="Frequency Period"
                value={field.value}
                selectionMode="single"
                request={tblPeriod.getAll}
                columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                getOptionLabel={(row) => row.name}
                error={!!fieldState.error}
                getRowId={(row) => row.periodId}
                onChange={field.onChange}
              />
            )}
          />
        </Box>
        <Box display={"flex"} gap={1.5}>
          {/* Maint Class */}
          <Controller
            name="maintClass"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
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
              />
            )}
          />

          {/* Maint Cause */}
          <Controller
            name="maintCause"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
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
              />
            )}
          />

          {/* Maint Type */}
          <Controller
            name="maintType"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
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
              />
            )}
          />
        </Box>
        {/* Priority */}
        <Box display={"flex"} width={"66%"} gap={1.5}>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Priority"
                fullWidth
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
                fullWidth
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
      </Box>

      {/* Status Checkboxes */}
      <Box mt={2} width={"80%"} sx={{ ...boxStyle }}>
        <Box>Component Status</Box>
        <Box display={"flex"}>
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
      </Box>

      <Box display={"flex"} gap={1.5} width={"100%"}>
        {/* Planning Method Radio */}
        <Box mt={2} sx={{ ...boxStyle }}>
          <Box>Planning Method</Box>
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
        <Box mt={2} sx={{ ...boxStyle }}>
          <Box>Advanced Option</Box>
          <Box>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
                  label="Active"
                />
              )}
            />
            <Controller
              name="mandatoryHistory"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} />}
                  label="Mandatory History"
                />
              )}
            />
          </Box>
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(ComponentTypeJobFormDialog);
