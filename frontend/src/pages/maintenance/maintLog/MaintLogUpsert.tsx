import * as z from "zod";
import Box from "@mui/material/Box";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Editor from "@/shared/components/Editor";
import { Controller } from "react-hook-form";
import { memo, useEffect, useState } from "react";
import { getMaintLogContext } from "@/core/api/api";
import { MaintLogContex } from "@/core/api/api.types";
import { toast } from "sonner";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { schema, TypeValues } from "./MaintLogUpsertSchema";
import {
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
  tblMaintType,
} from "@/core/api/generated/api";

type MaintLogUpsertProps = {
  open: boolean;
  mode: "create" | "update" | "view";
  recordId?: number | null;
  workOrderId?: number;
  compId?: number;
  onClose: () => void;
  onSuccess?: (result: any) => void;
};

const defaultValues: TypeValues = {
  dateDone: new Date(),
  totalDuration: 0,
  waitingMin: 0,
  maintType: null,
  maintCause: null,
  maintClass: null,
  history: "",
  unexpected: 0,
  reportedCount: 0,
};

function MaintLogUpsert({
  open,
  mode,
  recordId,
  workOrderId,
  compId: initialCompId,
  onClose,
  onSuccess,
}: MaintLogUpsertProps) {
  const [context, setContext] = useState<MaintLogContex | null>(null);

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<TypeValues, any>({
    entityName: "Maintenance Log",
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      // Fetch MaintLog record
      const maintLog = await tblMaintLog.getById(id, {
        include: {
          tblMaintCause: true,
          tblMaintType: true,
          tblMaintClass: true,
        },
      });

      // Get compId from the fetched record
      const fetchedCompId = maintLog?.compId;

      // Load context with compId
      if (fetchedCompId) {
        const contextData = await getMaintLogContext({
          compId: fetchedCompId,
          maintLogId: id,
        });
        setContext(contextData);
      }

      return {
        dateDone: maintLog?.dateDone ? new Date(maintLog.dateDone) : new Date(),
        totalDuration: maintLog?.totalDuration ?? 0,
        waitingMin: maintLog?.downTime ?? 0,
        maintType: maintLog?.tblMaintType ?? null,
        maintCause: maintLog?.tblMaintCause ?? null,
        maintClass: maintLog?.tblMaintClass ?? null,
        history: maintLog?.history ?? "",
        reportedCount: null,
        unexpected: maintLog?.unexpected,
      };
    },

    onCreate: async (values) => {
      const compId = initialCompId || workOrderId; // Use initialCompId if provided
      if (!compId) {
        throw new Error("CompId or WorkOrderId is required");
      }

      const payload = {
        compId,
        workOrderId,
        dateDone: values.dateDone?.toString(),
        downTime: values.waitingMin ?? 0,
        totalDuration: values.totalDuration ?? 0,
        unexpected: values.unexpected,
        history: values.history ?? "",
        maintClassId: values.maintClass?.maintClassId,
        maintTypeId: values.maintType?.maintTypeId,
        maintCauseId: values.maintCause?.maintCauseId,
        reportedCount: context?.isCounter ? values.reportedCount : undefined,
      };

      return await tblMaintLog.create(payload);
    },

    onUpdate: async (id, values) => {
      const payload = {
        dateDone: values.dateDone?.toString(),
        downTime: values.waitingMin ?? 0,
        totalDuration: values.totalDuration ?? 0,
        unexpected: values.unexpected,
        history: values.history ?? "",
        maintClassId: values.maintClass?.maintClassId,
        maintTypeId: values.maintType?.maintTypeId,
        maintCauseId: values.maintCause?.maintCauseId,
        reportedCount: context?.isCounter ? values.reportedCount : undefined,
      };

      return await tblMaintLog.update(id, payload as any);
    },

    onSuccess,
    onClose,
  });

  const {
    control,
    formState: { errors },
    setValue,
  } = form;

  // Load context when dialog opens for create mode
  useEffect(() => {
    if (!open || mode !== "create") return;

    const loadContext = async () => {
      if (!initialCompId && !workOrderId) return;

      try {
        const contextData = await getMaintLogContext({
          compId: initialCompId,
          workOrderId,
        });
        setContext(contextData);
      } catch (error) {
        toast.error("Failed to load context");
      }
    };

    loadContext();
  }, [open, mode, initialCompId, workOrderId]);

  // Update reportedCount when context changes
  useEffect(() => {
    if (context && mode === "create") {
      setValue("reportedCount", context.reportedCount ?? null);
    }
  }, [context, setValue, mode]);

  const disabledCounterFields = !context?.isCounter;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
      maxWidth="lg"
    >
      <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr">
        <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr">
          {/* Column 1: Date & Duration */}
          <Box display="grid" gap={1.5}>
            <Controller
              name="dateDone"
              control={control}
              render={({ field, fieldState }) => (
                <FieldDateTime
                  type="DATETIME"
                  label="Date Done"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  field={field}
                />
              )}
            />
            <Controller
              name="totalDuration"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  label="Total Duration (Minutes)"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  field={field}
                />
              )}
            />
            <Controller
              name="waitingMin"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  label="Waiting (Minutes)"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  field={field}
                />
              )}
            />
          </Box>

          {/* Column 2: Maint Type/Cause/Class */}
          <Box display="grid" gap={1.5}>
            <Controller
              name="maintType"
              control={control}
              render={({ field, fieldState }) => (
                <FieldAsyncSelectGrid
                  label="Maint Type *"
                  value={field.value}
                  error={!!fieldState.error}
                  request={tblMaintType.getAll}
                  columns={[
                    { field: "descr", headerName: "Description", flex: 1 },
                  ]}
                  getRowId={(r) => r.maintTypeId}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="maintClass"
              control={control}
              render={({ field, fieldState }) => (
                <FieldAsyncSelectGrid
                  label="Maint Class *"
                  value={field.value}
                  error={!!fieldState.error}
                  request={tblMaintClass.getAll}
                  columns={[
                    { field: "descr", headerName: "Description", flex: 1 },
                  ]}
                  getRowId={(r) => r.maintClassId}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="maintCause"
              control={control}
              render={({ field, fieldState }) => (
                <FieldAsyncSelectGrid
                  label="Maint Cause *"
                  value={field.value}
                  error={!!fieldState.error}
                  request={tblMaintCause.getAll}
                  columns={[
                    { field: "descr", headerName: "Description", flex: 1 },
                  ]}
                  getRowId={(r) => r.maintCauseId}
                  onChange={field.onChange}
                />
              )}
            />
          </Box>

          {/* Column 3: Counter Data */}
          <Box display="flex" flexDirection="column" gap={1.5}>
            <Box display="flex" gap={1.5}>
              <FieldDateTime
                type="DATETIME"
                label="Last Date"
                disabled
                field={{
                  name: "lastDate",
                  value: context?.counterData?.lastDate || null,
                  onChange: () => {},
                  onBlur: () => {},
                }}
              />
              <NumberField
                label="Last Value"
                disabled
                field={{
                  name: "lastValue",
                  value: context?.counterData?.lastValue || null,
                  onChange: () => {},
                  onBlur: () => {},
                }}
              />
            </Box>

            <Controller
              name="reportedCount"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  {...field}
                  label="Counter"
                  disabled={disabledCounterFields}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Column 4: Unexpected Type */}
          <Controller
            name="unexpected"
            control={control}
            render={({ field }) => (
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio size="small" />}
                    label="Routine"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio size="small" />}
                    label="Unplanned (Major)"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio size="small" />}
                    label="Non-routine (Minor)"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Box>

        {/* History Editor */}
        <Controller
          name="history"
          control={control}
          render={({ field }) => (
            <Box height={300}>
              <Editor
                label="History"
                autoSave={false}
                initValue={field.value}
                readOnly={readonly}
                {...field}
              />
            </Box>
          )}
        />
      </Box>

      <Box mt={1.5} height={300}>
        <Editor
          label="Job Description"
          readOnly
          initValue={
            context?.isPlanned
              ? (context?.jobDescription.content?.trim() ?? "--")
              : "--"
          }
        />
      </Box>
    </FormDialog>
  );
}

export default memo(MaintLogUpsert);
