import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";

import {
  TblJobTrigger,
  TblJobTriggerInputCreate,
  TblJobTriggerInputUpdate,
  TblJobTriggerPlain,
} from "orm/generated/prismabox/TblJobTrigger";

export const ServiceTblJobTrigger = new BaseService(prisma.tblJobTrigger);

const ControllerTblJobTrigger = new BaseController({
  prefix: "/tblJobTrigger",
  swagger: {
    tags: ["tblJobTrigger"],
  },
  primaryKey: "jobTriggerId",
  service: ServiceTblJobTrigger,
  createSchema: TblJobTriggerInputCreate,
  updateSchema: TblJobTriggerInputUpdate,
  responseSchema: buildResponseSchema(TblJobTriggerPlain, TblJobTrigger),
  extend: (app) => {
    app.post(
      ":jobTriggerId/generate",
      async ({ params, body, set }) => {
        const { jobTriggerId } = params;
        const { userId } = body;

        if (!userId) {
          set.status = 400;
          return {
            message: "User not found",
            createdWorkOrders: 0,
            updatedCompJobs: 0,
          };
        }

        const now = new Date();

        return await prisma.$transaction(async (tx) => {
          const compJobs = await tx.tblCompJobTrigger.findMany({
            where: {
              jobTriggerId: Number(jobTriggerId),
            },
            select: {
              tblCompJob: {
                select: {
                  compJobId: true,
                  discId: true,
                  compId: true,
                  priority: true,
                  window: true,
                  tblJobDescription: {
                    select: {
                      jobDescTitle: true,
                    },
                  },
                },
              },
            },
          });

          const validCompJobs = compJobs
            .map((i) => i.tblCompJob)
            .filter(Boolean);

          if (!validCompJobs.length) {
            return {
              message: "nothing to generate",
              createdWorkOrders: 0,
              updatedCompJobs: 0,
            };
          }

          const workOrders = validCompJobs.map((i) => ({
            createdBy: userId,
            compJobId: i!.compJobId,
            respDiscId: i!.discId,
            compId: i!.compId,
            title: i!.tblJobDescription?.jobDescTitle ?? null,
            priority: i!.priority,
            window: i!.window,
            dueDate: now,
            created: now,
            lastupdate: now,
            workOrderStatusId: 2,
            exportMarker: 0,
            workOrderTypeId: 3,
          }));

          const resultWorkOrder = await tx.tblWorkOrder.createMany({
            data: workOrders,
          });

          const resultCompJob = await tx.tblCompJob.updateMany({
            where: {
              compJobId: {
                in: validCompJobs.map((i) => i!.compJobId),
              },
            },
            data: {
              nextDueDate: now,
              lastupdate: now,
            },
          });

          return {
            message: "ok",
            createdWorkOrders: resultWorkOrder.count,
            updatedCompJobs: resultCompJob.count,
          };
        });
      },
      {
        body: t.Object({
          userId: t.Number(),
        }),
        response: t.Object({
          message: t.String(),
          createdWorkOrders: t.Number(),
          updatedCompJobs: t.Number(),
        }),
        detail: {
          tags: ["WorkOrder"],
          summary: "Generate WorkOrders from JobTrigger",
        },
      },
    );
  },
}).app;

export default ControllerTblJobTrigger;
