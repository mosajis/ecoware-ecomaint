import * as z from "zod";

import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { memo } from "react";
import { Controller } from "react-hook-form";

import {
  tblDiscipline,
  tblEmployee,
  TypeTblDiscipline,
  TypeTblEmployee,
} from "@/core/api/generated/api";
import { buildRelation, requiredStringField } from "@/core/helper";
import AsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

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
}: UpsertProps) {
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
        ...buildRelation("tblDiscipline", "discId", data.discipline),
      });
    },

    onUpdate: async (id, data) => {
      return tblEmployee.update(id, {
        code: data.code,
        lastName: data.lastName,
        firstName: data.firstName,
        ...buildRelation("tblDiscipline", "discId", data.discipline),
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
              data-cy="employee-code-input"
              label="Code *"
              size="small"
              sx={{ width: "70%" }}
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isDisabled}
              slotProps={{
                formHelperText: { "data-cy": "employee-code-error" },
              }}
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
                data-cy="employee-lastName-input"
                label="Last Name *"
                size="small"
                sx={{ flex: 1 }}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                disabled={isDisabled}
                slotProps={{
                  formHelperText: { "data-cy": "employee-lastName-error" },
                }}
              />
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                data-cy="employee-firstName-input"
                label="First Name *"
                size="small"
                sx={{ flex: 1 }}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                disabled={isDisabled}
                slotProps={{
                  formHelperText: { "data-cy": "employee-firstName-error" },
                }}
              />
            )}
          />
        </Box>

        <Controller
          name="discipline"
          control={control}
          render={({ field }) => (
            <AsyncSelect<TypeTblDiscipline>
              dataCy="employee-discipline-input"
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
