import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller } from "react-hook-form";
import { memo, useEffect } from "react";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

import {
  tblFailureReport,
  tblComponentUnit,
  tblFailureSeverityLevel,
  tblFailureStatus,
  tblFailureGroupFollow,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
  TypeTblFailureReport,
  TypeTblComponentUnit,
  TypeTblEmployee,
  TypeTblFailureGroupFollow,
  tblLocation,
} from "@/core/api/generated/api";

import {
  SchemaValue,
  schema,
  DEFAULT_VALUES,
} from "./FailureReportUpsertSchema";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import { useAtomValue } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import { Divider } from "@mui/material";
import { extractFullName } from "@/core/helper";
import { createFailureReport, updateFailureReport } from "@/core/api/api";

function FailureReportUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compId, // ✅ NEW
}: UpsertProps<any> & { compId?: number }) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);
  const userEmployee = user?.tblEmployee as TypeTblEmployee;

  const buildBodies = (v: SchemaValue) => {
    const now = new Date();

    return {
      maintLog: {
        compId: v.component?.compId,
        dateDone: v.failureDateTime,
        history: v.failureDesc,
        downTime: v.downTime,
        reportedDate: now,

        tblDiscipline: userDiscipline?.discId
          ? { connect: { discId: userDiscipline.discId } }
          : undefined,

        tblComponentUnit: v.component?.compId
          ? { connect: { compId: v.component.compId } }
          : undefined,

        tblEmployeeTblMaintLogReportedByTotblEmployee: userEmployee?.employeeId
          ? { connect: { employeeId: userEmployee.employeeId } }
          : undefined,

        tblMaintClass: v.maintClass?.maintClassId
          ? { connect: { maintClassId: v.maintClass.maintClassId } }
          : undefined,

        tblMaintCause: v.maintCause?.maintCauseId
          ? { connect: { maintCauseId: v.maintCause.maintCauseId } }
          : undefined,

        tblMaintType: v.maintType?.maintTypeId
          ? { connect: { maintTypeId: v.maintType.maintTypeId } }
          : undefined,
      },

      failureReport: {
        title: v.title,
        requestNo: v.requestNo,
        followDesc: v.followDesc,
        nextFollowDate: v.nextFollowDate,

        tblLocation: v.location?.locationId
          ? {
              connect: { locationId: v.location.locationId },
            }
          : undefined,
        tblFailureSeverityLevel: v.failureSeverity?.failureSeverityLevelId
          ? {
              connect: {
                failureSeverityLevelId:
                  v.failureSeverity.failureSeverityLevelId,
              },
            }
          : undefined,

        tblFailureStatus: v.failureStatus?.failureStatusId
          ? { connect: { failureStatusId: v.failureStatus.failureStatusId } }
          : undefined,

        tblFailureGroupFollow: v.failureGroupFollow?.failureGroupFollowId
          ? {
              connect: {
                failureGroupFollowId: v.failureGroupFollow.failureGroupFollowId,
              },
            }
          : undefined,
      },
    };
  };

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    title,
    handleFormSubmit,
    readonly,
  } = useUpsertForm<SchemaValue, TypeTblFailureReport>({
    onClose,
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues: DEFAULT_VALUES,

    onFetch: async (id) => {
      const failureReport = await tblFailureReport.getById(id, {
        include: {
          tblMaintLog: {
            include: {
              tblComponentUnit: true,
              tblMaintType: true,
              tblMaintCause: true,
              tblMaintClass: true,
            },
          },
          tblLocation: true,
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
        },
      });

      const maintLog = failureReport.tblMaintLog;

      return {
        title: failureReport.title || "",
        requestNo: failureReport.requestNo || "",

        failureDateTime: maintLog?.dateDone
          ? new Date(maintLog.dateDone)
          : new Date(),

        downTime: maintLog?.downTime ?? 0,
        component: maintLog?.tblComponentUnit ?? null,

        failureNumber: failureReport.failureNumber,
        failureSeverity: failureReport.tblFailureSeverityLevel ?? null,
        failureStatus: failureReport.tblFailureStatus ?? null,
        failureGroupFollow: failureReport.tblFailureGroupFollow ?? null,

        failureDesc: maintLog?.history ?? "",
        followDesc: failureReport.followDesc ?? "",
        nextFollowDate: failureReport.nextFollowDate ?? null,

        location: failureReport.tblLocation ?? null,
        maintClass: maintLog?.tblMaintClass ?? null,
        maintCause: maintLog?.tblMaintCause ?? null,
        maintType: maintLog?.tblMaintType ?? null,
      };
    },

    onCreate: async (values) => {
      const { maintLog, failureReport } = buildBodies(values);

      return createFailureReport({
        maintLog: {
          ...maintLog,
          dateDone: values.failureDateTime.toString(),
          reportedDate: new Date().toString(),
        },
        failureReport,
      });
    },

    onUpdate: async (id, values) => {
      const { maintLog, failureReport } = buildBodies(values);

      return updateFailureReport(id, {
        maintLog: {
          ...maintLog,
          dateDone: values.failureDateTime.toString(),
          reportedDate: undefined,
        },
        failureReport,
      });
    },
  });

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const component = watch("component");

  const locationFromReport = watch("location");

  useEffect(() => {
    if (!locationFromReport && component?.tblLocation) {
      form.setValue("location", component.tblLocation);
    }
  }, [component?.compId]);

  const editedTitle = watch("title");

  useEffect(() => {
    if (component?.compNo) {
      const newTitle = `${component.compNo} - Failure Report`;

      if (!editedTitle || editedTitle.includes("- Failure Report")) {
        form.setValue("title", newTitle);
      }
    }
  }, [component?.compNo]);

  useEffect(() => {
    if (!open || !compId || mode !== "create") return;

    if (mode === "create" && compId) {
      tblComponentUnit
        .getById(compId, {
          include: {
            tblLocation: true,
          },
        })
        .then((res) => {
          if (res) {
            form.setValue("component", res);

            // sync location فقط اگر قبلاً set نشده
            if (!form.getValues("location") && res.tblLocation) {
              form.setValue("location", res.tblLocation);
            }
          }
        });
    }
  }, [compId, mode, open]);
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
      <Box display={"grid"} gridTemplateColumns={"2fr 3fr"} gap={1.5}>
        <Box display={"flex"} gap={1.5} flexDirection={"column"}>
          <Box display="flex" gap={1.5} flexDirection={"column"}>
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

            <Box display="grid" gap={1.5} gridTemplateColumns={"1fr 1fr"}>
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

              <Controller
                name="failureNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    value={field.value ?? ""}
                    label="Failure No"
                    fullWidth
                    size="small"
                    disabled={isDisabled}
                    slotProps={{ input: { readOnly: true } }}
                  />
                )}
              />

              <Controller
                name="downTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Down Time (Min)"
                    type="number"
                    fullWidth
                    disabled={isDisabled}
                    size="small"
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
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
                  />
                )}
              />
            </Box>
            <Divider flexItem />
          </Box>
          <Box display={"flex"} gap={1.5}>
            <TextField
              label="Reported By"
              disabled={isDisabled}
              value={extractFullName(user?.tblEmployee)}
              fullWidth
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              fullWidth
              label="Discipline"
              disabled={isDisabled}
              value={userDiscipline?.name ?? ""}
              size="small"
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>

          <Divider flexItem />

          {/* Row 2 */}
          <Box display="flex" flexDirection={"column"} gap={1.5}>
            <Controller
              name="component"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelectGrid<TypeTblComponentUnit>
                  key={compId}
                  label="Component *"
                  columns={[
                    { field: "compNo", headerName: "Comp No", flex: 1 },
                  ]}
                  request={() =>
                    tblComponentUnit.getAll({ include: { tblLocation: true } })
                  }
                  getRowId={(row) => row.compId}
                  getOptionLabel={(row) => row.compNo ?? ""}
                  onChange={field.onChange}
                  value={field.value}
                  disabled={isDisabled}
                  readOnly={mode === "update"}
                  error={!!errors.component}
                />
              )}
            />
            <TextField
              label="Function No"
              value={component?.functionId ?? ""}
              fullWidth
              size="small"
              disabled={isDisabled}
              slotProps={{ input: { readOnly: true } }}
            />
            <Box display={"grid"} gridTemplateColumns={"2fr 1fr"} gap={1.5}>
              <TextField
                label="Location"
                value={locationFromReport?.name || ""}
                fullWidth
                disabled={isDisabled}
                slotProps={{ input: { readOnly: true } }}
                size="small"
              />
              <TextField
                label="Serial No"
                value={component?.serialNo ?? ""}
                fullWidth
                disabled={isDisabled}
                slotProps={{ input: { readOnly: true } }}
                size="small"
              />
            </Box>
          </Box>

          {/* Row 4 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
            <Box display="flex" gap={1.5} flexDirection="column">
              <Divider flexItem />
              <Controller
                name="maintClass"
                control={control}
                render={({ field }) => (
                  <FieldAsyncSelectGrid
                    disabled={isDisabled}
                    label="Maint Class *"
                    value={field.value}
                    selectionMode="single"
                    request={tblMaintClass.getAll}
                    columns={[
                      { field: "descr", headerName: "Description", flex: 1 },
                    ]}
                    getRowId={(row) => row.maintClassId}
                    onChange={field.onChange}
                    error={!!errors.maintClass}
                  />
                )}
              />

              <Controller
                name="maintCause"
                control={control}
                render={({ field }) => (
                  <FieldAsyncSelectGrid
                    disabled={isDisabled}
                    label="Maint Cause *"
                    value={field.value}
                    selectionMode="single"
                    request={tblMaintCause.getAll}
                    columns={[
                      { field: "descr", headerName: "Description", flex: 1 },
                    ]}
                    getRowId={(row) => row.maintCauseId}
                    onChange={field.onChange}
                    error={!!errors.maintCause}
                  />
                )}
              />

              <Controller
                name="maintType"
                control={control}
                render={({ field }) => (
                  <FieldAsyncSelectGrid
                    disabled={isDisabled}
                    label="Maint Type *"
                    value={field.value}
                    selectionMode="single"
                    request={tblMaintType.getAll}
                    columns={[
                      { field: "descr", headerName: "Description", flex: 1 },
                    ]}
                    getRowId={(row) => row.maintTypeId}
                    onChange={field.onChange}
                    error={!!errors.maintType}
                  />
                )}
              />
            </Box>

            <Box display="flex" gap={1.5} flexDirection="column">
              <Divider flexItem />
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
            </Box>
          </Box>

          <Divider flexItem />

          <Box display={"flex"} gap={1.5}>
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
            <Controller
              name="failureGroupFollow"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelect<TypeTblFailureGroupFollow>
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
          </Box>
        </Box>

        {/* Row 5 */}
        <Box display="flex" gap={1.5} flexDirection={"column"} height="580px">
          <Controller
            name="failureDesc"
            control={control}
            render={({ field }) => (
              <Editor
                {...field}
                initValue={field.value}
                label="Description / Action / Cause"
                onChange={field.onChange}
                disabled={isDisabled}
                readOnly={readonly}
              />
            )}
          />

          <Controller
            name="followDesc"
            control={control}
            render={({ field }) => (
              <Editor
                {...field}
                initValue={field.value}
                label="Follow Description"
                onChange={field.onChange}
                disabled={isDisabled}
                readOnly={readonly}
              />
            )}
          />
        </Box>
      </Box>
    </FormDialog>
  );
}

export default memo(FailureReportUpsert);
