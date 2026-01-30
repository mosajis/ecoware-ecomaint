import * as z from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FieldNumber from "@/shared/components/fields/FieldNumber";
import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tblAddress, TypeTblAddress } from "@/core/api/generated/api";
import { requiredStringField } from "@/core/helper";

// === Validation Schema with Zod ===
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

export type AddressFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess?: (data: TypeTblAddress) => void;
};

function AddressUpsert({ open, mode, recordId, onClose, onSuccess }: Props) {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: AddressFormValues = useMemo(
    () => ({
      code: "",
      name: "",
      address1: "",
      address2: "",
      phone: "",
      eMail: "",
      contact: "",
      orderNo: null,
    }),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // === Fetch initial data
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblAddress.getById(recordId);
        if (res) {
          reset({
            code: res.code ?? "",
            name: res.name ?? "",
            address1: res.address1 ?? "",
            address2: res.address2 ?? "",
            phone: res.phone ?? "",
            eMail: res.eMail ?? "",
            contact: res.contact ?? "",
            orderNo: res.orderNo,
          });
        }
      } catch (err) {
        console.error("Failed to load address", err);
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

  // === Form submit handler
  const handleFormSubmit = useCallback(
    async (values: AddressFormValues) => {
      setSubmitting(true);
      try {
        let result: TypeTblAddress | undefined;
        if (mode === "create") {
          result = await tblAddress.create(values);
        } else if (mode === "update" && recordId) {
          result = await tblAddress.update(recordId, values);
        }

        if (result) {
          onSuccess?.(result);
          onClose();
        }
      } catch (err) {
        console.error("Failed to submit address form", err);
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
      title={mode === "create" ? "Create Address" : "Edit Address"}
      submitting={submitting}
      loadingInitial={loadingInitial}
      onSubmit={handleSubmit(handleFormSubmit)}
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
