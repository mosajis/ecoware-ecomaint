import Editor from "@/shared/components/Editor";
import ReportWorkStep from "../../ReportWorkStep";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";
import Box from "@mui/material/Box";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
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
  tblCompCounter,
  tblCompJobCounter,
} from "@/core/api/generated/api";
import { Checkbox, FormControlLabel } from "@mui/material";

interface StepGeneralProps {
  onDialogSuccess?: () => void;
}

interface CounterViewData {
  lastDate: string | null;
  lastValue: number | null;
}

const COUNTER_TYPE_ID = 10001;

const StepGeneral = ({ onDialogSuccess }: StepGeneralProps) => {
  const [initalData, setInitalData] = useAtom<TypeInitialData>(atomInitalData);

  const setIsDirty = useSetAtom(atomIsDirty);

  const [counterData, setCounterData] = useState<CounterViewData>({
    lastDate: null,
    lastValue: null,
  });

  const [isCounter, setIsCounter] = useState(false);

  const compId = initalData.componentUnit?.compId;
  const maintLogId = initalData.maintLog?.maintLogId;
  const compJob = initalData.maintLog?.tblWorkOrder?.tblCompJob;

  const workOrder = initalData.workOrder;
  const isPlanned = !!compJob;

  const defaultValues: TypeValues = {
    dateDone: initalData.maintLog?.dateDone || new Date(),
    totalDuration: initalData.maintLog?.totalDuration || null,
    waitingMin: initalData.maintLog?.downTime || null,
    // unexpected: initalData.maintLog?.unexpected === 1 || false,
    maintType: initalData.maintLog?.tblMaintType ?? null,
    maintCause: initalData.maintLog?.tblMaintCause ?? null,
    maintClass: initalData.maintLog?.tblMaintClass ?? null,
    history: initalData.maintLog?.history || "",
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

  /* ---------------- Counter Detection + Last Value ---------------- */
  useEffect(() => {
    if (!compId) return;

    const loadCounterData = async () => {
      setIsCounter(false);
      setCounterData({ lastDate: null, lastValue: null });

      // ---- UNPLANNED ----
      if (!isPlanned) {
        const compCounters = await tblCompCounter.getAll({
          filter: {
            compId,
            counterTypeId: COUNTER_TYPE_ID,
          },
        });

        if (!compCounters.items.length) return;

        const counter = compCounters.items[0];
        setIsCounter(true);
        setCounterData({
          lastDate: counter.currentDate || null,
          lastValue: counter.currentValue || null,
        });
      }

      // ---- PLANNED ----
      if (isPlanned && compJob?.compJobId) {
        const jobCounters = await tblCompJobCounter.getAll({
          filter: {
            compJobId: compJob.compJobId,
            tblCompCounter: { counterTypeId: COUNTER_TYPE_ID },
          },
        });

        if (!jobCounters.items.length) return;

        const compCounters = await tblCompCounter.getAll({
          filter: {
            compId,
            counterTypeId: COUNTER_TYPE_ID,
          },
        });

        if (!compCounters.items.length) return;

        const counter = compCounters.items[0];
        setIsCounter(true);
        setCounterData({
          lastDate: counter.currentDate || null,
          lastValue: counter.currentValue || null,
        });
      }

      // ---- EDIT MODE : preload reportedCount ----
      if (maintLogId) {
        const logCounter = await tblLogCounter.getAll({
          filter: { maintLogId },
        });

        if (logCounter.items.length) {
          setValue("reportedCount", logCounter.items[0].reportedCount || 0);
        }
      }
    };

    loadCounterData();
  }, [compId, isPlanned, compJob?.compJobId, maintLogId, setValue]);

  /* ---------------- Dirty Flag ---------------- */
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  /* ---------------- Submit ---------------- */
  const onSubmit = useCallback(
    async (values: TypeValues) => {
      const payload = {
        totalDuration: values.totalDuration ?? 0,
        downTime: values.waitingMin ?? 0,
        dateDone: values.dateDone?.toString(),
        unexpected: isPlanned ? 0 : 1,
        history: values.history || "",
        lastUpdate: new Date(),
        ...(compJob && {
          frequency: compJob.frequency,
          ...buildRelation("tblPeriod", "periodId", compJob.frequencyPeriod),
        }),
        ...(!maintLogId && { compId }),
        ...buildRelation(
          "tblMaintType",
          "maintTypeId",
          values.maintType?.maintTypeId,
        ),
        ...buildRelation(
          "tblJobDescription",
          "jobDescId",
          isPlanned ? compJob?.jobDescId : null,
        ),
        ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation(
          "tblWorkOrder",
          "workOrderId",
          initalData.workOrder.workOrderId || null,
        ),
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

      const saved = maintLogId
        ? await tblMaintLog.update(maintLogId, payload)
        : await tblMaintLog.create(payload);

      if (isCounter) {
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
    [maintLogId, compId, isCounter, reset, setInitalData],
  );

  const handleNext = (goNext: () => void) => {
    handleSubmit(async (values) => {
      await onSubmit(values);
      goNext();
    })();
  };

  const disabledCounterFields = !isCounter;

  /* ---------------- UI ---------------- */
  return (
    <ReportWorkStep onNext={handleNext} onDialogSuccess={onDialogSuccess}>
      <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr 1fr">
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

        <Box display="flex" flexDirection="column" gap={1.5}>
          <Box display="flex" gap={1.5}>
            <FieldDateTime
              type="DATETIME"
              label="Last Date"
              disabled
              field={{
                name: "lastDate",
                value: counterData.lastDate,
                onChange: () => {},
                onBlur: () => {},
              }}
            />
            <NumberField
              label="Last Value"
              disabled
              field={{
                name: "lastValue",
                value: counterData.lastValue,
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

      <Box display="flex" gap={1} mt={2} height={"100%"}>
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
            isPlanned ? compJob?.tblJobDescription?.jobDesc?.trim() || "--" : ""
          }
        />
      </Box>
    </ReportWorkStep>
  );
};

export default StepGeneral;
