import { TypeStatistics } from "@/core/api/api";
import { KPI_COLORS } from "../_consts/colors";

export const buildFailureCardsData = (count: TypeStatistics) => [
  {
    label: "Total",
    value: count.total,
    // color: KPI_COLORS.blue,
  },
  {
    label: "Open",
    value: count.open,
    // color: KPI_COLORS.yellow,
  },
  {
    label: "Closed",
    value: count.open,
    // color: KPI_COLORS.green,
  },

  {
    label: "Last Week",
    value: count.open,
    // color: KPI_COLORS.blue,
  },
  {
    label: "Last Mounth",
    value: count.open,
    // color: KPI_COLORS.blue,
  },
];
