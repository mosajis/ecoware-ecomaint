import { responseSchemaList } from "@/types";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import { BaseService } from "@/utils/base.service";
import { authPlugin } from "../auth/auth.guard";
import { diffDay } from "@/helper";
import {
  BaseController,
  parseSortString,
  querySchema,
} from "@/utils/base.controller";
import {
  TblMaintLog,
  TblMaintLogInputCreate,
  TblMaintLogInputUpdate,
  TblMaintLogPlain,
} from "orm/generated/prismabox/TblMaintLog";
import { TblEmployee } from "orm/generated/prismabox/TblEmployee";
import { TblComponentUnit } from "orm/generated/prismabox/TblComponentUnit";
import { TblJobDescription } from "orm/generated/prismabox/TblJobDescription";
import { TblFollowStatus } from "orm/generated/prismabox/TblFollowStatus";
import { TblDiscipline } from "orm/generated/prismabox/TblDiscipline";
import { TblMaintClass } from "orm/generated/prismabox/TblMaintClass";
import { TblMaintType } from "orm/generated/prismabox/TblMaintType";
import { TblMaintCause } from "orm/generated/prismabox/TblMaintCause";
import { TblWorkOrder } from "orm/generated/prismabox/TblWorkOrder";
import type {
  Prisma,
  TblComponentUnit as TblComponentUnitType,
  TblMaintCause as TblMaintCauseType,
  TblMaintClass as TblMaintClassType,
  TblMaintType as TblMaintTypeType,
} from "orm/generated/prisma/client";

// =========================
// SCHEMA
// =========================
const MaintLogItemSchema = t.Composite([
  t.Pick(TblMaintLog, [
    "maintLogId",
    "overdueCount",
    "dateDone",
    "downTime",
    "totalDuration",
    "history",
    "unexpected",
    "workOrderId",
  ]),
  t.Object({
    countAttachment: t.Number(),
    countSpare: t.Number(),
    totalTimeSpent: t.Nullable(t.Number()),
    totalTimeSpentEmp: t.Nullable(t.Number()),
    tblEmployee: t.Optional(
      t.Nullable(t.Pick(TblEmployee, ["firstName", "lastName"])),
    ),
    tblComponentUnit: t.Optional(
      t.Nullable(t.Pick(TblComponentUnit, ["compNo", "compId"])),
    ),
    tblWorkOrder: t.Optional(t.Nullable(t.Pick(TblWorkOrder, ["description"]))),
    tblJobDescription: t.Nullable(
      t.Pick(TblJobDescription, ["jobDescCode", "jobDescTitle"]),
    ),
    tblFollowStatus: t.Nullable(t.Pick(TblFollowStatus, ["fsName"])),
    tblDiscipline: t.Nullable(t.Pick(TblDiscipline, ["name"])),
    tblMaintClass: t.Nullable(t.Pick(TblMaintClass, ["descr"])),
    tblMaintType: t.Nullable(t.Pick(TblMaintType, ["descr"])),
    tblMaintCause: t.Nullable(t.Pick(TblMaintCause, ["descr"])),
  }),
]);

// =========================
// SELECT
// =========================
const maintLogListSelect = {
  tblEmployee: {
    select: {
      lastName: true,
      firstName: true,
    },
  },
  overdueCount: true,
  maintLogId: true,
  dateDone: true,
  downTime: true,
  unexpected: true,
  history: true,
  totalDuration: true,
  workOrderId: true,
  tblWorkOrder: {
    select: { description: true },
  },
  tblComponentUnit: {
    select: { compNo: true, compId: true },
  },
  tblJobDescription: {
    select: {
      jobDescCode: true,
      jobDescTitle: true,
    },
  },
  tblDiscipline: {
    select: { name: true },
  },
  tblFollowStatus: {
    select: { fsName: true },
  },
  tblMaintClass: {
    select: { descr: true },
  },
  tblMaintType: {
    select: { descr: true },
  },
  tblMaintCause: {
    select: { descr: true },
  },
} satisfies Prisma.TblMaintLogSelect;

export type MaintLogItem = Prisma.TblMaintLogGetPayload<{
  select: typeof maintLogListSelect;
}> & {
  totalTimeSpent: number;
  totalTimeSpentEmp: number;
};

// =========================
// SERVICE
// =========================
const ServiceTblMaintLog = new BaseService(prisma.tblMaintLog);

