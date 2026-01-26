import React from "react";
import AccountTree from "@mui/icons-material/AccountTree";
import Build from "@mui/icons-material/Build";
import Inventory from "@mui/icons-material/Inventory";
import AttachFile from "@mui/icons-material/AttachFile";
import Straighten from "@mui/icons-material/Straighten";

const General = React.lazy(() => import("./steps/stepGeneral/StepGeneral"));
const StockUsed = React.lazy(
  () => import("./steps/stepStockUsed/StepStockUsed"),
);
const Attachments = React.lazy(() => import("./steps/StepAttachments"));
const MeasurePoints = React.lazy(() => import("./steps/StepMeasurePoints"));
const ResourceUsed = React.lazy(
  () => import("./steps/stepResourceUsed/StepResourceUsed"),
);

export type ReportWorkStep = {
  label: string;
  icon: React.ReactNode;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
};

export const reportWorkSteps: ReportWorkStep[] = [
  {
    label: "General",
    icon: <AccountTree />,
    component: General,
  },
  { label: "Resource Used", icon: <Build />, component: ResourceUsed },
  { label: "Stock Used", icon: <Inventory />, component: StockUsed },
  { label: "Attachments", icon: <AttachFile />, component: Attachments },
  {
    label: "Measure Points",
    icon: <Straighten />,
    component: MeasurePoints,
  },
];
