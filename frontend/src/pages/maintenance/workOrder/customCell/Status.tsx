import { FC } from "react";
import { Chip } from "@mui/material";
import { STATUS } from "../types";

type StatusKey = keyof typeof STATUS;

// معکوس map برای تبدیل value به key
const valueToKeyMap: Record<string, StatusKey> = Object.fromEntries(
  Object.entries(STATUS).map(([key, value]) => [value, key as StatusKey])
) as Record<string, StatusKey>;

const statusColors: Record<
  StatusKey,
  "default" | "primary" | "success" | "warning" | "error" | "info"
> = {
  PLAN: "info",
  REQUEST: "primary",
  ISSUE: "warning",
  PENDING: "warning",
  CONTROL: "info",
  COMPLETE: "success",
  CANCEL: "default",
  POSTPONED: "error",
};

interface StatusChipProps {
  status?: string;
}

const Status: FC<StatusChipProps> = ({ status }) => {
  const key = status ? valueToKeyMap[status] : undefined;
  const label = status || "Unknown";
  const color = key ? statusColors[key] : "default";

  return <Chip label={label} color={color} size="small" />;
};

export default Status;
