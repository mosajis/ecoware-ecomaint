import { TypeStatistics } from "@/core/api/api.types";

export const buildFailureCardsData = (counts: TypeStatistics) => [
  {
    label: "Total",
    value: counts.failure.total,
  },
  {
    label: "Open",
    value: counts.failure.open,
  },

  {
    label: "Last Week",
    value: counts.failure.lastWeek,
  },
  {
    label: "Closed",
    value: counts.failure.closed,
  },
];
