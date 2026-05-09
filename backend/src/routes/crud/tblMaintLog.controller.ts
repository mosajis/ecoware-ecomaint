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
import type {
  TblComponentUnit,
  TblMaintCause,
  TblMaintClass,
  TblMaintType,
  TblMaintLog as TypeTblMaintLog,
} from "orm/generated/prisma/client";

const MaintLogItemSchema = t.Object({
  maintLogId: t.Number(),
  dateDone: t.Nullable(t.Date()),
  downTime: t.Nullable(t.Number()),
  totalDuration: t.Nullable(t.Number()),
  history: t.Nullable(t.String()),
  unexpected: t.Nullable(t.Union([t.Boolean(), t.Number(), t.Null()])),
  tblComponentUnit: t.Optional(
    t.Nullable(
      t.Object({
        compNo: t.Nullable(t.String()),
        compId: t.Nullable(t.Number()),
      }),
    ),
  ),
  tblJobDescription: t.Nullable(
    t.Object({
      jobDescCode: t.Nullable(t.String()),
      jobDescTitle: t.Nullable(t.String()),
    }),
  ),
  tblWorkOrder: t.Optional(
    t.Nullable(
      t.Object({
        description: t.Nullable(t.String()),
      }),
    ),
  ),
  tblFollowStatus: t.Nullable(
    t.Object({
      fsName: t.Nullable(t.String()),
    }),
  ),
  tblMaintClass: t.Nullable(
    t.Object({
      descr: t.Nullable(t.String()),
    }),
  ),
  tblMaintType: t.Nullable(
    t.Object({
      descr: t.Nullable(t.String()),
    }),
  ),
  tblMaintCause: t.Nullable(
    t.Object({
      descr: t.Nullable(t.String()),
    }),
  ),
  tblDiscipline: t.Nullable(
    t.Object({
      name: t.Nullable(t.String()),
    }),
  ),
});

const MaintLogListResponseSchema = t.Object({
  items: t.Array(MaintLogItemSchema),
  total: t.Number(),
  page: t.Number(),
  perPage: t.Number(),
  totalPages: t.Number(),
});

const ServiceTblMaintLog = new BaseService(prisma.tblMaintLog);

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
    app.use(authPlugin).get(
      "/",
      async ({ query, headers }) => {
        const {
          page = 1,
          perPage = 20,
          sort,
          filter,
          paginate = false,
        } = query;

        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

        const parsedFilter = filter ? JSON.parse(filter) : {};
        const sortObj = parseSortString(sort);
        const usePagination = false;

        return ServiceTblMaintLog.findAll({
          where: { ...parsedFilter, instId },
          orderBy: sortObj,
          page: usePagination ? Number(page) : undefined,
          perPage: usePagination ? Number(perPage) : 250_000,

          select: {
            maintLogId: true,
            dateDone: true,
            downTime: true,
            unexpected: true,
            history: true,
            totalDuration: true,
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
          },
        });
      },
      {
        tags: ["tblMaintLog"],
        detail: { summary: "Get all" },
        query: querySchema,
        response: MaintLogListResponseSchema,
      },
    );

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
        let componentUnit: TblComponentUnit | null = null;

        let maintCause: TblMaintCause | null = null;
        let maintClass: TblMaintClass | null = null;
        let maintType: TblMaintType | null = null;

        // ── حالت ۱: Edit Mode - گرفتن اطلاعات موجود ──
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

            // Job Description
            if (compJob?.tblJobDescription) {
              jobDescription = {
                title: compJob.tblJobDescription.jobDescTitle ?? null,
                content: compJob.tblJobDescription.jobDesc ?? null,
                jobDescId: compJob.tblJobDescription.jobDescId ?? null,
              };
            }

            // Frequency
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

            // Counter data
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

        // ── حالت ۲: از روی Work Order (Planned) ──
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

            // Job Description
            jobDescription = {
              title: compJob.tblJobDescription?.jobDescTitle ?? null,
              content: compJob.tblJobDescription?.jobDesc ?? null,
              jobDescId: compJob.tblJobDescription?.jobDescId ?? null,
            };

            // Frequency
            frequency = {
              value: compJob.frequency ?? null,
              period: compJob.tblPeriod
                ? {
                    periodId: compJob.tblPeriod.periodId,
                    name: compJob.tblPeriod.name ?? null,
                  }
                : null,
            };

            // Check if this job has counter
            if (compJob.tblCompJobCounters?.length > 0) {
              isCounter = true;

              // Get counter data from tblCompCounter
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

        // ── حالت ۳: بدون Work Order → فقط بر اساس compId (Unplanned) ──
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

        // ── در Edit Mode هم counter data را بگیر ──
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

    app.use(authPlugin).post(
      "/",
      async ({ body, userId, headers }) => {
        const instId = Number(headers["x-inst-id"] || 0);

        if (!instId) {
          throw new Error("Instance ID is required");
        }

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
          where: {
            userId,
          },
          include: {
            tblEmployee: true,
          },
        });

        const employeeId = user?.tblEmployee?.employeeId;

        const tblFunction = await prisma.tblFunction.findFirst({
          where: {
            compId,
          },
        });

        const functionId = tblFunction?.functionId;

        const tblWorkOrder = await prisma.tblWorkOrder.findFirst({
          where: {
            workOrderId,
          },
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

            ...(functionId && {
              tblFunction: {
                connect: {
                  functionId,
                },
              },
            }),
            ...(respDiscId && {
              tblDiscipline: {
                connect: {
                  discId: respDiscId,
                },
              },
            }),
            ...(employeeId && {
              updatedEmployeeId: employeeId,
              tblEmployee: {
                connect: {
                  employeeId,
                },
              },
            }),
            ...(frequencyPeriod && {
              tblPeriod: {
                connect: {
                  periodId: frequencyPeriod,
                },
              },
            }),
            ...(instId && {
              tblInstallation: {
                connect: {
                  instId,
                },
              },
            }),
            ...(compId && {
              tblComponentUnit: {
                connect: {
                  compId: Number(compId),
                },
              },
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

            // ...(reportedCount !== undefined && {
            //   tblLogCounter: {
            //     create: {
            //       reportedCount: Number(reportedCount),
            //       compId: Number(compId),
            //     },
            //   },
            // }),
          },
        });

        if (workOrderId) {
          await prisma.tblWorkOrder.update({
            where: { workOrderId },
            include: {
              tblWorkOrderStatus: true,
            },
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
  },
}).app;

export default ControllerTblMaintLog;
