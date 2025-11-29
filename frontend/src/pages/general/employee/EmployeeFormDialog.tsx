import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import {
  tblAddress,
  tblDiscipline,
  tblEmployee,
  TypeTblEmployee,
} from "@/core/api/generated/api";
import AsyncSelect from "@/shared/components/AsyncSelect";

// === Validation Schema ===
export const schema = z.object({
  code: z.string().nullable(),
  lastName: z.string().min(1, "Last Name is required").nullable(),
  firstName: z.string().min(1, "First Name is required").nullable(),
  address: z
    .object({
      id: z.number(),
      label: z.string(),
    })
    .nullable(),
  discipline: z
    .object({
      id: z.number(),
      label: z.string(),
    })
    .nullable(),

  hrsAvailWeek: z.number().nullable(),
});

export type EmployeeFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblEmployee) => void;
};

function EmployeeFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: EmployeeFormValues = useMemo(
    () => ({
      code: "",
      lastName: "",
      firstName: "",
      address: null,
      discipline: null,
      position: null,
      hrsAvailWeek: null,
    }),
    []
  );

  const { control, handleSubmit, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data for edit
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblEmployee.getById(recordId, {
          include: {
            tblDiscipline: true,
            tblAddress: true,
          },
        });
        if (res) {
          reset({
            code: res.code ?? "",
            lastName: res.lastName ?? "",
            firstName: res.firstName ?? "",
            address: res.address
              ? { id: res.address.id, label: res.address.label }
              : null,
            discipline: res.discipline
              ? { id: res.discipline.id!, label: res.discipline.name ?? "" }
              : null,
            hrsAvailWeek: res.hrsAvailWeek ?? null,
          });
        }
      } finally {
        setLoadingInitial(false);
      }
    } else {
      reset(defaultValues);
    }
  }, [mode, recordId, reset, defaultValues]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const isDisabled = loadingInitial || submitting;

  // === Submit handler
  const handleFormSubmit = useCallback(
    async (values: EmployeeFormValues) => {
      setSubmitting(true);
      try {
        // Map object fields to ids for API
        const payload = {
          ...values,
          addressId: values.address?.id ?? null,
          disciplineId: values.discipline?.id ?? null,
          positionId: values.position?.id ?? null,
        };

        let result: TypeTblEmployee;

        if (mode === "create") {
          result = await tblEmployee.create(payload);
        } else if (mode === "update" && recordId) {
          result = await tblEmployee.update(recordId, payload);
        } else {
          return;
        }

        onSuccess(result);
        onClose();
      } catch (err) {
        console.error("Submit failed", err);
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose]
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Create Employee" : "Edit Employee"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Code"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Last Name *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="First Name *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <AsyncSelect
          name="discipline"
          control={control}
          label="Discipline"
          disabled={isDisabled}
          apiCall={() => tblDiscipline.getAll().then((res) => res.items)}
          mapper={(d) => ({ id: d.discId!, label: d.name ?? "" })}
          sx={{ gridColumn: "span 2" }}
        />

        <Controller
          name="hrsAvailWeek"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Hrs Avail Week"
              type="number"
              size="small"
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? null : Number(e.target.value)
                )
              }
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(EmployeeFormDialog);
