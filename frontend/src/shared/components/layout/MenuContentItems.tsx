import React from "react";
import type { ReactNode } from "react";
// ================= ICONS =================
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import StartIcon from "@mui/icons-material/Star";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import BuildCircleRoundedIcon from "@mui/icons-material/BuildCircleRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import EngineeringRoundedIcon from "@mui/icons-material/EngineeringRounded";

import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

// ================= TYPES =================
export type MenuItem = {
  text: string;
  path: string;
  id?: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export type MenuSection = {
  title: string;
  icon: ReactNode;
  path?: string;
  items: MenuItem[];
  noActiveHighlight?: boolean; // ← اضافه کن
};

// ================= ICON STYLE =================
const iconStyle = {
  fontSize: 20,
};

// ================= MENU =================
export const menuContentItems: MenuSection[] = [
  // ================= DASHBOARD =================
  {
    title: "Dashboard",
    icon: <DashboardRoundedIcon sx={iconStyle} />,
    path: "/dashboard",
    items: [],
  },

  // ================= QUICK ACCESS =================
  {
    title: "Quick Access",
    icon: <StartIcon sx={iconStyle} />,
    noActiveHighlight: true,
    items: [
      {
        text: "Component",
        path: "/maintenance/component-unit",
        id: "quick:component",
        icon: <PrecisionManufacturingRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Work Order",
        path: "/maintenance/work-order",
        id: "quick:workOrder",
        icon: <AssignmentTurnedInRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Update Counter",
        path: "/maintenance/counters",
        id: "quick:updateCounter",
        icon: <UpdateRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Maint Log",
        path: "/maintenance/maint-log",
        id: "quick:maintLog",
        icon: <ReceiptLongRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Failure Report",
        path: "/report/failure",
        id: "quick:failureReport",
        icon: <ReportProblemRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Workshop",
        path: "/maintenance/workshop",
        id: "quick:workshop",
        icon: <EngineeringRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= GENERAL =================
  {
    title: "General",
    icon: <ApartmentIcon sx={iconStyle} />,
    items: [
      {
        text: "Address",
        path: "/general/address",
        id: "general:address",
        icon: <LocationOnRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Location",
        path: "/general/location",
        id: "general:location",
        icon: <BusinessRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Employee",
        path: "/general/employee",
        id: "general:employee",
        icon: <BadgeRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Discipline",
        path: "/general/discipline",
        id: "general:discipline",
        icon: <HubRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counter Type",
        path: "/general/counter-type",
        id: "general:counterType",
        icon: <NumbersRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Maint Class",
        path: "/general/maint-class",
        id: "general:maintClass",
        icon: <CategoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Follow Status",
        path: "/general/follow-status",
        id: "general:followStatus",
        icon: <AutorenewRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Pending Type",
        path: "/general/pending-type",
        id: "general:pendingType",
        icon: <HourglassBottomRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Class",
        path: "/general/job-class",
        id: "general:jobClass",
        icon: <WorkOutlineRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Description",
        path: "/general/job-description",
        id: "general:jobDescription",
        icon: <DescriptionRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Trigger",
        path: "/general/job-trigger",
        id: "general:jobTrigger",
        icon: <FlashOnRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Attachment",
        path: "/general/attachment",
        id: "general:attachment",
        icon: <AttachFileRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= MAINTENANCE =================
  {
    title: "Maintenance",
    icon: <BuildRoundedIcon sx={iconStyle} />,
    items: [
      {
        text: "Function",
        path: "/maintenance/function",
        id: "maint:function",
        icon: <SettingsSuggestRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Component",
        path: "/maintenance/component-unit",
        id: "maint:component",
        icon: <PrecisionManufacturingRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Component Type",
        path: "/maintenance/component-type",
        id: "maint:componentType",
        icon: <WidgetsRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Component Job",
        path: "/maintenance/component-job",
        id: "maint:componentJob",
        icon: <BuildCircleRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Work Order",
        path: "/maintenance/work-order",
        id: "maint:workOrder",
        icon: <AssignmentTurnedInRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Round",
        path: "/maintenance/round",
        id: "maint:round",
        icon: <SyncRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Workshop",
        path: "/maintenance/workshop",
        id: "maint:workshop",
        icon: <EngineeringRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Update Counter",
        path: "/maintenance/counters",
        id: "maint:counters",
        icon: <UpdateRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counters Alert",
        path: "/maintenance/counters-alert",
        id: "maint:counterAlert",
        icon: <WarningAmberRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counters Logs",
        path: "/maintenance/counters-logs",
        id: "maint:counterLogs",
        icon: <HistoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Measure Points",
        path: "/maintenance/measure-points",
        id: "maint:measurePoints",
        icon: <SpeedRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Measure Points Logs",
        path: "/maintenance/measure-points-logs",
        id: "maint:measurePointsLogs",
        icon: <AnalyticsRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Maint Log",
        path: "/maintenance/maint-log",
        id: "maint:maintLog",
        icon: <ReceiptLongRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= SPARE =================
  {
    title: "Spare",
    icon: <InventoryRoundedIcon sx={iconStyle} />,
    items: [
      {
        text: "Spare Type",
        path: "/spare/type",
        id: "spare:type",
        icon: <CategoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Spare Unit",
        path: "/spare/unit",
        id: "spare:unit",
        icon: <StraightenRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Spare Used",
        path: "/spare/used",
        id: "spare:used",
        icon: <DoneAllRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= REPORT =================
  {
    title: "Report",
    icon: <AssessmentRoundedIcon sx={iconStyle} />,
    path: "/report",
    items: [
      {
        text: "Failure Report",
        path: "/report/failure",
        id: "report:failure",
        icon: <ReportProblemRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Daily Report",
        path: "/report/daily",
        id: "report:daily",
        icon: <TodayRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Monthly Report",
        path: "/report/monthly",
        id: "report:monthly",
        icon: <DateRangeRoundedIcon sx={iconStyle} />,
      },
      {
        text: "KPI Report",
        path: "/report/kpi",
        id: "report:kpi",
        icon: <TrendingUpRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= USERS =================
  {
    title: "Users",
    icon: <PeopleRoundedIcon sx={iconStyle} />,
    path: "/users",
    items: [],
  },
];
