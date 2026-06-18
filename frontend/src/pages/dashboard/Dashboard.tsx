import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Spinner from "@/shared/components/Spinner";
import WorkOrdersPieChart from "./_components/charts/ChartPie";
import DisciplineCard from "./_components/CardDiscipline";
import CardSection from "./_components/CardSection";
import { useEffect, useState } from "react";
import { PageHeader } from "../../shared/components/PageHeader";
import { getStatistics, getStatisticsKpi, TypeKPI } from "@/core/api/api";
import { buildWorkOrderCardsData } from "./cards/cardsWorkOrder";
import { buildFailureCardsData } from "./cards/cardsFailure";
import { buildUnplannedCardsData } from "./cards/cardsUnplanned";
import { TypeStatistics } from "@/core/api/api.types";
import { buildKPICardsData } from "./cards/cardsKpi";
import { useAtomValue } from "jotai";
import { atomRig } from "@/shared/atoms/general.atom";

const Dashboard = () => {
  const [counts, setCounts] = useState<TypeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<TypeKPI | null>(null);

  const inst = useAtomValue(atomRig);
  const instId = inst?.instId;

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      const [statistics, kpi] = await Promise.all([
        getStatistics(instId),
        getStatisticsKpi(instId),
      ]);

      setCounts(statistics);
      setKpiData(kpi);
      setLoading(false);
    };

    initFetch();
  }, [instId]);

  if (loading || !counts || !kpiData) {
    return <Spinner />;
  }

  const workOrderCardsData = buildWorkOrderCardsData(counts);
  const failureCardsData = buildFailureCardsData(counts);
  const unplannedCardsData = buildUnplannedCardsData(counts);
  const kpiCardsData = buildKPICardsData(kpiData);

  return (
    <Box display={"flex"} flexDirection={"column"} gap={1.5}>
      <CardSection
        cols={6}
        title="Work Order Statistics"
        subtitle="Work order volume, progress, and status"
        cards={workOrderCardsData}
      />
      <Divider />

      <Stack
        display="grid"
        gridTemplateColumns="1fr"
        divider={<Divider orientation="vertical" />}
      >
        <Box>
          <Stack
            display="grid"
            gridTemplateColumns="1fr auto 1fr auto 1fr "
            divider={<Divider orientation="vertical" />}
          >
            <Box p={1.5}>
              <PageHeader title="WorkOrder" subtitle="Open work order status" />
              <WorkOrdersPieChart counts={counts} />
            </Box>

            <Box>
              <CardSection
                cols={2}
                title="Failure Report"
                subtitle="Breakdown of failure-related maintenance"
                cards={failureCardsData}
              />
              <Divider sx={{ mx: 1.5 }} />
              <CardSection
                cols={2}
                title="Unplanned Jobs"
                subtitle="Reactive and unscheduled maintenance tasks"
                cards={unplannedCardsData}
              />
            </Box>

            <CardSection
              cols={2}
              title="KPI"
              subtitle="Maintenance KPI"
              cards={kpiCardsData}
            />
          </Stack>
        </Box>
      </Stack>
      <Divider />
      <Box p={1.5}>
        <PageHeader
          title="Discipline Analysis"
          subtitle="Distribution of work orders across maintenance disciplines"
        />
        <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1.5}>
          {[
            "Electrician",
            "Mechanic",
            "HSE Officer",
            "Toolpusher",
            "Mud Engineer",
          ].map((discipline) => (
            <DisciplineCard
              key={discipline}
              title={discipline}
              counts={counts}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
