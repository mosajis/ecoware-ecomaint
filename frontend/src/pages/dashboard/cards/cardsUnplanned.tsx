// cardsUnplanned.ts
import { TypeStatistics } from "@/core/api/api";
import { KPI_COLORS } from "../_consts/colors";

export const buildUnplannedCardsData = (counts: TypeStatistics) => [
  {
    label: "Last Month",
    value: counts.unplanned.lastMonth,
  },
  {
    label: "Last Week",
    value: counts.unplanned.lastWeek,
  },
];
