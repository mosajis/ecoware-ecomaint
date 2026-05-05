import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo } from "react";
import { Controller } from "react-hook-form";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";
import { useUpsertForm } from "@/shared/hooks/useUpsertForm";

// === Schema ===
const schema = z.object({
  code: requiredStringField(),
  name: requiredStringField(),
  address1: z.string().nullable(),
  address2: z.string().nullable(),
  phone: z.string().nullable(),
  eMail: z.string().nullable(),
  contact: z.string().nullable(),
  orderNo: z.number().nullable(),
});

type AddressFormValues = z.infer<typeof schema>;

const defaultValues: AddressFormValues = {
  code: "",
  name: "",
  address1: "",
  address2: "",
  phone: "",
  eMail: "",
  contact: "",
  orderNo: null,
};

function AddressUpsert({
  entityName,
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UpsertProps<TypeTblAddress>) {
  const {
    form,
    loadingInitial,
    submitting,
    isDisabled,
    readonly,
    title,
    handleFormSubmit,
  } = useUpsertForm<AddressFormValues, TypeTblAddress>({
    entityName,
    open,
    mode,
    recordId,
    schema,
    defaultValues,

    onFetch: async (id) => {
      const res = await tblAddress.getById(id);
      return {
        code: res.code ?? "",
        name: res.name ?? "",
        address1: res.address1 ?? "",
        address2: res.address2 ?? "",
        phone: res.phone ?? "",
        eMail: res.eMail ?? "",
        contact: res.contact ?? "",
        orderNo: res.orderNo ?? null,
      };
    },

    onCreate: tblAddress.create,
    onUpdate: tblAddress.update,
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
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1.5}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Code *"
              size="small"
              error={!!errors.code}
              helperText={errors.code?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name *"
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="address1"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address 1"
              size="small"
              error={!!errors.address1}
              helperText={errors.address1?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="address2"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address 2"
              size="small"
              error={!!errors.address2}
              helperText={errors.address2?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 4" }}
            />
          )}
        />

        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contact Person"
              size="small"
              error={!!errors.contact}
              helperText={errors.contact?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone"
              size="small"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />

        <Controller
          name="eMail"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              size="small"
              error={!!errors.eMail}
              helperText={errors.eMail?.message}
              disabled={isDisabled}
              sx={{ gridColumn: "span 2" }}
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
              sx={{ gridColumn: "span 2" }}
            />
          )}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(AddressUpsert);
