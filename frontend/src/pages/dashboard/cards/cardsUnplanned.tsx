import { TypeStatistics } from "@/core/api/api";

export const buildUnplannedCardsData = (counts: TypeStatistics) => [
  {
    label: "Last Week",
    value: counts.total,
  },
  {
    label: "Yesterday",
    value: counts.open,
  },
];
