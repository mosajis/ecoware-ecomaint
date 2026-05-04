import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import { BaseService } from "@/utils/base.service";
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
    app.get(
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

    app.get(
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
        let maintLog = null as any;

        // ── حالت ۱: Edit Mode - گرفتن اطلاعات موجود ──
        if (maintLogId) {
          maintLog = await prisma.tblMaintLog.findUnique({
            where: { maintLogId: Number(maintLogId) },
            include: {
              tblMaintType: true,
              tblMaintCause: true,
              tblMaintClass: true,
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
          }
        }

        // ── حالت ۲: از روی Work Order (Planned) ──
        if (workOrderId && !maintLogId) {
          isPlanned = true;

          const workOrder = await prisma.tblWorkOrder.findUnique({
            where: { workOrderId: Number(workOrderId) },
            include: {
              tblCompJob: {
                include: {
                  tblCompJobCounters: {
                    include: {
                      tblCompCounter: true,
                    },
                  },
                  tblJobDescription: true,
                  tblPeriod: true,
                },
              },
            },
          });

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

    app.post(
      "/",
      async ({ body }) => {
        const {
          reportedCount, // برای جدول tblLogCounter
          discId,
          periodId,
          jobDescId,
          maintClassId,
          maintTypeId,
          maintCauseId,
          fsId,
          workOrderId,
          compId,
          ...restData
        } = body;

        // ایجاد رکورد اصلی در tblMaintLog
        // const newLog = await prisma.tblMaintLog.create({
        //   data: {
        //     ...restData,
        //     // مدیریت روابط به صورت ایمن
        //     ...(compId && {
        //       tblComponentUnit: { connect: { compId: Number(compId) } },
        //     }),
        //     ...(workOrderId && {
        //       tblWorkOrder: { connect: { workOrderId: Number(workOrderId) } },
        //     }),
        //     ...(jobDescId && {
        //       tblJobDescription: { connect: { jobDescId: Number(jobDescId) } },
        //     }),
        //     ...(discId && {
        //       tblDiscipline: { connect: { discId: Number(discId) } },
        //     }),
        //     ...(periodId && {
        //       tblPeriod: { connect: { periodId: Number(periodId) } },
        //     }),
        //     ...(maintClassId && {
        //       tblMaintClass: {
        //         connect: { maintClassId: Number(maintClassId) },
        //       },
        //     }),
        //     ...(maintTypeId && {
        //       tblMaintType: { connect: { maintTypeId: Number(maintTypeId) } },
        //     }),
        //     ...(maintCauseId && {
        //       tblMaintCause: {
        //         connect: { maintCauseId: Number(maintCauseId) },
        //       },
        //     }),
        //     ...(fsId && {
        //       tblFollowStatus: { connect: { fsId: Number(fsId) } },
        //     }),

        //     // ...(reportedCount !== undefined && {
        //     //   tblLogCounter: {
        //     //     create: {
        //     //       reportedCount: Number(reportedCount),
        //     //       compId: Number(compId),
        //     //     },
        //     //   },
        //     // }),
        //   },
        // });

        // return newLog;
      },
      {
        tags: ["tblMaintLog"],
        body: t.Object({
          dateDone: t.String(),
          downTime: t.Optional(t.Number()),
          totalDuration: t.Optional(t.Number()),
          unexpected: t.Optional(t.Boolean()),
          history: t.Optional(t.String()),
          compId: t.Optional(t.Number()),
          workOrderId: t.Optional(t.Number()),
          discId: t.Optional(t.Number()),
          periodId: t.Optional(t.Number()),
          jobDescId: t.Optional(t.Number()),
          maintClassId: t.Optional(t.Number()),
          maintTypeId: t.Optional(t.Number()),
          maintCauseId: t.Optional(t.Number()),
          fsId: t.Optional(t.Number()),
          reportedCount: t.Optional(t.Number()),
        }),
        detail: { summary: "Create" },
      },
    );
  },
}).app;

export default ControllerTblMaintLog;
