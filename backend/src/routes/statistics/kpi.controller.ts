import Elysia, { t } from "elysia";
import { daysAgo } from "@/helper";
import { prisma } from "@/utils/prisma";
import { authPlugin } from "../auth/auth.guard";

// Query Parameters Schema برای بازه‌های زمانی
const KPIQuerySchema = t.Object({
  daysBack: t.Optional(t.Number({ default: 30 })), // تعداد روز برای محاسبه (پیش‌فرض: 30 روز)
  startDate: t.Optional(t.String()), // تاریخ شروع (ISO format)
  endDate: t.Optional(t.String()), // تاریخ پایان (ISO format)
});

// Response Schemas
const KPIMetricSchema = t.Object({
  value: t.Number(),
  numerator: t.Number(),
  denominator: t.Number(),
  percentage: t.Number(),
});

const KPIResponseSchema = t.Object({
  pmp: KPIMetricSchema, // Preventive Maintenance Performance
  pmc: KPIMetricSchema, // Preventive Maintenance Compliance
  backlogRatio: KPIMetricSchema, // Backlog Ratio (status 1,2,3)
  backlogRatioWithPend: KPIMetricSchema, // Backlog Ratio with Pending (status 1,2,3,4)
  timestamp: t.String(),
  period: t.Object({
    startDate: t.String(),
    endDate: t.String(),
  }),
});

