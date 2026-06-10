import { KPI_COLORS } from "../_consts/colors";
import { TypeKPI } from "@/core/api/api";

export const buildKPICardsData = (kpi: TypeKPI) => [
  {
    label: "PMP (By Time)",
    value: kpi.pmp.percentage + " %",
    color: KPI_COLORS.blue,
    tooltip: "Planned Maintenance Percentage",
  },
  {
    label: "PMC (By Time)",
    color: KPI_COLORS.blue,
    value: kpi.pmc.percentage + " %",
    tooltip: "Planned Maintenance Compliance",
  },
  {
    label: "PMP (By Count)",
    value: kpi.pmp.percentage + " %",
    color: KPI_COLORS.blue,
  },
  {
    label: "PMC (By Count)",
    value: kpi.pmc.percentage + " %",
    color: KPI_COLORS.blue,
  },
  {
    label: "Backlog Ratio",
    value: kpi.backlogRatio.percentage + " %",
    color: KPI_COLORS.blue,
  },
  {
    label: "Backlog Ratio (with Pend)",
    value: kpi.backlogRatioWithPend.percentage + " %",
    color: KPI_COLORS.blue,
  },
];
