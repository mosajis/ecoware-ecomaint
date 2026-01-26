import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Editor from "@/shared/components/Editor";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { schema, DEFAULT_VALUES, SchemaValue } from "./ReportFailureSchema";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import {
  tblFailureReports,
  tblComponentUnit,
  tblFailureSeverityLevel,
  tblFailureStatus,
  tblFailureGroupFollow,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function FailureReportUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const titleTouchedRef = useRef(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<SchemaValue>({
      resolver: zodResolver(schema),
      defaultValues: DEFAULT_VALUES,
    });

  const component = watch("component");

  /** auto set title from compNo (only once) */
  useEffect(() => {
    if (!component || titleTouchedRef.current) return;
    if (component.compNo) {
      setValue("title", component.compNo);
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
          tblComponentUnit: true,
          tblFailureSeverityLevel: true,
          tblFailureStatus: true,
          tblFailureGroupFollow: true,
        },
      });

      reset({
        component: res.tblComponentUnit
          ? {
              compId: res.tblComponentUnit.compId,
              compNo: res.tblComponentUnit.compNo ?? null,
            }
          : null,

        title: res.title ?? null,

        failureSeverity: res.tblFailureSeverityLevel
          ? {
              failureSeverityLevelId:
                res.tblFailureSeverityLevel.failureSeverityLevelId,
              name: res.tblFailureSeverityLevel.name,
            }
          : null,

        failureStatus: res.tblFailureStatus
          ? {
              failureStatusId: res.tblFailureStatus.failureStatusId,
              name: res.tblFailureStatus.name,
            }
          : null,

        failureGroupFollow: res.tblFailureGroupFollow
          ? {
              failureGroupFollowId:
                res.tblFailureGroupFollow.failureGroupFollowId,
              name: res.tblFailureGroupFollow.name,
            }
          : null,

        failureDesc: res.failureDesc ?? null,
        actionDesc: res.actionDesc ?? null,
        followDesc: res.followDesc ?? null,
        failureDateTime: res.failureDateTime
          ? new Date(res.failureDateTime)
          : null,
        nextFollowDate: res.nextFollowDate
          ? new Date(res.nextFollowDate)
          : null,
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
        setSubmitting(true);

        const body = {
          title: v.title,
          failureDesc: v.failureDesc,
          actionDesc: v.actionDesc,
          followDesc: v.followDesc,
          failureDateTime: v.failureDateTime,
          nextFollowDate: v.nextFollowDate,
          reportedUserId: user?.userId,

          ...buildRelation("tblComponentUnit", "compId", v.component?.compId),
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
        setSubmitting(false);
      }
    },
    [mode, recordId, user, onClose, onSuccess],
  );

  const isDisabled = loading || submitting;

  return (
    <FormDialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Failure Report" : "Edit Failure Report"}
      submitting={submitting}
      loadingInitial={loading}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        {/* Component */}
        <Controller
          name="component"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Component"
              value={field.value}
              selectionMode="single"
              request={tblComponentUnit.getAll}
              columns={[{ field: "compNo", headerName: "Comp No", flex: 1 }]}
              getRowId={(row) => row.compId}
              getOptionLabel={(row) => row.compNo ?? ""}
              onChange={field.onChange}
            />
          )}
        />

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              size="small"
              fullWidth
              disabled={isDisabled}
              onChange={(e) => {
                titleTouchedRef.current = true;
                field.onChange(e);
              }}
            />
          )}
        />

        {/* Status / Severity */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Controller
            name="failureStatus"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                columns={[]}
                label="Status"
                value={field.value}
                selectionMode="single"
                request={tblFailureStatus.getAll}
                getRowId={(r) => r.failureStatusId}
                getOptionLabel={(r) => r.name}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="failureSeverity"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                columns={[]}
                label="Severity"
                value={field.value}
                selectionMode="single"
                request={tblFailureSeverityLevel.getAll}
                getRowId={(r) => r.failureSeverityLevelId}
                getOptionLabel={(r) => r.name}
                onChange={field.onChange}
              />
            )}
          />
        </Box>

        {/* Group Follow */}
        <Controller
          name="failureGroupFollow"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              columns={[]}
              label="Follow Group"
              value={field.value}
              selectionMode="single"
              request={tblFailureGroupFollow.getAll}
              getRowId={(r) => r.failureGroupFollowId}
              getOptionLabel={(r) => r.name}
              onChange={field.onChange}
            />
          )}
        />

        {/* Editors */}
        <Controller
          name="failureDesc"
          control={control}
          render={({ field }) => (
            <Editor
              label="Failure Description"
              value={field.value ?? ""}
              onChange={field.onChange}
              autoSave={false}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="actionDesc"
          control={control}
          render={({ field }) => (
            <Editor
              label="Action Description"
              value={field.value ?? ""}
              onChange={field.onChange}
              autoSave={false}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="followDesc"
          control={control}
          render={({ field }) => (
            <Editor
              label="Follow Description"
              value={field.value ?? ""}
              onChange={field.onChange}
              autoSave={false}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(FailureReportUpsert);
