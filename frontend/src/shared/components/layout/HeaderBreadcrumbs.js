import { jsx as _jsx } from "react/jsx-runtime";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme.vars || theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: "center",
    },
}));
export default function HeaderBreadcrumbs() {
    const router = useRouter();
    const { location } = useRouterState();
    const pathnames = location.pathname.split("/").filter(Boolean);
    const handleNavigate = (to) => {
        router.navigate({ to });
    };
    // ساخت breadcrumb items با مسیر و نام
    const breadcrumbs = pathnames.map((name, index) => {
        const routePath = "/" + pathnames.slice(0, index + 1).join("/");
        // نمایش اسم بهتر: می‌توان map کرد روی route های ثبت شده یا فقط capitalize
        const label = name
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
        const isLast = index === pathnames.length - 1;
        return isLast ? (_jsx(Typography, { variant: "body1", sx: { color: "text.primary", fontWeight: 600 }, children: label }, routePath)) : (_jsx(Typography, { variant: "body1", sx: { cursor: "pointer" }, onClick: () => handleNavigate(routePath), children: label }, routePath));
    });
    useEffect(() => {
        const last = pathnames[pathnames.length - 1];
        if (last) {
            const formatted = last
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
            document.title = "ECO | " + formatted;
        }
    }, [location.pathname]);
    return (_jsx(StyledBreadcrumbs, { separator: _jsx(NavigateNextRoundedIcon, { fontSize: "small" }), children: breadcrumbs }));
}
