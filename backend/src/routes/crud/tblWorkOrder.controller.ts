import { t } from "elysia";
import {
  BaseController,
  parseSortString,
  querySchema,
} from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { responseSchemaList } from "@/types";
import { prisma } from "@/utils/prisma";
import { periodToDays } from "@/helper";
import {
  TblWorkOrder,
  TblWorkOrderInputCreate,
  TblWorkOrderInputUpdate,
  TblWorkOrderPlain,
} from "orm/generated/prismabox/TblWorkOrder";
import { TblComponentUnit } from "orm/generated/prismabox/TblComponentUnit";
import { TblLocation } from "orm/generated/prismabox/TblLocation";
import { TblCompJob } from "orm/generated/prismabox/TblCompJob";
import { TblJobDescription } from "orm/generated/prismabox/TblJobDescription";
import { TblPeriod } from "orm/generated/prismabox/TblPeriod";
import { TblPendingType } from "orm/generated/prismabox/TblPendingType";
import { TblDiscipline } from "orm/generated/prismabox/TblDiscipline";
import { TblWorkOrderStatus } from "orm/generated/prismabox/TblWorkOrderStatus";
import { authPlugin } from "../auth/auth.guard";
import type { Prisma } from "orm/generated/prisma/client";

// =========================
// SELECT
// =========================
const workOrderListSelect = {
  workOrderId: true,
  compId: true,
  pendingdate: true,
  issuedDate: true,
  title: true,
  priority: true,
  description: true,
  userComment: true,
  window: true,
  dueDate: true,
  created: true,
  started: true,
  completed: true,
  woNo: true,

  tblComponentUnit: {
    select: {
      compId: true,
      compNo: true,
      serialNo: true,
      isCritical: true,
      notes: true,
      tblLocation: {
        select: { name: true },
      },
    },
  },

  tblCompJob: {
    select: {
      jobDescId: true,
      frequency: true,
      compJobId: true,
      nextDueDate: true,
      tblJobDescription: {
        select: {
          jobDescCode: true,
          jobDescTitle: true,
          jobDesc: true,
        },
      },
      tblPeriod: {
        select: { name: true },
      },
    },
  },

  tblPendingType: {
    select: { pendTypeName: true, description: true },
  },

  tblDiscipline: {
    select: { name: true },
  },

  tblWorkOrderStatus: {
    select: { name: true },
  },
} satisfies Prisma.TblWorkOrderSelect;

export type WorkOrderItem = Prisma.TblWorkOrderGetPayload<{
  select: typeof workOrderListSelect;
}>;

// =========================
// SCHEMA
// =========================
export const WorkOrderItemSchema = t.Object({
  ...t.Pick(TblWorkOrder, [
    "workOrderId",
    "compId",
    "pendingdate",
    "issuedDate",
    "title",
    "priority",
    "description",
    "created",
    "woNo",
    "started",
    "dueDate",
    "window",
    "completed",
    "userComment",
  ]).properties,

  tblComponentUnit: t.Nullable(
    t.Object({
      ...t.Pick(TblComponentUnit, [
        "compId",
        "compNo",
        "serialNo",
        "isCritical",
        "notes",
      ]).properties,
      tblLocation: t.Nullable(t.Pick(TblLocation, ["name"])),
    }),
  ),

  tblCompJob: t.Nullable(
    t.Object({
      ...t.Pick(TblCompJob, [
        "jobDescId",
        "compJobId",
        "frequency",
        "nextDueDate",
      ]).properties,
      tblJobDescription: t.Nullable(
        t.Pick(TblJobDescription, ["jobDescCode", "jobDescTitle", "jobDesc"]),
      ),
      tblPeriod: t.Nullable(t.Pick(TblPeriod, ["name"])),
    }),
  ),

  tblPendingType: t.Nullable(
    t.Pick(TblPendingType, ["pendTypeName", "description"]),
  ),
  tblDiscipline: t.Nullable(t.Pick(TblDiscipline, ["name"])),
  tblWorkOrderStatus: t.Nullable(t.Pick(TblWorkOrderStatus, ["name"])),
});

