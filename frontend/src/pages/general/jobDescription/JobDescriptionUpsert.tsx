import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

import { memo } from "react";
import { Controller } from "react-hook-form";

import {
  tblJobDescription,
  tblJobClass,
  TypeTblJobDescription,
} from "@/core/api/generated/api";

import { buildRelation } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import { useAtomValue } from "jotai";
import { atomRig } from "@/shared/atoms/general.atom";

// === Schema ===
const schema = z.object({
  jobDescCode: z.string().nullable().optional(),
  jobDescTitle: z.string().min(1),
  jobClassId: z
    .object({
      jobClassId: z.number(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  changeReason: z.string().nullable().optional(),
});

export type JobDescriptionFormValues = z.infer<typeof schema>;

const defaultValues: JobDescriptionFormValues = {
  jobDescCode: "",
  jobDescTitle: "",
  jobClassId: null,
  changeReason: "",
};

function JobDescriptionUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblJobDescription>) {
  const rig = useAtomValue(atomRig);
  const rigId = rig?.instId as number;

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<JobDescriptionFormValues, TypeTblJobDescription>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblJobDescription.getById(id, {
        include: { tblJobClass: true },
      });

      return {
        jobDescCode: res?.jobDescCode ?? "",
        jobDescTitle: res?.jobDescTitle ?? "",
        jobClassId: res?.tblJobClass
          ? {
              jobClassId: res.tblJobClass.jobClassId,
              name: res.tblJobClass.name,
            }
          : null,
        changeReason: res?.changeReason ?? "",
      };
    },

    onCreate: tblJobDescription.create,
    onUpdate: tblJobDescription.update,

    onSuccess,
    onClose,
  });

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={1.5}>
        <Controller
          name="jobDescCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code"
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="jobDescTitle"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Job Title *"
              size="small"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="jobClassId"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              disabled={isDisabled}
              label="Job Class"
              selectionMode="single"
              value={field.value}
              request={tblJobClass.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.jobClassId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              dialogMaxWidth="sm"
            />
          )}
        />

        <Controller
          name="changeReason"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Change Reason"
              size="small"
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobDescriptionUpsert);
