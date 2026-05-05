import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import { memo } from "react";
import { Controller } from "react-hook-form";

import {
  tblEmployee,
  TypeTblEmployee,
  tblDiscipline,
  TypeTblDiscipline,
} from "@/core/api/generated/api";
import { buildRelation, requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";
import AsyncSelect from "@/shared/components/fields/FieldAsyncSelect";

// === Schema ===
const schema = z.object({
  code: requiredStringField(),
  lastName: requiredStringField(),
  firstName: requiredStringField(),

  discipline: z
    .object({
      discId: z.number(),
      name: z.string().optional().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Discipline is required",
    }),
});

export type EmployeeFormValues = z.input<typeof schema>;

const defaultValues: EmployeeFormValues = {
  code: "",
  lastName: "",
  firstName: "",
  discipline: null,
};

function EmployeeUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblEmployee>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<EmployeeFormValues, TypeTblEmployee>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblEmployee.getById(id, {
        include: { tblDiscipline: true },
      });

      return {
        code: res?.code ?? "",
        lastName: res?.lastName ?? "",
        firstName: res?.firstName ?? "",
        discipline: res?.tblDiscipline
          ? {
              discId: res.tblDiscipline.discId,
              name: res.tblDiscipline.name ?? "",
            }
          : null,
      };
    },

    onCreate: async (data) => {
      return tblEmployee.create({
        code: data.code,
        lastName: data.lastName,
        firstName: data.firstName,
        ...buildRelation("tblDiscipline", "discId", data.discipline?.discId),
      });
    },

    onUpdate: async (id, data) => {
      return tblEmployee.update(id, {
        code: data.code,
        lastName: data.lastName,
        firstName: data.firstName,
        ...buildRelation("tblDiscipline", "discId", data.discipline?.discId),
      });
    },

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
      <Box display="flex" flexDirection="column" gap={1}>
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

        <Box display="flex" gap={1}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name *"
                size="small"
                sx={{ flex: 1 }}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name *"
                size="small"
                sx={{ flex: 1 }}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        <Controller
          name="discipline"
          control={control}
          render={({ field }) => (
            <AsyncSelect<TypeTblDiscipline>
              label="Discipline *"
              disabled={isDisabled}
              error={!!errors.discipline}
              helperText={errors.discipline?.message}
              request={tblDiscipline.getAll}
              getOptionLabel={(r) => r.name || ""}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(EmployeeUpsert);
