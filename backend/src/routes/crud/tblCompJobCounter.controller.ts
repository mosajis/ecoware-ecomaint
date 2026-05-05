import { BaseController, querySchema } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { t } from "elysia";

import {
  TblCompJobCounter,
  TblCompJobCounterInputCreate,
  TblCompJobCounterInputUpdate,
  TblCompJobCounterPlain,
} from "orm/generated/prismabox/TblCompJobCounter";

import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJobCounter = new BaseService(
  prisma.tblCompJobCounter,
);

const AlertItemSchema = t.Object({
  start: t.Object({
    lastDoneCount: t.Nullable(t.Number()),
    lastDone: t.Optional(t.Nullable(t.Date())),
  }),

  value: t.Object({
    currentValue: t.Optional(t.Nullable(t.Number())),
    currentDate: t.Optional(t.Nullable(t.Date())),
  }),

  end: t.Object({
    nextDueCount: t.Nullable(t.Number()),
    nextDueDate: t.Optional(t.Nullable(t.Date())),
  }),

  info: t.Object({
    componentName: t.Optional(t.Nullable(t.String())),
    jobDescTitle: t.String(),
    frequency: t.Optional(t.Nullable(t.Number())),
    status: t.Nullable(t.Boolean()),
  }),
});

const ControllerTblCompJobCounter = new BaseController({
  prefix: "/tblCompJobCounter",
  swagger: {
    tags: ["tblCompJobCounter"],
  },
  scope: true,
  primaryKey: "compJobCounterId",
  service: ServiceTblCompJobCounter,
  createSchema: TblCompJobCounterInputCreate,
  updateSchema: TblCompJobCounterInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompJobCounterPlain,
    TblCompJobCounter,
  ),

  extend: (app) => {
    /**
     * 🚨 ALERT ENDPOINT
     */
    app.get(
      "/alert",
      async ({ headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        const compJobCounters = await prisma.tblCompJobCounter.findMany({
          where: { showInAlert: true, instId },
          select: {
            nextDueCount: true,
            lastDoneCount: true,
            tblCompCounter: {
              select: {
                tblComponentUnit: {
                  select: {
                    compNo: true,
                  },
                },
                currentDate: true,
                currentValue: true,
              },
            },
            tblCompJob: {
              select: {
                lastDone: true,
                nextDueDate: true,
                frequency: true,
                tblJobDescription: {
                  select: {
                    jobDescTitle: true,
                  },
                },
              },
            },
          },
        });

        const items = compJobCounters.map((x) => {
          const lastDoneTime = x.tblCompJob?.lastDone?.getTime() ?? 0;
          const currentTime = x.tblCompCounter?.currentDate?.getTime() ?? 0;
          const nextDueTime = x.tblCompJob?.nextDueDate?.getTime() ?? 0;

          const lastDoneCount = x.lastDoneCount ?? 0;
          const currentCount = x.tblCompCounter?.currentValue ?? 0;
          const nextDueCount = x.nextDueCount ?? 0;

          const hasRequiredData = x.tblCompJob && x.tblCompCounter;

          const dateCondition =
            hasRequiredData &&
            currentTime >= lastDoneTime &&
            currentTime <= nextDueTime;

          const countCondition =
            hasRequiredData &&
            currentCount >= lastDoneCount &&
            currentCount <= nextDueCount;

          const status = dateCondition && countCondition;

          return {
            start: {
              lastDoneCount: x.lastDoneCount,
              lastDone: x.tblCompJob?.lastDone,
            },
            value: {
              currentValue: x.tblCompCounter?.currentValue,
              currentDate: x.tblCompCounter?.currentDate,
            },
            end: {
              nextDueCount: x.nextDueCount,
              nextDueDate: x.tblCompJob?.nextDueDate,
            },
            info: {
              componentName: x.tblCompCounter?.tblComponentUnit?.compNo,
              jobDescTitle:
                x.tblCompJob?.tblJobDescription?.jobDescTitle ?? "N/A",
              frequency: x.tblCompJob?.frequency,
              status,
            },
          };
        });

        return {
          items,
          total: items.length,
          page: 1,
          perPage: items.length,
          totalPages: 1,
        };
      },
      {
        tags: ["tblCompJobCounter"],
        query: querySchema,
        response: t.Object({
          items: t.Array(AlertItemSchema),
          total: t.Integer(),
          page: t.Integer(),
          perPage: t.Integer(),
          totalPages: t.Integer(),
        }),
        detail: {
          summary: "Get All Counters Alerts",
        },
      },
    );
  },
}).app;

export default ControllerTblCompJobCounter;
