import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import NumberField from "@/shared/components/fields/FieldNumber";

import { memo } from "react";
import { Controller } from "react-hook-form";

import { tblPendingType, TypeTblPendingType } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  pendTypeName: requiredStringField(),
  description: z.string().nullable(),
  orderNo: z.number().nullable(),
});

export type PendingTypeFormValues = z.infer<typeof schema>;

const defaultValues: PendingTypeFormValues = {
  pendTypeName: "",
  description: "",
  orderNo: null,
};

function PendingTypeUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblPendingType>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<PendingTypeFormValues, TypeTblPendingType>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblPendingType.getById(id);

      return {
        pendTypeName: res?.pendTypeName ?? "",
        description: res?.description ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: tblPendingType.create,
    onUpdate: tblPendingType.update,

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
        {/* Name */}
        <Controller
          name="pendTypeName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.pendTypeName}
              helperText={errors.pendTypeName?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              size="small"
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 3" }}
            />
          )}
        />

        {/* Order No */}
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
              sx={{ gridColumn: "span 1" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(PendingTypeUpsert);
