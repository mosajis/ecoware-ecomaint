import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Editor from "@/shared/components/Editor";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import FieldAsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { schema, DEFAULT_VALUES, SchemaValue } from "./ReportFailureSchema";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser, atomUserDiscipline } from "@/pages/auth/auth.atom";
import {
  tblFailureReports,
  tblComponentUnit,
  tblFailureSeverityLevel,
  tblFailureStatus,
  tblFailureGroupFollow,
  tblLocation,
  TypeTblComponentUnit,
  TypeTblLocation,
  tblMaintClass,
  tblMaintCause,
  tblMaintType,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  compId?: number;
  onClose: () => void;
  onSuccess: () => void;
};

function FailureReportUpsert({
  open,
  mode,
  recordId,
  compId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);
  const userDiscipline = useAtomValue(atomUserDiscipline);

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

  // maint class maint cause maint Type از جدول tblMaintLog خوانده میشه یا نوشته میشه.
  // total wait هم داخل maintLog ذخیره میشه.
  // createdBy داخل maintLog ذخیره میشه
  // failure No
  // description داخل histoy توی tblMaintLog
  //
  useEffect(() => {
    if (!compId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await tblComponentUnit.getById(compId, {
          include: { tblLocation: true },
        });
        setValue("component", res as any);
        if (res.tblLocation) {
          setValue("location", res.tblLocation);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [compId, setValue]);

  useEffect(() => {
    if (!component || titleTouchedRef.current) return;
    if (component.compNo) {
      setValue("title", `${component.compNo} - Failure Report`);
    }
    if (component.tblLocation) {
      setValue("location", component.tblLocation);
    }
  }, [component, setValue]);

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(DEFAULT_VALUES);
      titleTouchedRef.current = false;
      return;
    }
    setLoading(true);
    try {
      const res = await tblFailureReports.getById(recordId, {
        include: {
          tblComponentUnit: { include: { tblLocation: true } },
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
          tblLocation: true,
        },
      });
      reset({
        component: res.tblComponentUnit ?? null,
        // location: res.tblLocation ?? null,
        title: res.title ?? null,
        failureSeverity: res.tblFailureSeverityLevel ?? null,
        failureStatus: res.tblFailureStatus ?? null,
        failureGroupFollow: res.tblFailureGroupFollow ?? null,
        failureDesc: res.failureDesc ?? null,
        actionDesc: res.actionDesc ?? null,
        followDesc: res.followDesc ?? null,
        failureDateTime: res.failureDateTime
          ? new Date(res.failureDateTime)
          : new Date(),
        nextFollowDate: res.nextFollowDate
          ? new Date(res.nextFollowDate)
          : null,
        totalWait: res.totalWait ?? null,
        // requestNo: res.requestNo ?? null,
        // closeDate: res.closeDate ? new Date(res.closeDate) : null,
        reportedBy: null,
        discipline: null,
      });
      titleTouchedRef.current = true;
    } finally {
      setLoading(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleFormSubmit = useCallback(
    async (values: SchemaValue) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const v = parsed.data;
      try {
        const body: any = {
          title: v.title,
          failureDesc: v.failureDesc,
          actionDesc: v.actionDesc,
          followDesc: v.followDesc,
          failureDateTime: v.failureDateTime,
          nextFollowDate: v.nextFollowDate,
          closeDate: v.closeDate,
          totalWait: v.totalWait,
          requestNo: v.requestNo,
          reportedUserId: user?.userId,
          ...buildRelation("tblComponentUnit", "compId", v.component?.compId),
          ...buildRelation("tblLocation", "locationId", v.location?.locationId),
          ...buildRelation(
            "tblFailureSeverityLevel",
            "failureSeverityLevelId",
            v.failureSeverity?.failureSeverityLevelId,
          ),
          ...buildRelation(
            "tblFailureStatus",
            "failureStatusId",
            v.failureStatus?.failureStatusId,
          ),
          ...buildRelation(
            "tblFailureGroupFollow",
            "failureGroupFollowId",
            v.failureGroupFollow?.failureGroupFollowId,
          ),
        };

        if (mode === "create") {
          await tblFailureReports.create(body);
        } else {
          await tblFailureReports.update(recordId!, body);
        }
        onSuccess();
        onClose();
      } finally {
      }
    },
    [mode, recordId, user, onClose, onSuccess],
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(handleFormSubmit)}
      title={
        mode === "create" ? "Create Failure Report" : "Update Failure Report"
      }
      loadingInitial={loading}
      submitting={isSubmitting}
      maxWidth="lg"
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display={"flex"} gap={1.5}>
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
          <Box display={"flex"} gap={1.5} flex={1}>
            <Controller
              name="requestNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Failiure No"
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
                  label="Failure Date Time"
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
            value={user?.uName ?? ""}
            fullWidth
            size="small"
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </Box>

        {/* Row 1: Component & Serial No */}
        <Box display="flex" gap={1.5}>
          <Box flex={1.5} display={"flex"} gap={1.5}>
            <Controller
              name="component"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelectGrid<TypeTblComponentUnit>
                  label="Component"
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
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <FieldAsyncSelectGrid<TypeTblLocation>
                  columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                  getRowId={(row) => row.locationId}
                  label="Location"
                  request={tblLocation.getAll}
                  getOptionLabel={(row) => row.name ?? ""}
                  onChange={field.onChange}
                  value={field.value}
                  disabled={isDisabled}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />
          </Box>
        </Box>

        {/* Row 4: Status, Severity & Total Wait */}
        <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} gap={1.5}>
          <Box display="flex" gap={1.5} flexDirection={"column"}>
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
            <Box display={"flex"} gap={1.5}>
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

          <Box display={"flex"} gap={1.5} flexDirection={"column"}>
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

          {/* Row 7: Dates */}
          <Box display="flex" gap={1.5} flexDirection={"column"}>
            <TextField
              label="Total Wait"
              value={component?.serialNo ?? ""}
              fullWidth
              disabled
              size="small"
            />
            <TextField
              label="Request No"
              value={component?.serialNo ?? ""}
              fullWidth
              disabled
              size="small"
            />
            {/* fieldAsyncSelctGrid tblWorkShopjob.getAll */}
            <TextField
              label="WorkShop No"
              value={component?.serialNo ?? ""}
              fullWidth
              disabled
              size="small"
            />
          </Box>
        </Box>

        {/* Editors */}
        <Box display={"flex"} gridTemplateColumns={"1fr 1fr"} gap={1.5}>
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
        </Box>
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
      </Box>
    </FormDialog>
  );
}

export default memo(FailureReportUpsert);
