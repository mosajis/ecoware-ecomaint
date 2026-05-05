import * as z from "zod";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";

import { memo } from "react";
import { Controller } from "react-hook-form";

import { tblJobTrigger, TypeTblJobTrigger } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  descr: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  descr: "",
  orderNo: null,
};

function JobTriggerUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblJobTrigger>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<FormValues, TypeTblJobTrigger>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblJobTrigger.getById(id);

      return {
        descr: res?.descr ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: tblJobTrigger.create,
    onUpdate: tblJobTrigger.update,

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
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Controller
          name="descr"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description *"
              size="small"
              error={!!errors.descr}
              helperText={errors.descr?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <FieldNumber
              {...field}
              label="Order No"
              size="small"
              error={!!errors.orderNo}
              helperText={errors.orderNo?.message}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(JobTriggerUpsert);
