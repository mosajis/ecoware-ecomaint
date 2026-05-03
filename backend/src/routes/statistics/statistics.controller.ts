import Elysia, { t } from "elysia";
import { daysAgo } from "@/helper";
import { prisma } from "@/utils/prisma";
import { authPlugin } from "../auth/auth.guard";

export const ControllerStatistics = new Elysia()
  .use(authPlugin)
  .group("/statistics", (app) =>
    app.get(
      "/",
      async ({ userId, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        const sevenDaysAgo = daysAgo(7);
        const thirtyDaysAgo = daysAgo(30);
        const now = new Date();

        // === Work Order Statistics ===
        const [
          total,
          completed,
          overdue,
          pending,
          current,
          postponed,
          plan,
          issue,
        ] = await Promise.all([
          // Total
          prisma.tblWorkOrder.count({
            where: {
              instId,
            },
          }),

          // Completed
          prisma.tblMaintLog.count({
            where: {
              instId,
            },
          }),

          // OverDue
          prisma.tblWorkOrder.count({
            where: {
              instId,
              dueDate: { lt: sevenDaysAgo },
              workOrderStatusId: { in: [2, 3, 4] },
            },
          }),

          // Pending
          prisma.tblWorkOrder.count({
            where: {
              instId,
              workOrderStatusId: 4,
            },
          }),

          // Current
          prisma.tblWorkOrder.count({
            where: {
              instId,
              dueDate: {
                gt: sevenDaysAgo,
                lt: now,
              },
              workOrderStatusId: { in: [2, 3, 4] },
            },
          }),

          // PostPoned
          prisma.tblWorkOrder.count({
            where: {
              instId,
              workOrderStatusId: 8,
            },
          }),

          // Plan
          prisma.tblWorkOrder.count({
            where: {
              instId,
              dueDate: {
                lt: now,
              },
              workOrderStatusId: 2,
            },
          }),

          // Issue
          prisma.tblWorkOrder.count({
            where: {
              instId,
              dueDate: {
                lt: now,
              },
              workOrderStatusId: 3,
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
          prisma.tblFailureReport.count({
            where: {
              instId,
            },
          }),

          // Open (closedDateTime is null)
          prisma.tblFailureReport.count({
            where: { closedDateTime: null, instId },
          }),

          // Closed (closedDateTime is not null)
          prisma.tblFailureReport.count({
            where: { closedDateTime: { not: null }, instId },
          }),

          // Last Week (failureDateTime in last 7 days)
          prisma.tblFailureReport.count({
            where: {
              instId,
              tblMaintLog: {
                dateDone: { gte: sevenDaysAgo },
              },
            },
          }),

          // Last Month (failureDateTime in last 30 days)
          prisma.tblFailureReport.count({
            where: {
              instId,
              tblMaintLog: {
                dateDone: { gte: sevenDaysAgo },
              },
            },
          }),
        ]);

        // === Unplanned Jobs Statistics ===
        const [unplannedLastWeek, unplannedLastMonth] = await Promise.all([
          // Last Week (workOrderId is null and dateDone in last 7 days)
          prisma.tblMaintLog.count({
            where: {
              instId,
              workOrderId: null,
              unexpected: 1,
              dateDone: { gte: sevenDaysAgo },
            },
          }),

          // Last Month (workOrderId is null and dateDone in last 30 days)
          prisma.tblMaintLog.count({
            where: {
              instId,
              workOrderId: null,
              unexpected: 1,
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
                instId,
                respDiscId: discId,
                dueDate: { lt: now },
                workOrderStatusId: { in: [2, 3, 4] },
              },
            }),

            // Pending (status = 4)
            prisma.tblWorkOrder.count({
              where: {
                instId,
                respDiscId: discId,
                workOrderStatusId: 4,
              },
            }),

            // Overdue (status in [2, 3, 4] and dueDate < 7 days ago)
            prisma.tblWorkOrder.count({
              where: {
                instId,
                respDiscId: discId,
                dueDate: { lt: sevenDaysAgo },
                workOrderStatusId: { in: [2, 3, 4] },
              },
            }),

            // Current (status in [2, 3, 4] and dueDate in last 7 days)
            prisma.tblWorkOrder.count({
              where: {
                respDiscId: discId,
                instId,
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
            plan,
            issue,
            total,
            open: overdue + current,
            completed,
            overdue,
            pending,
            current,
            postponed,
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
        response: t.Any(),
        detail: {
          tags: ["Statistics"],
          summary: "Dashboard statistics",
        },
      },
    ),
  );