// Helper function برای محاسبه overdue
const calculateOverdueFromDueDate = (
  dueDate: Date,
  referenceDate: Date = new Date(),
): number => {
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return 0;

  const diffDays = Math.ceil(
    (referenceDate.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays;
};

// Helper function برای دریافت بازه زمانی
const getDateRange = (query: any) => {
  let startDate: Date;
  let endDate: Date = new Date();

  if (query.startDate && query.endDate) {
    startDate = new Date(query.startDate);
    endDate = new Date(query.endDate);
  } else {
    const daysBack = query.daysBack || 30;
    startDate = daysAgo(daysBack);
  }

  return { startDate, endDate };
};

export const ControllerKPI = new Elysia().group("/statistics/kpi", (app) =>
  app
    .get(
      "/",
      async ({ headers, query }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        const { startDate, endDate } = getDateRange(query);

        // ===== 1. PMP  =====
        const pmpRoutineNumerator = await prisma.tblMaintLog.count({
          where: {
            instId,
            dateDone: {
              gte: startDate,
              lte: endDate,
            },
            unexpected: 0, // Routine only
          },
        });

        const pmpDenominator = await prisma.tblMaintLog.count({
          where: {
            instId,
            dateDone: {
              gte: startDate,
              lte: endDate,
            },
            unexpected: { in: [0, 1] }, // Routine + KPI unplanned
          },
        });

        const pmpPercentage =
          pmpDenominator > 0
            ? Math.round((pmpRoutineNumerator / pmpDenominator) * 100 * 100) /
              100
            : 0;

        // ===== 2. PMC  =====
        const pmcWorkOrders = await prisma.tblMaintLog.findMany({
          where: {
            instId,
            dateDone: {
              gte: startDate,
              lte: endDate,
            },
            unexpected: 0, // Only Routine
          },
          include: {
            tblWorkOrder: true,
          },
        });

        const pmcNumerator = pmcWorkOrders.filter((log) => {
          if (!log.tblWorkOrder?.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(log.tblWorkOrder.dueDate),
            new Date(log.dateDone || new Date()),
          );
          return overdueCount <= 7;
        }).length;

        const pmcDenominator = pmcWorkOrders.length;
        const pmcPercentage =
          pmcDenominator > 0
            ? Math.round((pmcNumerator / pmcDenominator) * 100 * 100) / 100
            : 0;

        // ===== 3. Backlog Ratio (overdue < -7) =====
        const NumeratorCount = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3] },
          },
          select: {
            dueDate: true,
          },
        });

        const backlogNumerator = NumeratorCount.filter((wo) => {
          if (!wo.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(),
            new Date(wo.dueDate),
          );
          return overdueCount < -7;
        }).length;

        // محاسبه تعداد workorder های با overdue <= 0
        const allOpenWorkOrders = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3] },
          },
          select: {
            workOrderId: true,
            dueDate: true,
          },
        });

        const backlogDenominator = allOpenWorkOrders.filter((wo) => {
          if (!wo.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(),
            new Date(wo.dueDate),
          );
          return overdueCount <= 0;
        }).length;

        const backlogRatioPercentage =
          backlogDenominator > 0
            ? Math.round((backlogNumerator / backlogDenominator) * 100 * 100) /
              100
            : 0;

        // ===== 4. Backlog Ratio with Pending =====
        const backlogWithPendWorkOrders = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3, 4] },
          },
        });

        const backlogWithPendNumerator = backlogWithPendWorkOrders.filter(
          (wo) => {
            if (!wo.dueDate) return false;
            const overdueCount = calculateOverdueFromDueDate(
              new Date(),
              new Date(wo.dueDate),
            );
            return overdueCount < -7;
          },
        ).length;

        const allOpenWithPendWorkOrders = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3, 4] },
          },
          select: {
            workOrderId: true,
            dueDate: true,
          },
        });

        const backlogWithPendDenominator = allOpenWithPendWorkOrders.filter(
          (wo) => {
            if (!wo.dueDate) return false;
            const overdueCount = calculateOverdueFromDueDate(
              new Date(wo.dueDate),
            );
            return overdueCount <= 0;
          },
        ).length;

        const backlogWithPendPercentage =
          backlogWithPendDenominator > 0
            ? Math.round(
                (backlogWithPendNumerator / backlogWithPendDenominator) *
                  100 *
                  100,
              ) / 100
            : 0;

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
            numerator: backlogNumerator,
            denominator: backlogDenominator,
            percentage: backlogRatioPercentage,
          },
          backlogRatioWithPend: {
            value: backlogWithPendPercentage,
            numerator: backlogWithPendNumerator,
            denominator: backlogWithPendDenominator,
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
    )

    // Route جداگانه برای هر KPI (optional)
    .get(
      "/pmp",
      async ({ headers, query }) => {
        const instId = Number(headers["x-inst-id"] || 0);
        if (!instId) throw new Error("Instance ID is required");

        const { startDate, endDate } = getDateRange(query);

        const [numerator, denominator] = await Promise.all([
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

        const percentage =
          denominator > 0
            ? Math.round((numerator / denominator) * 100 * 100) / 100
            : 0;

        return {
          pmp: {
            value: percentage,
            numerator,
            denominator,
            percentage,
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };
      },
      {
        query: KPIQuerySchema,
        detail: {
          tags: ["Statistics"],
          summary: "PMP Metric",
        },
      },
    )

    .get(
      "/pmc",
      async ({ headers, query }) => {
        const instId = Number(headers["x-inst-id"] || 0);
        if (!instId) throw new Error("Instance ID is required");

        const { startDate, endDate } = getDateRange(query);

        const pmcWorkOrders = await prisma.tblMaintLog.findMany({
          where: {
            instId,
            dateDone: { gte: startDate, lte: endDate },
            unexpected: { in: [0, 1] },
          },
          include: { tblWorkOrder: true },
        });

        const numerator = pmcWorkOrders.filter((log) => {
          if (!log.tblWorkOrder?.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(log.tblWorkOrder.dueDate),
            new Date(log.dateDone || new Date()),
          );
          return overdueCount <= 7;
        }).length;

        const percentage =
          pmcWorkOrders.length > 0
            ? Math.round((numerator / pmcWorkOrders.length) * 100 * 100) / 100
            : 0;

        return {
          pmc: {
            value: percentage,
            numerator,
            denominator: pmcWorkOrders.length,
            percentage,
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };
      },
      {
        query: KPIQuerySchema,
        detail: {
          tags: ["Statistics"],
          summary: "PMC Metric",
        },
      },
    )

    .get(
      "/backlog-ratio",
      async ({ headers, query }) => {
        const instId = Number(headers["x-inst-id"] || 0);
        if (!instId) throw new Error("Instance ID is required");

        const { startDate, endDate } = getDateRange(query);

        const numerator = await prisma.tblWorkOrder.count({
          where: {
            instId,
            dueDate: { lt: endDate },
            workOrderStatusId: { in: [1, 2, 3] },
          },
        });

        const allOpenWorkOrders = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3] },
          },
          select: { workOrderId: true, dueDate: true },
        });

        const denominator = allOpenWorkOrders.filter((wo) => {
          if (!wo.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(wo.dueDate),
          );
          return overdueCount <= 0;
        }).length;

        const percentage =
          denominator > 0
            ? Math.round((numerator / denominator) * 100 * 100) / 100
            : 0;

        return {
          backlogRatio: {
            value: percentage,
            numerator,
            denominator,
            percentage,
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };
      },
      {
        query: KPIQuerySchema,
        detail: {
          tags: ["Statistics"],
          summary: "Backlog Ratio (Status 1,2,3)",
        },
      },
    )

    .get(
      "/backlog-ratio-with-pend",
      async ({ headers, query }) => {
        const instId = Number(headers["x-inst-id"] || 0);
        if (!instId) throw new Error("Instance ID is required");

        const { startDate, endDate } = getDateRange(query);

        const numerator = await prisma.tblWorkOrder.count({
          where: {
            instId,
            dueDate: { lt: endDate },
            workOrderStatusId: { in: [1, 2, 3, 4] },
          },
        });

        const allOpenWithPendWorkOrders = await prisma.tblWorkOrder.findMany({
          where: {
            instId,
            workOrderStatusId: { in: [1, 2, 3, 4] },
          },
          select: { workOrderId: true, dueDate: true },
        });

        const denominator = allOpenWithPendWorkOrders.filter((wo) => {
          if (!wo.dueDate) return false;
          const overdueCount = calculateOverdueFromDueDate(
            new Date(wo.dueDate),
          );
          return overdueCount <= 0;
        }).length;

        const percentage =
          denominator > 0
            ? Math.round((numerator / denominator) * 100 * 100) / 100
            : 0;

        return {
          backlogRatioWithPend: {
            value: percentage,
            numerator,
            denominator,
            percentage,
          },
          period: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };
      },
      {
        query: KPIQuerySchema,
        detail: {
          tags: ["Statistics"],
          summary: "Backlog Ratio with Pending (Status 1,2,3,4)",
        },
      },
    ),
);
