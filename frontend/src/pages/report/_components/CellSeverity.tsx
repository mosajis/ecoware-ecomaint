import Chip from "@mui/material/Chip";
import { FC } from "react";

// Map severity levels by ID to color
const severityColors: Record<
  number,
  "default" | "success" | "warning" | "error" | "info"
> = {
  1: "success", // Low
  2: "warning", // Medium
  3: "error", // High
};

// Map severity levels by ID to label (optional, can be overridden by name from DB)
const severityLabels: Record<number, string> = {
  1: "Low",
  2: "Medium",
  3: "High",
};

interface CellSeverityProps {
  value?: {
    failureSeverityLevelId?: number;
    name?: string | null;
  } | null;
}

const CellSeverity: FC<CellSeverityProps> = ({ value }) => {
  if (!value?.failureSeverityLevelId) {
    return <Chip label="N/A" color="default" size="small" />;
  }

  const severityId = value.failureSeverityLevelId;
  const label = value.name || severityLabels[severityId] || "Unknown";
  const color = severityColors[severityId] || "default";

  return <Chip label={label} color={color} size="small" />;
};

export default CellSeverity;
