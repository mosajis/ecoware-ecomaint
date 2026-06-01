import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import NumberField from "@/shared/components/fields/FieldNumber";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";

import { memo } from "react";
import { Controller } from "react-hook-form";
import { useAtomValue } from "jotai";

import { buildRelation } from "@/core/helper";
import { atomUser } from "@/pages/auth/auth.atom";
import { effectTblComponentUnit } from "@/core/api/apiEffects";

import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

import {
  tblAddress,
  tblComponentUnit,
  tblCompStatus,
  tblCompType,
  tblLocation,
  TypeTblAddress,
  TypeTblCompStatus,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

import { DEFAULT_VALUES, schema, SchemaValue } from "./ComponentUnitSchema";

type Props = UpsertProps;

function ComponentUnitUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);

  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<SchemaValue, TypeTblComponentUnit>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues: DEFAULT_VALUES,

    onFetch: async (id) => {
      const res = await tblComponentUnit.getById(id, {
        include: {
          tblCompType: true,
          tblLocation: true,
          tblCompStatus: true,
          tblComponentUnit: true,
          tblAddress: true,
        },
      });

      return {
        compType: res.tblCompType,
        location: res.tblLocation,
        parentComp: res.tblComponentUnit,
        status: res.tblCompStatus,
        vendor: res.tblAddress,
        compNo: res.compNo ?? "",
        serialNo: res.serialNo ?? "",
        assetNo: res.assetNo ?? "",
        model: res.model ?? "",
        comment1: res.comment1 ?? "",
        comment2: res.comment2 ?? "",
        comment3: res.comment3 ?? "",
        isCritical: !!res.isCritical,
        orderNo: res.orderNo ?? null,
      };
    },

    onCreate: async (values) => {
      const compStatusId = 1;

      const body = {
        compNo: values.compNo,
        serialNo: values.serialNo ?? null,
        assetNo: values.assetNo ?? null,
        comment1: values.comment1 ?? null,
        comment2: values.comment2 ?? null,
        comment3: values.comment3 ?? null,
        model: values.model ?? null,
        isCritical: values.isCritical ? 1 : 0,
        orderNo: values.orderNo ?? null,

        ...buildRelation("tblCompType", "compTypeId", values.compType),
        ...buildRelation("tblLocation", "locationId", values.location),
        ...buildRelation("tblCompStatus", "compStatusId", { compStatusId }),
        ...buildRelation("tblAddress", "addressId", values.vendor),
        ...buildRelation("tblComponentUnit", "compId", values.parentComp),
      };

      const result = await tblComponentUnit.create(body);

      await effectTblComponentUnit(result.compId, user?.userId as number);

      return result;
    },

    onUpdate: async (id, values) => {
      const compStatusId = values.status?.compStatusId ?? 1;
      const body = {
        compNo: values.compNo,
        serialNo: values.serialNo ?? null,
        assetNo: values.assetNo ?? null,
        comment1: values.comment1 ?? null,
        comment2: values.comment2 ?? null,
        comment3: values.comment3 ?? null,
        model: values.model ?? null,
        isCritical: values.isCritical ? 1 : 0,
        orderNo: values.orderNo ?? null,

        ...buildRelation("tblCompType", "compTypeId", values.compType),
        ...buildRelation("tblLocation", "locationId", values.location),
        ...buildRelation("tblCompStatus", "compStatusId", { compStatusId }),
        ...buildRelation("tblAddress", "addressId", values.vendor),
        ...buildRelation("tblComponentUnit", "compId", values.parentComp),
      };

      return tblComponentUnit.update(id, body);
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
      maxWidth="sm"
      open={open}
      onClose={onClose}
      title={title}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleFormSubmit}
      readonly={readonly}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display="flex" gap={1.5}>
          <Controller
            name="compNo"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Component No *"
                size="small"
                sx={{ width: "85%" }}
                disabled={isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="isCritical"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                sx={{ margin: 0 }}
                control={
                  <Checkbox
                    {...field}
                    checked={field.value ?? false}
                    disabled={isDisabled}
                  />
                }
                label="Critical"
              />
            )}
          />
        </Box>

        <Controller
          name="compType"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Type *"
              disabled={isDisabled}
              getOptionLabel={(row) => row.compName}
              value={field.value}
              selectionMode="single"
              request={tblCompType.getAll}
              columns={[
                {
                  field: "compName",
                  headerName: "Name",
                  flex: 1,
                },
              ]}
              getRowId={(row) => row.compTypeId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Box display="grid" gridTemplateColumns="3fr 1fr" gap={1.5}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid
                label="Location"
                disabled={isDisabled}
                getOptionLabel={(row) => row.name}
                value={field.value}
                selectionMode="single"
                request={tblLocation.getAll}
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    flex: 1,
                  },
                ]}
                getRowId={(row) => row.locationId}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FieldAsyncSelectGrid<TypeTblCompStatus>
                label="Status"
                value={field.value}
                disabled={isDisabled || mode === "create"}
                selectionMode="single"
                request={tblCompStatus.getAll}
                columns={[
                  {
                    field: "compStatusName",
                    headerName: "Status",
                    flex: 1,
                  },
                ]}
                onChange={field.onChange}
                getOptionLabel={(row) => row.compStatusName}
                getRowId={(row) => row.compStatusId}
              />
            )}
          />
        </Box>

        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              label="Model / Type"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        <Box display="flex" gap={1.5}>
          <Controller
            name="serialNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="Serial No"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />

          <Controller
            name="assetNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ""}
                label="Asset No"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        <Controller
          name="vendor"
          control={control}
          render={({ field }) => (
            <FieldAsyncSelectGrid<TypeTblAddress>
              label="Maker"
              value={field.value}
              disabled={isDisabled}
              selectionMode="single"
              request={tblAddress.getAll}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                },
              ]}
              onChange={field.onChange}
              getOptionLabel={(row) => row.name}
              getRowId={(row) => row.addressId}
            />
          )}
        />

        <Controller
          name="comment1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              label="Comment 1"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="comment2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              label="Comment 2"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="comment3"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value || ""}
              label="Comment 3"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        <Controller
          name="parentComp"
          control={control}
          render={({ field, fieldState }) => (
            <FieldAsyncSelectGrid
              label="Parent"
              getOptionLabel={(row) => row.compNo ?? ""}
              disabled={isDisabled}
              value={field.value}
              selectionMode="single"
              request={tblComponentUnit.getAll}
              columns={[
                {
                  field: "compNo",
                  headerName: "Comp No",
                  flex: 1,
                },
              ]}
              getRowId={(row) => row.compId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
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

export default memo(ComponentUnitUpsert);
