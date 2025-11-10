import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { tblAddress } from "@/core/api/generated/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function AddressFormDialog({ open, onClose, initialData }) {
    const queryClient = useQueryClient();
    // --- اگر Edit باشد، دیتای کامل را بگیر
    const { data: fullData, isLoading } = useQuery({
        enabled: !!initialData?.addressId,
        queryKey: ["tblAddress", initialData?.addressId],
        queryFn: () => tblAddress.getById(initialData.addressId).then((r) => r),
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
    const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (initialData?.addressId && isLoading)
        return null; // یا یک Spinner نمایش بدیم
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: initialData?.addressId ? "Edit Address" : "New Address" }), _jsx(DialogContent, { children: _jsxs(Stack, { spacing: 2, mt: 1, children: [_jsx(TextField, { label: "Code", value: form.code, onChange: handleChange("code") }), _jsx(TextField, { label: "Name", value: form.name, onChange: handleChange("name") }), _jsx(TextField, { label: "Address 1", value: form.address1, onChange: handleChange("address1") }), _jsx(TextField, { label: "Address 2", value: form.address2, onChange: handleChange("address2") }), _jsx(TextField, { label: "Phone", value: form.phone, onChange: handleChange("phone") }), _jsx(TextField, { label: "Email", value: form.eMail, onChange: handleChange("eMail") }), _jsx(TextField, { label: "Country", value: form.country, onChange: handleChange("country") })] }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: onClose, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: () => mutation.mutate(), children: "Save" })] })] }));
}