// =========================
// CONTROLLER
// =========================
const ControllerTblMaintLog = new BaseController({
  prefix: "/tblMaintLog",
  swagger: {
    tags: ["tblMaintLog"],
  },
  primaryKey: "maintLogId",
  service: ServiceTblMaintLog,
  createSchema: TblMaintLogInputCreate,
  updateSchema: TblMaintLogInputUpdate,
  responseSchema: buildResponseSchema(TblMaintLogPlain, TblMaintLog),
  scope: true,

  extend: (app) => {
    // =========================
    // GET LIST
    // =========================
    app.use(authPlugin).get(
      "/",
      async ({ query, headers }) => {
        const { page = 1, perPage = 20, sort, filter } = query;
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const [
          result,
          timeSpentRows,
          allTimeSpentAgg,
          attachmentRows,
          spareRows,
        ] = await Promise.all([
          ServiceTblMaintLog.findAll({
            where: { ...(filter ? JSON.parse(filter) : {}), instId },
            orderBy: parseSortString(sort),
            perPage: 250_000,
            select: maintLogListSelect,
          }),
          prisma.tblLogDiscipline.groupBy({
            by: ["maintLogId"],
            where: { instId, maintLogId: { not: null } },
            _sum: { timeSpent: true },
          }),
          prisma.tblLogDiscipline.aggregate({
            where: { instId },
            _sum: { timeSpent: true },
          }),

          // +
          prisma.tblMaintLogAttachment.groupBy({
            by: ["maintLogId"],
            where: { instId },
            _count: { maintLogAttachmentId: true },
          }),

          // +
          prisma.tblMaintLogSpare.groupBy({
            by: ["maintLogId"],
            where: { instId },
            _count: { maintLogSpareId: true },
          }),
        ]);

        const attachmentCountMap = new Map(
          attachmentRows.map((r) => [
            r.maintLogId,
            r._count.maintLogAttachmentId,
          ]),
        );

        const spareCountMap = new Map(
          spareRows.map((r) => [r.maintLogId, r._count.maintLogSpareId]),
        );

        const timeSpentMap = new Map(
          timeSpentRows
            .filter((r) => r.maintLogId != null)
            .map((r) => [r.maintLogId!, r._sum.timeSpent ?? 0]),
        );

        const totalTimeSpent = allTimeSpentAgg._sum.timeSpent ?? 0;

        return {
          ...result,
          items: result.items.map((item: MaintLogItem) => ({
            ...item,
            totalTimeSpentEmp: timeSpentMap.get(item.maintLogId) ?? 0,
            totalTimeSpent,

            countAttachment: attachmentCountMap.get(item.maintLogId) ?? 0, // +
            countSpare: spareCountMap.get(item.maintLogId) ?? 0,
          })),
        };
      },
      {
        tags: ["tblMaintLog"],
        detail: { summary: "Get all with per-maintLog timeSpent" },
        query: querySchema,
        response: responseSchemaList(MaintLogItemSchema),
      },
    );

    // =========================
    // GET CONTEXT
    // =========================
    app.use(authPlugin).get(
      "/context",
      async ({ query }) => {
        const { compId, workOrderId, maintLogId } = query;

        const COUNTER_TYPE_ID = 10001;

        let isPlanned = false;
        let isCounter = false;
        let counterData = {
          lastDate: null as string | null,
          lastValue: null as number | null,
        };
        let reportedCount = 0;
        let jobDescription = {
          title: null as string | null,
          content: null as string | null,
          jobDescId: null as number | null,
        };
        let frequency = {
          value: null as number | null,
          period: null as { periodId: number; name: string | null } | null,
        };

        let maintLog: any = null;
        let componentUnit: TblComponentUnitType | null = null;
        let maintCause: TblMaintCauseType | null = null;
        let maintClass: TblMaintClassType | null = null;
        let maintType: TblMaintTypeType | null = null;

        // ── Edit Mode ──
        if (maintLogId) {
          maintLog = await prisma.tblMaintLog.findUnique({
            where: { maintLogId: Number(maintLogId) },
            include: {
              tblMaintType: true,
              tblMaintCause: true,
              tblMaintClass: true,
              tblComponentUnit: true,
              tblWorkOrder: {
                include: {
                  tblCompJob: {
                    include: {
                      tblJobDescription: true,
                      tblPeriod: true,
                    },
                  },
                },
              },
              tblJobDescription: true,
            },
          });

          if (maintLog) {
            const compJob = maintLog.tblWorkOrder?.tblCompJob;
            isPlanned = !!compJob;

            if (compJob?.tblJobDescription) {
              jobDescription = {
                title: compJob.tblJobDescription.jobDescTitle ?? null,
                content: compJob.tblJobDescription.jobDesc ?? null,
                jobDescId: compJob.tblJobDescription.jobDescId ?? null,
              };
            }

            if (compJob) {
              frequency = {
                value: compJob.frequency ?? null,
                period: compJob.tblPeriod
                  ? {
                      periodId: compJob.tblPeriod.periodId,
                      name: compJob.tblPeriod.name ?? null,
                    }
                  : null,
              };
            }

            const logCounter = await prisma.tblLogCounter.findFirst({
              where: { maintLogId: Number(maintLogId) },
            });

            if (logCounter) {
              reportedCount = logCounter.reportedCount ?? 0;
            }

            componentUnit = maintLog.tblComponentUnit;
            maintClass = maintLog.tblMaintClass;
            maintType = maintLog.tblMaintType;
            maintCause = maintLog.tblMaintCause;
          }
        }

        // ── از روی Work Order (Planned) ──
        if (workOrderId && !maintLogId) {
          isPlanned = true;

          const workOrder = await prisma.tblWorkOrder.findUnique({
            where: { workOrderId: Number(workOrderId) },
            include: {
              tblMaintCause: true,
              tblMaintClass: true,
              tblMaintType: true,
              tblCompJob: {
                include: {
                  tblJobDescription: true,
                  tblPeriod: true,
                  tblComponentUnit: true,
                  tblCompJobCounters: {
                    include: {
                      tblCompCounter: true,
                    },
                  },
                },
              },
            },
          });

          componentUnit = workOrder?.tblCompJob?.tblComponentUnit || null;
          maintCause = workOrder?.tblMaintCause || null;
          maintClass = workOrder?.tblMaintClass || null;
          maintType = workOrder?.tblMaintType || null;

          if (workOrder?.tblCompJob) {
            const compJob = workOrder.tblCompJob;

            jobDescription = {
              title: compJob.tblJobDescription?.jobDescTitle ?? null,
              content: compJob.tblJobDescription?.jobDesc ?? null,
              jobDescId: compJob.tblJobDescription?.jobDescId ?? null,
            };

            frequency = {
              value: compJob.frequency ?? null,
              period: compJob.tblPeriod
                ? {
                    periodId: compJob.tblPeriod.periodId,
                    name: compJob.tblPeriod.name ?? null,
                  }
                : null,
            };

            if (compJob.tblCompJobCounters?.length > 0) {
              isCounter = true;

              const compCounter = await prisma.tblCompCounter.findFirst({
                where: {
                  compId: workOrder.compId,
                  counterTypeId: COUNTER_TYPE_ID,
                },
              });

              if (compCounter) {
                counterData = {
                  lastDate: compCounter.currentDate?.toISOString() ?? null,
                  lastValue: compCounter.currentValue ?? null,
                };
              }
            }
          }
        }

        // ── بدون Work Order (Unplanned) ──
        if (compId && !workOrderId && !maintLogId) {
          const component = await prisma.tblComponentUnit.findUnique({
            where: { compId: Number(compId) },
          });

          componentUnit = component;

          const compCounter = await prisma.tblCompCounter.findFirst({
            where: {
              compId: Number(compId),
              counterTypeId: COUNTER_TYPE_ID,
            },
          });

          if (compCounter) {
            isCounter = true;
            counterData = {
              lastDate: compCounter.currentDate?.toISOString() ?? null,
              lastValue: compCounter.currentValue ?? null,
            };
          }
        }

        // ── Edit Mode counter data ──
        if (maintLogId && maintLog?.compId) {
          const compCounter = await prisma.tblCompCounter.findFirst({
            where: {
              compId: maintLog.compId,
              counterTypeId: COUNTER_TYPE_ID,
            },
          });

          if (compCounter) {
            isCounter = true;
            counterData = {
              lastDate: compCounter.currentDate?.toISOString() ?? null,
              lastValue: compCounter.currentValue ?? null,
            };
          }
        }

        return {
          isPlanned,
          isCounter,
          counterData,
          reportedCount,
          jobDescription,
          componentUnit,
          maintCause,
          maintClass,
          maintType,
          frequency,
          maintLog,
        };
      },
      {
        tags: ["tblMaintLog"],
        detail: {
          summary: "Get context for creating or editing maintenance log",
        },
        query: t.Object({
          compId: t.Optional(t.Numeric({ minimum: 1 })),
          workOrderId: t.Optional(t.Numeric({ minimum: 1 })),
          maintLogId: t.Optional(t.Numeric({ minimum: 1 })),
        }),
        response: t.Object({
          isPlanned: t.Boolean(),
          isCounter: t.Boolean(),
          componentUnit: t.Nullable(
            t.Object({
              compNo: t.Nullable(t.String()),
              compId: t.Nullable(t.Number()),
            }),
          ),
          maintCause: t.Nullable(
            t.Object({
              maintCauseId: t.Number(),
              descr: t.Nullable(t.String()),
            }),
          ),
          maintClass: t.Nullable(
            t.Object({
              maintClassId: t.Number(),
              descr: t.Nullable(t.String()),
            }),
          ),
          maintType: t.Nullable(
            t.Object({
              maintTypeId: t.Number(),
              descr: t.Nullable(t.String()),
            }),
          ),
          counterData: t.Object({
            lastDate: t.Nullable(t.String()),
            lastValue: t.Nullable(t.Number()),
          }),
          reportedCount: t.Number(),
          jobDescription: t.Object({
            title: t.Nullable(t.String()),
            content: t.Nullable(t.String()),
            jobDescId: t.Nullable(t.Number()),
          }),
          frequency: t.Object({
            value: t.Nullable(t.Number()),
            period: t.Nullable(
              t.Object({
                periodId: t.Number(),
                name: t.Nullable(t.String()),
              }),
            ),
          }),
          maintLog: t.Nullable(
            buildResponseSchema(TblMaintLogPlain, TblMaintLog),
          ),
        }),
      },
    );

    // =========================
    // POST
    // =========================
    app.use(authPlugin).post(
      "/",
      async ({ body, userId, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) throw new Error("Instance ID is required");

        const now = new Date().toISOString();

        const {
          reportedCount,
          discId,
          periodId,
          maintClassId,
          maintTypeId,
          maintCauseId,
          workOrderId,
          compId,
          dateDone,
          ...restData
        } = body;

        const user = await prisma.tblUser.findFirst({
          where: { userId },
          include: { tblEmployee: true },
        });

        const tblFunction = await prisma.tblFunction.findFirst({
          where: { compId },
        });

        const functionId = tblFunction?.functionId;
        const employeeId = user?.tblEmployee?.employeeId as number;

        if (body.mode === "unPlanned") {
          const discId = user?.tblEmployee?.discId;

          const newLog = await prisma.tblMaintLog.create({
            data: {
              overdueCount: 0,
              workOrderStatusId: 5,
              history: restData.history,
              reportedDate: now,
              unexpected: restData.unexpected,
              totalDuration: restData.totalDuration,
              downTime: restData.downTime || 0,
              dateDone: dateDone || now,

              ...(functionId && { tblFunction: { connect: { functionId } } }),
              ...(discId && { tblDiscipline: { connect: { discId } } }),
              ...(employeeId && {
                updatedEmployeeId: employeeId,
                tblEmployee: { connect: { employeeId } },
              }),
              ...(instId && { tblInstallation: { connect: { instId } } }),
              ...(compId && {
                tblComponentUnit: { connect: { compId: Number(compId) } },
              }),
              ...(maintClassId && {
                tblMaintClass: {
                  connect: { maintClassId: Number(maintClassId) },
                },
              }),
              ...(maintTypeId && {
                tblMaintType: { connect: { maintTypeId: Number(maintTypeId) } },
              }),
              ...(maintCauseId && {
                tblMaintCause: {
                  connect: { maintCauseId: Number(maintCauseId) },
                },
              }),
            },
          });

          return newLog;
        }

        const tblWorkOrder = await prisma.tblWorkOrder.findFirst({
          where: { workOrderId },
          select: {
            dueDate: true,
            respDiscId: true,
            tblCompJob: {
              select: {
                compJobId: true,
                jobDescId: true,
                frequency: true,
                frequencyPeriod: true,
              },
            },
          },
        });

        const jobDescId = tblWorkOrder?.tblCompJob?.jobDescId;
        const frequency = tblWorkOrder?.tblCompJob?.frequency;
        const frequencyPeriod = tblWorkOrder?.tblCompJob?.frequencyPeriod;
        const respDiscId = tblWorkOrder?.respDiscId;

        const newLog = await prisma.tblMaintLog.create({
          data: {
            overdueCount: tblWorkOrder?.dueDate
              ? diffDay(dateDone, tblWorkOrder?.dueDate)
              : null,
            workOrderStatusId: 5,
            history: restData.history,
            reportedDate: now,
            unexpected: restData.unexpected,
            frequency,
            totalDuration: restData.totalDuration,
            downTime: restData.downTime || 0,
            dateDone: dateDone || now,

            ...(functionId && { tblFunction: { connect: { functionId } } }),
            ...(respDiscId && {
              tblDiscipline: { connect: { discId: respDiscId } },
            }),
            ...(employeeId && {
              updatedEmployeeId: employeeId,
              tblEmployee: { connect: { employeeId } },
            }),
            ...(frequencyPeriod && {
              tblPeriod: { connect: { periodId: frequencyPeriod } },
            }),
            ...(instId && { tblInstallation: { connect: { instId } } }),
            ...(compId && {
              tblComponentUnit: { connect: { compId: Number(compId) } },
            }),
            ...(workOrderId && {
              tblWorkOrder: { connect: { workOrderId: Number(workOrderId) } },
            }),
            ...(jobDescId && {
              tblJobDescription: { connect: { jobDescId: Number(jobDescId) } },
            }),
            ...(discId && {
              tblDiscipline: { connect: { discId: Number(discId) } },
            }),
            ...(periodId && {
              tblPeriod: { connect: { periodId: Number(periodId) } },
            }),
            ...(maintClassId && {
              tblMaintClass: {
                connect: { maintClassId: Number(maintClassId) },
              },
            }),
            ...(maintTypeId && {
              tblMaintType: { connect: { maintTypeId: Number(maintTypeId) } },
            }),
            ...(maintCauseId && {
              tblMaintCause: {
                connect: { maintCauseId: Number(maintCauseId) },
              },
            }),
          },
        });

        if (reportedCount && employeeId) {
          const compJobCounters = await prisma.tblWorkOrder.findFirst({
            include: {
              tblCompJob: {
                include: { tblCompJobCounters: true },
              },
            },
            where: { workOrderId },
          });

          const compJobCounter =
            compJobCounters?.tblCompJob?.tblCompJobCounters[0];
          const dueCount = compJobCounter?.nextDueCount || 0;
          const frequency = compJobCounter?.frequency || 0;

          await prisma.tblCompJobCounter.update({
            where: { compJobCounterId: compJobCounter?.compJobCounterId },
            data: {
              lastDoneCount: Number(reportedCount),
              nextDueCount: Number(reportedCount) + frequency,
              lastUpdate: now,
            },
          });

          await prisma.tblLogCounter.create({
            data: {
              frequency,
              counterTypeId: 10001,
              reportedCount: Number(reportedCount),
              overdueCount: reportedCount - dueCount,
              maintLogId: newLog.maintLogId,
              createdEmployeeId: employeeId,
              instId,
            },
          });
        }

        if (workOrderId) {
          await prisma.tblWorkOrder.update({
            where: { workOrderId },
            include: { tblWorkOrderStatus: true },
            data: {
              workOrderStatusId: 5,
              completed: now,
              lastUpdate: now,
            },
          });
        }

        return newLog;
      },
      {
        tags: ["tblMaintLog"],
        body: t.Object({
          mode: t.String(),
          dateDone: t.String(),
          downTime: t.Optional(t.Number()),
          totalDuration: t.Optional(t.Number()),
          unexpected: t.Optional(t.Number()),
          history: t.Optional(t.String()),
          compId: t.Optional(t.Number()),
          workOrderId: t.Optional(t.Number()),
          discId: t.Optional(t.Number()),
          periodId: t.Optional(t.Number()),
          jobDescId: t.Optional(t.Number()),
          maintClassId: t.Optional(t.Number()),
          maintTypeId: t.Optional(t.Number()),
          maintCauseId: t.Optional(t.Number()),
          reportedCount: t.Optional(t.Number()),
        }),
        response: buildResponseSchema(TblMaintLogPlain, TblMaintLog),
        detail: { summary: "Create" },
      },
    );

    // =========================
    // PUT
    // =========================
    app.use(authPlugin).put(
      "/:maintLogId",
      async ({ params, body }) => {
        const maintLogId = Number(params.maintLogId);
        const { reportedCount, ...restBody } = body;

        const updated = await prisma.tblMaintLog.update({
          where: { maintLogId },
          data: restBody as any,
        });

        if (reportedCount !== undefined) {
          const logCounter = await prisma.tblLogCounter.findFirst({
            where: { maintLogId },
          });

          if (logCounter) {
            await prisma.tblLogCounter.update({
              where: { logCounterId: logCounter.logCounterId },
              data: { reportedCount },
            });
          }
        }

        return updated;
      },
      {
        tags: ["tblMaintLog"],
        params: t.Object({
          maintLogId: t.Numeric(),
        }),
        body: t.Object({
          ...TblMaintLogInputUpdate.properties,
          reportedCount: t.Optional(t.Number()),
        }),
        response: buildResponseSchema(TblMaintLogPlain, TblMaintLog),
        detail: { summary: "Update with optional counter" },
      },
    );
  },
}).app;

export default ControllerTblMaintLog;
