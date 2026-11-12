import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Spinner from "@/shared/components/Spinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { atomRig } from "@/shared/atoms/general.atom";
import { useAtomValue } from "jotai";

import { getWaitingDashboard } from "@/core/api/api";

import {
  MetricCard,
  WaitingSection,
  WaitingBarList,
  WaitingDateFilter,
} from "../_components/WaitingShared";
import { WaitingDashboardData } from "../WaitingTypes";

const Dashboard = () => {
  const inst = useAtomValue(atomRig);
  const instId = inst?.instId;

  const [data, setData] = useState<WaitingDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getWaitingDashboard({
          instId,
        });

        if (active) setData(result);
      } catch (err) {
        if (active) {
          setError("Failed to load waiting dashboard.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [inst?.instId, startDate, endDate]);

  if (loading && !data) return <Spinner />;

  if (error && !data) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!data) return null;

  const { summary } = data;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <PageHeader
          title="Waiting Dashboard"
          subtitle="Overview of waiting time and operational losses"
        />

        <WaitingDateFilter
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </Stack>

      {loading && <Spinner />}

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={1.5}>
        {[
          {
            title: "Total Waiting Hours",
            value: summary.totalHours.toFixed(1),
            subtitle: "Total accumulated waiting time",
          },
          {
            title: "Total Events",
            value: summary.totalEvents,
            subtitle: "Registered waiting events",
          },
          {
            title: "Rigs with Waiting",
            value: summary.installationsWithWaiting ?? 0,
            subtitle: "Affected installations",
          },
          {
            title: "Days with Waiting",
            value: summary.daysWithWaiting,
            subtitle: "Distinct calendar days",
          },
          {
            title: "Average Duration",
            value: `${summary.averageDurationHours.toFixed(1)} h`,
            subtitle: "Average hours per event",
          },
        ].map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 2.4 }}>
            <MetricCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Divider />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <WaitingSection
            title="Waiting by Installation"
            subtitle="Total waiting hours per rig"
          >
            <WaitingBarList
              items={data.installations.map((x) => ({
                name: x.name,
                value: x.hours,
                subtitle: `${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <WaitingSection
            title="Waiting by Reason Group"
            subtitle="Distribution of operational losses"
          >
            <WaitingBarList
              items={data.reasonGroups.map((x) => ({
                name: x.name,
                value: x.hours,
                subtitle: `${x.events} events · ${(x.shareOfHours * 100).toFixed(1)}%`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <WaitingSection
            title="Monthly Waiting Trend"
            subtitle="Monthly accumulated waiting hours"
          >
            <WaitingBarList
              items={data.monthly.map((x) => ({
                name: x.month,
                value: x.hours,
                subtitle: `${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <WaitingSection
            title="Top Waiting Reason"
            subtitle="Reason with the highest accumulated hours"
          >
            {data.topReason ? (
              <Stack gap={1}>
                <Typography variant="h5" fontWeight={700}>
                  {data.topReason.reasonNameEn}
                </Typography>

                {data.topReason.reasonNameFa && (
                  <Typography color="text.secondary">
                    {data.topReason.reasonNameFa}
                  </Typography>
                )}

                <Typography variant="h4">
                  {data.topReason.hours.toFixed(1)} h
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {data.topReason.events} waiting events
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No waiting reason available
              </Typography>
            )}
          </WaitingSection>
        </Grid>

        <Grid size={12}>
          <WaitingSection
            title="Rig × Reason Group"
            subtitle="Waiting hours by installation and reason group"
          >
            <Box
              sx={{
                overflowX: "auto",
              }}
            >
              <Box
                display="grid"
                gridTemplateColumns="minmax(130px, 1fr) repeat(3, minmax(130px, 1fr))"
                gap={1}
                minWidth={550}
              >
                <Typography fontWeight={700}>Installation</Typography>
                {Array.from(
                  new Set(data.rigReasonGroups.map((x) => x.reasonGroup)),
                ).map((group) => (
                  <Typography key={group} fontWeight={700}>
                    {group}
                  </Typography>
                ))}

                {data.installations.map((rig) => (
                  <>
                    <Typography key={rig.instId}>{rig.name}</Typography>

                    {Array.from(
                      new Set(data.rigReasonGroups.map((x) => x.reasonGroup)),
                    ).map((group) => {
                      const value =
                        data.rigReasonGroups.find(
                          (x) =>
                            x.instId === rig.instId && x.reasonGroup === group,
                        )?.hours ?? 0;

                      return (
                        <Box
                          key={`${rig.instId}-${group}`}
                          bgcolor="action.hover"
                          borderRadius={1}
                          p={1}
                        >
                          <Typography fontWeight={700}>
                            {value.toFixed(1)} h
                          </Typography>
                        </Box>
                      );
                    })}
                  </>
                ))}
              </Box>
            </Box>
          </WaitingSection>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
