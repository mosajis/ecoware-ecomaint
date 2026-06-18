import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import FormDialog from "@/shared/components/formDialog/FormDialog";
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
  TypeTblDiscipline,
} from "@/core/api/generated/api";

import {
  SchemaValue,
  schema,
  DEFAULT_VALUES,
} from "./FailureReportUpsertSchema";

import { useAtomValue } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import { extractFullName } from "@/core/helper";
import { createFailureReport, updateFailureReport } from "@/core/api/api";

function FailureReportUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compId,
}: UpsertProps & { compId?: number }) {
  // ─── Atoms (logged-in user context) ───────────────────────────────────────
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);
  const userEmployee = user?.tblEmployee as TypeTblEmployee;

  // ─── Build API request bodies ──────────────────────────────────────────────
  const buildBodies = (v: SchemaValue) => {
    return {
      maintLog: {
        compId: v.component?.compId,
        dateDone: v.failureDateTime,
        history: v.failureDesc,
        downTime: v.downTime,
        reportedDate: new Date(),

        // tblDiscipline → discId در TblMaintLog
        tblDiscipline: v.discipline?.discId
          ? { connect: { discId: v.discipline.discId } }
          : undefined,

        tblComponentUnit: v.component?.compId
          ? { connect: { compId: v.component.compId } }
          : undefined,

        // tblEmployee → reportedBy در TblMaintLog
        tblEmployee: v.employee?.employeeId
          ? { connect: { employeeId: v.employee.employeeId } }
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
          ? { connect: { locationId: v.location.locationId } }
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

  // ─── Upsert form hook ──────────────────────────────────────────────────────
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
              // tblEmployee → reportedBy در TblMaintLog (یه relation داره)
              tblEmployee: true,
              // tblDiscipline → discId در TblMaintLog
              tblDiscipline: true,
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
        title: failureReport.title ?? "",
        requestNo: failureReport.requestNo ?? "",

        failureDateTime: maintLog?.dateDone
          ? new Date(maintLog.dateDone)
          : new Date(),

        downTime: maintLog?.downTime ?? 0,
        failureNumber: failureReport.failureNumber,

        // در edit mode از رکورد fetch‌شده می‌خونه
        employee: (maintLog?.tblEmployee as TypeTblEmployee) ?? null,
        discipline: (maintLog?.tblDiscipline as TypeTblDiscipline) ?? null,

        component: maintLog?.tblComponentUnit ?? null,
        location: failureReport.tblLocation ?? null,

        failureSeverity: failureReport.tblFailureSeverityLevel ?? null,
        failureStatus: failureReport.tblFailureStatus ?? null,
        failureGroupFollow: failureReport.tblFailureGroupFollow ?? null,

        maintClass: maintLog?.tblMaintClass ?? null,
        maintCause: maintLog?.tblMaintCause ?? null,
        maintType: maintLog?.tblMaintType ?? null,

        failureDesc: maintLog?.history ?? "",
        followDesc: failureReport.followDesc ?? "",
        nextFollowDate: failureReport.nextFollowDate ?? null,
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

    onSuccess,
  });

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  // ─── Watched fields ────────────────────────────────────────────────────────
  const component = watch("component");
  const locationFromReport = watch("location");
  const editedTitle = watch("title");
  const watchedEmployee = watch("employee");
  const watchedDiscipline = watch("discipline");

  // ─── Display values: atom در create، fetched record در edit/view ───────────
  const displayEmployee =
    mode === "create"
      ? extractFullName(userEmployee)
      : extractFullName(watchedEmployee);

  const displayDiscipline =
    mode === "create"
      ? (userDiscipline?.name ?? "")
      : (watchedDiscipline?.name ?? "");

  // ─── در create mode: مقادیر atom رو داخل فرم seed کن ────────────────────
  useEffect(() => {
    if (!open || mode !== "create") return;
    if (userEmployee) form.setValue("employee", userEmployee);
    if (userDiscipline)
      form.setValue("discipline", userDiscipline as TypeTblDiscipline);
  }, [open, mode]);

  // ─── Auto-fill location از component ──────────────────────────────────────
  useEffect(() => {
    if (!locationFromReport && component?.tblLocation) {
      form.setValue("location", component.tblLocation);
    }
  }, [component?.compId]);

  // ─── Auto-fill title از component number ──────────────────────────────────
  useEffect(() => {
    if (component?.compNo) {
      const newTitle = `${component.compNo} - Failure Report`;
      if (!editedTitle || editedTitle.includes("- Failure Report")) {
        form.setValue("title", newTitle);
      }
    }
  }, [component?.compNo]);

  // ─── Pre-select component وقتی از صفحه component باز میشه ────────────────
  useEffect(() => {
    if (!open || !compId || mode !== "create") return;

    tblComponentUnit
      .getById(compId, { include: { tblLocation: true } })
      .then((res) => {
        if (!res) return;
        form.setValue("component", res);
        if (!form.getValues("location") && res.tblLocation) {
          form.setValue("location", res.tblLocation);
        }
      });
  }, [compId, mode, open]);

  // ─── Render ────────────────────────────────────────────────────────────────
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
      <Box display="grid" gridTemplateColumns="2fr 3fr" gap={1.5}>
        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <Box display="flex" gap={1.5} flexDirection="column">
          {/* Title + basic fields */}
          <Box display="flex" gap={1.5} flexDirection="column">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title *"
                  value={field.value ?? ""}
                  fullWidth
                  size="small"
                  disabled={isDisabled}
                  error={!!errors.title}
                />
              )}
            />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
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
                  <FieldNumber
                    {...field}
                    label="Down Time (Min)"
                    fullWidth
                    disabled={isDisabled}
                    size="small"
                    value={field.value ?? 0}
                    onChange={field.onChange}
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

          {/* Reported By & Discipline — read-only, منبع بسته به mode */}
          <Box display="flex" gap={1.5}>
            <TextField
              label="Reported By"
              value={displayEmployee}
              fullWidth
              size="small"
              disabled={isDisabled}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label="Discipline"
              value={displayDiscipline}
              fullWidth
              size="small"
              disabled={isDisabled}
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>

          <Divider flexItem />

          {/* Component + derived read-only fields */}
          <Box display="flex" flexDirection="column" gap={1.5}>
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

            <Box display="grid" gridTemplateColumns="2fr 1fr" gap={1.5}>
              <TextField
                label="Location"
                value={locationFromReport?.name ?? ""}
                fullWidth
                size="small"
                disabled={isDisabled}
                slotProps={{ input: { readOnly: true } }}
              />
              <TextField
                label="Serial No"
                value={component?.serialNo ?? ""}
                fullWidth
                size="small"
                disabled={isDisabled}
                slotProps={{ input: { readOnly: true } }}
              />
            </Box>
          </Box>

          {/* Maint fields + Status/Severity */}
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

          {/* Follow date & group */}
          <Box display="flex" gap={1.5}>
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

        {/* ── Right Column: rich-text editors ─────────────────────────────── */}
        <Box display="flex" gap={1.5} flexDirection="column" height="580px">
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
