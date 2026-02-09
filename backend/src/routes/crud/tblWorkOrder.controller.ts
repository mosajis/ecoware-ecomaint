import { t } from "elysia";
import {
  BaseController,
  parseSortString,
  querySchema,
} from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import {
  TblWorkOrder,
  TblWorkOrderInputCreate,
  TblWorkOrderInputUpdate,
  TblWorkOrderPlain,
} from "orm/generated/prismabox/TblWorkOrder";

export const ServiceTblWorkOrder = new BaseService(prisma.tblWorkOrder);

const ControllerTblWorkOrder = new BaseController({
  prefix: "/tblWorkOrder",
  swagger: {
    tags: ["tblWorkOrder"],
  },
  primaryKey: "workOrderId",
  service: ServiceTblWorkOrder,
  createSchema: TblWorkOrderInputCreate,
  updateSchema: TblWorkOrderInputUpdate,
  responseSchema: buildResponseSchema(TblWorkOrderPlain, TblWorkOrder),
  extend: (app) => {
    app.get(
      "/",
      async ({ query }) => {
        const {
          page = 1,
          perPage = 20,
          sort,
          filter,
          paginate = false,
        } = query;

        const parsedFilter = filter ? JSON.parse(filter) : {};

        const sortObj = parseSortString(sort);
        const usePagination = !!paginate;

        return await ServiceTblWorkOrder.findAll({
          where: parsedFilter,
          orderBy: sortObj,
          page: usePagination ? Number(page) : 1,
          perPage: usePagination ? Number(perPage) : Number.MAX_SAFE_INTEGER,
          select: {
            // Primary Keys
            workOrderId: true,
            compId: true,

            // Main Fields
            title: true,
            priority: true,
            description: true,
            userComment: true,

            // Date Fields
            dueDate: true,
            created: true,
            started: true,
            completed: true,

            // Relations
            tblComponentUnit: {
              select: {
                compId: true,
                compNo: true,
                tblLocation: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            tblCompJob: {
              select: {
                compJobId: true,
                nextDueDate: true,
                tblJobDescription: {
                  select: {
                    jobDescCode: true,
                    jobDesc: true,
                  },
                },
                tblPeriod: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            tblPendingType: {
              select: {
                pendTypeName: true,
              },
            },
            tblDiscipline: {
              select: {
                name: true,
              },
            },
            tblWorkOrderStatus: {
              select: {
                name: true,
              },
            },
          },
        });
      },
      {
        tags: ["tblWorkOrder"],
        detail: { summary: "Get all with custom select" },
        query: querySchema,
        response: t.Any(),
      },
    );
    app.post(
      "/generate",
      async ({ body, set }) => {
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
          const compJobs = await tx.tblCompJob.findMany({
            where: { nextDueDate: null },
            select: {
              compJobId: true,
              discId: true,
              compId: true,
              priority: true,
              window: true,
              tblJobDescription: {
                select: { jobDescTitle: true },
              },
            },
          });

          if (!compJobs.length) {
            return {
              message: "nothing to generate",
              createdWorkOrders: 0,
              updatedCompJobs: 0,
            };
          }

          const workOrders = compJobs.map((i) => ({
            createdBy: userId,
            respDiscId: i.discId,
            compId: i.compId,
            title: i.tblJobDescription?.jobDescTitle ?? null,
            priority: i.priority,
            window: i.window,
            dueDate: now,
            created: now,
            lastupdate: now,
            workOrderStatusId: 2,
            exportMarker: 0,
            workOrderTypeId: 2,
          }));

          const resultWorkOrder = await tx.tblWorkOrder.createMany({
            data: workOrders,
          });

          const resultCompJob = await tx.tblCompJob.updateMany({
            where: {
              compJobId: { in: compJobs.map((i) => i.compJobId) },
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
          summary: "Generate WorkOrders from CompJobs",
        },
      },
    );

    app.post("/generate/next", async ({ params, body, set }) => {});
  },
}).app;

export default ControllerTblWorkOrder;
