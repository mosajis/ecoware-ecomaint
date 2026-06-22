import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { effectCompCounter } from "../effects/EffectTblCompCounter";
import { BaseService } from "@/utils/base.service";
import { diffHours } from "@/helper";
import { authPlugin } from "../auth/auth.guard";
import type { TblCompCounter } from "orm/generated/prisma/browser";
import {
  TblCompCounter as TblCompCounterSchema,
  TblCompCounterInputCreate,
  TblCompCounterInputUpdate,
  TblCompCounterPlain,
} from "orm/generated/prismabox/TblCompCounter";
import { responseSchemaList } from "@/types";

export const ServiceTblCompCounter = new BaseService(prisma.tblCompCounter);

const TblCompCounterWithMtbf = t.Object({
  ...buildResponseSchema(TblCompCounterPlain, TblCompCounterSchema).properties,
  mtbf: t.Number(),
  mttr: t.Number(),
});

const ControllerTblCompCounter = new BaseController({
  prefix: "/tblCompCounter",
  swagger: {
    tags: ["tblCompCounter"],
  },
  scope: true,
  primaryKey: "compCounterId",
  service: ServiceTblCompCounter,
  createSchema: TblCompCounterInputCreate,
  updateSchema: TblCompCounterInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompCounterPlain,
    TblCompCounterSchema,
  ),
  extend: (app) => {
    app
      .use(authPlugin)
      .get(
        "/",
        async ({ query, headers }) => {
          const { sort, filter } = query;

          const instId = Number(headers["x-inst-id"] || 0);

          if (!instId) {
            throw new Error("Instance ID is required");
          }

          const result = await ServiceTblCompCounter.findAll({
            where: {
              ...(filter ? JSON.parse(filter) : {}),
              instId,
            },
            include: {
              tblCounterType: true,
              tblComponentUnit: true,
              tblEmployee: true,
            },
            orderBy: sort ? JSON.parse(sort) : undefined,
          });

          const counterIds = result.items
            .map((x: TblCompCounter) => x.compCounterId)
            .filter(Boolean);

          const compIds = result.items
            .map((x: TblCompCounter) => x.compId)
            .filter((x: number) => typeof x === "number" && x > 0);

          if (!counterIds.length) {
            return {
              ...result,
              items: [],
            };
          }

          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

          const [counterLogs, maintLogs] = await Promise.all([
            prisma.tblCompCounterLog.findMany({
              where: {
                instId,
                compCounterId: {
                  in: counterIds,
                },
                currentDate: {
                  gte: oneYearAgo,
                },
              },
              orderBy: {
                currentDate: "asc",
              },
            }),

            prisma.tblMaintLog.findMany({
              where: {
                instId,
                unexpected: 1,
                compId: {
                  in: compIds,
                },
                dateDone: {
                  not: null,
                },
              },
              select: {
                compId: true,
                dateDone: true,
                downTime: true,
              },
            }),
          ]);

          type CounterLog = (typeof counterLogs)[number];
          type MaintLog = (typeof maintLogs)[number];

          const logsByCounter = counterLogs.reduce(
            (acc, log) => {
              const key = log.compCounterId;

              if (!key) return acc;

              if (!acc[key]) {
                acc[key] = [];
              }

              acc[key].push(log);

              return acc;
            },
            {} as Record<number, CounterLog[]>,
          );

          const maintLogsByComp = maintLogs.reduce(
            (acc, log) => {
              const key = log.compId;

              if (!key) return acc;

              if (!acc[key]) {
                acc[key] = [];
              }

              acc[key].push(log);

              return acc;
            },
            {} as Record<number, MaintLog[]>,
          );

          return {
            ...result,
            items: result.items.map((counter: TblCompCounter) => {
              let mtbf = -1;
              let mttr = -1;

              try {
                if (!counter.compId) {
                  return { ...counter, mtbf, mttr };
                }

                const logs = logsByCounter[counter.compCounterId] ?? [];

                if (logs.length < 2) {
                  return { ...counter, mtbf, mttr };
                }

                const minLog = logs[0];
                const maxLog = logs[logs.length - 1];

                if (
                  minLog?.currentValue == null ||
                  maxLog?.currentValue == null ||
                  minLog?.currentDate == null ||
                  maxLog?.currentDate == null
                ) {
                  return { ...counter, mtbf, mttr };
                }

                const minDate: Date = minLog.currentDate;
                const maxDate: Date = maxLog.currentDate;

                const usage = maxLog.currentValue - minLog.currentValue;

                if (usage <= 0) {
                  return { ...counter, mtbf, mttr };
                }

                const durationMs = maxDate.getTime() - minDate.getTime();

                if (durationMs <= 0) {
                  return { ...counter, mtbf, mttr };
                }

                // نرخ مصرف counter به ازای هر میلی‌ثانیه
                const usageRate = usage / durationMs;

                const failures = (maintLogsByComp[counter.compId] ?? []).filter(
                  (m) =>
                    m.dateDone != null &&
                    m.dateDone >= minDate &&
                    m.dateDone <= maxDate,
                );

                const failureCount = failures.length;

                if (failureCount <= 0) {
                  return { ...counter, mtbf, mttr };
                }

                // MTBF: مقدار counter تقسیم بر تعداد خرابی‌ها
                mtbf = usage / failureCount;
                if (!Number.isFinite(mtbf)) mtbf = -1;

                // MTTR: میانگین مدت تعمیر به واحد counter
                const totalRepairUsage = failures.reduce((sum, m) => {
                  if (!m.downTime || m.downTime <= 0) return sum;

                  // downTime به دقیقه → تبدیل به میلی‌ثانیه → ضرب در نرخ مصرف counter
                  const downTimeMs = m.downTime * 60 * 1000;

                  return sum + downTimeMs * usageRate;
                }, 0);

                if (totalRepairUsage > 0) {
                  mttr = totalRepairUsage / failureCount;
                  if (!Number.isFinite(mttr)) mttr = -1;
                }

                return { ...counter, mtbf, mttr };
              } catch {
                return { ...counter, mtbf: -1, mttr: -1 };
              }
            }),
          };
        },
        {
          tags: ["tblCompCounter"],
          query: t.Object({
            sort: t.Optional(t.String()),
            filter: t.Optional(t.String()),
          }),

          response: responseSchemaList(TblCompCounterWithMtbf),
        },
      )
      .post(
        "/",
        async ({ body, set, headers }) => {
          const instId = Number(headers["x-inst-id"] || 0);

          if (!instId) {
            throw new Error("Instance ID is required");
          }

          const data = body;
          const result = await prisma.$transaction(async (tx) => {
            const counter = await tx.tblCompCounter.create({
              data: {
                compId: data.tblComponentUnit?.connect.compId,
                averageCountRate: data.averageCountRate,
                counterTypeId: data.tblCounterType?.connect.counterTypeId,
                dependsOnId: data.tblCompCounter?.connect.compCounterId,
                orderNo: data.orderNo,
                startDate: data.startDate,
                startValue: data.startValue,
                useCalcAverage: data.useCalcAverage,
                zeroedDate: null,
                changedBy: null,
                currentDate: null,
                currentValue: null,
                lastUpdate: null,
                lastZeroedValue: null,
                instId,
              },
            });
            await effectCompCounter(tx, counter, instId);
            return counter;
          });

          set.status = 201;
          return result;
        },
        {
          tags: ["tblCompCounter"],
          detail: {
            summary: "Create",
            description:
              "Create TblCompCounter and run side effects in transaction",
          },
          body: TblCompCounterInputCreate,
          response: buildResponseSchema(
            TblCompCounterPlain,
            TblCompCounterSchema,
          ),
        },
      )

      .put(
        "/:compCounterId",
        async ({ params, body, set, headers, userId }) => {
          const instId = Number(headers["x-inst-id"] || 0);

          if (!instId) {
            throw new Error("Instance ID is required");
          }

          const compCounterId = Number(params.compCounterId);
          const data = body;

          const result = await prisma.$transaction(async (tx) => {
            const user = await tx.tblUser.findFirst({
              where: {
                userId: Number(userId),
              },
            });

            // ۱. اعتبارسنجی تاریخ (طبق منطق قبلی خودت)
            const lastLog = await tx.tblCompCounterLog.findFirst({
              where: { compCounterId, instId },
              orderBy: { compCounterLogId: "desc" },
            });

            if (lastLog) {
              const timeDiff = diffHours(lastLog.currentDate, data.currentDate);
              if (timeDiff < 0) {
                throw new Error(
                  "Current Date Must be greater than last record",
                );
              }
            }

            // ۲. بروزرسانی کانتر
            let counter = await tx.tblCompCounter.update({
              where: { compCounterId, instId },
              data: {
                changedBy: user?.employeeId,
                dependsOnId:
                  data.tblCompCounter?.connect?.compCounterId || null,
                orderNo: data.orderNo,
                startDate: data.startDate,
                startValue: data.startValue,
                currentDate: data.currentDate,
                currentValue: data.currentValue,
                useCalcAverage: data.useCalcAverage ? 1 : null,
                averageCountRate: data.useCalcAverage
                  ? data.averageCountRate
                  : null,
              },
            });

            // ۳. ثبت لاگ
            await effectCompCounter(tx, counter, instId);

            // ۴. محاسبه نرخ متوسط (الگوریتم اصلی بدون تغییر)
            let finalAvg = counter.averageCountRate ?? -1;

            if (!data.useCalcAverage) {
              const lastTwoLogs = await tx.tblCompCounterLog.findMany({
                where: { compCounterId, instId },
                orderBy: { compCounterLogId: "desc" },
                take: 2,
              });

              if (lastTwoLogs.length === 2) {
                const l1 = lastTwoLogs[0];
                const l2 = lastTwoLogs[1];

                if (l1?.currentValue != null && l2?.currentValue != null) {
                  const dv = l1.currentValue - l2.currentValue;
                  const dd = diffHours(l2.currentDate, l1.currentDate);

                  if (dd > 0 && dv <= dd + 13) {
                    const hourlyAvg = dv / dd;
                    finalAvg = hourlyAvg * 24;
                  }
                }
                if (finalAvg < 0) finalAvg = -1;
                if (finalAvg > 24) finalAvg = 24;
              }

              counter = await tx.tblCompCounter.update({
                where: { compCounterId, instId },
                data: { averageCountRate: finalAvg },
              });
            }

            // ۵. توسعه: پیدا کردن Jobها از طریق جدول واسط TblCompJobCounters
            const jobCounters = await tx.tblCompJobCounter.findMany({
              where: { compCounterId: compCounterId, instId },
              include: {
                tblCompJob: true, // لینک به جدول اصلی Job
              },
            });

            const now = new Date();

            for (const jc of jobCounters) {
              const job = jc.tblCompJob;
              if (!job) continue;

              let nextDate = new Date();

              if (finalAvg === -1) {
                nextDate = now;
              } else if (finalAvg === 0) {
                // ۶ ماه آینده
                nextDate.setMonth(nextDate.getMonth() + 6);
              } else {
                // شرط سوم: محاسبه جبری
                const nextDueCount = jc.nextDueCount;
                const currentVal = counter.currentValue || 0;

                if (!nextDueCount) {
                  nextDate = now;
                } else {
                  const remainingCapacity = nextDueCount - currentVal;
                  const addDays = remainingCapacity / finalAvg;

                  // اصلاح خطای TypeScript با استفاده از Nullish Coalescing
                  const baseDate = new Date(counter.currentDate ?? new Date());
                  baseDate.setDate(baseDate.getDate() + Math.round(addDays));

                  nextDate = baseDate;
                }
              }

              // بروزرسانی جدول Job
              await tx.tblCompJob.update({
                where: { compJobId: job.compJobId, instId },
                data: {
                  nextDueDate: nextDate,
                  lastUpdate: now,
                },
              });

              // بروزرسانی WorkOrderها
              await tx.tblWorkOrder.updateMany({
                where: {
                  instId,
                  compJobId: job.compJobId,
                  workOrderStatusId: { notIn: [5, 6, 7, 8] },
                },
                data: {
                  dueDate: nextDate,
                  lastUpdate: now,
                },
              });
            }

            return counter;
          });

          return result;
        },
        {
          tags: ["tblCompCounter"],
          detail: {
            summary: "Update",
            description:
              "Update TblCompCounter and run side effects in transaction",
          },
          params: t.Object({
            compCounterId: t.Number(),
          }),
          body: TblCompCounterInputUpdate,
          response: buildResponseSchema(
            TblCompCounterPlain,
            TblCompCounterSchema,
          ),
        },
      );
  },
}).app;

export default ControllerTblCompCounter;
