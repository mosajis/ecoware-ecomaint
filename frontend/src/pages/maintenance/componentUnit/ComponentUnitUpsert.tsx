import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import NumberField from "@/shared/components/NumberField";
import { memo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectField } from "@/shared/components/AsyncSelectField";
import { buildRelation } from "@/core/helper";
import { DEFAULT_VALUES, schema, SchemaValue } from "./ComponentUnitSchema";
import {
  tblAddress,
  tblComponentUnit,
  tblCompStatus,
  tblCompType,
  tblLocation,
  TypeTblAddress,
  TypeTblCompStatus,
} from "@/core/api/generated/api";
import { logicTblComponentUnit } from "./ComponentUnitEffect";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

function ComponentUnitUpsert({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const user = useAtomValue(atomUser);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<SchemaValue>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  const fetchData = useCallback(async () => {
    if (mode !== "update" || !recordId) {
      reset(DEFAULT_VALUES);
      return;
    }

    setLoading(true);
    try {
      const res = await tblComponentUnit.getById(recordId, {
        include: {
          tblCompType: true,
          tblLocation: true,
          tblCompStatus: true,
          tblComponentUnit: true,
          tblAddress: true,
        },
      });

      reset({
        compType: res.tblCompType
          ? {
              compTypeId: res.tblCompType.compTypeId,
              compName: res.tblCompType.compName,
            }
          : null,
        location: res.tblLocation
          ? {
              locationId: res.tblLocation.locationId,
              name: res.tblLocation.name,
            }
          : null,
        //@ts-ignore
        parentComp: res.tblComponentUnit
          ? {
              compId: res.tblComponentUnit?.compId,
              compNo: res.tblComponentUnit?.compNo ?? null,
            }
          : null,
        status: res.tblCompStatus
          ? {
              compStatusId: res.tblCompStatus.compStatusId,
              compStatusName: res.tblCompStatus.compStatusName,
            }
          : null,

        vendor: res.tblAddress
          ? {
              addressId: res.tblAddress.addressId,
              name: res.tblAddress.name,
            }
          : null,
        compNo: res.compNo ?? "",
        serialNo: res.serialNo ?? null,
        assetNo: res.assetNo ?? null,
        model: res.model ?? null,
        comment1: res.comment1 ?? null,
        comment2: res.comment2 ?? null,
        comment3: res.comment3 ?? null,
        isCritical: !!res.isCritical,
        orderNo: res.orderNo ?? null,
      });
    } finally {
      setLoading(false);
    }
  }, [mode, recordId, reset]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleFormSubmit = useCallback(
    async (values: SchemaValue) => {
      const parsed = schema.safeParse(values);
      if (!parsed.success) return;

      const v = parsed.data;

      try {
        setSubmitting(true);

        const body = {
          compNo: v.compNo,
          serialNo: v.serialNo ?? null,
          assetNo: v.assetNo ?? null,
          comment1: v.comment1 ?? null,
          comment2: v.comment2 ?? null,
          comment3: v.comment3 ?? null,
          model: v.model ?? null,
          isCritical: v.isCritical ? 1 : 0,
          orderNo: v.orderNo ?? null,
          ...buildRelation("tblCompType", "compTypeId", v.compType?.compTypeId),
          ...buildRelation("tblLocation", "locationId", v.location?.locationId),
          ...buildRelation(
            "tblCompStatus",
            "compStatusId",
            v.status?.compStatusId,
          ),
          ...buildRelation("tblAddress", "addressId", v.vendor?.addressId),
          ...buildRelation("tblComponentUnit", "compId", v.parentComp?.compId),
        };

        if (mode === "create") {
          const result = await tblComponentUnit.create(body);
          await logicTblComponentUnit.effect(
            result.compId,
            user?.userId as number,
          );
        } else {
          await tblComponentUnit.update(recordId!, body);
        }

        // onSuccess()
        // onClose()
      } finally {
        setSubmitting(false);
      }
    },
    [mode, recordId, onSuccess, onClose],
  );
  const isDisabled = loading || submitting;

  return (
    <FormDialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New Component Unit" : "Edit Component Unit"}
      submitting={submitting}
      loadingInitial={loading}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Box display="flex" flexDirection="column" gap={1.5}>
        <Box display={"flex"} gap={1.5}>
          {/* Component No */}
          <Controller
            name="compNo"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Component No"
                size="small"
                sx={{ width: "85%" }}
                disabled={isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {/* Is Critical */}
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

        {/* Component Type */}
        <Controller
          name="compType"
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              label="Type"
              getOptionLabel={(row) => row.compName}
              value={field.value}
              selectionMode="single"
              request={tblCompType.getAll}
              columns={[{ field: "compName", headerName: "Name", flex: 1 }]}
              getRowId={(row) => row.compTypeId}
              onChange={field.onChange}
            />
          )}
        />

        <Box display={"grid"} gridTemplateColumns={"3fr 1fr"} gap={1.5}>
          {/* Location */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <AsyncSelectField
                label="Location"
                getOptionLabel={(row) => row.name}
                value={field.value}
                selectionMode="single"
                request={tblLocation.getAll}
                columns={[{ field: "name", headerName: "Name", flex: 1 }]}
                getRowId={(row) => row.locationId}
                onChange={field.onChange}
              />
            )}
          />
          {/* Component Type */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <AsyncSelectField<TypeTblCompStatus>
                label="Status"
                value={field.value}
                selectionMode="single"
                request={tblCompStatus.getAll}
                columns={[
                  { field: "compStatusName", headerName: "Status", flex: 1 },
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
              label="Model / Type"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />
        {/* Serial No */}
        <Box display={"flex"} gap={1.5}>
          <Controller
            name="serialNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Serial No"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />

          {/* Asset No */}
          <Controller
            name="assetNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Asset No"
                size="small"
                fullWidth
                disabled={isDisabled}
              />
            )}
          />
        </Box>

        {/* Component Type */}
        <Controller
          name="vendor"
          control={control}
          render={({ field }) => (
            <AsyncSelectField<TypeTblAddress>
              label="Maker"
              value={field.value}
              selectionMode="single"
              request={tblAddress.getAll}
              columns={[{ field: "name", headerName: "Name", flex: 1 }]}
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
              label="Comment 1"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        {/* Comment2 */}
        <Controller
          name="comment2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Comment 2"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        {/* Comment3 */}
        <Controller
          name="comment3"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Comment 3"
              size="small"
              fullWidth
              disabled={isDisabled}
            />
          )}
        />

        {/* Parent Component */}
        <Controller
          name="parentComp"
          control={control}
          render={({ field, fieldState }) => (
            <AsyncSelectField
              label="Parent"
              getOptionLabel={(row) => row.compNo ?? ""}
              value={field.value}
              selectionMode="single"
              request={tblComponentUnit.getAll}
              columns={[
                { field: "compNo", headerName: "Comp No", flex: 1 },
                { field: "compName", headerName: "Name", flex: 1 },
              ]}
              getRowId={(row) => row.compId}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        {/* Order No */}
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
