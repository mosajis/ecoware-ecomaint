import { TypeStatistics } from "@/core/api/api.types";
import { KPI_COLORS } from "../_consts/colors";

export const buildKpiCardsData = (counts: TypeStatistics) => [
  {
    label: "MTBF",
    value: 1,
    color: KPI_COLORS.blue,
  },
  {
    label: "MTTR",
    value: 2,
    color: KPI_COLORS.blue,
  },
  {
    label: "PMC",
    value: 3,
    color: KPI_COLORS.blue,
  },
  {
    label: "PMP",
    value: 4,
    color: KPI_COLORS.blue,
  },
  {
    label: "Backlog Ratio",
    value: 5,
    color: KPI_COLORS.blue,
  },
];
