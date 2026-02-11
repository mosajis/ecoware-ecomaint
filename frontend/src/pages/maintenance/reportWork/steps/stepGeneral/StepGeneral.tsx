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
import { atomInitalData, atomIsDirty } from "../../ReportWorkAtom";
import { useCallback, useEffect } from "react";
import {
  tblMaintType,
  tblMaintCause,
  tblMaintClass,
  tblMaintLog,
} from "@/core/api/generated/api";

interface StepGeneralProps {
  onDialogSuccess?: () => void;
}

const StepGeneral = ({ onDialogSuccess }: StepGeneralProps) => {
  const [initalData, setInitalData] = useAtom(atomInitalData);
  const setIsDirty = useSetAtom(atomIsDirty);

  const defaultValues: TypeValues = {
    dateDone: initalData.maintLog?.dateDone || null,
    totalDuration: initalData.maintLog?.totalDuration || null,
    waitingMin: initalData.maintLog?.downTime || null,
    unexpected: initalData.maintLog?.unexpected === 1 || false,

    maintType: initalData.maintLog?.tblMaintType ?? null,
    maintCause: initalData.maintLog?.tblMaintCause ?? null,
    maintClass: initalData.maintLog?.tblMaintClass ?? null,

    history: initalData.maintLog?.history || "",
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
    reset,
  } = useForm<TypeValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Track dirty state in atom
  useEffect(() => {
    setIsDirty(isDirty);
  }, [isDirty, setIsDirty]);

  const onSubmit = useCallback(
    async (values: TypeValues) => {
      // Don't submit if no changes
      if (!isDirty && initalData.maintLog?.maintLogId) {
        return initalData.maintLog;
      }

      try {
        const payload = {
          totalDuration: values.totalDuration ?? 0,
          downTime: values.waitingMin ?? 0,
          dateDone: values.dateDone,
          unexpected: values.unexpected ? 1 : 0,
          history: values.history || "",

          // Add componentUnitId for new records
          ...(!initalData.maintLog?.maintLogId && {
            componentUnitId: initalData.componentUnit?.compId,
          }),

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
        };

        let savedRecord;

        if (initalData.maintLog?.maintLogId) {
          // Update existing record
          savedRecord = await tblMaintLog.update(
            initalData.maintLog.maintLogId,
            payload,
          );
        } else {
          // Create new record
          savedRecord = await tblMaintLog.create(payload);
        }

        // Fetch full record with relations
        const fullRecord = await tblMaintLog.getById(savedRecord.maintLogId, {
          include: {
            tblMaintCause: true,
            tblMaintClass: true,
            tblMaintType: true,
            tblWorkOrder: true,
            tblJobDescription: true,
          },
        });

        // Replace entire maintLog with fresh data
        setInitalData((prev) => ({
          ...prev,
          maintLog: fullRecord,
        }));

        // Reset form with new values to clear dirty state
        reset({
          dateDone: fullRecord.dateDone || null,
          totalDuration: fullRecord.totalDuration || null,
          waitingMin: fullRecord.downTime || null,
          unexpected: fullRecord.unexpected === 1 || false,
          maintType: fullRecord.tblMaintType ?? null,
          maintCause: fullRecord.tblMaintCause ?? null,
          maintClass: fullRecord.tblMaintClass ?? null,
          history: fullRecord.history || "",
        });

        return fullRecord;
      } catch (error) {
        console.error("Failed to save maintenance log:", error);

        throw error;
      }
    },
    [isDirty, initalData, setInitalData, reset],
  );

  const handleNext = (goNext: () => void) => {
    handleSubmit(async (values) => {
      try {
        await onSubmit(values);
        goNext();
      } catch (error) {
        // Error already handled in onSubmit
      }
    })();
  };

  const isDisabled = isSubmitting;

  return (
    <ReportWorkStep onNext={handleNext} onDialogSuccess={onDialogSuccess}>
      <Box display={"grid"} gap={1.5} gridTemplateColumns={"1fr 1fr 1fr"}>
        <Box display={"grid"} gap={1.5} gridTemplateColumns={"1fr"}>
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
                getRowId={(row) => row.maintTypeId}
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
                getRowId={(row) => row.maintCauseId}
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
                getRowId={(row) => row.maintClassId}
                onChange={field.onChange}
              />
            )}
          />
        </Box>
        <Box display={"grid"} gap={1.5} gridTemplateColumns={"1fr"}>
          <Controller
            name="dateDone"
            control={control}
            render={({ field, fieldState }) => (
              <FieldDateTime
                type="DATETIME"
                label="Date Done"
                field={field}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="totalDuration"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Total Duration (min)"
                field={field}
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="waitingMin"
            control={control}
            render={({ field }) => (
              <NumberField
                label="Waiting (min)"
                field={field}
                disabled={isDisabled}
              />
            )}
          />
        </Box>
        <Box display={"flex"} gap={1.5} flexDirection={"column"}>
          <Box display={"flex"} gap={1.5}>
            <Controller
              name="totalDuration"
              control={control}
              render={({ field, fieldState }) => (
                <FieldDateTime
                  pickerProps={{ readOnly: true }}
                  type="DATETIME"
                  label="Last Date"
                  field={field}
                  disabled={isDisabled}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="totalDuration"
              control={control}
              render={({ field, fieldState }) => (
                <NumberField
                  readOnly
                  label="Last Value"
                  field={field}
                  disabled={isDisabled}
                  error={!!fieldState.error?.message}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
          <Controller
            name="totalDuration"
            control={control}
            render={({ field, fieldState }) => (
              <NumberField
                label="Reported Count"
                field={field}
                disabled={isDisabled}
                error={!!fieldState.error?.message}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Box>
      {/* -------- Editors -------- */}
      <Box display="flex" gap={1} flex={1}>
        <Controller
          name="history"
          control={control}
          render={({ field }) => (
            <Editor
              label="History"
              autoSave={false}
              initValue={initalData.maintLog?.history}
              {...field}
            />
          )}
        />
        <Editor
          label="Job Description"
          initValue={initalData.maintLog?.tblJobDescription?.jobDesc || "--"}
          readOnly
        />
      </Box>
    </ReportWorkStep>
  );
};

export default StepGeneral;
