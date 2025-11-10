import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppRouter from "./router";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "@/shared/theme/AppTheme";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { queryClient } from "@/core/api/queryClient";
const Providers = ({ children }) => {
    return (_jsx(JotaiProvider, { children: _jsxs(QueryClientProvider, { client: queryClient, children: [_jsxs(AppTheme, { children: [_jsx(CssBaseline, { enableColorScheme: true }), _jsx(AppRouter, {}), children] }), _jsx(Toaster, {})] }) }));
};
export default Providers;
