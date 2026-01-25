import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../_consts/colors";
import { WorkOrderCounts } from "../Dashboard";

export const buildWorkOrderKpis = (counts: WorkOrderCounts) => [
  {
    label: "Open",
    value: counts.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "Pend",
    value: counts.pend,
    color: KPI_COLORS.yellow,
    percent: toPercent(counts.pend, counts.open),
  },
  {
    label: "Overdue",
    value: counts.overdue,
    color: KPI_COLORS.red,
    percent: toPercent(counts.overdue, counts.open),
  },
  {
    label: "Current",
    value: counts.current,
    color: KPI_COLORS.blue,
    percent: toPercent(counts.current, counts.open),
  },
  {
    label: "Completed",
    value: counts.completed,
    color: KPI_COLORS.green,
  },
];
