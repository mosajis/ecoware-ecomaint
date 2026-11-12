import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Spinner from "@/shared/components/Spinner";
import WaitingMetricCard from "../_components/WaitingMetricCard";
import WaitingSection from "../_components/WaitingSection";
import WaitingBarChart from "../_components/WaitingBarChart";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { PageHeader } from "@/shared/components/PageHeader";
import { atomRig } from "@/shared/atoms/general.atom";
import { getWaitingDashboard, TypeWaitingDashboard } from "@/core/api/api";

const Dashboard = () => {
  const [data, setData] = useState<TypeWaitingDashboard | null>(null);

  const [loading, setLoading] = useState(true);

  const inst = useAtomValue(atomRig);

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);

      try {
        const result = await getWaitingDashboard({
          instId: inst?.instId,
        });

        setData(result);
      } finally {
        setLoading(false);
      }
    };

    initFetch();
  }, [inst?.instId]);

  if (loading || !data) {
    return <Spinner />;
  }

  const { summary } = data;

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      <PageHeader
        title="Waiting Dashboard"
        subtitle="Overview of operational waiting and downtime"
      />

      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1.5}>
        <WaitingMetricCard
          title="Total Waiting"
          value={`${summary.totalHours.toFixed(1)} h`}
          subtitle="Accumulated waiting time"
        />

        <WaitingMetricCard
          title="Events"
          value={summary.totalEvents}
          subtitle="Registered waiting events"
        />

        <WaitingMetricCard
          title="Waiting Days"
          value={summary.daysWithWaiting}
          subtitle="Days affected by waiting"
        />

        <WaitingMetricCard
          title="Average Duration"
          value={`${summary.averageDurationHours.toFixed(1)} h`}
          subtitle="Per waiting event"
        />

        <WaitingMetricCard
          title="Affected Rigs"
          value={summary.installationsWithWaiting}
          subtitle="Installations with waiting"
        />
      </Box>

      <Divider />

      <Stack
        display="grid"
        gridTemplateColumns="1fr 1fr"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box p={1.5}>
          <WaitingSection
            title="Waiting by Reason Group"
            subtitle="Distribution of waiting hours"
          >
            <WaitingBarChart
              maxItems={8}
              items={data.reasonGroups.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events · ${(item.shareOfHours * 100).toFixed(1)}%`,
              }))}
            />
          </WaitingSection>
        </Box>

        <Box p={1.5}>
          <WaitingSection
            title="Waiting by Installation"
            subtitle="Comparison between rigs"
          >
            <WaitingBarChart
              maxItems={8}
              items={data.installations.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>
        </Box>
      </Stack>

      <Divider />

      <Stack
        display="grid"
        gridTemplateColumns="1fr 1fr"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box p={1.5}>
          <WaitingSection
            title="Monthly Trend"
            subtitle="Waiting hours over time"
          >
            <WaitingBarChart
              items={data.monthly.map((item) => ({
                name: item.month,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>
        </Box>

        <Box p={1.5}>
          <WaitingSection
            title="Highest Impact"
            subtitle="Main sources of waiting"
          >
            <Stack gap={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Top Waiting Reason
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {data.topReason?.reasonNameEn ?? "-"}
                </Typography>

                <Typography color="text.secondary">
                  {data.topReason
                    ? `${data.topReason.hours.toFixed(1)} h · ${data.topReason.events} events`
                    : "No data"}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Highest Waiting Installation
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {data.worstInstallation?.name ?? "-"}
                </Typography>

                <Typography color="text.secondary">
                  {data.worstInstallation
                    ? `${data.worstInstallation.hours.toFixed(1)} h · ${data.worstInstallation.events} events`
                    : "No data"}
                </Typography>
              </Box>
            </Stack>
          </WaitingSection>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
