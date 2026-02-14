import Editor from "@/shared/components/Editor";
import ReportWorkStep from "../../ReportWorkStep";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";
import Box from "@mui/material/Box";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import Spinner from "@/shared/components/Spinner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useSetAtom } from "jotai";
import { buildRelation } from "@/core/helper";
import { schema, TypeValues } from "./stepGeneralSchema";
import {
  atomInitalData,
  atomIsDirty,
  TypeInitialData,
} from "../../ReportWorkAtom";
import { useCallback, useEffect, useState } from "react";
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
  tblLogCounter,
} from "@/core/api/generated/api";
import { getMaintLogContext, MaintLogContext } from "../../ReportWorkContext";

interface StepGeneralProps {
  onDialogSuccess?: () => void;
}

const COUNTER_TYPE_ID = 10001;

const StepGeneral = ({ onDialogSuccess }: StepGeneralProps) => {
  const [initalData, setInitalData] = useAtom<TypeInitialData>(atomInitalData);
  const setIsDirty = useSetAtom(atomIsDirty);

  const [context, setContext] = useState<MaintLogContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const compId = initalData.componentUnit?.compId;
  const maintLogId = initalData.maintLog?.maintLogId;
  const workOrderId = initalData.workOrder?.workOrderId;

  // Default values
  const defaultValues: TypeValues = {
    dateDone: initalData.maintLog?.dateDone || new Date(),
    totalDuration: initalData.maintLog?.totalDuration || 0,
    waitingMin: initalData.maintLog?.downTime || 0,
    maintType: initalData.maintLog?.tblMaintType ?? null,
    maintCause: initalData.maintLog?.tblMaintCause ?? null,
    maintClass: initalData.maintLog?.tblMaintClass ?? null,
    history: initalData.maintLog?.history || "",
    unexpected: initalData.maintLog?.unexpected || false,
    reportedCount: 0,
  };

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
    reset,
    setValue,
  } = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    const loadContext = async () => {
      if (!compId && !workOrderId && !maintLogId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const data = await getMaintLogContext({
          compId,
          workOrderId,
          maintLogId,
        });

        setContext(data);

        // Set default values from context
        if (data.maintLog) {
          reset({
            dateDone: data.maintLog.dateDone
              ? new Date(data.maintLog.dateDone)
              : new Date(),
            totalDuration: data.maintLog.totalDuration ?? null,
            waitingMin: data.maintLog.downTime ?? null,
            maintType: data.maintLog.tblMaintType ?? null,
            maintCause: data.maintLog.tblMaintCause ?? null,
            maintClass: data.maintLog.tblMaintClass ?? null,
            history: data.maintLog.history || "",
            reportedCount: data.reportedCount,
          });
        } else {
          setValue("reportedCount", data.reportedCount);
        }
      } catch (error) {
        console.error("Error loading context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContext();
  }, [compId, workOrderId, maintLogId, setValue, reset]);

  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  const onSubmit = useCallback(
    async (values: TypeValues) => {
      if (!context) return;

      const payload = {
        totalDuration: values.totalDuration ?? 0,
        downTime: values.waitingMin ?? 0,
        dateDone: values.dateDone?.toString(),
        unexpected: context.isPlanned ? 0 : 1,
        history: values.history || "",
        lastUpdate: new Date(),

        // Frequency (فقط برای Planned)
        ...(context.isPlanned &&
          context.frequency.value && {
            frequency: context.frequency.value,
            ...buildRelation(
              "tblPeriod",
              "periodId",
              context.frequency.period?.periodId,
            ),
          }),

        // Relations
        ...(!maintLogId && { compId }),
        ...buildRelation(
          "tblMaintType",
          "maintTypeId",
          values.maintType?.maintTypeId,
        ),
        ...buildRelation(
          "tblJobDescription",
          "jobDescId",
          context.maintLog?.tblWorkOrder?.tblCompJob?.jobDescId ?? null,
        ),
        ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation("tblWorkOrder", "workOrderId", workOrderId || null),
        ...buildRelation(
          "tblMaintCause",
          "maintCauseId",
          values.maintCause?.maintCauseId,
        ),
        ...buildRelation(
          "tblMaintClass",
          "maintClassId",
          values.maintClass?.maintClassId,
        ),
      };

      // Save MaintLog
      const saved = maintLogId
        ? await tblMaintLog.update(maintLogId, payload)
        : await tblMaintLog.create(payload);

      // Save Counter (if applicable)
      if (context.isCounter) {
        const counterPayload = {
          maintLogId: saved.maintLogId,
          reportedCount: values.reportedCount,
          counterTypeId: COUNTER_TYPE_ID,
          lastupdate: new Date().toISOString(),
        };

        const existing = await tblLogCounter.getAll({
          filter: { maintLogId: saved.maintLogId },
        });

        if (existing.items.length) {
          await tblLogCounter.update(
            existing.items[0].logCounterId,
            counterPayload,
          );
        } else {
          await tblLogCounter.create(counterPayload);
        }
      }

      // Reload full data
      const full = await tblMaintLog.getById(saved.maintLogId, {
        include: {
          tblMaintType: true,
          tblMaintCause: true,
          tblMaintClass: true,
          tblWorkOrder: { include: { tblCompJob: true } },
          tblJobDescription: true,
        },
      });

      setInitalData((p) => ({ ...p, maintLog: full }));

      reset({
        ...values,
        reportedCount: values.reportedCount,
      });

      return full;
    },
    [maintLogId, compId, workOrderId, context, reset, setInitalData],
  );

  const handleNext = (goNext: () => void) => {
    handleSubmit(async (values) => {
      await onSubmit(values);
      goNext();
    })();
  };

  if (isLoading || !context) {
    return <Spinner />;
  }

  const disabledCounterFields = !context.isCounter;

  return (
    <ReportWorkStep onNext={handleNext} onDialogSuccess={onDialogSuccess}>
      <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr 1fr">
        {/* ────── Column 1: Date & Duration ────── */}
        <Box display="grid" gap={1.5}>
          <Controller
            name="dateDone"
            control={control}
            render={({ field }) => (
              <FieldDateTime type="DATETIME" label="Date Done" field={field} />
            )}
          />
          <Controller
            name="totalDuration"
            control={control}
            render={({ field }) => (
              <NumberField label="Total Duration" field={field} />
            )}
          />
          <Controller
            name="waitingMin"
            control={control}
            render={({ field }) => (
              <NumberField label="Waiting (min)" field={field} />
            )}
          />
        </Box>

        {/* ────── Column 2: Maint Type/Cause/Class ────── */}
        <Box display="grid" gap={1.5}>
          <Controller
            name="maintType"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Maint Type"
                value={field.value}
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
            name="maintCause"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Maint Cause"
                value={field.value}
                request={tblMaintCause.getAll}
                columns={[
                  { field: "descr", headerName: "Description", flex: 1 },
                ]}
                getRowId={(r) => r.maintCauseId}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="maintClass"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Maint Class"
                value={field.value}
                request={tblMaintClass.getAll}
                columns={[
                  { field: "descr", headerName: "Description", flex: 1 },
                ]}
                getRowId={(r) => r.maintClassId}
                onChange={field.onChange}
              />
            )}
          />
        </Box>

        {/* ────── Column 3: Counter Data ────── */}
        <Box display="flex" flexDirection="column" gap={1.5}>
          <Box display="flex" gap={1.5}>
            <FieldDateTime
              type="DATETIME"
              label="Last Date"
              disabled
              field={{
                name: "lastDate",
                value: context.counterData.lastDate,
                onChange: () => {},
                onBlur: () => {},
              }}
            />
            <NumberField
              label="Last Value"
              disabled
              field={{
                name: "lastValue",
                value: context.counterData.lastValue,
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
                label="Reported Count"
                field={field}
                disabled={disabledCounterFields || isSubmitting}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* ────── Editors ────── */}
      <Box display="flex" gap={1} height={"500px"}>
        <Controller
          name="history"
          control={control}
          render={({ field }) => (
            <Editor label="History" autoSave={false} {...field} />
          )}
        />
        <Editor
          label="Job Description"
          readOnly
          initValue={
            context.isPlanned
              ? context.jobDescription.content?.trim() || "--"
              : ""
          }
        />
      </Box>
    </ReportWorkStep>
  );
};

export default StepGeneral;
