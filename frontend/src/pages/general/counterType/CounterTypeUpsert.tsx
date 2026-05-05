import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import NumberField from "@/shared/components/fields/FieldNumber";

import { memo } from "react";
import { Controller } from "react-hook-form";

import { tblCounterType, TypeTblCounterType } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  code: requiredStringField(),
  name: requiredStringField(),
  type: z.number(),
  orderNo: z.number().nullable(),
});

export type CounterTypeFormValues = z.infer<typeof schema>;

const defaultValues: CounterTypeFormValues = {
  code: "",
  name: "",
  type: 0,
  orderNo: null,
};

function CounterTypeUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblCounterType>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<CounterTypeFormValues, TypeTblCounterType>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblCounterType.getById(id);

      return {
        code: res?.code ?? "",
        name: res?.name ?? "",
        type: res?.type ?? 0,
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: tblCounterType.create,
    onUpdate: tblCounterType.update,

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
              sx={{ width: "70%" }}
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

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Type *"
              size="small"
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              error={!!errors.type}
              helperText={errors.type?.message}
              disabled={isDisabled}
              sx={{ width: "50%" }}
            >
              <MenuItem value={3}>Measure</MenuItem>
              <MenuItem value={0}>Counter</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(CounterTypeUpsert);
