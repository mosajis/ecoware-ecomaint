import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import { useRouter, useRouterState } from "@tanstack/react-router";
const menuSections = [
    {
        title: "Quick Access",
        icon: _jsx(HomeRoundedIcon, {}),
        items: [],
        path: "/quick-access",
    },
    {
        title: "Dashboard",
        icon: _jsx(DashboardRoundedIcon, {}),
        items: [],
        path: "/dashboard",
    },
    {
        title: "General",
        icon: _jsx(CategoryRoundedIcon, {}),
        items: [
            // {
            //   text: "Drawing",
            //   icon: <BrushRoundedIcon />,
            //   id: "general:drawing",
            //   path: "/general/drawing",
            // },
            // {
            //   text: "Product Type",
            //   icon: <CategoryRoundedIcon />,
            //   id: "general:productType",
            //   path: "/general/product-type",
            // },
            {
                text: "Address",
                icon: _jsx(LocationOnRoundedIcon, {}),
                id: "general:address",
                path: "/general/address",
            },
            {
                text: "Location",
                icon: _jsx(BusinessRoundedIcon, {}),
                id: "general:location",
                path: "/general/location",
            },
            {
                text: "Discipline",
                icon: _jsx(SchoolRoundedIcon, {}),
                id: "general:discipline",
                path: "/general/discipline",
            },
            {
                text: "Counter Type",
                icon: _jsx(BadgeRoundedIcon, {}),
                id: "general:counterType",
                path: "/general/counter-type",
            },
            {
                text: "Employee",
                icon: _jsx(PeopleRoundedIcon, {}),
                id: "general:employee",
                path: "/general/employee",
            },
            {
                text: "Maint Type",
                icon: _jsx(BuildRoundedIcon, {}),
                id: "general:maintType",
                path: "/general/maint-type",
            },
            {
                text: "Maint Class",
                icon: _jsx(PrecisionManufacturingRoundedIcon, {}),
                id: "general:maintClass",
                path: "/general/maint-class",
            },
            {
                text: "Maint Cause",
                icon: _jsx(ArticleRoundedIcon, {}),
                id: "general:maintCause",
                path: "/general/maint-cause",
            },
            {
                text: "Follow Status",
                icon: _jsx(LoopRoundedIcon, {}),
                id: "general:followStatus",
                path: "/general/follow-status",
            },
            {
                text: "Pending Type",
                icon: _jsx(HourglassEmptyRoundedIcon, {}),
                id: "general:pendingType",
                path: "/general/pending-type",
            },
            {
                text: "Job Class",
                icon: _jsx(WorkHistoryRoundedIcon, {}),
                id: "general:jobClass",
                path: "/general/job-class",
            },
            {
                text: "Job Description",
                icon: _jsx(DescriptionRoundedIcon, {}),
                id: "general:jobDescription",
                path: "/general/job-description",
            },
        ],
    },
    {
        title: "Maintenance",
        icon: _jsx(BuildRoundedIcon, {}),
        items: [
            {
                text: "Function",
                icon: _jsx(SettingsRoundedIcon, {}),
                id: "maint:function",
                path: "/maintenance/function",
            },
            {
                text: "Component Unit",
                icon: _jsx(Inventory2RoundedIcon, {}),
                id: "maint:componentType:component",
                path: "/maintenance/component-unit",
            },
            {
                text: "Component Type",
                icon: _jsx(PrecisionManufacturingRoundedIcon, {}),
                id: "maint:componentType",
                path: "/maintenance/component-type",
            },
            {
                text: "Component Job",
                icon: _jsx(BuildRoundedIcon, {}),
                id: "maint:componentType:componentJob",
                path: "/maintenance/component-job",
            },
            {
                text: "Work Order",
                icon: _jsx(AssignmentRoundedIcon, {}),
                id: "maint:workOrder",
                path: "/maintenance/work-order",
            },
            {
                text: "Round",
                icon: _jsx(LoopRoundedIcon, {}),
                id: "maint:round",
                path: "/maintenance/round",
            },
            {
                text: "Unplanned Jobs",
                icon: _jsx(WarningAmberRoundedIcon, {}),
                id: "maint:unplannedJobs",
                path: "/maintenance/unplanned-jobs",
            },
            {
                text: "Requisition Work",
                icon: _jsx(PostAddRoundedIcon, {}),
                id: "maint:requisitionWork",
                path: "/maintenance/requisition-work",
            },
            {
                text: "Component Trigger",
                icon: _jsx(FlashOnRoundedIcon, {}),
                id: "maint:componentTrigger",
                path: "/maintenance/component-trigger",
            },
            {
                text: "Update Counter",
                icon: _jsx(UpdateRoundedIcon, {}),
                id: "maint:updateCounter",
                path: "/maintenance/update-counter",
            },
            {
                text: "Counter Log",
                icon: _jsx(HistoryRoundedIcon, {}),
                id: "maint:counterLog",
                path: "/maintenance/counter-log",
            },
            {
                text: "Measure Points",
                icon: _jsx(ExploreRoundedIcon, {}),
                id: "maint:measurePoints",
                path: "/maintenance/measure-points",
            },
            {
                text: "Measure Points Logs",
                icon: _jsx(ListAltRoundedIcon, {}),
                id: "maint:measurePointsLogs",
                path: "/maintenance/measure-points-logs",
            },
            {
                text: "Maint Log",
                icon: _jsx(ArticleRoundedIcon, {}),
                id: "maint:maintLog",
                path: "/maintenance/maint-log",
            },
        ],
    },
    {
        title: "Stock",
        icon: _jsx(Inventory2RoundedIcon, {}),
        items: [
            {
                text: "Stock Type",
                icon: _jsx(CategoryRoundedIcon, {}),
                id: "stock:type",
                path: "/stock/stock-type",
            },
            {
                text: "Stock Item",
                icon: _jsx(Inventory2RoundedIcon, {}),
                id: "stock:item",
                path: "/stock/stock-item",
            },
            {
                text: "Stock Used",
                icon: _jsx(Inventory2RoundedIcon, {}),
                id: "stock:stock-used",
                path: "/stock/stock-used",
            },
        ],
    },
    {
        title: "Report",
        icon: _jsx(AssessmentRoundedIcon, {}),
        items: [],
        path: "/report",
    },
    { title: "Users", icon: _jsx(PeopleRoundedIcon, {}), items: [], path: "/users" },
    {
        title: "Settings",
        icon: _jsx(SettingsRoundedIcon, {}),
        items: [],
        path: "/settings",
    },
    { title: "About", icon: _jsx(InfoRoundedIcon, {}), items: [], path: "/about" },
    {
        title: "Feedback",
        icon: _jsx(HelpRoundedIcon, {}),
        items: [],
        path: "/feedback",
    },
];
export default function MenuContent() {
    const router = useRouter();
    const { location } = useRouterState();
    const currentPath = location.pathname;
    const [openSection, setOpenSection] = React.useState(null);
    // باز کردن منوی والد بر اساس مسیر فعلی
    React.useEffect(() => {
        const parent = menuSections.find((section) => section.items?.some((item) => currentPath.startsWith(item.path)));
        if (parent)
            setOpenSection(parent.title);
    }, [currentPath]);
    const handleToggle = (title) => {
        setOpenSection((prev) => (prev === title ? null : title));
    };
    const handleNavigate = (path) => {
        if (path)
            router.navigate({ to: path });
    };
    return (_jsx(Stack, { sx: { flexGrow: 1, p: 1 }, children: menuSections.map((section, index) => {
            const isActiveParent = currentPath === section.path ||
                section.items?.some((item) => currentPath.startsWith(item.path));
            return (_jsxs(React.Fragment, { children: [_jsx(ListItem, { disablePadding: true, sx: { display: "block" }, children: _jsxs(ListItemButton, { onClick: () => section.items.length
                                ? handleToggle(section.title)
                                : handleNavigate(section.path), selected: isActiveParent, sx: {
                                borderRadius: 1,
                                "&.Mui-selected": {
                                    backgroundColor: "primary.main !important",
                                },
                            }, children: [_jsx(ListItemIcon, { children: section.icon }), _jsx(ListItemText, { primary: section.title }), section.items.length !== 0 ? (openSection === section.title ? (_jsx(ExpandLess, {})) : (_jsx(ExpandMore, {}))) : null] }) }), section.items.length !== 0 && (_jsx(Collapse, { in: openSection === section.title, timeout: "auto", unmountOnExit: true, children: _jsx(List, { component: "div", disablePadding: true, dense: true, sx: { pl: 2 }, children: section.items.map((item) => {
                                const isActiveChild = currentPath === item.path;
                                return (_jsx(ListItem, { disablePadding: true, children: _jsxs(ListItemButton, { onClick: () => handleNavigate(item.path), selected: isActiveChild, sx: {
                                            borderRadius: 1,
                                            "&.Mui-selected": {
                                                backgroundColor: "primary.light",
                                            },
                                        }, children: [item.icon && (_jsx(ListItemIcon, { sx: { minWidth: 32 }, children: item.icon })), _jsx(ListItemText, { primary: item.text })] }) }, item.text));
                            }) }) })), index < menuSections.length - 1 && _jsx(Divider, { sx: { my: 0.5 } })] }, section.title));
        }) }));
}
