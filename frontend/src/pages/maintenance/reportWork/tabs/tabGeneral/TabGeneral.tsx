import Editor from "@/shared/components/Editor";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import NumberField from "@/shared/components/fields/FieldNumber";
import Box from "@mui/material/Box";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, TypeValues } from "./TabGeneralSchema";
import { useCallback, useEffect, useState } from "react";
import { getMaintLogContext } from "@/core/api/api";
import { useAtom, useAtomValue } from "jotai";
import { reportWorkAtom } from "../../ReportWorkAtom";
import { MaintLogContex } from "@/core/api/api.types";
import { toast } from "sonner";
import { atomUser } from "@/pages/auth/auth.atom";
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
} from "@/core/api/generated/api";

const COUNTER_TYPE_ID = 10001;

const StepGeneral = () => {
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const [context, setContext] = useState<MaintLogContex | null>(null);
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
      unexpected: 0,
      reportedCount: 0,
    },
  });

  useEffect(() => {
    const values = {
      dateDone: maintLog?.dateDone ? new Date(maintLog.dateDone) : new Date(),
      totalDuration: maintLog?.totalDuration ?? 0,
      waitingMin: maintLog?.downTime ?? 0,
      maintType: maintLog?.tblMaintType ?? null,
      maintCause: maintLog?.tblMaintCause ?? null,
      maintClass: maintLog?.tblMaintClass ?? null,
      history: maintLog?.history ?? "",
      reportedCount: context?.reportedCount ?? 0,
    };

    reset(values);
    setValue("reportedCount", values.reportedCount);
  }, [context, reset, setValue]);

  const onSubmit = useCallback(
    async (values: TypeValues) => {
      if (!context) return;

      const payload = {
        // داده‌های اصلی فرم
        dateDone: values.dateDone?.toString(),
        downTime: values.waitingMin ?? 0,
        totalDuration: values.totalDuration ?? 0,
        unexpected: !!values.unexpected,
        history: values.history ?? "",

        compId: compId,
        workOrderId: workOrderId,

        maintClassId: values.maintClass?.maintClassId,
        maintTypeId: values.maintType?.maintTypeId,
        maintCauseId: values.maintCause?.maintCauseId,

        reportedCount: context.isCounter ? values.reportedCount : undefined,
      };

      try {
        if (maintLogId) {
          // await api.patch(`/tblMaintLog/${maintLogId}`, payload);
        } else {
          await tblMaintLog.create(payload as any);
        }
      } catch (error) {
        toast.error("Faild ...");
      }
    },
    [context, compId, workOrderId, maintLogId],
  );

  const disabledCounterFields = !context?.isCounter;

  const isDisabled = isSubmitting || isLoading;

  return (
    <Box
      p={1}
      height={"100%"}
      display={"flex"}
      gap={1.5}
      flexDirection={"column"}
    >
      <Box display={"grid"} gap={1.5} gridTemplateColumns="1fr 1fr">
        <Box display="grid" gap={1.5} gridTemplateColumns="1fr 1fr">
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
                  label="Counter"
                  field={field}
                  disabled={disabledCounterFields || isDisabled}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
          <Controller
            name="unexpected"
            control={control}
            render={({ field }) => (
              <FormControl disabled={isDisabled}>
                <RadioGroup
                  value={field.value ?? 0}
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

        <Controller
          name="history"
          control={control}
          render={({ field }) => (
            <Editor
              label="History"
              autoSave={false}
              initValue={field.value}
              {...field}
            />
          )}
        />
      </Box>

      {/* Editors */}
      <Editor
        label="Job Description"
        readOnly
        initValue={
          context?.isPlanned
            ? (context?.jobDescription.content?.trim() ?? "--")
            : ""
        }
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary"
        style={{ width: "180px" }}
        onClick={handleSubmit(onSubmit)}
        disabled={isDisabled}
      >
        {isSubmitting ? "saving ..." : "Save"}
      </Button>
    </Box>
  );
};

export default StepGeneral;
