import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  BaseController,
  parseSortString,
  querySchema,
} from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblMaintLog,
  TblMaintLogInputCreate,
  TblMaintLogInputUpdate,
  TblMaintLogPlain,
} from "orm/generated/prismabox/TblMaintLog";

/**
 * Item schema for list response
 */
const MaintLogItemSchema = t.Object({
  maintLogId: t.Number(),
  dateDone: t.Optional(t.String()),
  downTime: t.Optional(t.String()),
  unplanned: t.Boolean(),
  tblComponentUnit: t.Optional(
    t.Object({
      compNo: t.String(),
    }),
  ),
  tblJobDescription: t.Optional(
    t.Object({
      jobDescCode: t.String(),
      jobDescTitle: t.String(),
    }),
  ),
  tblWorkOrder: t.Optional(
    t.Object({
      tblDiscipline: t.Optional(
        t.Object({
          name: t.String(),
        }),
      ),
    }),
  ),
  tblFollowStatus: t.Optional(
    t.Object({
      fsName: t.String(),
    }),
  ),
  tblMaintClass: t.Optional(
    t.Object({
      descr: t.Optional(t.String()),
    }),
  ),
});

export const MaintLogListResponseSchema = t.Object({
  data: t.Array(MaintLogItemSchema),
  total: t.Number(),
  page: t.Number(),
  perPage: t.Number(),
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

  extend: (app) => {
    // لیست با select سفارشی
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
        const usePagination = paginate === true;

        return ServiceTblMaintLog.findAll({
          where: parsedFilter,
          orderBy: sortObj,
          page: usePagination ? Number(page) : undefined,
          perPage: usePagination ? Number(perPage) : 250_000,

          select: {
            maintLogId: true,
            dateDone: true,
            downTime: true,
            unplanned: true,
            tblComponentUnit: {
              select: { compNo: true },
            },
            tblJobDescription: {
              select: {
                jobDescCode: true,
                jobDescTitle: true,
              },
            },
            tblWorkOrder: {
              select: {
                tblDiscipline: {
                  select: { name: true },
                },
              },
            },
            tblFollowStatus: {
              select: { fsName: true },
            },
            tblMaintClass: {
              select: { descr: true },
            },
          },
        });
      },
      {
        tags: ["tblMaintLog"],
        detail: { summary: "Get maintenance logs with custom fields" },
        query: querySchema,
        response: MaintLogListResponseSchema,
      },
    );

    // ────────────────────────────────────────────────
    // Endpoint برای گرفتن context (planned / unplanned / edit)
    // ────────────────────────────────────────────────
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
          maintLog: t.Nullable(t.Any()),
        }),
      },
    );
  },
}).app;

export default ControllerTblMaintLog;
