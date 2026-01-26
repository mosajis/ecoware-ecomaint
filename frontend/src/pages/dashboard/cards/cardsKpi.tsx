import { KPI_COLORS } from "../_consts/colors";
import { TypeStatistics } from "@/core/api/api";

export const buildKpiCardsData = (counts: TypeStatistics) => [
  {
    label: "MTBF",
    value: counts.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "MTTR",
    value: counts.pending,
    color: KPI_COLORS.blue,
  },
  {
    label: "PMC",
    value: counts.overdue,
    color: KPI_COLORS.blue,
  },
  {
    label: "PMP",
    value: counts.current,
    color: KPI_COLORS.blue,
  },
  {
    label: "Backlog Ratio",
    value: counts.completed,
    color: KPI_COLORS.blue,
  },
];
