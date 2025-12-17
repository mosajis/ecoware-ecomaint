import AssignmentTurnedIn from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import RequestPage from "@mui/icons-material/RequestPage";
import Schedule from "@mui/icons-material/Schedule";
import { STATUS, TypeWorkOrderStatus } from "./types";

export type ActionKey =
  | "issue"
  | "complete"
  | "pending"
  | "postponed"
  | "cancel"
  | "request";

export type ActionConfig = {
  label: string;
  icon: React.ReactNode;
  isEnabled: (statuses: string[]) => boolean;
};

export const WORK_ORDER_ACTIONS: Record<ActionKey, ActionConfig> = {
  issue: {
    label: "Issue",
    icon: <AssignmentTurnedIn />,
    isEnabled: (statuses) =>
      statuses.every((s) => s === STATUS.PLAN || s === STATUS.REQUEST),
  },

  complete: {
    label: "Complete",
    icon: <CheckCircle />,
    isEnabled: (statuses) =>
      statuses.every(
        (s) =>
          s === STATUS.ISSUE || s === STATUS.PENDING || s === STATUS.POSTPONED
      ),
  },

  pending: {
    label: "Pending",
    icon: <HourglassEmpty />,
    isEnabled: (statuses) => statuses.every((s) => s === STATUS.ISSUE),
  },

  postponed: {
    label: "Postponed",
    icon: <Schedule />,
    isEnabled: (statuses) =>
      statuses.every((s) => s === STATUS.PENDING || s === STATUS.ISSUE),
  },

  cancel: {
    label: "Cancel",
    icon: <Schedule />,
    isEnabled: (statuses) =>
      statuses.every((s) => s !== STATUS.COMPLETE && s !== STATUS.CONTROL),
  },

  request: {
    label: "Request",
    icon: <RequestPage />,
    isEnabled: (statuses) =>
      statuses.every((s) => s === STATUS.PLAN || s === STATUS.REQUEST),
  },
};
