import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

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

const ControllerTblCompJobCounter = new BaseController({
  prefix: "/tblCompJobCounter",
  swagger: {
    tags: ["tblCompJobCounter"],
  },
  primaryKey: "compJobCounterId",
  service: ServiceTblCompJobCounter,
  createSchema: TblCompJobCounterInputCreate,
  updateSchema: TblCompJobCounterInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompJobCounterPlain,
    TblCompJobCounter,
  ),
  extend: (app) => {
    app.get(
      "/alert",
      async ({ params, body, set }) => {
        const compJobCounters = await prisma.tblCompJobCounter.findMany({
          where: { showInAlert: true },
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

        const result = compJobCounters.map((x) => {
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

        return result;
      },
      {
        tags: ["tblCompJobCounter"],
        detail: {
          summary: "Get All Counters Alerts",
        },
      },
    );
  },
}).app;

export default ControllerTblCompJobCounter;
