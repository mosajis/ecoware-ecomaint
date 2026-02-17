import Elysia, { t } from "elysia";
import { daysAgo } from "@/helper";
import { prisma } from "@/utils/prisma";

export const ControllerStatistics = new Elysia().group("/statistics", (app) =>
  app.get(
    "/",
    async () => {
      const sevenDaysAgo = daysAgo(7);
      const thirtyDaysAgo = daysAgo(30);
      const now = new Date();

      // === Work Order Statistics ===
      const [total, completed, overdue, pending, current] = await Promise.all([
        // Total
        prisma.tblWorkOrder.count(),

        // Completed
        prisma.tblMaintLog.count(),

        // OverDue
        prisma.tblWorkOrder.count({
          where: {
            dueDate: { lt: sevenDaysAgo },
            workOrderStatusId: { notIn: [2, 3, 4] },
          },
        }),

        // Pending
        prisma.tblWorkOrder.count({
          where: {
            workOrderStatusId: 4,
          },
        }),

        // Current
        prisma.tblWorkOrder.count({
          where: {
            dueDate: {
              gte: sevenDaysAgo,
              lte: now,
            },
            workOrderStatusId: { notIn: [2, 3, 4] },
          },
        }),
      ]);

      // === Failure Report Statistics ===
      const [
        failureTotal,
        failureOpen,
        failureClosed,
        failureLastWeek,
        failureLastMonth,
      ] = await Promise.all([
        // Total
        prisma.tblFailureReports.count(),

        // Open (closedDateTime is null)
        prisma.tblFailureReports.count({
          where: { closedDateTime: null },
        }),

        // Closed (closedDateTime is not null)
        prisma.tblFailureReports.count({
          where: { closedDateTime: { not: null } },
        }),

        // Last Week (failureDateTime in last 7 days)
        prisma.tblFailureReports.count({
          where: {
            // failureDateTime: { gte: sevenDaysAgo },
          },
        }),

        // Last Month (failureDateTime in last 30 days)
        prisma.tblFailureReports.count({
          where: {
            // failureDateTime: { gte: thirtyDaysAgo },
          },
        }),
      ]);

      // === Unplanned Jobs Statistics ===
      const [unplannedLastWeek, unplannedLastMonth] = await Promise.all([
        // Last Week (workOrderId is null and dateDone in last 7 days)
        prisma.tblMaintLog.count({
          where: {
            workOrderId: null,
            dateDone: { gte: sevenDaysAgo },
          },
        }),

        // Last Month (workOrderId is null and dateDone in last 30 days)
        prisma.tblMaintLog.count({
          where: {
            workOrderId: null,
            dateDone: { gte: thirtyDaysAgo },
          },
        }),
      ]);

      // === Discipline Statistics ===
      const disciplineIds = {
        Electrician: 10001,
        Mechanic: 10002,
        "HSE Officer": 10005,
        Toolpusher: 10003,
        "Mud Engineer": 10114,
      };

      const disciplineStats: Record<
        string,
        {
          open: number;
          pending: number;
          overdue: number;
          current: number;
        }
      > = {};

      for (const [name, discId] of Object.entries(disciplineIds)) {
        const [open, pending, overdue, current] = await Promise.all([
          // Open (status in [2, 3, 4])
          prisma.tblWorkOrder.count({
            where: {
              respDiscId: discId,
              workOrderStatusId: { in: [2, 3, 4] },
            },
          }),

          // Pending (status = 4)
          prisma.tblWorkOrder.count({
            where: {
              respDiscId: discId,
              workOrderStatusId: 4,
            },
          }),

          // Overdue (status in [2, 3, 4] and dueDate < 7 days ago)
          prisma.tblWorkOrder.count({
            where: {
              respDiscId: discId,
              dueDate: { lt: sevenDaysAgo },
              workOrderStatusId: { in: [2, 3, 4] },
            },
          }),

          // Current (status in [2, 3, 4] and dueDate in last 7 days)
          prisma.tblWorkOrder.count({
            where: {
              respDiscId: discId,
              dueDate: {
                gte: sevenDaysAgo,
                lte: now,
              },
              workOrderStatusId: { in: [2, 3, 4] },
            },
          }),
        ]);

        disciplineStats[name] = { open, pending, overdue, current };
      }

      return {
        workOrder: {
          total,
          open: overdue + current,
          completed,
          overdue,
          pending,
          current,
        },
        failure: {
          total: failureTotal,
          open: failureOpen,
          closed: failureClosed,
          lastWeek: failureLastWeek,
          lastMonth: failureLastMonth,
        },
        unplanned: {
          lastWeek: unplannedLastWeek,
          lastMonth: unplannedLastMonth,
        },
        disciplines: disciplineStats,
      };
    },
    {
      response: t.Object({
        workOrder: t.Object({
          total: t.Number(),
          open: t.Number(),
          completed: t.Number(),
          overdue: t.Number(),
          pending: t.Number(),
          current: t.Number(),
        }),
        failure: t.Object({
          total: t.Number(),
          open: t.Number(),
          closed: t.Number(),
          lastWeek: t.Number(),
          lastMonth: t.Number(),
        }),
        unplanned: t.Object({
          lastWeek: t.Number(),
          lastMonth: t.Number(),
        }),
        disciplines: t.Record(
          t.String(),
          t.Object({
            open: t.Number(),
            pending: t.Number(),
            overdue: t.Number(),
            current: t.Number(),
          }),
        ),
      }),
      detail: {
        tags: ["Statistics"],
        summary: "Dashboard statistics",
      },
    },
  ),
);
