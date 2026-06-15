import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblCompCounterLog,
  TblCompCounterLogInputCreate,
  TblCompCounterLogInputUpdate,
  TblCompCounterLogPlain,
} from "orm/generated/prismabox/TblCompCounterLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompCounterLog = new BaseService(
  prisma.tblCompCounterLog,
);

const ControllerTblCompCounterLog = new BaseController({
  prefix: "/tblCompCounterLog",
  swagger: {
    tags: ["tblCompCounterLog"],
  },
  scope: true,
  primaryKey: "compCounterLogId",
  service: ServiceTblCompCounterLog,
  createSchema: TblCompCounterLogInputCreate,
  updateSchema: TblCompCounterLogInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompCounterLogPlain,
    TblCompCounterLog,
  ),

  extend: (app) => {
    app.get(
      "/",
      async ({ query, headers }) => {
        const { page = 1, perPage = 20 } = query;
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const take = perPage;

        const rows = await prisma.tblCompCounterLog.findMany({
          where: { instId },
          orderBy: { compCounterLogId: "desc" },
        });

        if (rows.length === 0) return [];

        const compCounterIds = [
          ...new Set(rows.map((r) => r.compCounterId)),
        ].filter((id) => id !== null) as number[];

        const counters = await prisma.tblCompCounter.findMany({
          where: {
            compCounterId: { in: compCounterIds },
          },
          select: {
            compCounterId: true,
            compId: true,
          },
        });

        const counterMap = new Map(counters.map((c) => [c.compCounterId, c]));

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // 👇 همه compId ها
        const compIds = [...new Set(counters.map((c) => c.compId))].filter(
          (id) => id !== null,
        ) as number[];

        // 🚀 گرفتن first/last log برای همه کمپ‌ها یکجا (حل N+1 اصلی)
        const logs = await prisma.tblCompCounterLog.findMany({
          where: {
            tblCompCounter: {
              compId: { in: compIds },
            },
            currentDate: {
              gte: sixMonthsAgo,
            },
          },
          orderBy: {
            currentDate: "asc",
          },
        });

        // گروه‌بندی لاگ‌ها بر اساس compId
        const logsByComp = new Map<number, typeof logs>();

        for (const log of logs) {
          const compId = (log as any).tblCompCounter?.compId;
          if (!compId) continue;

          if (!logsByComp.has(compId)) {
            logsByComp.set(compId, []);
          }

          logsByComp.get(compId)!.push(log);
        }

        // maintenance logs count (batch)
        const maintCounts = await prisma.tblMaintLog.groupBy({
          by: ["compId"],
          where: {
            unexpected: 1,
            compId: { in: compIds },
            dateDone: {
              gte: sixMonthsAgo,
            },
          },
          _count: true,
        });

        const maintMap = new Map(maintCounts.map((m) => [m.compId, m._count]));

        const enriched = rows.map((row) => {
          const counter = counterMap.get(row.compCounterId);

          if (!counter) {
            return { ...row, mtbf: 0 };
          }

          const compLogs = logsByComp.get(counter.compId) || [];

          if (compLogs.length === 0) {
            return { ...row, mtbf: 0 };
          }

          const firstLog = compLogs[0];
          const lastLog = compLogs[compLogs.length - 1];

          const numerator =
            (lastLog.currentValue ?? 0) - (firstLog.currentValue ?? 0);

          const maintLogs = maintMap.get(counter.compId) || 0;

          return {
            ...row,
            mtbf: maintLogs > 0 ? numerator / maintLogs : 0,
          };
        });

        return enriched;
      },
      {
        query: t.Any(),
        response: t.Array(
          t.Intersect([
            TblCompCounterLogPlain,
            t.Object({
              mtbf: t.Number(),
            }),
          ]),
        ),
      },
    );
  },
}).app;

export default ControllerTblCompCounterLog;
