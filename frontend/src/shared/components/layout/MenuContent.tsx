import * as React from "react";
import {Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack,} from "@mui/material";
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
import {useRouter, useRouterState} from "@tanstack/react-router";

type MenuItem = {
  text: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  id?: string;
  path: string;
};

const menuSections: {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
  path?: string;
}[] = [
  {
    title: "Quick Access",
    icon: <HomeRoundedIcon />,
    items: [],
    path: "/quick-access",
  },
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
        text: "Discipline",
        icon: <SchoolRoundedIcon />,
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
        text: "Employee",
        icon: <PeopleRoundedIcon />,
        id: "general:employee",
        path: "/general/employee",
      },
      {
        text: "Maint Type",
        icon: <BuildRoundedIcon />,
        id: "general:maintType",
        path: "/general/maint-type",
      },
      {
        text: "Maint Class",
        icon: <PrecisionManufacturingRoundedIcon />,
        id: "general:maintClass",
        path: "/general/maint-class",
      },
      {
        text: "Maint Cause",
        icon: <ArticleRoundedIcon />,
        id: "general:maintCause",
        path: "/general/maint-cause",
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
      },
      {
        text: "Component Unit",
        icon: <Inventory2RoundedIcon />,
        id: "maint:componentType:component",
        path: "/maintenance/component-unit",
      },
      {
        text: "Component Type",
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
  {
    title: "Settings",
    icon: <SettingsRoundedIcon />,
    items: [],
    path: "/settings",
  },
  { title: "About", icon: <InfoRoundedIcon />, items: [], path: "/about" },
  {
    title: "Feedback",
    icon: <HelpRoundedIcon />,
    items: [],
    path: "/feedback",
  },
];

export default function MenuContent() {
  const router = useRouter();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const [openSection, setOpenSection] = React.useState<string | null>(null);

  // باز کردن منوی والد بر اساس مسیر فعلی
  React.useEffect(() => {
    const parent = menuSections.find((section) =>
      section.items?.some((item) => currentPath.startsWith(item.path))
    );
    if (parent) setOpenSection(parent.title);
  }, [currentPath]);

  const handleToggle = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const handleNavigate = (path?: string) => {
    if (path) router.navigate({ to: path });
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      {menuSections.map((section, index) => {
        const isActiveParent =
          currentPath === section.path ||
          section.items?.some((item) => currentPath.startsWith(item.path));

        return (
          <React.Fragment key={section.title}>
            {/* منوی سطح اول */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() =>
                  section.items.length
                    ? handleToggle(section.title)
                    : handleNavigate(section.path)
                }
                selected={isActiveParent}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main !important",
                  },
                }}
              >
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.title} />
                {section.items.length !== 0 ? (
                  openSection === section.title ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItemButton>
            </ListItem>

            {/* زیرمنوها */}
            {section.items.length !== 0 && (
              <Collapse
                in={openSection === section.title}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding dense sx={{ pl: 2 }}>
                  {section.items.map((item) => {
                    const isActiveChild = currentPath === item.path;
                    return (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton
                          onClick={() => handleNavigate(item.path)}
                          selected={isActiveChild}
                          sx={{
                            borderRadius: 1,
                            "&.Mui-selected": {
                              backgroundColor: "primary.light",
                            },
                          }}
                        >
                          {item.icon && (
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {item.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText primary={item.text} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            )}

            {index < menuSections.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </React.Fragment>
        );
      })}
    </Stack>
  );
}
