import * as z from "zod";
import AsyncSelect from "@/shared/components/fields/FieldAsyncSelect";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildRelation, requiredStringField } from "@/core/helper";
import {
  tblAddress,
  tblDiscipline,
  tblEmployee,
  TypeTblAddress,
  TypeTblDiscipline,
  TypeTblEmployee,
} from "@/core/api/generated/api";

// === Validation Schema ===
export const schema = z.object({
  code: requiredStringField(),
  lastName: requiredStringField(),
  firstName: requiredStringField(),

  address: z
    .object({
      addressId: z.number(),
      name: z.string(),
    })
    .nullable(),

  discipline: z
    .object({
      discId: z.number(),
      name: z.string().optional().nullable(),
    })
    .nullable()
    .refine((val) => val !== null, {
      message: "Discipline is required",
    }),

  orderNo: z.number().nullable(),
});

export type EmployeeFormValues = z.input<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: TypeTblEmployee) => void;
};

function EmployeeUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: EmployeeFormValues = useMemo(
    () => ({
      code: "",
      lastName: "",
      firstName: "",
      address: null,
      orderNo: null,
      discipline: null,
    }),
    [],
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
                  discId: res.tblDiscipline.discId,
                  name: res.tblDiscipline.name ?? "",
                }
              : null,

            orderNo: res.orderNo ?? null,
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
          orderNo: values.orderNo,

          // Relation
          ...buildRelation(
            "tblAddress",
            "addressId",
            values.address?.addressId,
          ),
          ...buildRelation(
            "tblDiscipline",
            "discId",
            values.discipline?.discId,
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
    [mode, recordId, onSuccess, onClose],
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
              label="Code *"
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
            <FieldAsyncSelectGrid<TypeTblAddress>
              disabled={isDisabled}
              label="Address"
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
        <Controller
          name="discipline"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelect<TypeTblDiscipline>
              label="Discipline *"
              disabled={isDisabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              request={tblDiscipline.getAll}
              getOptionLabel={(row) => row.name || ""}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="orderNo"
          control={control}
          render={({ field }) => (
            <NumberField
              {...field}
              sx={{ width: "50%" }}
              label="Order No"
              size="small"
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(EmployeeUpsert);
