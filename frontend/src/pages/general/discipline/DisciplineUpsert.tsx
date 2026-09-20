import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { memo } from "react";
import { Controller } from "react-hook-form";

import { tblDiscipline, TypeTblDiscipline } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  name: requiredStringField(),
  orderNo: z.number().nullable(),
});

export type DisciplineFormValues = z.infer<typeof schema>;

const defaultValues: DisciplineFormValues = {
  name: "",
  orderNo: null,
};

function DisciplineUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<DisciplineFormValues, TypeTblDiscipline>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblDiscipline.getById(id);

      return {
        name: res?.name ?? "",
        orderNo: res?.orderNo ?? null,
      };
    },

    onCreate: tblDiscipline.create,
    onUpdate: tblDiscipline.update,

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
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              data-cy="discipline-name-input"
              label="Name *"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isDisabled}
              fullWidth
              slotProps={{
                formHelperText: { "data-cy": "discipline-name-error" },
              }}
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
              sx={{ width: "30%" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(DisciplineUpsert);
