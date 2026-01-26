import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../_consts/colors";
import { TypeStatistics } from "@/core/api/api";

export const buildWorkOrderCardsData = (counts: TypeStatistics) => [
  {
    label: "Today",
    value: counts.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "Open",
    value: counts.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "Current",
    value: counts.current,
    color: KPI_COLORS.blue,
    percent: toPercent(counts.current, counts.open),
  },
  {
    label: "Pend",
    value: counts.pending,
    color: KPI_COLORS.yellow,
    percent: toPercent(counts.pending, counts.open),
  },
  {
    label: "Overdue",
    value: counts.overdue,
    color: KPI_COLORS.red,
    percent: toPercent(counts.overdue, counts.open),
  },

  {
    label: "Completed",
    value: counts.completed,
    color: KPI_COLORS.green,
  },
];
