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
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { Controller } from "react-hook-form";
import { memo, useEffect, useMemo, useState } from "react";
import { generateNextWorkOrder, getMaintLogContext } from "@/core/api/api";
import { MaintLogContex } from "@/core/api/api.types";
import { toast } from "sonner";
import { buildRelation } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { buildSchema, TypeValues } from "./MaintLogUpsertSchema";
import {
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
  tblMaintType,
} from "@/core/api/generated/api";

type MaintLogUpsertProps = {
  open: boolean;
  title: string;
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
  title,
  mode,
  recordId,
  workOrderId,
  compId: initialCompId,
  onClose,
  onSuccess,
}: MaintLogUpsertProps) {
  const [context, setContext] = useState<MaintLogContex | null>(null);

  const dynamicSchema = useMemo(
    () => buildSchema(context?.isCounter ?? false),
    [context?.isCounter],
  );

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    handleFormSubmit,
  } = useUpsertForm<TypeValues, any>({
    entityName: "Maintenance Log",
    open,
    mode,
    recordId,
    schema: dynamicSchema,
    defaultValues,

    onFetch: async (id) => {
      const maintLog = await tblMaintLog.getById(id);

      const fetchedCompId = maintLog?.compId;

      if (fetchedCompId) {
        const contextData = await getMaintLogContext({
          compId: fetchedCompId,
          maintLogId: id,
        });
        setContext(contextData);

        // ✅ Fix 1: از contextData بخون نه context (که هنوز stale هست)
        return {
          dateDone: maintLog?.dateDone
            ? new Date(maintLog.dateDone)
            : new Date(),
          totalDuration: maintLog?.totalDuration ?? 0,
          waitingMin: maintLog?.downTime ?? 0,
          maintType: contextData?.maintType ?? null,
          maintCause: contextData?.maintCause ?? null,
          maintClass: contextData?.maintClass ?? null,
          history: maintLog?.history ?? "",
          unexpected: maintLog?.unexpected,
          reportedCount: contextData?.isCounter
            ? contextData.reportedCount
            : undefined,
        };
      }

      return {
        dateDone: maintLog?.dateDone ? new Date(maintLog.dateDone) : new Date(),
        totalDuration: maintLog?.totalDuration ?? 0,
        waitingMin: maintLog?.downTime ?? 0,
        maintType: null,
        maintCause: null,
        maintClass: null,
        history: maintLog?.history ?? "",
        unexpected: maintLog?.unexpected,
        reportedCount: undefined,
      };
    },

    onCreate: async (values) => {
      const payload: any = {
        mode: initialCompId ? "unPlanned" : "Planned",
        compId: initialCompId || context?.componentUnit?.compId || 0,
        workOrderId,
        dateDone: values.dateDone,
        downTime: values.waitingMin ?? 0,
        totalDuration: values.totalDuration ?? 0,
        unexpected: values.unexpected,
        history: values.history ?? "",

        maintClassId: values.maintClass?.maintClassId,
        maintTypeId: values.maintType?.maintTypeId,
        maintCauseId: values.maintCause?.maintCauseId,

        reportedCount: context?.isCounter ? values.reportedCount : undefined,
      };

      await tblMaintLog
        .create(payload)
        .then((res) => {
          toast.success("created successfully");

          if (workOrderId) {
            generateNextWorkOrder(res.maintLogId)
              .then(() => {
                toast.success("Next Work Order generated successfully");
              })
              .catch(() => {
                toast.error("Failed to generate Next Work Order");
              });
          }

          onSuccess?.(res);
        })
        .catch(() => {
          toast.error("Failed to create Maintenance Log");
        });
      return;
    },

    onUpdate: async (id, values) => {
      const payload = {
        dateDone: values.dateDone?.toString(),
        downTime: values.waitingMin ?? 0,
        totalDuration: values.totalDuration ?? 0,
        unexpected: values.unexpected,
        history: values.history ?? "",
        reportedCount: context?.isCounter ? values.reportedCount : undefined,
        ...buildRelation("tblMaintClass", "maintClassId", values.maintClass),
        ...buildRelation("tblMaintType", "maintTypeId", values.maintType),
        ...buildRelation("tblMaintCause", "maintCauseId", values.maintCause),
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
    reset,
  } = form;

  useEffect(() => {
    if (!open || mode !== "create") return;

    const loadContext = async () => {
      try {
        const contextData = await getMaintLogContext({
          compId: initialCompId,
          workOrderId,
        });
        setContext(contextData);

        reset({
          ...defaultValues,
          unexpected: initialCompId ? 1 : 0,
          maintType: contextData.maintType || null,
          maintCause: contextData.maintCause || null,
          maintClass: contextData.maintClass || null,
          reportedCount: contextData.isCounter ? contextData.reportedCount : 0,
        });
      } catch (error) {
        toast.error("Failed to load context");
      }
    };

    loadContext();
  }, [open, mode, initialCompId, workOrderId, reset]);

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
        <Box display="grid" gap={1.5} gridTemplateColumns="3fr 2fr">
          <Box
            gridColumn={"span 2"}
            display={"flex"}
            flexDirection={"column"}
            gap={1.5}
          >
            <TextField
              label="Component"
              fullWidth
              value={context?.componentUnit?.compNo || " "}
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Job Title"
              value={context?.jobDescription?.title || " "}
              fullWidth
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
            <Divider />
          </Box>

          {/* Column 1: Date & Duration */}
          <Box display="grid" gap={1.5}>
            <Controller
              name="dateDone"
              control={control}
              render={({ field, fieldState }) => (
                <FieldDateTime
                  field={field}
                  type="DATETIME"
                  pickerProps={{
                    maxDate: new Date(),
                  }}
                  label="Date Done"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
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
                disabled={disabledCounterFields}
                field={{
                  name: "lastDate",
                  value: context?.counterData?.lastDate || null,
                  onChange: () => {},
                  onBlur: () => {},
                }}
              />
              <NumberField
                label="Last Value"
                disabled={disabledCounterFields}
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
                  disabled={disabledCounterFields}
                  label="Counter"
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
                    label="UnPlanned (KPI)"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio size="small" />}
                    label="UnPlanned (Ignore)"
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
