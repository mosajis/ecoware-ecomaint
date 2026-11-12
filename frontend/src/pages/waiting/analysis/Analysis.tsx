import WaitingMetricCard from "../_components/WaitingMetricCard";
import WaitingSection from "../_components/WaitingSection";
import WaitingBarChart from "../_components/WaitingBarChart";
import WaitingEventsTable from "../_components/WaitingEventsTable";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Spinner from "@/shared/components/Spinner";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { PageHeader } from "@/shared/components/PageHeader";
import { atomRig } from "@/shared/atoms/general.atom";
import { getWaitingAnalysis, TypeWaitingAnalysis } from "@/core/api/api";

const Analysis = () => {
  const inst = useAtomValue(atomRig);

  const [data, setData] = useState<TypeWaitingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inst?.instId) {
      setLoading(false);
      return;
    }

    const initFetch = async () => {
      setLoading(true);

      try {
        const result = await getWaitingAnalysis({
          instId: inst.instId,
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
    <Box
      display="flex"
      flexDirection="column"
      gap={1.5}
      sx={{ width: "100%" }}
      p={1.5}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <PageHeader
        title="Waiting Analysis"
        subtitle={`Detailed analysis · ${inst?.name ?? ""}`}
      />

      {/* =====================================================
          KPI
      ===================================================== */}

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={1.5}
      >
        <WaitingMetricCard
          title="Total Waiting"
          value={`${summary.totalHours.toFixed(1)} h`}
          subtitle="Accumulated waiting"
        />

        <WaitingMetricCard
          title="Events"
          value={summary.totalEvents}
          subtitle="Registered events"
        />

        <WaitingMetricCard
          title="Average Duration"
          value={`${summary.averageDurationHours.toFixed(1)} h`}
          subtitle="Per event"
        />

        <WaitingMetricCard
          title="Waiting Days"
          value={summary.daysWithWaiting}
          subtitle="Affected days"
        />
      </Box>

      <Divider />

      {/* =====================================================
          MAIN ANALYSIS
      ===================================================== */}

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          lg: "minmax(0, 2fr) minmax(520px, 1fr)",
        }}
        gap={1.5}
      >
        {/* TOP REASONS - Primary */}
        <WaitingSection
          title="Top Reasons"
          subtitle="Reasons with the highest waiting time"
        >
          <WaitingBarChart
            maxItems={10}
            items={data.reasons.map((item) => ({
              name: item.reasonNameEn,
              value: item.hours,
              subtitle: `${item.reasonCode} · ${item.events} events`,
            }))}
          />
        </WaitingSection>

        {/* SECONDARY ANALYSIS */}
        <Box display="flex" flexDirection="column" gap={1.5}>
          <WaitingSection
            title="Reason Groups"
            subtitle="Waiting distribution by category"
          >
            <WaitingBarChart
              items={data.reasonGroups.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>

          <WaitingSection
            title="Shift Analysis"
            subtitle="Waiting distribution by shift"
          >
            <WaitingBarChart
              isHorizontal
              items={data.shifts.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>
          <WaitingSection title="NPT Class" subtitle="Waiting classification">
            <WaitingBarChart
              items={data.nptClasses.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>
          <WaitingSection
            title="Operation Phase"
            subtitle="Waiting by operational phase"
          >
            <WaitingBarChart
              items={data.operationPhases.map((item) => ({
                name: item.name,
                value: item.hours,
                subtitle: `${item.events} events`,
              }))}
            />
          </WaitingSection>
        </Box>
      </Box>

      {/* =====================================================
          OPERATIONAL ANALYSIS
      ===================================================== */}

      <Divider />

      {/* =====================================================
          EVENTS
      ===================================================== */}

      <WaitingSection
        title="Top Waiting Events"
        subtitle="Longest recorded waiting events"
      >
        <WaitingEventsTable events={data.topEvents} />
      </WaitingSection>
    </Box>
  );
};

export default Analysis;
