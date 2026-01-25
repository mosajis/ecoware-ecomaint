import { KPI_COLORS } from "../_consts/colors";

export const buildFailureKpis = (base: { total: number; open: number }) => [
  {
    label: "Total",
    value: base.total,
    color: KPI_COLORS.blue,
  },
  {
    label: "Open",
    value: base.open,
    color: KPI_COLORS.blue,
  },
  {
    label: "Closed",
    value: base.open,
    color: KPI_COLORS.blue,
  },

  {
    label: "Last Mounth",
    value: base.open,
    color: KPI_COLORS.blue,
  },
];
