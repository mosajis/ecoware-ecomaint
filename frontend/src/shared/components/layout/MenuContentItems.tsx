import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import ShapeLineIcon from "@mui/icons-material/ShapeLine";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import Box from "@mui/material/Box";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Upload from "@mui/icons-material/Upload";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const BulletIcon = () => (
  <Box
    component="span"
    sx={{
      minWidth: "6px",
      width: "6px !important",
      height: "6px !important",
      borderRadius: "50%",
      bgcolor: "text.primary",
      flexShrink: 0,
    }}
  />
);

export type MenuItem = {
  text: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  id?: string;
  path: string;
};

export const menuContentItems: {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  path?: string;
}[] = [
  {
    title: "Dashboard",
    icon: <DashboardRoundedIcon />,
    items: [],
    path: "/dashboard",
  },
  {
    title: "General",
    icon: <CategoryRoundedIcon />,
    items: [
      {
        text: "Address",
        icon: <LocationOnRoundedIcon />,
        id: "general:address",
        path: "/general/address",
      },
      {
        text: "Location",
        icon: <BusinessRoundedIcon />,
        id: "general:location",
        path: "/general/location",
      },
      {
        text: "Employee",
        icon: <PeopleRoundedIcon />,
        id: "general:employee",
        path: "/general/employee",
      },
      {
        text: "Discipline",
        icon: <BrightnessAutoIcon />,
        id: "general:discipline",
        path: "/general/discipline",
      },
      {
        text: "Counter Type",
        icon: <BadgeRoundedIcon />,
        id: "general:counterType",
        path: "/general/counter-type",
      },

      {
        text: "Maint Class +",
        icon: <PrecisionManufacturingRoundedIcon />,
        id: "general:maint-class",
        path: "/general/maint-class",
      },

      {
        text: "Follow Status",
        icon: <LoopRoundedIcon />,
        id: "general:followStatus",
        path: "/general/follow-status",
      },
      {
        text: "Pending Type",
        icon: <HourglassEmptyRoundedIcon />,
        id: "general:pendingType",
        path: "/general/pending-type",
      },
      {
        text: "Job Class",
        icon: <WorkHistoryRoundedIcon />,
        id: "general:jobClass",
        path: "/general/job-class",
      },
      {
        text: "Job Description",
        icon: <DescriptionRoundedIcon />,
        id: "general:jobDescription",
        path: "/general/job-description",
      },
      {
        text: "Attachment",
        icon: <Upload />,
        id: "general:attachment",
        path: "/general/attachment",
      },
    ],
  },
  {
    title: "Maintenance (x)",
    icon: <BuildRoundedIcon />,
    items: [
      {
        text: "Function",
        icon: <SettingsRoundedIcon />,
        id: "maint:function",
        path: "/maintenance/function",
      },
      {
        text: "Component Unit (x)",
        icon: <Inventory2RoundedIcon />,
        id: "maint:componentUnit:component",
        path: "/maintenance/component-unit",
      },
      {
        text: "Component Type (x)",
        icon: <PrecisionManufacturingRoundedIcon />,
        id: "maint:componentType",
        path: "/maintenance/component-type",
      },
      {
        text: "Component Job",
        icon: <BuildRoundedIcon />,
        id: "maint:componentType:componentJob",
        path: "/maintenance/component-job",
      },
      {
        text: "Work Order (x)",
        icon: <AssignmentRoundedIcon />,
        id: "maint:workOrder",
        path: "/maintenance/work-order",
      },
      {
        text: "Round (x)",
        icon: <LoopRoundedIcon />,
        id: "maint:round",
        path: "/maintenance/round",
      },
      {
        text: "Requisition Work (x)",
        icon: <PostAddRoundedIcon />,
        id: "maint:requisitionWork",
        path: "/maintenance/requisition-work",
      },
      {
        text: "Component Trigger (x)",
        icon: <FlashOnRoundedIcon />,
        id: "maint:componentTrigger",
        path: "/maintenance/component-trigger",
      },
      {
        text: "Counter Update (x)",
        icon: <UpdateRoundedIcon />,
        id: "maint:updateCounter",
        path: "/maintenance/update-counter",
      },
      {
        text: "Counter Logs (x)",
        icon: <HistoryRoundedIcon />,
        id: "maint:counterLog",
        path: "/maintenance/counters-log",
      },
      {
        text: "Measure Points (x)",
        icon: <ExploreRoundedIcon />,
        id: "maint:measurePoints",
        path: "/maintenance/measure-points",
      },
      {
        text: "Measure Points Logs (x)",
        icon: <ListAltRoundedIcon />,
        id: "maint:measurePointsLogs",
        path: "/maintenance/measure-points-logs",
      },
      {
        text: "Maint Log (x)",
        icon: <ArticleRoundedIcon />,
        id: "maint:maintLog",
        path: "/maintenance/maint-log",
      },
    ],
  },

  {
    title: "Spare",
    icon: <Inventory2RoundedIcon />,
    items: [
      {
        text: "Spare Type",
        icon: <CategoryRoundedIcon />,
        id: "spare:type",
        path: "/spare/type",
      },
      {
        text: "Spare Unit",
        icon: <ShapeLineIcon />,
        id: "spare:unit",
        path: "/spare/unit",
      },
      {
        text: "Spare Used",
        icon: <DoneAllIcon />,
        id: "spare:spare-used",
        path: "/spare/used",
      },
    ],
  },
  {
    title: "Report (x)",
    icon: <AssessmentRoundedIcon />,
    path: "/report",
    items: [
      {
        text: "Daily Report (x)",
        icon: <TodayRoundedIcon />,
        id: "report:daily",
        path: "/report/daily",
      },
      {
        text: "Failure Report (x)",
        icon: <ReportProblemRoundedIcon />,
        id: "report:failure",
        path: "/report/failure",
      },
      {
        text: "Job Report (x)",
        icon: <WorkRoundedIcon />,
        id: "report:job",
        path: "/report/job",
      },
      {
        text: "Monthly Report (x)",
        icon: <CalendarMonthRoundedIcon />,
        id: "report:monthly",
        path: "/report/monthly",
      },
    ],
  },
  {
    title: "Users (x)",
    icon: <PeopleRoundedIcon />,
    items: [],
    path: "/users",
  },
];
