import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Spinner from "@/shared/components/Spinner";
import CardSection from "../dashboard/_components/CardSection";
import WorkOrdersPieChart from "../dashboard/_components/charts/ChartPie";
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
              getStatistics(),
              getStatisticsKpi(),
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

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
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
              <Box>
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
