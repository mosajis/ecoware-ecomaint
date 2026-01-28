// cardsWorkOrder.ts
import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../_consts/colors";
import { TypeStatistics } from "@/core/api/api";

export const buildWorkOrderCardsData = (counts: TypeStatistics) => [
  {
    label: "Total",
    value: counts.workOrder.total,
    color: KPI_COLORS.blue,
  },
  {
    label: "Open",
    value: counts.workOrder.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "Current",
    value: counts.workOrder.current,
    color: KPI_COLORS.blue,
    percent: toPercent(counts.workOrder.current, counts.workOrder.open),
  },
  {
    label: "Pend",
    value: counts.workOrder.pending,
    color: KPI_COLORS.yellow,
    percent: toPercent(counts.workOrder.pending, counts.workOrder.open),
  },
  {
    label: "Overdue",
    value: counts.workOrder.overdue,
    color: KPI_COLORS.red,
    percent: toPercent(counts.workOrder.overdue, counts.workOrder.open),
  },
  {
    label: "Completed",
    value: counts.workOrder.completed,
    color: KPI_COLORS.green,
  },
];
