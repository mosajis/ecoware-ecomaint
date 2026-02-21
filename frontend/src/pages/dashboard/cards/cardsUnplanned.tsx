import { TypeStatistics } from "@/core/api/api.types";

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
