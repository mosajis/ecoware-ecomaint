import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
import { effectCompCounter } from "../effects/EffectTblCompCounter";
import { BaseService } from "@/utils/base.service";
import {
  TblCompCounter,
  TblCompCounterInputCreate,
  TblCompCounterInputUpdate,
  TblCompCounterPlain,
} from "orm/generated/prismabox/TblCompCounter";
import { diffHours } from "@/helper";

export const ServiceTblCompCounter = new BaseService(prisma.tblCompCounter);
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
  responseSchema: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
  extend: (app) => {
    app.post(
      "/",
      async ({ body, set }) => {
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
            },
          });
          await effectCompCounter(tx, counter);
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
        response: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
      },
    );

    app.put(
      "/:compCounterId",
      async ({ params, body, set }) => {
        const compCounterId = Number(params.compCounterId);
        const data = body;

        const result = await prisma.$transaction(async (tx) => {
          // ۱. اعتبارسنجی تاریخ (طبق منطق قبلی خودت)
          const lastLog = await tx.tblCompCounterLog.findFirst({
            where: { compCounterId },
            orderBy: { compCounterLogId: "desc" },
          });

          if (lastLog) {
            const timeDiff = diffHours(lastLog.currentDate, data.currentDate);
            if (timeDiff < 0) {
              throw new Error("Current Date Must be greater than last record");
            }
          }

          // ۲. بروزرسانی کانتر
          let counter = await tx.tblCompCounter.update({
            where: { compCounterId },
            data: {
              dependsOnId: data.tblCompCounter?.connect?.compCounterId,
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
          await effectCompCounter(tx, counter);

          // ۴. محاسبه نرخ متوسط (الگوریتم اصلی بدون تغییر)
          let finalAvg = counter.averageCountRate ?? -1;

          if (!data.useCalcAverage) {
            const lastTwoLogs = await tx.tblCompCounterLog.findMany({
              where: { compCounterId },
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
              where: { compCounterId },
              data: { averageCountRate: finalAvg },
            });
          }

          // ۵. توسعه: پیدا کردن Jobها از طریق جدول واسط TblCompJobCounters
          const jobCounters = await tx.tblCompJobCounter.findMany({
            where: { compCounterId: compCounterId },
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
              where: { compJobId: job.compJobId },
              data: {
                nextDueDate: nextDate,
                lastUpdate: now,
              },
            });

            // بروزرسانی WorkOrderها
            await tx.tblWorkOrder.updateMany({
              where: {
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
        response: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
      },
    );
  },
}).app;

export default ControllerTblCompCounter;
