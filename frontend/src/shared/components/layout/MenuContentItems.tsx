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
import PeopleRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { getPermit } from "@/shared/hooks/usePermison";
// ================= TYPES =================
export type MenuItem = {
  text: string;
  path: string;
  id?: string;
  icon?: ReactNode;
  children?: MenuItem[];
  permit?: boolean;
};

export type MenuSection = {
  title: string;
  icon: ReactNode;
  path?: string;
  items: MenuItem[];
  noActiveHighlight?: boolean;
  permit?: boolean;
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
        permit: getPermit(1310).canView,
      },
      {
        text: "Work Order",
        path: "/maintenance/work-order",
        id: "quick:workOrder",
        icon: <AssignmentTurnedInRoundedIcon sx={iconStyle} />,
        permit: getPermit(1340).canView,
      },
      {
        text: "Update Counter",
        path: "/maintenance/counter",
        id: "quick:updateCounter",
        icon: <UpdateRoundedIcon sx={iconStyle} />,
        permit: getPermit(1370).canView,
      },
      {
        text: "Maint Log",
        path: "/maintenance/maint-log",
        id: "quick:maintLog",
        icon: <ReceiptLongRoundedIcon sx={iconStyle} />,
        permit: getPermit(1420).canView,
      },
      {
        text: "Failure Report",
        path: "/report/failure",
        id: "quick:failureReport",
        icon: <ReportProblemRoundedIcon sx={iconStyle} />,
        permit: getPermit(1610).canView,
      },
      {
        text: "Workshop",
        path: "/maintenance/workshop",
        id: "quick:workshop",
        icon: <EngineeringRoundedIcon sx={iconStyle} />,
        permit: getPermit(1360).canView,
      },
    ],
  },

  // ================= GENERAL =================
  {
    title: "General",
    icon: <ApartmentIcon sx={iconStyle} />,
    permit: getPermit(100).canView,
    items: [
      {
        text: "Address",
        path: "/general/address",
        id: "general:address",
        icon: <LocationOnRoundedIcon sx={iconStyle} />,
        permit: getPermit(100).canView,
      },
      {
        text: "Location",
        path: "/general/location",
        id: "general:location",
        permit: getPermit(200).canView,
        icon: <BusinessRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Employee",
        path: "/general/employee",
        id: "general:employee",
        permit: getPermit(300).canView,
        icon: <BadgeRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Discipline",
        path: "/general/discipline",
        id: "general:discipline",
        permit: getPermit(400).canView,
        icon: <HubRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counter Type",
        path: "/general/counter-type",
        id: "general:counterType",
        permit: getPermit(500).canView,
        icon: <NumbersRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Maint Classes",
        path: "/general/maint-class",
        id: "general:maintClass",
        permit: getPermit(600).canView,
        icon: <CategoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Follow Status",
        path: "/general/follow-status",
        id: "general:followStatus",
        permit: getPermit(700).canView,
        icon: <AutorenewRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Pending Type",
        path: "/general/pending-type",
        id: "general:pendingType",
        permit: getPermit(800).canView,
        icon: <HourglassBottomRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Class",
        path: "/general/job-class",
        id: "general:jobClass",
        permit: getPermit(900).canView,
        icon: <WorkOutlineRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Description",
        path: "/general/job-description",
        id: "general:jobDescription",
        permit: getPermit(1000).canView,
        icon: <DescriptionRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Job Trigger",
        path: "/general/job-trigger",
        id: "general:jobTrigger",
        permit: getPermit(1100).canView,
        icon: <FlashOnRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Attachment",
        path: "/general/attachment",
        id: "general:attachment",
        permit: getPermit(1200).canView,
        icon: <AttachFileRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= MAINTENANCE =================
  {
    title: "** Maintenance",
    icon: <BuildRoundedIcon sx={iconStyle} />,
    permit: getPermit(1300).canView,
    items: [
      {
        text: "Function",
        path: "/maintenance/function",
        id: "maint:function",
        permit: getPermit(1430).canView,
        icon: <SettingsSuggestRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Component",
        path: "/maintenance/component-unit",
        id: "maint:component",
        permit: getPermit(1310).canView,
        icon: <PrecisionManufacturingRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Component Type",
        path: "/maintenance/component-type",
        id: "maint:componentType",
        permit: getPermit(1320).canView,
        icon: <WidgetsRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Component Job",
        path: "/maintenance/component-job",
        id: "maint:componentJob",
        permit: getPermit(1330).canView,
        icon: <BuildCircleRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Work Order",
        path: "/maintenance/work-order",
        id: "maint:workOrder",
        permit: getPermit(1340).canView,
        icon: <AssignmentTurnedInRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Round",
        path: "/maintenance/round",
        id: "maint:round",
        permit: getPermit(1350).canView,
        icon: <SyncRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Workshop",
        path: "/maintenance/workshop",
        id: "maint:workshop",
        permit: getPermit(1360).canView,
        icon: <EngineeringRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Update Counter",
        path: "/maintenance/counters",
        id: "maint:counters",
        permit: getPermit(1370).canView,
        icon: <UpdateRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counter Alert",
        path: "/maintenance/counter-alert",
        id: "maint:counterAlert",
        permit: getPermit(1380).canView,
        icon: <WarningAmberRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Counter Log",
        path: "/maintenance/counter-log",
        id: "maint:counterLogs",
        permit: getPermit(1390).canView,
        icon: <HistoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Measure Point",
        path: "/maintenance/measure-point",
        id: "maint:measurePoint",
        permit: getPermit(1400).canView,
        icon: <SpeedRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Measure Point Log",
        path: "/maintenance/measure-point-log",
        id: "maint:measurePointsLogs",
        permit: getPermit(1410).canView,
        icon: <AnalyticsRoundedIcon sx={iconStyle} />,
      },
      {
        text: "** Maint Log",
        path: "/maintenance/maint-log",
        id: "maint:maintLog",
        permit: getPermit(1420).canView,
        icon: <ReceiptLongRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= SPARE =================
  {
    title: "Spare",
    icon: <InventoryRoundedIcon sx={iconStyle} />,
    permit: getPermit(1500).canView,

    items: [
      {
        text: "Spare Type",
        path: "/spare/type",
        id: "spare:type",
        permit: getPermit(1510).canView,
        icon: <CategoryRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Spare Unit",
        path: "/spare/unit",
        id: "spare:unit",
        permit: getPermit(1520).canView,
        icon: <StraightenRoundedIcon sx={iconStyle} />,
      },
      {
        text: "Spare Used",
        path: "/spare/used",
        id: "spare:used",
        permit: getPermit(1530).canView,
        icon: <DoneAllRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= REPORT =================
  {
    title: "** Report",
    icon: <AssessmentRoundedIcon sx={iconStyle} />,
    path: "/report",
    permit: getPermit(1600).canView,
    items: [
      {
        text: "** Failure Report",
        path: "/report/failure",
        id: "report:failure",
        permit: getPermit(1610).canView,
        icon: <ReportProblemRoundedIcon sx={iconStyle} />,
      },
    ],
  },

  // ================= USERS =================
  {
    title: "Access",
    icon: <SecurityRoundedIcon sx={iconStyle} />,
    path: "/access",
    permit: getPermit(1700).canView,
    items: [
      {
        text: "Users",
        icon: <PeopleRoundedIcon sx={iconStyle} />,
        path: "/access/user",
        permit: getPermit(1710).canView,
      },
      {
        text: "Users Group",
        icon: <GroupRoundedIcon sx={iconStyle} />,
        path: "/access/user-group",
        permit: getPermit(1720).canView,
      },
    ],
  },
];
