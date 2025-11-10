import {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {tblAddress} from "@/core/api/generated/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function AddressFormDialog({ open, onClose, initialData }: any) {
  const queryClient = useQueryClient();

  // --- اگر Edit باشد، دیتای کامل را بگیر
  const { data: fullData, isLoading } = useQuery({
    enabled: !!initialData?.addressId,
    queryKey: ["tblAddress", initialData?.addressId],
    queryFn: () =>
      tblAddress.getById(initialData.addressId).then((r) => r),
  });

  // --- فرم اولیه (در حالت New این خالی می‌ماند)
  const [form, setForm] = useState({
    code: "",
    name: "",
    address1: "",
    address2: "",
    phone: "",
    eMail: "",
    country: "",
  });

  // مقداردهی فرم بعد از دریافت داده کامل
  useEffect(() => {
    if (fullData) {
      setForm({
        code: fullData.code ?? "",
        name: fullData.name ?? "",
        address1: fullData.address1 ?? "",
        address2: fullData.address2 ?? "",
        phone: fullData.phone ?? "",
        eMail: fullData.eMail ?? "",
        country: fullData.country ?? "",
      });
    }
  }, [fullData]);

  // --- Create یا Update
  const mutation = useMutation({
    mutationFn: () => {
      if (initialData?.addressId) {
        return tblAddress.update(initialData.addressId, form);
      }
      return tblAddress.create(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tblAddress"] });
      onClose();
    },
  });

  const handleChange = (key: string) => (e: any) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  if (initialData?.addressId && isLoading) return null; // یا یک Spinner نمایش بدیم

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData?.addressId ? "Edit Address" : "New Address"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Code" value={form.code} onChange={handleChange("code")} />
          <TextField label="Name" value={form.name} onChange={handleChange("name")} />
          <TextField label="Address 1" value={form.address1} onChange={handleChange("address1")} />
          <TextField label="Address 2" value={form.address2} onChange={handleChange("address2")} />
          <TextField label="Phone" value={form.phone} onChange={handleChange("phone")} />
          <TextField label="Email" value={form.eMail} onChange={handleChange("eMail")} />
          <TextField label="Country" value={form.country} onChange={handleChange("country")} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => mutation.mutate()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
