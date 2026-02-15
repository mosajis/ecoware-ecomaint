import Editor from "@/shared/components/Editor";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";
import Box from "@mui/material/Box";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import Spinner from "@/shared/components/Spinner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation } from "@/core/helper";
import { schema, TypeValues } from "./stepGeneralSchema";
import { useCallback, useEffect, useState } from "react";
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
  tblLogCounter,
} from "@/core/api/generated/api";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import { getMaintLogContext, MaintLogContext } from "@/core/api/api";
import { useAtom } from "jotai";
import { reportWorkAtom } from "../../ReportWorkAtom";

const COUNTER_TYPE_ID = 10001;

const StepGeneral = () => {
  const [context, setContext] = useState<MaintLogContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [reportWork, setReportWork] = useAtom(reportWorkAtom);

  const { maintLog, workOrder, componentUnit } = reportWork;

  const compId =
    maintLog?.tblComponentUnit?.compId ??
    workOrder?.tblComponentUnit?.compId ??
    componentUnit?.compId;

  const maintLogId = maintLog?.maintLogId;
  const workOrderId = workOrder?.workOrderId;

  /* ================= Load Context ================= */
  useEffect(() => {
    const loadContext = async () => {
      if (!compId && !maintLogId && !workOrderId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const data = await getMaintLogContext({
        compId,
        maintLogId,
        workOrderId,
      });

      setContext(data);
      setIsLoading(false);
    };

    loadContext();
  }, [compId, maintLogId, workOrderId]);

  /* ================= Form ================= */
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateDone: new Date(),
      totalDuration: 0,
      waitingMin: 0,
      maintType: null,
      maintCause: null,
      maintClass: null,
      history: "",
      unexpected: false,
      reportedCount: 0,
    },
  });

  useEffect(() => {
    if (!context) return;
    console.log(context);
    const values = {
      dateDone: maintLog?.dateDone ? new Date(maintLog.dateDone) : new Date(),
      totalDuration: maintLog?.totalDuration ?? 0,
      waitingMin: maintLog?.downTime ?? 0,
      maintType: maintLog?.tblMaintType ?? null,
      maintCause: maintLog?.tblMaintCause ?? null,
      maintClass: maintLog?.tblMaintClass ?? null,
      history: maintLog?.history ?? "",
      unexpected: !context?.isPlanned,
      reportedCount: maintLog?.reportedCount ?? 0,
    };

    reset(values);
    setValue("reportedCount", values.reportedCount);
  }, [context, reset, setValue]);

  /* ================= Submit ================= */
  const onSubmit = useCallback(
    async (values: TypeValues) => {
      if (!context) return;

      const payload = {
        totalDuration: values.totalDuration ?? 0,
        downTime: values.waitingMin ?? 0,
        dateDone: values.dateDone?.toString(),
        unexpected: context.isPlanned ? 0 : 1,
        history: values.history ?? "",
        lastUpdate: new Date(),

        ...(!maintLogId && { compId }),

        ...buildRelation(
          "tblMaintType",
          "maintTypeId",
          values.maintType?.maintTypeId,
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
        ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation("tblWorkOrder", "workOrderId", workOrderId ?? null),
      };

      const saved = maintLogId
        ? await tblMaintLog.update(maintLogId, payload)
        : await tblMaintLog.create(payload);
      const recordMaintLog = await tblMaintLog.getById(saved.maintLogId, {
        include: {
          tblComponentUnit: true,
          tblMaintCause: true,
          tblMaintClass: true,
          tblMaintType: true,
          tblWorkOrder: true,
          tblJobDescription: true,
        },
      });

      // Counter
      if (context.isCounter) {
        const counterPayload = {
          maintLogId: saved.maintLogId,
          reportedCount: values.reportedCount,
          counterTypeId: COUNTER_TYPE_ID,
          lastupdate: new Date().toString(),
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
      setReportWork({
        maintLog: { ...recordMaintLog },
        workOrder: workOrder,
        componentUnit: componentUnit,
      });
    },
    [context, maintLogId, compId, workOrderId],
  );

  const disabledCounterFields = !context?.isCounter;

  const isDisabled = isSubmitting || isLoading;

  return (
    <Box p={1}>
      <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr 1fr">
        {/* Column 1: Date & Duration */}
        <Box display="grid" gap={1.5}>
          <Controller
            name="dateDone"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
                label="Maint Type"
                value={field.value}
                error={!!fieldState.error}
                // helperText={fieldState.error?.message}
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
                disabled={isDisabled}
                label="Maint Class"
                value={field.value}
                error={!!fieldState.error}
                // helperText={fieldState.error?.message}
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
                disabled={isDisabled}
                label="Maint Cause"
                value={field.value}
                error={!!fieldState.error}
                // helperText={fieldState.error?.message}
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
                value: context?.counterData.lastDate || null,
                onChange: () => {},
                onBlur: () => {},
              }}
            />
            <NumberField
              label="Last Value"
              disabled
              field={{
                name: "lastValue",
                value: context?.counterData.lastValue || null,
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
                disabled={disabledCounterFields || isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="unexpected"
            control={control}
            render={({ field, fieldState }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisabled}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Unexpected"
              />
            )}
          />
        </Box>
      </Box>

      {/* Editors */}
      <Box display="flex" gap={1} height={"335px"} my={1}>
        <Editor
          label="Job Description"
          readOnly
          initValue={
            context?.isPlanned
              ? (context?.jobDescription.content?.trim() ?? "--")
              : ""
          }
        />
        <Controller
          name="history"
          control={control}
          render={({ field }) => (
            <Editor label="History" autoSave={false} {...field} />
          )}
        />
      </Box>

      <Button
        type="submit"
        variant="outlined"
        color="secondary"
        style={{ width: "200px" }}
        onClick={handleSubmit(onSubmit)}
        disabled={isDisabled}
      >
        {isSubmitting ? "saving ..." : "Save General"}
      </Button>
    </Box>
  );
};

export default StepGeneral;
