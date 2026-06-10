import Elysia, { t } from "elysia";
import { daysAgo } from "@/helper";
import { prisma } from "@/utils/prisma";

// =======================
// Schemas
// =======================

const KPIQuerySchema = t.Object({
  daysBack: t.Optional(t.Number({ default: 30 })),
  startDate: t.Optional(t.String()),
  endDate: t.Optional(t.String()),
});

const KPIMetricSchema = t.Object({
  value: t.Number(),
  numerator: t.Number(),
  denominator: t.Number(),
  percentage: t.Number(),
});

const KPIResponseSchema = t.Object({
  pmp: KPIMetricSchema,
  pmc: KPIMetricSchema,
  backlogRatio: KPIMetricSchema,
  backlogRatioWithPend: KPIMetricSchema,
  timestamp: t.String(),
  period: t.Object({
    startDate: t.String(),
    endDate: t.String(),
  }),
});

// =======================
// Helpers
// =======================

const calculateOverdueFromDueDate = (
  dueDate: Date,
  referenceDate: Date = new Date(),
): number => {
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return 0;

  return Math.ceil(
    (referenceDate.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
  );
};

const getDateRange = (query: any) => {
  const endDate = new Date();

  const startDate =
    query.startDate && query.endDate
      ? new Date(query.startDate)
      : daysAgo(query.daysBack || 30);

  const realEndDate =
    query.startDate && query.endDate ? new Date(query.endDate) : endDate;

  return { startDate, endDate: realEndDate };
};

const percent = (num: number, den: number) =>
  den > 0 ? Math.round((num / den) * 10000) / 100 : 0;

// =======================
// Controller
// =======================

export const ControllerKPI = new Elysia().group("/statistics/kpi", (app) =>
  app.get(
    "/",
    async ({ headers, query }) => {
      const instId = Number(headers["x-inst-id"] || 0);
      if (!instId) throw new Error("Instance ID is required");

      const { startDate, endDate } = getDateRange(query);
      const now = new Date();

      // =======================
      // 1. PMP
      // =======================
      const [pmpRoutineNumerator, pmpDenominator] = await Promise.all([
        prisma.tblMaintLog.count({
          where: {
            instId,
            dateDone: { gte: startDate, lte: endDate },
            unexpected: 0,
          },
        }),
        prisma.tblMaintLog.count({
          where: {
            instId,
            dateDone: { gte: startDate, lte: endDate },
            unexpected: { in: [0, 1] },
          },
        }),
      ]);

      const pmpPercentage = percent(pmpRoutineNumerator, pmpDenominator);

      // =======================
      // 2. PMC
      // =======================
      const pmcLogs = await prisma.tblMaintLog.findMany({
        where: {
          instId,
          dateDone: { gte: startDate, lte: endDate },
          unexpected: 0,
        },
        select: {
          dateDone: true,
          tblWorkOrder: {
            select: { dueDate: true },
          },
        },
      });

      const pmcNumerator = pmcLogs.filter((log) => {
        if (!log.tblWorkOrder?.dueDate || !log.dateDone) return false;

        const overdue = calculateOverdueFromDueDate(
          new Date(log.tblWorkOrder.dueDate),
          new Date(log.dateDone),
        );

        return overdue <= 7;
      }).length;

      const pmcDenominator = pmcLogs.length;
      const pmcPercentage = percent(pmcNumerator, pmcDenominator);

      // =======================
      // 3. Backlog Ratio (1,2,3)
      // =======================
      const backlogWO = await prisma.tblWorkOrder.findMany({
        where: {
          instId,
          workOrderStatusId: { in: [1, 2, 3] },
          dueDate: { not: null },
        },
        select: { dueDate: true },
      });

      let backlogNum = 0;
      let backlogDen = 0;

      for (const wo of backlogWO) {
        const overdue = calculateOverdueFromDueDate(new Date(wo.dueDate!), now);

        if (overdue <= 0) {
          backlogDen++;
          if (overdue < -7) backlogNum++;
        }
      }

      const backlogRatioPercentage = percent(backlogNum, backlogDen);

      // =======================
      // 4. Backlog Ratio with Pending (1,2,3,4)
      // =======================
      const backlogPendWO = await prisma.tblWorkOrder.findMany({
        where: {
          instId,
          workOrderStatusId: { in: [1, 2, 3, 4] },
          dueDate: { not: null },
        },
        select: { dueDate: true },
      });

      let backlogPendNum = 0;
      let backlogPendDen = 0;

      for (const wo of backlogPendWO) {
        const overdue = calculateOverdueFromDueDate(new Date(wo.dueDate!), now);

        if (overdue <= 0) {
          backlogPendDen++;
          if (overdue < -7) backlogPendNum++;
        }
      }

      const backlogWithPendPercentage = percent(backlogPendNum, backlogPendDen);

      // =======================
      // Response
      // =======================
      return {
        pmp: {
          value: pmpPercentage,
          numerator: pmpRoutineNumerator,
          denominator: pmpDenominator,
          percentage: pmpPercentage,
        },
        pmc: {
          value: pmcPercentage,
          numerator: pmcNumerator,
          denominator: pmcDenominator,
          percentage: pmcPercentage,
        },
        backlogRatio: {
          value: backlogRatioPercentage,
          numerator: backlogNum,
          denominator: backlogDen,
          percentage: backlogRatioPercentage,
        },
        backlogRatioWithPend: {
          value: backlogWithPendPercentage,
          numerator: backlogPendNum,
          denominator: backlogPendDen,
          percentage: backlogWithPendPercentage,
        },
        timestamp: new Date().toISOString(),
        period: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      };
    },
    {
      query: KPIQuerySchema,
      response: KPIResponseSchema,
      detail: {
        tags: ["Statistics"],
        summary: "KPI Metrics",
      },
    },
  ),
);
