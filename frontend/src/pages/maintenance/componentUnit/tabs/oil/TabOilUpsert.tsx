import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import NumberField from "@/shared/components/fields/FieldNumber";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

import { buildRelation } from "@/core/helper";
import { type UpsertProps } from "@/core/helper.types";

import {
  tblCompOilInfo,
  tblComponentUnit,
  tblEmployee,
  tblInstallation,
  tblCompCounter,
  tblSpareType,
  tblCompJob,
  TypeTblCompOilInfo,
} from "@/core/api/generated/api";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { memo } from "react";
import { Controller } from "react-hook-form";

import { DEFAULT_VALUES, schema, SchemaValue } from "./TabOilSchema";

type Props = UpsertProps;

function TabOilUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
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
          tblComponentUnit: true,
          tblCompCounter: true,
          tblSpareType: true,
          tblCompJob: true,
          tblEmployee: true,
          tblInstallation: true,
        },
      });

      return {
        component: res.tblComponentUnit ?? null,
        compCounter: res.tblCompCounter ?? null,
        spareType: res.tblSpareType ?? null,
        compJob: res.tblCompJob ?? null,
        employee: res.tblEmployee ?? null,
        installation: res.tblInstallation ?? null,

        tankCapacity: res.tankCapacity ?? null,
        laboratoryCode: res.laboratoryCode ?? "",
        samplingPosition: res.samplingPosition ?? "",
        oilGrade: res.oilGrade ?? "",
        orderNo: res.orderNo ?? null,
      };
    },

    onCreate: async (values) => {
      const body = {
        tankCapacity: values.tankCapacity ?? null,
        laboratoryCode: values.laboratoryCode ?? null,
        samplingPosition: values.samplingPosition ?? null,
        oilGrade: values.oilGrade ?? null,
        orderNo: values.orderNo ?? null,

        ...buildRelation("tblComponentUnit", "compId", values.component),
        ...buildRelation("tblCompCounter", "compCounterId", values.compCounter),
        ...buildRelation("tblSpareType", "spareTypeId", values.spareType),
        ...buildRelation("tblCompJob", "compJobId", values.compJob),
        ...buildRelation("tblEmployee", "employeeId", values.employee),
        ...buildRelation("tblInstallation", "instId", values.installation),
      };

      return tblCompOilInfo.create(body);
    },

    onUpdate: async (id, values) => {
      const body = {
        tankCapacity: values.tankCapacity ?? null,
        laboratoryCode: values.laboratoryCode ?? null,
        samplingPosition: values.samplingPosition ?? null,
        oilGrade: values.oilGrade ?? null,
        orderNo: values.orderNo ?? null,

        ...buildRelation("tblComponentUnit", "compId", values.component),
        ...buildRelation("tblCompCounter", "compCounterId", values.compCounter),
        ...buildRelation("tblSpareType", "spareTypeId", values.spareType),
        ...buildRelation("tblCompJob", "compJobId", values.compJob),
        ...buildRelation("tblEmployee", "employeeId", values.employee),
        ...buildRelation("tblInstallation", "instId", values.installation),
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
            name="component"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Component"
                disabled={isDisabled}
                value={field.value}
                selectionMode="single"
                request={tblComponentUnit.getAll}
                getOptionLabel={(row) => row.compNo ?? ""}
                getRowId={(row) => row.compId}
                onChange={field.onChange}
                columns={[
                  {
                    field: "compNo",
                    headerName: "Component No",
                    flex: 1,
                  },
                  {
                    field: "model",
                    headerName: "Model",
                    flex: 1,
                  },
                ]}
              />
            )}
          />

          <Controller
            name="compCounter"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Component Counter"
                disabled={isDisabled}
                value={field.value}
                selectionMode="single"
                request={tblCompCounter.getAll}
                getOptionLabel={(row) => row.counterName ?? ""}
                getRowId={(row) => row.compCounterId}
                onChange={field.onChange}
                columns={[
                  {
                    field: "counterName",
                    headerName: "Name",
                    flex: 1,
                  },
                ]}
              />
            )}
          />
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5}>
          <Controller
            name="spareType"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Spare Type"
                disabled={isDisabled}
                value={field.value}
                selectionMode="single"
                request={tblSpareType.getAll}
                getOptionLabel={(row) => row.spareTypeName ?? ""}
                getRowId={(row) => row.spareTypeId}
                onChange={field.onChange}
                columns={[
                  {
                    field: "spareTypeName",
                    headerName: "Name",
                    flex: 1,
                  },
                ]}
              />
            )}
          />

          <Controller
            name="compJob"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Component Job"
                disabled={isDisabled}
                value={field.value}
                selectionMode="single"
                request={tblCompJob.getAll}
                getOptionLabel={(row) => row.jobName ?? ""}
                getRowId={(row) => row.compJobId}
                onChange={field.onChange}
                columns={[
                  {
                    field: "jobName",
                    headerName: "Name",
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
          name="oilGrade"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label="Oil Grade"
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
