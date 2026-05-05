import * as z from "zod";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import NumberField from "@/shared/components/fields/FieldNumber";

import { memo } from "react";
import { Controller } from "react-hook-form";

import { tblMaintCause, TypeTblMaintCause } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  description: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type MaintCauseFormValues = z.infer<typeof schema>;

const defaultValues: MaintCauseFormValues = {
  description: "",
  orderNo: null,
};

function MaintCauseUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblMaintCause>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<MaintCauseFormValues, TypeTblMaintCause>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblMaintCause.getById(id);

      return {
        description: res?.descr ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: (data) =>
      tblMaintCause.create({
        descr: data.description,
        orderNo: data.orderNo,
      }),

    onUpdate: (id, data) =>
      tblMaintCause.update(id, {
        descr: data.description,
        orderNo: data.orderNo,
      }),

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
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description *"
              size="small"
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
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

export default memo(MaintCauseUpsert);
