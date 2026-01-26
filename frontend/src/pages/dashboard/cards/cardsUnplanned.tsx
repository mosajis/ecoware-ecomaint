import { TypeStatistics } from "@/core/api/api";

export const buildUnplannedCardsData = (counts: TypeStatistics) => [
  {
    label: "This Week",
    value: counts.open,
  },
  {
    label: "Last Week",
    value: counts.total,
  },
];
