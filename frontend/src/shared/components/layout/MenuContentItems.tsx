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
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";

import { Box } from "@mui/material";

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
        text: "Maint Class",
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
    ],
  },
  {
    title: "Maintenance",
    icon: <BuildRoundedIcon />,
    items: [
      {
        text: "Function",
        icon: <SettingsRoundedIcon />,
        id: "maint:function",
        path: "/maintenance/function",
        children: [
          {
            text: "Tree View",
            id: "maint:Function:tree",
            path: "/maintenance/function/tree-view",
            icon: <BulletIcon />,
          },
          {
            text: "List View",
            id: "maint:Function:list",
            path: "/maintenance/function/list-view",
            icon: <BulletIcon />,
          },
        ],
      },
      {
        text: "Component Unit",
        icon: <Inventory2RoundedIcon />,
        id: "maint:componentUnit:component",
        path: "/maintenance/component-unit",
        children: [
          {
            text: "Tree View",
            id: "maint:componentUnit:tree",
            path: "/maintenance/component-unit/tree-view",
            icon: <BulletIcon />,
          },
          {
            text: "List View",
            id: "maint:componentUnit:list",
            path: "/maintenance/component-unit/list-view",
            icon: <BulletIcon />,
          },
        ],
      },
      {
        text: "Component Type",
        icon: <PrecisionManufacturingRoundedIcon />,
        id: "maint:componentType",
        path: "/maintenance/component-type",
        children: [
          {
            text: "Tree View",
            id: "maint:componentType:tree",
            path: "/maintenance/component-type/tree-view",
            icon: <BulletIcon />,
          },
          {
            text: "List View",
            id: "maint:componentType:list",
            path: "/maintenance/component-type/list-view",
            icon: <BulletIcon />,
          },
        ],
      },
      {
        text: "Component Job",
        icon: <BuildRoundedIcon />,
        id: "maint:componentType:componentJob",
        path: "/maintenance/component-job",
        children: [
          {
            text: "Tree View",
            id: "maint:componentType:tree",
            path: "/maintenance/component-job/tree-view",
            icon: <BulletIcon />,
          },
          {
            text: "List View",
            id: "maint:componentType:list",
            path: "/maintenance/component-job/list-view",
            icon: <BulletIcon />,
          },
        ],
      },
      {
        text: "Work Order",
        icon: <AssignmentRoundedIcon />,
        id: "maint:workOrder",
        path: "/maintenance/work-order",
      },
      {
        text: "Round",
        icon: <LoopRoundedIcon />,
        id: "maint:round",
        path: "/maintenance/round",
      },
      {
        text: "Unplanned Jobs",
        icon: <WarningAmberRoundedIcon />,
        id: "maint:unplannedJobs",
        path: "/maintenance/unplanned-jobs",
      },
      {
        text: "Requisition Work",
        icon: <PostAddRoundedIcon />,
        id: "maint:requisitionWork",
        path: "/maintenance/requisition-work",
      },
      {
        text: "Component Trigger",
        icon: <FlashOnRoundedIcon />,
        id: "maint:componentTrigger",
        path: "/maintenance/component-trigger",
      },
      {
        text: "Update Counter",
        icon: <UpdateRoundedIcon />,
        id: "maint:updateCounter",
        path: "/maintenance/update-counter",
      },
      {
        text: "Counter Log",
        icon: <HistoryRoundedIcon />,
        id: "maint:counterLog",
        path: "/maintenance/counter-log",
      },
      {
        text: "Measure Points",
        icon: <ExploreRoundedIcon />,
        id: "maint:measurePoints",
        path: "/maintenance/measure-points",
      },
      {
        text: "Measure Points Logs",
        icon: <ListAltRoundedIcon />,
        id: "maint:measurePointsLogs",
        path: "/maintenance/measure-points-logs",
      },
      {
        text: "Maint Log",
        icon: <ArticleRoundedIcon />,
        id: "maint:maintLog",
        path: "/maintenance/maint-log",
      },
    ],
  },

  {
    title: "Stock",
    icon: <Inventory2RoundedIcon />,
    items: [
      {
        text: "Stock Type",
        icon: <CategoryRoundedIcon />,
        id: "stock:type",
        path: "/stock/stock-type",
      },
      {
        text: "Stock Item",
        icon: <Inventory2RoundedIcon />,
        id: "stock:item",
        path: "/stock/stock-item",
      },
      {
        text: "Stock Used",
        icon: <Inventory2RoundedIcon />,
        id: "stock:stock-used",
        path: "/stock/stock-used",
      },
    ],
  },
  {
    title: "Report",
    icon: <AssessmentRoundedIcon />,
    items: [],
    path: "/report",
  },
  { title: "Users", icon: <PeopleRoundedIcon />, items: [], path: "/users" },
];
