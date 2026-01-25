import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { toPercent } from "@/shared/utils/zodUtils";
import { WorkOrderCounts } from "../../Dashboard";
import { KPI_COLORS } from "../../_consts/colors";
import { PageHeader } from "../PageHeader";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

type WorkOrdersPieChartProps = {
  counts: WorkOrderCounts;
};

export default function WorkOrdersPieChart({
  counts,
}: WorkOrdersPieChartProps) {
  const [view, setView] = React.useState<"status" | "openBreakdown">("status");

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "status" | "openBreakdown" | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const total = counts.total;

  const statusData = React.useMemo(() => {
    return [
      {
        id: "Open",
        label: "Open",
        value: counts.open,
        percentage: toPercent(counts.open, total),
        color: `rgb(${KPI_COLORS.blue})`,
      },
      {
        id: "Pend",
        label: "Pend",
        value: counts.pend,
        percentage: toPercent(counts.pend, total),
        color: `rgb(${KPI_COLORS.yellow})`,
      },
      {
        id: "Overdue",
        label: "Overdue",
        value: counts.overdue,
        percentage: toPercent(counts.overdue, total),
        color: `rgb(${KPI_COLORS.red})`,
      },
      {
        id: "Completed",
        label: "Completed",
        value: counts.completed,
        percentage: toPercent(counts.completed, total),
        color: `rgb(${KPI_COLORS.green})`,
      },
    ];
  }, [counts, total]);

  const openBreakdownData = React.useMemo(() => {
    const openTotal = counts.open || 1;

    return [
      {
        id: "Pend",
        label: "Pend",
        value: counts.pend,
        percentage: toPercent(counts.pend, openTotal),
        color: `rgba(${KPI_COLORS.yellow}, 0.6)`,
      },
      {
        id: "Overdue",
        label: "Overdue",
        value: counts.overdue,
        percentage: toPercent(counts.overdue, openTotal),
        color: `rgba(${KPI_COLORS.red}, 0.6)`,
      },
      {
        id: "Current",
        label: "Current",
        value: counts.current,
        percentage: toPercent(counts.current, openTotal),
        color: `rgba(${KPI_COLORS.blue}, 0.6)`,
      },
    ];
  }, [counts]);

  const innerRadius = 60;
  const middleRadius = 120;

  return (
    <Box p={1.5}>
      <PageHeader
        title="WorkOrder Analyze"
        subtitle="Current workload and completion status"
      />

      <Box sx={{ display: "flex", justifyContent: "center", height: 250 }}>
        <PieChart
          series={[
            {
              innerRadius,
              outerRadius: middleRadius,
              data: openBreakdownData,
              highlightScope: { fade: "global", highlight: "item" },
              highlighted: { additionalRadius: 2 },
              cornerRadius: 3,
            },
          ]}
        />
      </Box>
    </Box>
  );
}
