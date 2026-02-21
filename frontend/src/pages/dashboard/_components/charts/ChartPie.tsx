import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../../_consts/colors";
import { TypeStatistics } from "@/core/api/api.types";

type Props = {
  counts: TypeStatistics;
};

export default function WorkOrdersPieChart({ counts }: Props) {
  const openBreakdownData = React.useMemo(() => {
    const openTotal = counts.workOrder.open;
    return [
      {
        id: "Overdue",
        label: "Overdue",
        value: counts.workOrder.overdue,
        percentage: toPercent(counts.workOrder.overdue, openTotal),
        color: `rgba(${KPI_COLORS.red})`,
      },
      {
        id: "Current",
        label: "Current",
        value: counts.workOrder.current,
        percentage: toPercent(counts.workOrder.current, openTotal),
        color: `rgba(${KPI_COLORS.blue})`,
      },
    ];
  }, [counts]);

  const currentBreakdownData = React.useMemo(() => {
    return [
      {
        id: "OverduePlaceholder",
        label: "",
        value: 0,
        color: "transparent",
      },
      {
        id: "Pend",
        label: "Pend",
        value: counts.workOrder.pending,
        percentage: toPercent(counts.workOrder.pending, counts.workOrder.open),
        color: `rgba(${KPI_COLORS.yellow}, 0.6)`,
      },
      {
        id: "Issue",
        label: "Issue",
        value: counts.workOrder.issue,
        percentage: toPercent(counts.workOrder.issue, counts.workOrder.open),
        color: `rgba(${KPI_COLORS.red}, 0.6)`,
      },

      {
        id: "Plan",
        label: "Plan",
        value: counts.workOrder.plan,
        percentage: toPercent(counts.workOrder.plan, counts.workOrder.open),
        color: `rgba(${KPI_COLORS.blue}, 0.7)`,
      },
    ];
  }, [counts]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: 290 }}>
      <PieChart
        series={[
          {
            innerRadius: 60,
            outerRadius: 100,
            data: openBreakdownData,
            highlightScope: { fade: "global", highlight: "item" },
            highlighted: { additionalRadius: 2 },
            cornerRadius: 3,
          },
          {
            innerRadius: 105,
            outerRadius: 130,
            data: currentBreakdownData,
            highlightScope: { fade: "global", highlight: "item" },
            highlighted: { additionalRadius: 2 },
            cornerRadius: 3,
          },
        ]}
      />
    </Box>
  );
}
