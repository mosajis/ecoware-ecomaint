import * as z from "zod";
import AsyncSelect from "@/shared/components/AsyncSelect";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  tblAddress,
  tblDiscipline,
  tblEmployee,
  TypeTblAddress,
  TypeTblEmployee,
} from "@/core/api/generated/api";
import { buildRelation } from "@/core/api/helper";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";

// === Validation Schema ===
export const schema = z.object({
  code: z.string().nullable(),
  lastName: z.string().min(1, "Last Name is required").nullable(),
  firstName: z.string().min(1, "First Name is required").nullable(),

  address: z
    .object({
      addressId: z.number(),
      name: z.string(),
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
      hrsAvailWeek: null,
    }),
    []
  );

  const { control, handleSubmit, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data ===
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

            address: res.tblAddress
              ? {
                  addressId: res.tblAddress.addressId,
                  name: res.tblAddress.name ?? "",
                }
              : null,

            discipline: res.tblDiscipline
              ? {
                  id: res.tblDiscipline.discId,
                  label: res.tblDiscipline.name ?? "",
                }
              : null,

            hrsAvailWeek: res.available ?? null,
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

  // === Submit Handler ===
  const handleFormSubmit = useCallback(
    async (values: EmployeeFormValues) => {
      setSubmitting(true);

      try {
        const payload = {
          code: values.code ?? null,
          lastName: values.lastName ?? "",
          firstName: values.firstName ?? "",
          available: values.hrsAvailWeek ?? 0,

          // ⭐⭐⭐ Relation Mapping — Clean & Reusable
          ...buildRelation(
            "tblAddress",
            "addressId",
            values.address?.addressId ?? null
          ),
          ...buildRelation(
            "tblDiscipline",
            "discId",
            values.discipline?.id ?? null
          ),
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
      <Box display="flex" flexDirection={"column"} gap={1}>
        {/* Code (70%) */}
        <Controller
          name="code"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              sx={{ width: "70%" }}
              label="Code"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              disabled={isDisabled}
            />
          )}
        />

        <Box display={"flex"} gap={1}>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                sx={{ flex: "1" }}
                label="Last Name *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                size="small"
                disabled={isDisabled}
              />
            )}
          />

          {/* First Name (50%) */}
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                sx={{ flex: "1" }}
                label="First Name *"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                size="small"
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        {/* Address (70%) */}
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              dialogMaxWidth="sm"
              label="Address"
              selectionMode="single"
              value={field.value}
              request={tblAddress.getAll}
              columns={[{ field: "name", headerName: "Address", flex: 1 }]}
              getRowId={(row) => row.addressId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        {/* Discipline (30%) */}
        <AsyncSelect
          name="discipline"
          control={control}
          label="Discipline"
          disabled={isDisabled}
          apiCall={() => tblDiscipline.getAll().then((res) => res.items)}
          mapper={(d) => ({
            id: d.discId!,
            label: d.name ?? "",
          })}
        />

        <Controller
          name="hrsAvailWeek"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ width: "50%" }}
              label="Hrs Avail Week"
              type="number"
              size="small"
              disabled={isDisabled}
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
