import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Spinner from "@/shared/components/Spinner";
import KpiSection from "./_components/KpiSection";
import { tblMaintLog, tblWorkOrder } from "@/core/api/generated/api";
import { useEffect, useMemo, useState } from "react";
import { buildWorkOrderKpis } from "./kpis/workOrderKpis";
import { buildFailureKpis } from "./kpis/failureKpis";
import { daysAgo } from "@/shared/utils/zodUtils";
import WorkOrdersPieChart from "./_components/charts/WorkOrdersPieChart";
import { buildGeneralKpis } from "./kpis/generalKpis";

export type WorkOrderCounts = {
  total: number;
  completed: number;
  overdue: number;
  pend: number;
  current: number;
  open: number;
};

const Dashboard = () => {
  const [counts, setCounts] = useState<WorkOrderCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);

      const [total, completed, overdue, pend, current] = await Promise.all([
        // total
        tblWorkOrder.count(),
        // completed
        tblMaintLog.count(),
        // overdue
        tblWorkOrder.count({
          filter: {
            dueDate: { lt: daysAgo(7) },
            workOrderStatusId: { notIn: [2, 3, 4] },
          },
        }),
        // pend
        tblWorkOrder.count({
          filter: {
            workOrderStatusId: { in: [4] },
          },
        }),
        // current
        tblWorkOrder.count({
          filter: {
            dueDate: {
              gte: daysAgo(7),
              lte: new Date(),
            },
            workOrderStatusId: { notIn: [2, 3, 4] },
          },
        }),
      ]);

      setCounts({
        open: overdue.count + current.count,
        total: total.count,
        completed: completed.count,
        overdue: overdue.count,
        pend: pend.count,
        current: current.count,
      });

      setLoading(false);
    };

    fetchCounts();
  }, []);

  if (loading || !counts) {
    return <Spinner />;
  }

  const workOrderKpis = buildWorkOrderKpis(counts);
  const generalKpis = buildGeneralKpis(counts);
  // const failureKpis = buildFailureKpis({
  //   total: woCalc.total,
  //   open: woCalc.open.value,
  // });

  return (
    <Box>
      {/* Row 1 */}
      <Stack
        display="grid"
        gridTemplateColumns="5fr auto 1fr "
        divider={<Divider orientation="vertical" />}
      >
        <Box>
          <KpiSection
            cols={5}
            title="Work Orders Statistics"
            subtitle="Current workload and completion status"
            kpis={workOrderKpis}
          />
          <Stack
            display="grid"
            gridTemplateColumns="1fr auto 1fr "
            divider={<Divider orientation="vertical" />}
          >
            <KpiSection
              cols={2}
              title="KPIs"
              subtitle="Unscheduled maintenance activities"
              kpis={generalKpis}
            />
            <KpiSection
              cols={3}
              title="KPIs"
              subtitle="Unscheduled maintenance activities"
              kpis={generalKpis}
            />
          </Stack>
        </Box>
        <KpiSection
          cols={1}
          title="KPIs"
          subtitle="Unscheduled maintenance activities"
          kpis={generalKpis}
        />
      </Stack>

      {/* <WorkOrdersPieChart counts={counts} /> */}
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default Dashboard;
