import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Spinner from "@/shared/components/Spinner";
import WorkOrdersPieChart from "./_components/charts/ChartPie";
import DisciplineCard from "./_components/CardDiscipline";
import { useEffect, useState } from "react";

import { PageHeader } from "../../shared/components/PageHeader";
import { getStatistics, TypeStatistics } from "@/core/api/api";
import { buildWorkOrderCardsData } from "./cards/cardsWorkOrder";
import { buildKpiCardsData } from "./cards/cardsKpi";
import { buildFailureCardsData } from "./cards/cardsFailure";
import { buildUnplannedCardsData } from "./cards/cardsUnplanned";
import CardSection from "./_components/CardSection";

const Dashboard = () => {
  const [counts, setCounts] = useState<TypeStatistics | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);

      const counts = await getStatistics();
      setCounts(counts);

      setLoading(false);
    };

    initFetch();
  }, []);

  if (loading || !counts) {
    return <Spinner />;
  }

  const workOrderCardsData = buildWorkOrderCardsData(counts);
  const kpiCardsData = buildKpiCardsData(counts);
  const failureCardsData = buildFailureCardsData(counts);
  const unplannedCardsData = buildUnplannedCardsData(counts);

  return (
    <Box display={"flex"} flexDirection={"column"} gap={1.5}>
      {/* <KpiSection
        cols={6}
        title="KPI Overview"
        subtitle="Overall maintenance performance and status"
        kpis={generalKpis}
      />
      <Divider /> */}
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
              <PageHeader
                title="WorkOrder Graph"
                subtitle="Current workload and completion status"
              />
              <WorkOrdersPieChart counts={counts} />
            </Box>

            <CardSection
              cols={2}
              title="Failure Analysis"
              subtitle="Breakdown of failure-related maintenance"
              cards={failureCardsData}
            />
            <CardSection
              cols={2}
              title="Unplanned Jobs"
              subtitle="Reactive and unscheduled maintenance tasks"
              cards={unplannedCardsData}
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
            "BargeMaster",
            "Technical Inspection",
            "Toolpusher",
          ].map((i) => (
            <DisciplineCard title={i || ""} counts={counts} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
