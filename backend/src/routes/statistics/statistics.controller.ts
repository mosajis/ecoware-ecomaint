import Elysia, { t } from "elysia";
import { daysAgo } from "@/helper";
import { prisma } from "@/utils/prisma";

export const ControllerStatistics = new Elysia().group("/statistics", (app) =>
  app.get(
    "/",
    async () => {
      const sevenDaysAgo = daysAgo(7);
      const now = new Date();

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

      return {
        open: overdue + current,
        total,
        completed,
        overdue,
        pending,
        current,
      };
    },
    {
      response: t.Object({
        total: t.Number(),
        open: t.Number(),
        completed: t.Number(),
        overdue: t.Number(),
        pending: t.Number(),
        current: t.Number(),
      }),
      detail: {
        tags: ["Statistics"],
        summary: "Dashboard statistics",
      },
    },
  ),
);
