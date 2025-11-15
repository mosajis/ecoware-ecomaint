import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, TextField } from "@mui/material";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { tblAddress } from "@/core/api/generated/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// === Validation Schema ===
const schema = z.object({
  name: z.string().min(1, "Name is required").nullable(),
  address1: z.string().optional().nullable(),
  address2: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  eMail: z.string().email("Invalid email").or(z.literal("")).nullable(),
  code: z.string(),
  contact: z.string().optional().nullable(),
});

export type AddressFormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "update";
  recordId?: number | null;
  onClose: () => void;
  onSuccess: (data: any) => void;
};

function AddressFormDialog({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const [loadingInitial, setLoadingInitial] = useState(false);

  // ✅ useMemo برای جلوگیری از بازسازی defaultValues در هر رندر
  const defaultValues = useMemo(
    () => ({
      name: "",
      address1: "",
      address2: "",
      phone: "",
      eMail: "",
      code: "",
      contact: "",
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // ✅ Mutation‌ها memo شوند تا در هر رندر دوباره ساخته نشن
  const createMutation = useMutation({
    mutationFn: (formData: AddressFormValues) => tblAddress.create(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
      onSuccess(data);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: number;
      formData: AddressFormValues;
    }) => tblAddress.update(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
      onSuccess(data);
      onClose();
    },
  });

  // ✅ useCallback برای جلوگیری از رندرهای اضافی هنگام fetchData
  const fetchData = useCallback(async () => {
    if (mode === "update" && recordId) {
      setLoadingInitial(true);
      try {
        const res = await tblAddress.getById(recordId);
        if (res) {
          // فقط فیلدهای مرتبط با فرم رو reset کن
          reset({
            name: res.name ?? "",
            address1: res.address1 ?? "",
            address2: res.address2 ?? "",
            phone: res.phone ?? "",
            eMail: res.eMail ?? "",
            contact: res.contact ?? "",
            code: res.code ?? "",
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

  // === Fetch only when dialog opens ===
  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const submitting = createMutation.isPending || updateMutation.isPending;
  const isDisabled = loadingInitial || submitting;

  const handleFormSubmit = useCallback(
    (values: AddressFormValues) => {
      if (mode === "create") {
        createMutation.mutate(values);
      } else if (mode === "update" && recordId) {
        updateMutation.mutate({ id: recordId, formData: values });
      }
    },
    [mode, recordId, createMutation, updateMutation]
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
        <TextField
          label="Code *"
          {...register("code")}
          error={!!errors.code}
          helperText={errors.code?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 2" }}
        />

        <TextField
          label="Name *"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 4" }}
        />

        <TextField
          label="Address 1"
          {...register("address1")}
          error={!!errors.address1}
          helperText={errors.address1?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 4" }}
        />

        <TextField
          label="Address 2"
          {...register("address2")}
          error={!!errors.address2}
          helperText={errors.address2?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 4" }}
        />

        <TextField
          label="Contact person"
          {...register("contact")}
          error={!!errors.contact}
          helperText={errors.contact?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 2" }}
        />

        <TextField
          label="Phone"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 2" }}
        />

        <TextField
          label="Email"
          {...register("eMail")}
          error={!!errors.eMail}
          helperText={errors.eMail?.message}
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          disabled={isDisabled}
          sx={{ gridColumn: "span 2" }}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(AddressFormDialog);
