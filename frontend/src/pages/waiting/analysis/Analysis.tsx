import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Spinner from "@/shared/components/Spinner";
import { PageHeader } from "@/shared/components/PageHeader";
import { atomRig } from "@/shared/atoms/general.atom";
import { useAtomValue } from "jotai";

import { getWaitingAnalysis } from "@/core/api/api";

import {
  MetricCard,
  WaitingSection,
  WaitingBarList,
  WaitingDateFilter,
} from "../_components/WaitingShared";
import { WaitingAnalysisData } from "../WaitingTypes";

const Analysis = () => {
  const inst = useAtomValue(atomRig);
  const instId = inst?.instId;

  const [data, setData] = useState<WaitingAnalysisData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!inst?.instId) {
      setData(null);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getWaitingAnalysis({
          instId,
        });

        if (active) setData(result);
      } catch {
        if (active) {
          setError("Failed to load waiting analysis.");
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

  if (!inst?.instId) {
    return (
      <Typography color="text.secondary">
        Please select an installation.
      </Typography>
    );
  }

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
          title="Waiting Analysis"
          subtitle={`Detailed waiting analysis · ${inst.name}`}
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Events"
            value={summary.totalEvents}
            subtitle="Registered waiting events"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Total Waiting"
            value={`${summary.totalHours.toFixed(1)} h`}
            subtitle="Accumulated waiting hours"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Average Duration"
            value={`${summary.averageDurationHours.toFixed(1)} h`}
            subtitle="Average hours per event"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Waiting Days"
            value={summary.daysWithWaiting}
            subtitle="Distinct days with waiting"
          />
        </Grid>
      </Grid>

      <Divider />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <WaitingSection
            title="Reason Group Analysis"
            subtitle="Waiting hours by reason group"
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

        <Grid size={{ xs: 12, md: 6 }}>
          <WaitingSection
            title="Top Waiting Reasons"
            subtitle="Reasons ranked by accumulated hours"
          >
            <WaitingBarList
              items={data.reasons.map((x) => ({
                name: x.reasonNameEn,
                value: x.hours,
                subtitle: `${x.reasonCode} · ${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WaitingSection
            title="NPT Classification"
            subtitle="Distribution by NPT class"
          >
            <WaitingBarList
              items={data.nptClasses.map((x) => ({
                name: x.name,
                value: x.hours,
                subtitle: `${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WaitingSection
            title="Operation Phase"
            subtitle="Waiting hours by operation phase"
          >
            <WaitingBarList
              items={data.operationPhases.map((x) => ({
                name: x.name,
                value: x.hours,
                subtitle: `${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <WaitingSection
            title="Shift Analysis"
            subtitle="Waiting hours by shift"
          >
            <WaitingBarList
              items={data.shifts.map((x) => ({
                name: x.name,
                value: x.hours,
                subtitle: `${x.events} events`,
              }))}
            />
          </WaitingSection>
        </Grid>

        <Grid size={12}>
          <WaitingSection
            title="Waiting Events"
            subtitle="Latest and longest waiting events"
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Event Code</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Reason Group</TableCell>
                    <TableCell>Operation Phase</TableCell>
                    <TableCell>NPT Class</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.topEvents.map((event) => (
                    <TableRow key={event.waitingEventId} hover>
                      <TableCell>{event.eventCode ?? "-"}</TableCell>

                      <TableCell>
                        {new Date(event.startDateTime).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {new Date(event.endDateTime).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {event.reason?.nameEn ?? "Custom / Unspecified"}
                      </TableCell>

                      <TableCell>{event.reasonGroup ?? "-"}</TableCell>

                      <TableCell>{event.operationPhase ?? "-"}</TableCell>

                      <TableCell>{event.nptClass ?? "-"}</TableCell>

                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          {event.durationHours.toFixed(1)} h
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}

                  {data.topEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No waiting events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </WaitingSection>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analysis;
