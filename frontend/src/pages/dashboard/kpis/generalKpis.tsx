import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../_consts/colors";
import { WorkOrderCounts } from "../Dashboard";

export const buildGeneralKpis = (counts: WorkOrderCounts) => [
  {
    label: "MTBF",
    value: counts.open,
  },
  {
    label: "MTTR",
    value: counts.pend,
  },
  {
    label: "PMC",
    value: counts.overdue,
  },
  {
    label: "PMP",
    value: counts.current,
  },
  {
    label: "Backlog Ratio",
    value: counts.completed,
  },
];
