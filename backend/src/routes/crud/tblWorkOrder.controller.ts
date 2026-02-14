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
import { periodToDays } from "@/helper";

export const ServiceTblWorkOrder = new BaseService(prisma.tblWorkOrder);
export const WorkOrderItemSchema = t.Object({
  workOrderId: t.Number(),
  compId: t.Number(),

  title: t.String(),
  priority: t.Optional(t.String()),
  description: t.Optional(t.String()),
  userComment: t.Optional(t.String()),

  dueDate: t.Optional(t.String()),
  created: t.Optional(t.String()),
  started: t.Optional(t.String()),
  completed: t.Optional(t.String()),

  tblComponentUnit: t.Optional(
    t.Object({
      compId: t.Number(),
      compNo: t.String(),
      tblLocation: t.Optional(
        t.Object({
          name: t.String(),
        }),
      ),
    }),
  ),

  tblCompJob: t.Optional(
    t.Object({
      compJobId: t.Number(),
      nextDueDate: t.Optional(t.String()),
      tblJobDescription: t.Optional(
        t.Object({
          jobDescCode: t.String(),
          jobDescTitle: t.String(),
        }),
      ),
      tblPeriod: t.Optional(
        t.Object({
          name: t.String(),
        }),
      ),
    }),
  ),

  tblPendingType: t.Optional(
    t.Object({
      pendTypeName: t.String(),
    }),
  ),

  tblDiscipline: t.Optional(
    t.Object({
      name: t.String(),
    }),
  ),

  tblWorkOrderStatus: t.Optional(
    t.Object({
      name: t.String(),
    }),
  ),
});

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
                    jobDescTitle: true,
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
        data: t.Array(WorkOrderItemSchema),
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

    app.post(
      "/generate/next",
      async ({ body, set }) => {
        const { maintLogId, userId } = body;

        if (!maintLogId || !userId) {
          set.status = 400;
          return {
            message: "maintLogId and userId are required",
            success: false,
          };
        }

        return prisma.$transaction(async (tx) => {
          /* 1. MaintLog --------------------------------------------------------------------- */
          const maintLog = await tx.tblMaintLog.findUnique({
            where: { maintLogId },
            select: {
              maintLogId: true,
              workOrderId: true,
              dateDone: true,
            },
          });

          if (!maintLog || !maintLog.workOrderId) {
            set.status = 404;
            return {
              message: "MaintLog or WorkOrder not found",
              success: false,
            };
          }

          /* 2. WorkOrder --------------------------------------------------------------------- */
          const workOrder = await tx.tblWorkOrder.findUnique({
            where: { workOrderId: maintLog.workOrderId },
            select: {
              workOrderId: true,
              compJobId: true,
              dueDate: true,
              workOrderTypeId: true,
            },
          });

          if (!workOrder || !workOrder.compJobId) {
            set.status = 404;
            return {
              message: "CompJob not found in WorkOrder",
              success: false,
            };
          }

          if (workOrder.workOrderTypeId !== 1) {
            set.status = 400;
            return {
              message:
                "Only WorkOrder with workOrderTypeId = 1 can generate next WorkOrder",
              success: false,
            };
          }

          /* 3. CompJob ------------------------------------------------------------------------- */
          const compJob = await tx.tblCompJob.findUnique({
            where: { compJobId: workOrder.compJobId },
            include: {
              tblCompJobCounters: true,
              tblJobDescription: true,
              tblPeriod: true,
            },
          });

          if (!compJob) {
            set.status = 404;
            return {
              message: "CompJob not found",
              success: false,
            };
          }

          /* 5. nextDueDate ------------------------------------------------------------------- */
          const nextDueDateArray: Date[] = [];

          const isFixed = compJob.planningMethod === 1;

          if (
            (!isFixed && !maintLog.dateDone) ||
            (isFixed && !workOrder.dueDate)
          ) {
            set.status = 400;
            return {
              message: "Base date is missing for dueDate calculation",
              success: false,
            };
          }

          const baseDateDone = new Date(
            isFixed ? workOrder.dueDate! : maintLog.dateDone!,
          );

          const now = new Date();

          /* 6. Time Based calculation --------------------------------------------------------*/
          if (compJob.frequency && compJob.frequencyPeriod) {
            const days =
              compJob.frequency * periodToDays(compJob.frequencyPeriod);

            const calculatedDate = new Date(baseDateDone);
            calculatedDate.setDate(calculatedDate.getDate() + days);

            nextDueDateArray.push(calculatedDate);
          }

          // compcounter => avarage
          // comp
          /* 7. Counter-based calculation -------------------------------------------------------- */
          // compJob.tblCompJobCounters?.forEach(counter => {
          // if (counter.frequency) {
          //   const counterDate = new Date(baseDateDone);
          //   counterDate.setDate(counterDate.getDate() + counter.frequency);
          //   dateDoneArray.push(counterDate);
          // }
          // });

          /* 8. Final DueDate -------------------------------------------------------------------- */
          if (nextDueDateArray.length === 0) {
            nextDueDateArray.push(now);
          }

          const finalNextDueDate = new Date(
            Math.min(...nextDueDateArray.map((d) => d.getTime())),
          );

          /* 9. Create Next WorkOrder ------------------------------------------------------------ */
          const newWorkOrder = await tx.tblWorkOrder.create({
            data: {
              compJobId: compJob.compJobId,
              createdBy: userId,
              respDiscId: compJob.discId,
              compId: compJob.compId,
              title:
                compJob.tblJobDescription?.jobDescTitle ??
                "Faild to load jobDescTitle",
              priority: compJob.priority,
              window: compJob.window,
              dueDate: finalNextDueDate,
              created: now,
              lastupdate: now,
              workOrderStatusId: 2,
              workOrderTypeId: 1,
              exportMarker: 0,
            },
          });

          /* 10. Update CompJob ------------------------------------------------------------------- */
          await tx.tblCompJob.update({
            where: { compJobId: compJob.compJobId },
            data: {
              nextDueDate: finalNextDueDate,
              lastDone: maintLog.dateDone,
              lastupdate: now,
            },
          });

          /* 11. Response ------------------------------------------------------------------------- */
          return {
            message: "Next WorkOrder generated successfully",
            success: true,
            workOrderId: newWorkOrder.workOrderId,
            dueDate: finalNextDueDate,
            planningMethod: isFixed ? "Fixed" : "Variable",
          };
        });
      },
      {
        body: t.Object({
          maintLogId: t.Number(),
          userId: t.Number(),
        }),
        response: t.Object({
          message: t.String(),
          success: t.Boolean(),
          workOrderId: t.Optional(t.Number()),
          dueDate: t.Optional(t.Date()),
          planningMethod: t.Optional(t.String()),
        }),
        detail: {
          tags: ["tblWorkOrder"],
          summary: "Generate next WorkOrder from MaintLog",
        },
      },
    );
  },
}).app;

export default ControllerTblWorkOrder;
