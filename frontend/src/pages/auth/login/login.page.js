import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LockOutlinedIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LoginInfoPanel from "./components/loginPanel";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField, Link, } from "@mui/material";
import { login } from "../auth.api";
import { LOCAL_STORAGE } from "@/const";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
// 🧩 Zod schema
const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    remember: z.boolean(),
});
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigatge = useNavigate();
    // 🔥 Mutation
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            if (res.accessToken) {
                localStorage.setItem(LOCAL_STORAGE.ACCESS_KEY, res.accessToken);
                toast.success("Logged in successfully!");
                navigatge({
                    to: "/",
                });
            }
            else {
                toast.error(res.message || "Login failed.");
            }
        },
        onError: (err) => {
            const errorMsg = err?.response?.data?.message ||
                err?.message ||
                "An error occurred while logging in.";
            toast.error(errorMsg);
        },
    });
    // 🎯 React Hook Form
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: true,
        },
    });
    // ✅ Submit handler
    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };
    return (_jsxs(Box, { display: "grid", gridTemplateColumns: {
            md: "1fr",
            lg: "9fr 11fr",
        }, minHeight: "100vh", children: [_jsx(Box, { display: "flex", justifyContent: "center", flexDirection: "column", padding: "4rem", children: _jsxs(Box, { children: [_jsxs(Box, { pb: 4, children: [_jsx(Box, { fontSize: "1.8rem", fontWeight: "bold", children: "Sign In" }), _jsx(Box, { color: "#5a5a5a", fontWeight: "medium", children: "Access your preventive maintenance dashboard" })] }), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs(Box, { display: "flex", flexDirection: "column", gap: 1.5, children: [_jsx(TextField, { label: "Username", placeholder: "Enter your username", fullWidth: true, ...register("username"), error: !!errors.username, helperText: errors.username?.message, slotProps: {
                                            input: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(AccountCircle, { color: "action" }) })),
                                            },
                                        } }), _jsx(TextField, { label: "Password", type: showPassword ? "text" : "password", fullWidth: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("password"), error: !!errors.password, helperText: errors.password?.message, slotProps: {
                                            input: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockOutlinedIcon, { color: "action" }) })),
                                                endAdornment: (_jsx(Box, { style: { cursor: "pointer" }, color: "gray", onClick: () => setShowPassword(!showPassword), display: "flex", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) })),
                                            },
                                        } }), _jsx(Button, { type: "submit", variant: "contained", color: "secondary", disabled: loginMutation.isPending, sx: { mt: 0 }, children: loginMutation.isPending ? "Signing In..." : "SIGN IN" }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(FormControlLabel, { style: {
                                                    margin: 0,
                                                    display: "flex",
                                                    gap: 10,
                                                    alignItems: "center",
                                                }, control: _jsx(Checkbox, { style: { margin: 0 }, ...register("remember") }), label: "Remember me" }), _jsx(Link, { href: "#", underline: "hover", sx: { fontSize: "0.9rem", color: "secondary.main" }, children: "Forgot password?" })] })] }) })] }) }), _jsx(LoginInfoPanel, {})] }));
}
