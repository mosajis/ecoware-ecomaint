import { useEffect, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import Spinner from "@/shared/components/Spinner";
import CardSection from "../dashboard/_components/CardSection";
import GenericDataGrid from "@/shared/components/dataGrid/DataGrid";
import { PageHeader } from "@/shared/components/PageHeader";

import { getStatistics, getStatisticsKpi, TypeKPI } from "@/core/api/api";

import {
  tblUserInstallation,
  TypeTblInstallation,
} from "@/core/api/generated/api";

import { TypeStatistics } from "@/core/api/api.types";
import { atomUser } from "../auth/auth.atom";
import { useAtomValue } from "jotai";

type DashboardItem = {
  installation: TypeTblInstallation;
  statistics: TypeStatistics;
  kpi: TypeKPI;
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);

  const user = useAtomValue(atomUser);

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);

        const res = await tblUserInstallation.getAll({
          filter: { userId: user?.userId },
          include: { tblInstallation: true },
        });

        const data = await Promise.all(
          res.items.map(async (item: any) => {
            const installation = item.tblInstallation;

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
      } finally {
        setLoading(false);
      }
    };

    initFetch();
  }, [user?.userId]);

  const summary = useMemo(() => {
    return dashboardData.reduce(
      (acc, item) => {
        acc.totalWO += item.statistics.workOrder.total;
        acc.openWO += item.statistics.workOrder.open;
        acc.overdueWO += item.statistics.workOrder.overdue;
        acc.completedWO += item.statistics.workOrder.completed;

        acc.pmc += item.kpi.pmc.percentage;
        acc.pmp += item.kpi.pmp.percentage;

        return acc;
      },
      {
        totalWO: 0,
        openWO: 0,
        overdueWO: 0,
        completedWO: 0,
        pmc: 0,
        pmp: 0,
      },
    );
  }, [dashboardData]);

  const summaryCards = [
    {
      label: "Installations",
      value: dashboardData.length,
      color: "#1976d2",
    },
    {
      label: "Total WO",
      value: summary.totalWO,
      color: "#1976d2",
    },
    {
      label: "Open WO",
      value: summary.openWO,
      color: "#ed6c02",
    },
    {
      label: "Overdue WO",
      value: summary.overdueWO,
      color: "#d32f2f",
    },
    {
      label: "Completed WO",
      value: summary.completedWO,
      color: "#2e7d32",
    },
    {
      label: "Avg PMC",
      value:
        dashboardData.length > 0
          ? (summary.pmc / dashboardData.length).toFixed(1) + "%"
          : "0%",
      color: "#0288d1",
    },
  ];

  const rows = dashboardData.map((item) => ({
    id: item.installation.instId,

    installation: item.installation.name,

    totalWO: item.statistics.workOrder.total,
    openWO: item.statistics.workOrder.open,
    overdueWO: item.statistics.workOrder.overdue,
    completedWO: item.statistics.workOrder.completed,
    pendingWO: item.statistics.workOrder.pending,
    currentWO: item.statistics.workOrder.current,

    pmc: item.kpi.pmc.percentage,
    pmp: item.kpi.pmp.percentage,
    backlog: item.kpi.backlogRatio.percentage,

    healthScore: Math.max(
      0,
      Math.round(
        item.kpi.pmc.percentage * 0.5 +
          item.kpi.pmp.percentage * 0.3 -
          item.statistics.workOrder.overdue * 2,
      ),
    ),

    status:
      item.statistics.workOrder.overdue > 20
        ? "Critical"
        : item.statistics.workOrder.overdue > 5
          ? "Warning"
          : "Healthy",
  }));

  const criticalInstallations = [...rows]
    .sort((a, b) => b.overdueWO - a.overdueWO)
    .slice(0, 5);

  const bestInstallations = [...rows].sort((a, b) => b.pmc - a.pmc).slice(0, 5);

  const columns = [
    {
      field: "installation",
      headerName: "Installation",
      flex: 1.5,
    },
    {
      field: "totalWO",
      headerName: "Total WO",
      width: 120,
    },
    {
      field: "openWO",
      headerName: "Open",
      width: 100,
    },
    {
      field: "overdueWO",
      headerName: "Overdue",
      width: 120,
    },
    {
      field: "completedWO",
      headerName: "Completed",
      width: 120,
    },
    {
      field: "pmc",
      headerName: "PMC %",
      width: 120,
    },
    {
      field: "pmp",
      headerName: "PMP %",
      width: 120,
    },
    {
      field: "backlog",
      headerName: "Backlog %",
      width: 140,
    },
    {
      field: "healthScore",
      headerName: "Health",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: any) => (
        <Chip
          size="small"
          color={
            params.value === "Critical"
              ? "error"
              : params.value === "Warning"
                ? "warning"
                : "success"
          }
          label={params.value}
        />
      ),
    },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <PageHeader
        title="Maintenance Overview"
        subtitle="Executive dashboard across all installations"
      />

      <CardSection
        cols={6}
        title="Executive Summary"
        subtitle="Overall fleet statistics"
        cards={summaryCards}
      />

      <Divider />

      <Stack direction="row" spacing={2}>
        <Paper sx={{ p: 2, flex: 1 }} variant="outlined">
          <Typography variant="subtitle1" fontWeight={600}>
            Critical Installations
          </Typography>

          <Box mt={2}>
            {criticalInstallations.map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                py={0.75}
              >
                <Typography>{item.installation}</Typography>

                <Chip
                  size="small"
                  color="error"
                  label={`${item.overdueWO} overdue`}
                />
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 2, flex: 1 }} variant="outlined">
          <Typography variant="subtitle1" fontWeight={600}>
            Best Installations
          </Typography>

          <Box mt={2}>
            {bestInstallations.map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                py={0.75}
              >
                <Typography>{item.installation}</Typography>

                <Chip size="small" color="success" label={`PMC ${item.pmc}%`} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Stack>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          KPI Heatmap
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns="2fr 1fr 1fr 1fr"
          gap={1}
          alignItems="center"
        >
          <Typography fontWeight={700}>Installation</Typography>
          <Typography fontWeight={700}>PMC</Typography>
          <Typography fontWeight={700}>PMP</Typography>
          <Typography fontWeight={700}>Backlog</Typography>

          {rows.map((row) => (
            <>
              <Typography>{row.installation}</Typography>

              <Chip
                size="small"
                color={
                  row.pmc >= 90
                    ? "success"
                    : row.pmc >= 80
                      ? "warning"
                      : "error"
                }
                label={`${row.pmc}%`}
              />

              <Chip
                size="small"
                color={
                  row.pmp >= 90
                    ? "success"
                    : row.pmp >= 80
                      ? "warning"
                      : "error"
                }
                label={`${row.pmp}%`}
              />

              <Chip
                size="small"
                color={
                  row.backlog <= 5
                    ? "success"
                    : row.backlog <= 10
                      ? "warning"
                      : "error"
                }
                label={`${row.backlog}%`}
              />
            </>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Overdue Ranking
        </Typography>

        {criticalInstallations.map((item, index) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            py={0.5}
          >
            <Typography>
              #{index + 1} {item.installation}
            </Typography>

            <Chip
              size="small"
              color={
                item.overdueWO > 20
                  ? "error"
                  : item.overdueWO > 5
                    ? "warning"
                    : "success"
              }
              label={item.overdueWO}
            />
          </Box>
        ))}
      </Paper>

      <PageHeader
        title="Installation Comparison"
        subtitle="Compare maintenance performance across installations"
      />

      <GenericDataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        disableAdd
      />
    </Box>
  );
}
