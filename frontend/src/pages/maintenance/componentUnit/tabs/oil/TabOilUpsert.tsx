import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import NumberField from "@/shared/components/fields/FieldNumber";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

import { buildRelation } from "@/core/helper";
import { type UpsertProps } from "@/core/helper.types";

import {
  tblCompOilInfo,
  tblEmployee,
  tblInstallation,
  TypeTblCompOilInfo,
} from "@/core/api/generated/api";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { memo } from "react";
import { Controller } from "react-hook-form";

import { DEFAULT_VALUES, schema, SchemaValue } from "./TabOilSchema";

type Props = UpsertProps & {
  compId?: number;
};

function TabOilUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
  compId,
}: Props) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<SchemaValue, TypeTblCompOilInfo>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues: DEFAULT_VALUES,

    onFetch: async (id) => {
      const res = await tblCompOilInfo.getById(id, {
        include: {
          tblEmployee: true,
        },
      });

      return {
        employee: res.tblEmployee ?? null,
        installation: res.tblInstallation ?? null,

        tankCapacity: res.tankCapacity ?? null,
        laboratoryCode: res.laboratoryCode ?? "",
        samplingPosition: res.samplingPosition ?? "",
        oilDesc: res.oilDesc ?? "",
        orderNo: res.orderNo ?? null,
      };
    },

    onCreate: async (values) => {
      const body = {
        compId,

        tankCapacity: values.tankCapacity ?? null,
        laboratoryCode: values.laboratoryCode ?? null,
        samplingPosition: values.samplingPosition ?? null,
        oilDesc: values.oilDesc ?? null,
        orderNo: values.orderNo ?? null,
        // ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation("tblEmployee", "employeeId", values.employee),
      };

      return tblCompOilInfo.create(body);
    },

    onUpdate: async (id, values) => {
      const body = {
        tankCapacity: values.tankCapacity ?? null,
        laboratoryCode: values.laboratoryCode ?? null,
        samplingPosition: values.samplingPosition ?? null,
        oilDesc: values.oilDesc ?? null,
        orderNo: values.orderNo ?? null,
        // ...buildRelation("tblComponentUnit", "compId", compId),
        ...buildRelation("tblEmployee", "employeeId", values.employee),
      };

      return tblCompOilInfo.update(id, body);
    },

    onSuccess,
    onClose,
  });

  const { control } = form;

  return (
    <FormDialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Controller
            name="employee"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Employee"
                disabled={isDisabled}
                value={field.value}
                selectionMode="single"
                request={tblEmployee.getAll}
                getOptionLabel={(row) =>
                  `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim()
                }
                getRowId={(row) => row.employeeId}
                onChange={field.onChange}
                columns={[
                  {
                    field: "firstName",
                    headerName: "First Name",
                    flex: 1,
                  },
                  {
                    field: "lastName",
                    headerName: "Last Name",
                    flex: 1,
                  },
                ]}
              />
            )}
          />
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Controller
            name="tankCapacity"
            control={control}
            render={({ field }) => (
              <NumberField
                {...field}
                label="Tank Capacity"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="laboratoryCode"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Laboratory Code"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        <Controller
          name="samplingPosition"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label="Sampling Position"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="oilDesc"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label="Oil Description"
              size="small"
              fullWidth
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
              sx={{ width: "35%" }}
              disabled={isDisabled}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(TabOilUpsert);
