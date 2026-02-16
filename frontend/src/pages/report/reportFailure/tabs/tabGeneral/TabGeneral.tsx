import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { schema, DEFAULT_VALUES, SchemaValue } from "./TabGeneralSchema";
import { buildRelation } from "@/core/helper";
import { useAtomValue, useSetAtom } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
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
import { failureReportAtom } from "../../FailureReportAtom";

type Props = {
  mode: "create" | "update";
  failureReportId?: number | null;
  compId?: number;
};

function StepGeneral({ mode, failureReportId, compId }: Props) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);
  const setFailureReportAtom = useSetAtom(failureReportAtom);

  const [loading, setLoading] = useState(false);
  const titleTouchedRef = useRef(false);

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
    if (!component || titleTouchedRef.current) return;
    if (component.compNo) {
      setValue("title", `${component.compNo} - Failure Report`);
    }
  }, [component, setValue]);

  // Fetch data for update mode
  const fetchData = useCallback(async () => {
    console.log(mode, failureReportId);
    if (mode !== "update" || !failureReportId) {
      reset(DEFAULT_VALUES);
      titleTouchedRef.current = false;
      return;
    }

    setLoading(true);
    try {
      const failureReport = await tblFailureReports.getById(failureReportId, {
        include: {
          // tblLocation: true,
          tblMaintLog: {
            include: {
              tblComponentUnit: true,
              tblMaintType: true,
              tblMaintCause: true,
              tblMaintClass: true,
            },
          },
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
        },
      });

      // Fetch maintLog if exists
      let maintLog = null;
      if (failureReport.maintLogId) {
        maintLog = await tblMaintLog.getById(failureReport.maintLogId, {
          include: {
            tblMaintClass: true,
            tblMaintCause: true,
            tblMaintType: true,
          },
        });
      }

      reset({
        component: failureReport.tblComponentUnit ?? null,
        title: failureReport.title ?? "",
        // requestNo: failureReport.requestNo ?? null,
        failureSeverity: failureReport.tblFailureSeverityLevel ?? null,
        failureStatus: failureReport.tblFailureStatus ?? null,
        failureGroupFollow: failureReport.tblFailureGroupFollow ?? null,
        failureDesc: failureReport.failureDesc ?? null,
        followDesc: failureReport.followDesc ?? null,
        failureDateTime: failureReport.failureDateTime
          ? new Date(failureReport.failureDateTime)
          : new Date(),
        nextFollowDate: failureReport.nextFollowDate
          ? new Date(failureReport.nextFollowDate)
          : null,
        maintClass: maintLog?.tblMaintClass ?? null,
        maintCause: maintLog?.tblMaintCause ?? null,
        maintType: maintLog?.tblMaintType ?? null,
      });

      // Update atom
      setFailureReportAtom({
        maintLog: maintLog,
        failureReport: failureReport,
      });

      titleTouchedRef.current = true;
    } finally {
      setLoading(false);
    }
  }, [mode, failureReportId, reset, setFailureReportAtom]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        const maintLogBody: any = {
          compId: v.component?.compId,
          dateDone: v.failureDateTime,
          history: v.failureDesc,
          loggedBy: user?.userId,
          downTime: null, // Will be calculated later
          deptId: null,
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
        const failureReportBody: any = {
          title: v.title,
          failureDesc: v.failureDesc,
          followDesc: v.followDesc,
          failureDateTime: v.failureDateTime,
          failureReportDate: now,
          waitDateTime: now,
          nextFollowDate: v.nextFollowDate,
          failureNumber: failureNumber,
          requestNo: v.requestNo,
          reportedUserId: user?.userId,
          discId: userDiscipline?.discId,
          deptId: null,
          ...buildRelation("tblComponentUnit", "compId", v.component?.compId),
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

        // Add locationId from component
        if (v.component?.tblLocation?.locationId) {
          failureReportBody.locationId = v.component.tblLocation.locationId;
        }

        let createdMaintLog;
        let createdFailureReport;

        if (mode === "create") {
          // Create maintLog first
          createdMaintLog = await tblMaintLog.create(maintLogBody);

          // Create failureReport with maintLogId
          createdFailureReport = await tblFailureReports.create({
            ...failureReportBody,
            maintLogId: createdMaintLog.maintLogId,
          });

          // Update atom with created data
          setFailureReportAtom({
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
          } else {
            // Create new maintLog if doesn't exist
            createdMaintLog = await tblMaintLog.create(maintLogBody);
            failureReportBody.maintLogId = createdMaintLog.maintLogId;
          }

          // Update failureReport
          await tblFailureReports.update(failureReportId!, failureReportBody);

          // Refresh data
          await fetchData();
        }
      } catch (error) {
        console.error("Error saving failure report:", error);
      }
    },
    [
      mode,
      failureReportId,
      user,
      userDiscipline,
      setFailureReportAtom,
      fetchData,
    ],
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      display="flex"
      flexDirection="column"
      gap={1.5}
      p={2}
    >
      {/* Title & Basic Info */}
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
              helperText={errors.title?.message}
              onChange={(e) => {
                titleTouchedRef.current = true;
                field.onChange(e);
              }}
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
                label="Request No"
                value={field.value ?? ""}
                fullWidth
                size="small"
                disabled={isDisabled}
                error={!!errors.requestNo}
                helperText={errors.requestNo?.message}
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
                helperText={errors.failureDateTime?.message}
              />
            )}
          />
        </Box>
      </Box>

      {/* User Info */}
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
        <Box flex={1.5} display="flex" gap={1.5}>
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
                helperText={errors.component?.message}
              />
            )}
          />
          <TextField
            label="Serial No"
            value={component?.serialNo ?? ""}
            fullWidth
            disabled
            size="small"
          />
          <TextField
            label="Location"
            value={component?.tblLocation?.name ?? ""}
            fullWidth
            disabled
            size="small"
          />
        </Box>
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
                label="Severity"
                request={tblFailureSeverityLevel.getAll}
                extractRows={(data) => data.rows}
                getOptionKey={(r) => r.failureSeverityLevelId}
                getOptionLabel={(r) => r.name ?? ""}
                onChange={field.onChange}
                value={field.value}
                disabled={isDisabled}
                error={!!errors.failureSeverity}
                helperText={errors.failureSeverity?.message}
              />
            )}
          />
          <Controller
            name="failureStatus"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelect
                label="Status"
                request={tblFailureStatus.getAll}
                getOptionKey={(r) => r.failureStatusId}
                getOptionLabel={(r) => r.name ?? ""}
                onChange={field.onChange}
                value={field.value}
                disabled={isDisabled}
                error={!!errors.failureStatus}
                helperText={errors.failureStatus?.message}
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
                  extractRows={(data) => data.rows}
                  getOptionKey={(r) => r.failureGroupFollowId}
                  getOptionLabel={(r) => r.name ?? ""}
                  onChange={field.onChange}
                  value={field.value}
                  disabled={isDisabled}
                  error={!!errors.failureGroupFollow}
                  helperText={errors.failureGroupFollow?.message}
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
                  helperText={errors.nextFollowDate?.message}
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

        {/* Column 3: Additional Info */}
        <Box display="flex" gap={1.5} flexDirection="column">
          <TextField
            label="Total Wait"
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

      {/* Descriptions */}
      <Controller
        name="failureDesc"
        control={control}
        render={({ field }) => (
          <Editor
            {...field}
            label="Description"
            containerStyle={{ height: 200 }}
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
            containerStyle={{ height: 200 }}
            onChange={field.onChange}
            disabled={isDisabled}
          />
        )}
      />

      {/* Save Button */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}

export default memo(StepGeneral);
