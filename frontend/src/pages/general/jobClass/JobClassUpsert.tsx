import * as z from "zod";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo } from "react";
import { Controller } from "react-hook-form";
import { tblJobClass, TypeTblJobClass } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  code: requiredStringField(),
  name: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type JobClassFormValues = z.infer<typeof schema>;

// === Default values ===
const defaultValues: JobClassFormValues = {
  code: "",
  name: "",
  orderNo: null,
};

function JobClassUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblJobClass>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<JobClassFormValues, TypeTblJobClass>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblJobClass.getById(id);

      return {
        code: res?.code ?? "",
        name: res?.name ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: tblJobClass.create,
    onUpdate: tblJobClass.update,

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
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code *"
              size="small"
              sx={{ width: "50%" }}
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
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
              sx={{ width: "50%" }}
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

export default memo(JobClassUpsert);