// =========================
// SERVICE
// =========================
export const ServiceTblWorkOrder = new BaseService(prisma.tblWorkOrder);

// =========================
// CONTROLLER
// =========================
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
  scope: true,

  extend: (app) => {
    // =========================
    // GET LIST
    // =========================
    app.get(
      "/",
      async ({ query, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const {
          page = 1,
          perPage = 20,
          sort,
          filter,
          paginate = false,
        } = query;

        const parsedFilter = filter ? JSON.parse(filter) : {};
        const usePagination = !!paginate;

        return await ServiceTblWorkOrder.findAll({
          where: { ...parsedFilter, instId },
          orderBy: parseSortString(sort),
          page: usePagination ? Number(page) : undefined,
          perPage: usePagination ? Number(perPage) : 250_000,
          select: workOrderListSelect,
        });
      },
      {
        tags: ["tblWorkOrder"],
        detail: { summary: "Get all work orders" },
        query: querySchema,
        response: responseSchemaList(WorkOrderItemSchema),
      },
    );

    // =========================
    // POST /generate
    // =========================
    app.use(authPlugin).post(
      "/generate",
      async ({ headers, userId }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });

        const employeeId = user?.tblEmployee?.employeeId;
        const now = new Date();

        return await prisma.$transaction(async (tx) => {
          const compJobs = await tx.tblCompJob.findMany({
            where: { nextDueDate: null, instId },
            select: {
              compJobId: true,
              discId: true,
              compId: true,
              priority: true,
              window: true,
              maintCauseId: true,
              maintClassId: true,
              maintTypeId: true,
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

          const workOrders = compJobs.map((job, index) => ({
            woNo: String(index),
            plannedBy: employeeId,
            compJobId: job.compJobId,
            createdBy: employeeId,
            maintCauseId: job.maintCauseId,
            maintClassId: job.maintClassId,
            maintTypeId: job.maintTypeId,
            respDiscId: job.discId,
            compId: job.compId,
            title: job.tblJobDescription?.jobDescTitle ?? null,
            priority: job.priority,
            window: job.window,
            dueDate: now,
            created: now,
            lastUpdate: now,
            workOrderStatusId: 2,
            workOrderTypeId: 1,
            instId,
          }));

          const resultWorkOrder = await tx.tblWorkOrder.createMany({
            data: workOrders,
          });

          const resultCompJob = await tx.tblCompJob.updateMany({
            where: {
              instId,
              compJobId: { in: compJobs.map((job) => job.compJobId) },
            },
            data: { nextDueDate: now, lastUpdate: now },
          });

          return {
            message: "ok",
            createdWorkOrders: resultWorkOrder.count,
            updatedCompJobs: resultCompJob.count,
          };
        });
      },
      {
        response: t.Object({
          message: t.String(),
          createdWorkOrders: t.Number(),
          updatedCompJobs: t.Number(),
        }),
        detail: {
          tags: ["tblWorkOrder"],
          summary: "Generate WorkOrders from CompJobs",
        },
      },
    );

    // =========================
    // POST /generate/next
    // =========================
    app.use(authPlugin).post(
      "/generate/next",
      async ({ body, set, headers, userId }) => {
        const { maintLogId } = body;

        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });

        const employeeId = user?.tblEmployee?.employeeId;

        return prisma.$transaction(async (tx) => {
          /* 1. MaintLog */
          const maintLog = await tx.tblMaintLog.findUnique({
            where: { maintLogId, instId },
            select: {
              maintLogId: true,
              workOrderId: true,
              dateDone: true,
              tblLogCounters: true,
            },
          });

          if (!maintLog?.workOrderId) {
            set.status = 404;
            return {
              message: "MaintLog or WorkOrder not found",
              success: false,
            };
          }

          /* 2. WorkOrder */
          const workOrder = await tx.tblWorkOrder.findUnique({
            where: { workOrderId: maintLog.workOrderId, instId },
            select: {
              workOrderId: true,
              compJobId: true,
              dueDate: true,
              workOrderTypeId: true,
            },
          });

          if (!workOrder?.compJobId) {
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

          /* 3. CompJob */
          const compJob = await tx.tblCompJob.findUnique({
            where: { compJobId: workOrder.compJobId, instId },
            include: {
              tblCompJobCounters: { include: { tblCompCounter: true } },
              tblJobDescription: true,
              tblPeriod: true,
            },
          });

          if (!compJob) {
            set.status = 404;
            return { message: "CompJob not found", success: false };
          }

          /* 4. Validate base date */
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
          const nextDueDateCandidates: Date[] = [];

          /* 5. Time-based calculation */
          if (compJob.frequency && compJob.frequencyPeriod) {
            const days =
              compJob.frequency * periodToDays(compJob.frequencyPeriod);

            const calculated = new Date(baseDateDone);
            calculated.setDate(calculated.getDate() + days);
            nextDueDateCandidates.push(calculated);
          }

          /* 6. Counter-based calculation */
          compJob.tblCompJobCounters?.forEach((compJobCounter) => {
            const frequency = compJobCounter.frequency ?? 0;
            const averageCountRate =
              compJobCounter.tblCompCounter?.averageCountRate;

            if (
              frequency === 0 ||
              averageCountRate == null ||
              averageCountRate === -1
            ) {
              nextDueDateCandidates.push(now);
              return;
            }

            if (averageCountRate === 0) {
              const future = new Date(now);
              future.setMonth(future.getMonth() + 6);
              nextDueDateCandidates.push(future);
              return;
            }

            const logCounter = maintLog.tblLogCounters[0];
            let baseValue = compJobCounter.tblCompCounter?.currentValue ?? 0;
            if (!baseValue) baseValue = logCounter?.reportedCount ?? 0;

            const reportedCount = logCounter?.reportedCount ?? 0;
            const nextCount = reportedCount + frequency;
            const diffCount = nextCount - baseValue;
            const diffDays = diffCount / averageCountRate;

            const nextDate = new Date(maintLog.dateDone ?? now);
            nextDate.setDate(nextDate.getDate() + diffDays);
            nextDueDateCandidates.push(nextDate);
          });

          /* 7. Final DueDate */
          if (nextDueDateCandidates.length === 0) {
            nextDueDateCandidates.push(now);
          }

          const finalNextDueDate = new Date(
            Math.min(...nextDueDateCandidates.map((d) => d.getTime())),
          );

          /* 8. Create Next WorkOrder */
          const newWorkOrder = await tx.tblWorkOrder.create({
            data: {
              compJobId: compJob.compJobId,
              createdBy: employeeId,
              respDiscId: compJob.discId,
              compId: compJob.compId,
              title:
                compJob.tblJobDescription?.jobDescTitle ??
                "Failed to load jobDescTitle",
              priority: compJob.priority,
              window: compJob.window,
              dueDate: finalNextDueDate,
              created: now,
              lastUpdate: now,
              workOrderStatusId: 2,
              workOrderTypeId: 1,
              instId,
              plannedBy: employeeId,
              maintCauseId: compJob.maintCauseId,
              maintClassId: compJob.maintClassId,
              maintTypeId: compJob.maintTypeId,
            },
          });

          /* 9. Update CompJob */
          await tx.tblCompJob.update({
            where: { compJobId: compJob.compJobId, instId },
            data: {
              nextDueDate: finalNextDueDate,
              lastDone: maintLog.dateDone,
              lastUpdate: now,
            },
          });

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

    app.use(authPlugin).post(
      "/reschedule",
      async ({ body, headers, userId, set }) => {
        const { workOrderId, newDueDate, newDueCount, reason } = body;

        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          set.status = 400;
          return {
            success: false as const,
            message: "Instance ID is required",
            workOrder: null,
          };
        }

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });

        const employeeId = user?.tblEmployee?.employeeId;

        if (!employeeId) {
          set.status = 400;
          return {
            success: false as const,
            message: "Employee not found",
            workOrder: null,
          };
        }

        return prisma.$transaction(async (tx) => {
          const workOrder = await tx.tblWorkOrder.findUnique({
            where: {
              workOrderId,
              instId,
            },
            include: {
              tblCompJob: {
                include: {
                  tblCompJobCounters: true,
                },
              },
            },
          });

          if (!workOrder) {
            set.status = 404;

            return {
              success: false,
              message: "WorkOrder not found",
              workOrder: null,
            };
          }

          const now = new Date();

          // Update CompJob
          if (workOrder.compJobId) {
            await tx.tblCompJob.update({
              where: {
                compJobId: workOrder.compJobId,
                instId,
              },
              data: {
                nextDueDate: newDueDate,
                lastUpdate: now,
              },
            });
          }

          // Update Counter(s)
          if (
            newDueCount !== undefined &&
            workOrder.tblCompJob?.tblCompJobCounters?.length
          ) {
            await tx.tblCompJobCounter.updateMany({
              where: {
                compJobId: workOrder.compJobId!,
                instId,
              },
              data: {
                nextDueCount: newDueCount,
                lastUpdate: now,
              },
            });
          }

          // Update WorkOrder
          const updatedWorkOrder = await tx.tblWorkOrder.update({
            include: {
              tblWorkOrderStatus: true,
            },
            where: {
              workOrderId,
              instId,
            },
            data: {
              workOrderStatusId: 2,
              issuedDate: null,
              issuedBy: null,
              dueDate: newDueDate,
              lastUpdate: now,
            },
          });

          // Create Log
          await tx.tblReScheduleLog.create({
            data: {
              workOrderId,
              rescheduledBy: employeeId,
              fromDueDate: workOrder.dueDate,
              toDueDate: newDueDate,
              rescheduledDate: now,
              reason,
              lastUpdate: now,
              instId,
            },
          });

          return {
            success: true,
            message: "WorkOrder rescheduled successfully",
            workOrder: updatedWorkOrder,
          };
        });
      },
      {
        body: t.Object({
          workOrderId: t.Number(),
          newDueDate: t.Date(),
          newDueCount: t.Optional(t.Number()),
          reason: t.String(),
        }),
        response: t.Object({
          success: t.Boolean(),
          message: t.String(),
          workOrder: t.Union([
            t.Null(),
            buildResponseSchema(TblWorkOrderPlain, TblWorkOrder),
          ]),
        }),
        detail: {
          tags: ["tblWorkOrder"],
          summary: "Reschedule WorkOrder",
        },
      },
    );

    app.use(authPlugin).post(
      "/issue",
      async ({ body, headers, userId, set }) => {
        const { workOrderIds } = body;
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          set.status = 400;
          return {
            success: false,
            message: "Instance ID is required",
            count: 0,
            workOrders: [] as {
              workOrderId: number;
              issuedDate: Date | null;
              tblWorkOrderStatus: { name: string } | null;
            }[],
          };
        }

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });

        const employeeId = user?.tblEmployee?.employeeId;

        if (!employeeId) {
          set.status = 400;
          return {
            success: false,
            message: "Employee not found",
            count: 0,
            workOrders: [] as {
              workOrderId: number;
              issuedDate: Date | null;
              tblWorkOrderStatus: { name: string } | null;
            }[],
          };
        }

        const now = new Date();

        const result = await prisma.tblWorkOrder.updateMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          data: {
            workOrderStatusId: 3,
            issuedDate: now,
            issuedBy: employeeId,
            lastUpdate: now,
          },
        });

        const updatedWorkOrders = await prisma.tblWorkOrder.findMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          select: {
            workOrderId: true,
            issuedDate: true,
            tblWorkOrderStatus: { select: { name: true } },
          },
        });

        return {
          success: true,
          message: `${result.count} work order(s) issued successfully`,
          count: result.count,
          workOrders: updatedWorkOrders,
        };
      },
      {
        body: t.Object({
          workOrderIds: t.Array(t.Number()),
        }),
        response: t.Object({
          success: t.Boolean(),
          message: t.String(),
          count: t.Number(),
          workOrders: t.Array(
            t.Object({
              workOrderId: t.Number(),
              issuedDate: t.Nullable(t.Date()),
              tblWorkOrderStatus: t.Nullable(
                t.Pick(TblWorkOrderStatus, ["name"]),
              ),
            }),
          ),
        }),
        detail: {
          tags: ["tblWorkOrder"],
          summary: "Bulk issue work orders",
        },
      },
    );

    // =========================
    // POST /cancel
    // =========================
    app.use(authPlugin).post(
      "/cancel",
      async ({ body, headers, set }) => {
        const { workOrderIds } = body;
        const instId = Number(headers["x-inst-id"] || 0);

        const emptyWorkOrders = [] as {
          workOrderId: number;
          tblWorkOrderStatus: { name: string } | null;
        }[];

        if (!instId) {
          set.status = 400;
          return {
            success: false,
            message: "Instance ID is required",
            count: 0,
            workOrders: emptyWorkOrders,
          };
        }

        const result = await prisma.tblWorkOrder.updateMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          data: { workOrderStatusId: 7, lastUpdate: new Date() },
        });

        const updatedWorkOrders = await prisma.tblWorkOrder.findMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          select: {
            workOrderId: true,
            tblWorkOrderStatus: { select: { name: true } },
          },
        });

        return {
          success: true,
          message: `${result.count} work order(s) cancelled successfully`,
          count: result.count,
          workOrders: updatedWorkOrders,
        };
      },
      {
        body: t.Object({
          workOrderIds: t.Array(t.Number()),
        }),
        response: t.Object({
          success: t.Boolean(),
          message: t.String(),
          count: t.Number(),
          workOrders: t.Array(
            t.Object({
              workOrderId: t.Number(),
              tblWorkOrderStatus: t.Nullable(
                t.Pick(TblWorkOrderStatus, ["name"]),
              ),
            }),
          ),
        }),
        detail: { tags: ["tblWorkOrder"], summary: "Bulk cancel work orders" },
      },
    );

    // =========================
    // POST /postpone
    // =========================
    app.use(authPlugin).post(
      "/postpone",
      async ({ body, headers, set }) => {
        const { workOrderIds } = body;
        const instId = Number(headers["x-inst-id"] || 0);

        const emptyWorkOrders = [] as {
          workOrderId: number;
          tblWorkOrderStatus: { name: string } | null;
        }[];

        if (!instId) {
          set.status = 400;
          return {
            success: false,
            message: "Instance ID is required",
            count: 0,
            workOrders: emptyWorkOrders,
          };
        }

        const result = await prisma.tblWorkOrder.updateMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          data: { workOrderStatusId: 8, lastUpdate: new Date() },
        });

        const updatedWorkOrders = await prisma.tblWorkOrder.findMany({
          where: { workOrderId: { in: workOrderIds }, instId },
          select: {
            workOrderId: true,
            tblWorkOrderStatus: { select: { name: true } },
          },
        });

        return {
          success: true,
          message: `${result.count} work order(s) postponed successfully`,
          count: result.count,
          workOrders: updatedWorkOrders,
        };
      },
      {
        body: t.Object({
          workOrderIds: t.Array(t.Number()),
        }),
        response: t.Object({
          success: t.Boolean(),
          message: t.String(),
          count: t.Number(),
          workOrders: t.Array(
            t.Object({
              workOrderId: t.Number(),
              tblWorkOrderStatus: t.Nullable(
                t.Pick(TblWorkOrderStatus, ["name"]),
              ),
            }),
          ),
        }),
        detail: {
          tags: ["tblWorkOrder"],
          summary: "Bulk postpone work orders",
        },
      },
    );
  },
}).app;

export default ControllerTblWorkOrder;
