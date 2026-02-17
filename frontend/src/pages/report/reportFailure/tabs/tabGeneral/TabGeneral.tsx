import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useState } from "react";
import { schema, DEFAULT_VALUES, SchemaValue } from "./TabGeneralSchema";
import { buildRelation } from "@/core/helper";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import { atomInitData } from "../../FailureReportAtom";
import {
  tblFailureReports,
  tblComponentUnit,
  tblFailureSeverityLevel,
  tblFailureStatus,
  tblFailureGroupFollow,
  TypeTblComponentUnit,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  tblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  mode: "create" | "update";
  failureReportId?: number | null;
  compId?: number;
};

function StepGeneral({ mode, failureReportId, compId }: Props) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);

  const [initData, setInitData] = useAtom(atomInitData);

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...DEFAULT_VALUES,
      failureDateTime: new Date(),
    },
  });

  const component = watch("component");
  const isDisabled = loading || isSubmitting || !!compId;

  useEffect(() => {
    const { failureReport, maintLog } = initData;
    const formData: SchemaValue = {
      downTime: failureReport?.tblMaintLog?.downTime || 0,
      component: (failureReport?.tblMaintLog?.tblComponentUnit as any) ?? null,
      title: failureReport?.title ?? "",
      requestNo: failureReport?.requestNo ?? "",
      failureSeverity: failureReport?.tblFailureSeverityLevel ?? null,
      failureStatus: failureReport?.tblFailureStatus ?? null,
      failureGroupFollow: failureReport?.tblFailureGroupFollow ?? null,
      failureDesc: failureReport?.tblMaintLog?.history ?? "",
      followDesc: failureReport?.followDesc ?? null,
      failureDateTime: failureReport?.tblMaintLog?.dateDone ?? new Date(),
      nextFollowDate: failureReport?.nextFollowDate,
      maintClass: maintLog?.tblMaintClass ?? null,
      maintCause: maintLog?.tblMaintCause ?? null,
      maintType: maintLog?.tblMaintType ?? null,
    };

    reset(formData);
  }, []);
  // Load component if compId provided
  useEffect(() => {
    if (!compId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await tblComponentUnit.getById(compId, {
          include: { tblLocation: true },
        });
        setValue("component", res as any);
      } finally {
        setLoading(false);
      }
    })();
  }, [compId, setValue]);

  // Auto-fill title from component
  useEffect(() => {
    if (!component) return;
    if (component.compNo) {
      setValue("title", `${component.compNo} - Failure Report`);
    }
  }, [component, setValue]);

  const handleFormSubmit = useCallback(
    async (values: SchemaValue) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const v = parsed.data;

      try {
        const now = new Date();

        // Get failure count for failure number
        const res = await tblFailureReports.count();
        const failureNumber = res.count + 1;

        // Prepare maintLog data
        const maintLogBody = {
          compId: v.component?.compId,
          dateDone: v.failureDateTime.toString(),
          history: v.failureDesc,
          downTime: v.downTime,
          ...buildRelation("tblDiscipline", "discId", userDiscipline?.discId),
          ...buildRelation(
            "tblUsersTblMaintLogReportedByTotblUsers",
            "userId",
            user?.userId,
          ),
          reportedDate: now.toString(),
          ...buildRelation("tblComponentUnit", "compId", v.component?.compId),
          ...buildRelation(
            "tblMaintClass",
            "maintClassId",
            v.maintClass?.maintClassId,
          ),
          ...buildRelation(
            "tblMaintCause",
            "maintCauseId",
            v.maintCause?.maintCauseId,
          ),
          ...buildRelation(
            "tblMaintType",
            "maintTypeId",
            v.maintType?.maintTypeId,
          ),
          ...(v.component?.functionId && {
            functionId: v.component.functionId,
          }),
        };

        // Prepare failureReport data
        const failureReportBody = {
          title: v.title,
          followDesc: v.followDesc,
          nextFollowDate: v.nextFollowDate?.toString(),
          failureNumber: failureNumber,
          requestNo: v.requestNo,

          ...buildRelation(
            "tblFailureSeverityLevel",
            "failureSeverityLevelId",
            v.failureSeverity?.failureSeverityLevelId ?? null,
          ),
          ...buildRelation(
            "tblFailureStatus",
            "failureStatusId",
            v.failureStatus?.failureStatusId ?? null,
          ),
          ...buildRelation(
            "tblFailureGroupFollow",
            "failureGroupFollowId",
            v.failureGroupFollow?.failureGroupFollowId ?? null,
          ),
        };

        let createdMaintLog;
        let createdFailureReport;

        if (mode === "create" && !initData.failureReport?.failureReportId) {
          // Create maintLog first
          createdMaintLog = await tblMaintLog.create(maintLogBody);

          // Create failureReport with maintLogId
          createdFailureReport = await tblFailureReports.create({
            ...failureReportBody,
            ...buildRelation(
              "tblLocation",
              "locationId",
              v.component.tblLocation.locationId,
            ),
            ...buildRelation(
              "tblMaintLog",
              "maintLogId",
              createdMaintLog.maintLogId,
            ),
          });

          // Update atom with created data
          setInitData({
            maintLog: createdMaintLog,
            failureReport: createdFailureReport,
          });
        } else {
          // Update mode
          const existingFailureReport = await tblFailureReports.getById(
            failureReportId!,
          );

          if (existingFailureReport.maintLogId) {
            // Update existing maintLog
            await tblMaintLog.update(
              existingFailureReport.maintLogId,
              maintLogBody,
            );
          }

          // Update failureReport
          await tblFailureReports.update(failureReportId!, failureReportBody);
        }
      } catch (error) {
        console.error("Error saving failure report:", error);
      }
    },
    [mode, failureReportId, user, userDiscipline, setInitData],
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      display="flex"
      flexDirection="column"
      gap={1.5}
      p={1}
    >
      <Box display="flex" gap={1.5}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ flex: 1 }}
              label="Title *"
              value={field.value ?? ""}
              fullWidth
              size="small"
              disabled={isDisabled}
              error={!!errors.title}
            />
          )}
        />
        <Box display="flex" gap={1.5} flex={1}>
          <Controller
            name="requestNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Request No *"
                value={field.value ?? ""}
                fullWidth
                size="small"
                disabled={isDisabled}
                error={!!errors.requestNo}
              />
            )}
          />

          <Controller
            name="failureDateTime"
            control={control}
            render={({ field }) => (
              <FieldDateTime
                label="Failure Date Time *"
                field={field}
                disabled={isDisabled}
                type="DATETIME"
                error={!!errors.failureDateTime}
              />
            )}
          />
        </Box>
      </Box>

      <Box display="flex" gap={1.5}>
        <TextField
          fullWidth
          label="Discipline"
          value={userDiscipline?.name ?? ""}
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          label="Reported By"
          value={user?.uName ?? ""}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          label="Function No"
          value={component?.functionId ?? ""}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      </Box>

      {/* Component & Location */}
      <Box display="flex" gap={1.5}>
        <Controller
          name="component"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid<TypeTblComponentUnit>
              label="Component *"
              columns={[{ field: "compNo", headerName: "Comp No", flex: 1 }]}
              request={() =>
                tblComponentUnit.getAll({ include: { tblLocation: true } })
              }
              getRowId={(row) => row.compId}
              getOptionLabel={(row) => row.compNo ?? ""}
              onChange={field.onChange}
              value={field.value}
              disabled={isDisabled}
              error={!!errors.component}
            />
          )}
        />
        <TextField
          label="Serial No"
          value={component?.serialNo ?? ""}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
          size="small"
        />
        <TextField
          label="Location"
          value={component?.tblLocation?.name ?? ""}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
          size="small"
        />
      </Box>

      {/* Status Grid */}
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={1.5}>
        {/* Column 1: Status Info */}
        <Box display="flex" gap={1.5} flexDirection="column">
          <Controller
            name="failureSeverity"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelect
                label="Severity *"
                request={tblFailureSeverityLevel.getAll}
                getOptionKey={(r) => r.failureSeverityLevelId}
                getOptionLabel={(r) => r.name ?? ""}
                onChange={field.onChange}
                value={field.value}
                disabled={isDisabled}
                error={!!errors.failureSeverity}
              />
            )}
          />
          <Controller
            name="failureStatus"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelect
                label="Status *"
                request={tblFailureStatus.getAll}
                getOptionKey={(r) => r.failureStatusId}
                getOptionLabel={(r) => r.name ?? ""}
                onChange={field.onChange}
                value={field.value}
                disabled={isDisabled}
                error={!!errors.failureStatus}
              />
            )}
          />
          <Box display="flex" gap={1.5}>
            <Controller
              name="failureGroupFollow"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelect
                  label="Follow By"
                  request={tblFailureGroupFollow.getAll}
                  getOptionKey={(r) => r.failureGroupFollowId}
                  getOptionLabel={(r) => r.name ?? ""}
                  onChange={field.onChange}
                  value={field.value}
                  disabled={isDisabled}
                  error={!!errors.failureGroupFollow}
                />
              )}
            />
            <Controller
              name="nextFollowDate"
              control={control}
              render={({ field }) => (
                <FieldDateTime
                  label="Next Follow Date"
                  field={field}
                  disabled={isDisabled}
                  type="DATE"
                  error={!!errors.nextFollowDate}
                />
              )}
            />
          </Box>
        </Box>

        {/* Column 2: Maintenance Info */}
        <Box display="flex" gap={1.5} flexDirection="column">
          <Controller
            name="maintClass"
            control={control}
            render={({ field, fieldState }) => (
              <FieldAsyncSelectGrid
                disabled={isDisabled}
                dialogMaxWidth="sm"
                label="Maint Class *"
                value={field.value}
                selectionMode="single"
                request={tblMaintClass.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Class", flex: 1 },
                ]}
                getRowId={(row) => row.maintClassId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
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
                label="Maint Cause *"
                value={field.value}
                selectionMode="single"
                request={tblMaintCause.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Cause", flex: 1 },
                ]}
                getRowId={(row) => row.maintCauseId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
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
                label="Maint Type *"
                value={field.value}
                selectionMode="single"
                request={tblMaintType.getAll}
                columns={[
                  { field: "descr", headerName: "Maint Type", flex: 1 },
                ]}
                getRowId={(row) => row.maintTypeId}
                onChange={field.onChange}
                error={!!fieldState.error?.message}
              />
            )}
          />
        </Box>

        {/* Column 3: Additional Info */}
        <Box display="flex" gap={1.5} flexDirection="column">
          <TextField
            label="Down Time"
            value=""
            fullWidth
            disabled
            size="small"
          />
          <TextField
            label="Failure No"
            value=""
            fullWidth
            disabled
            size="small"
          />
          <TextField
            label="WorkShop No"
            value=""
            fullWidth
            disabled
            size="small"
          />
        </Box>
      </Box>

      <Box display={"flex"} gap={1.5} height={"280px"}>
        {/* Descriptions */}
        <Controller
          name="failureDesc"
          control={control}
          render={({ field }) => (
            <Editor
              {...field}
              label="Description"
              onChange={field.onChange}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="followDesc"
          control={control}
          render={({ field }) => (
            <Editor
              {...field}
              label="Follow Description"
              onChange={field.onChange}
              disabled={isDisabled}
            />
          )}
        />
      </Box>

      {/* Save Button */}
      <Button
        type="submit"
        variant="outlined"
        color="secondary"
        style={{ width: "200px", marginLeft: "auto" }}
        disabled={isDisabled}
      >
        {isSubmitting ? "saving ..." : "Save General"}
      </Button>
    </Box>
  );
}

export default memo(StepGeneral);
