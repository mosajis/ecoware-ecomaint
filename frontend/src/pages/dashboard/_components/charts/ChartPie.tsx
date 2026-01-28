import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { toPercent } from "@/shared/utils/zodUtils";
import { KPI_COLORS } from "../../_consts/colors";
import { TypeStatistics } from "@/core/api/api";

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
        color: `rgba(${KPI_COLORS.red}, 0.6)`,
      },
      {
        id: "Current",
        label: "Current",
        value: counts.workOrder.current,
        percentage: toPercent(counts.workOrder.current, openTotal),
        color: `rgba(${KPI_COLORS.blue}, 0.6)`,
      },
    ];
  }, [counts]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", height: 250 }}>
      <PieChart
        series={[
          {
            innerRadius: 60,
            outerRadius: 120,
            data: openBreakdownData,
            highlightScope: { fade: "global", highlight: "item" },
            highlighted: { additionalRadius: 2 },
            cornerRadius: 3,
          },
        ]}
      />
    </Box>
  );
}
