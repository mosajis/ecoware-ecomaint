import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Spinner from "@/shared/components/Spinner";
import CardSection from "../dashboard/_components/CardSection";
import WorkOrdersPieChart from "../dashboard/_components/charts/ChartPie";
import { columns, getRowId } from "./DashboardOverallColumns";
import { useEffect, useState } from "react";
import { PageHeader } from "../../shared/components/PageHeader";
import { TypeStatistics } from "@/core/api/api.types";
import { buildWorkOrderCardsData } from "../dashboard/cards/cardsWorkOrder";
import { buildKPICardsData } from "../dashboard/cards/cardsKpi";
import { getStatistics, getStatisticsKpi, TypeKPI } from "@/core/api/api";
import {
  tblUserInstallation,
  TypeTblInstallation,
} from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomUser } from "../auth/auth.atom";
import GenericDataGrid from "@/shared/components/dataGrid/DataGrid";
import { BarChart } from "@mui/x-charts";
import { KPI_COLORS } from "./_consts/colors";

type DashboardItem = {
  installation: TypeTblInstallation;
  statistics: TypeStatistics;
  kpi: TypeKPI;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);

  const user = useAtomValue(atomUser);
  const userId = user?.userId;

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);

        const res = await tblUserInstallation.getAll({
          filter: { userId },
          include: { tblInstallation: true },
        });

        const data = await Promise.all(
          res.items.map(async (item: any) => {
            const installation = item.tblInstallation;
            const instId = installation.instId;

            const [statistics, kpi] = await Promise.all([
              getStatistics(instId),
              getStatisticsKpi(instId),
            ]);

            return {
              installation,
              statistics,
              kpi,
            };
          }),
        );

        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initFetch();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const comparisonRows = dashboardData.map((item) => ({
    id: item.installation.instId,
    installation: item.installation.name,

    // Work Order
    total: item.statistics.workOrder.total,
    open: item.statistics.workOrder.open,
    overdue: item.statistics.workOrder.overdue,
    completed: item.statistics.workOrder.completed,
    failureOpen: item.statistics.failure.open,

    plan: item.statistics.workOrder.plan,
    issue: item.statistics.workOrder.issue,
    pending: item.statistics.workOrder.pending,

    // KPI
    pmp: item.kpi.pmp.percentage,
    pmc: item.kpi.pmc.percentage,
  }));

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <Box
        display={"grid"}
        gridTemplateColumns={"2fr auto 1fr"}
        gap={1.5}
        margin={1.5}
      >
        <Box>
          <PageHeader title="Comparison" subtitle="Compare all installations" />
          <GenericDataGrid
            rows={comparisonRows}
            columns={columns}
            getRowId={getRowId}
            style={{ height: 350 }}
          />
        </Box>

        <Divider flexItem orientation="vertical" />
        <Box>
          <PageHeader title="Comparison" subtitle="Compare all Work Orders" />
          <BarChart
            height={350}
            xAxis={[
              {
                scaleType: "band",
                data: comparisonRows.map((x) => x.installation),
              },
            ]}
            series={[
              {
                label: "Plan",
                data: comparisonRows.map((x) => x.plan),
                stack: "current",
                color: `rgba(${KPI_COLORS.blue}, 0.7)`,
              },
              {
                label: "Pend",
                data: comparisonRows.map((x) => x.pending),
                stack: "current",
                color: `rgba(${KPI_COLORS.yellow}, 0.6)`,
              },
              {
                label: "Issue",
                data: comparisonRows.map((x) => x.issue),
                stack: "current",
                color: `rgba(${KPI_COLORS.red}, 0.6)`,
              },
              {
                label: "Overdue",
                data: comparisonRows.map((x) => x.overdue),
                color: `rgba(${KPI_COLORS.red})`,
              },
            ]}
          />
        </Box>
      </Box>

      <Divider sx={{ m: 1.5 }} />
      {dashboardData.map((item) => {
        const statisticsCards = buildWorkOrderCardsData(item.statistics);
        const kpiCards = buildKPICardsData(item.kpi);

        return (
          <Box key={item.installation.instId}>
            <PageHeader
              title={item.installation.name}
              subtitle={item.installation.caption!}
              sx={{ textAlign: "center" }}
            />

            <Box
              display={"grid"}
              gridTemplateColumns={"1fr auto 1fr auto 1fr"}
              gap={1.5}
            >
              <CardSection
                cols={2}
                title="Statistics"
                subtitle="Work order statistics"
                cards={statisticsCards}
              />

              <Divider flexItem orientation="vertical" />

              <CardSection
                cols={2}
                title="KPI"
                subtitle="Maintenance KPI"
                cards={kpiCards}
              />
              <Divider flexItem orientation="vertical" />
              <Box margin={1.5}>
                <PageHeader
                  title="WorkOrder"
                  subtitle="Open work order status"
                />
                <WorkOrdersPieChart counts={item.statistics} />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
          </Box>
        );
      })}
    </Box>
  );
};

export default Dashboard;
