import type { prisma } from "@/utils/prisma";
import type { Prisma, TblCompCounter } from "orm/generated/prisma/client";

export async function effectCompCounter(
  tx: Prisma.TransactionClient,
  counter: TblCompCounter,
) {
  const hasCurrent = counter.currentDate && counter.currentValue !== null;
  const hasStart = counter.startDate && counter.startValue !== null;

  if (!hasCurrent && !hasStart) return null;

  // لاگ اصلی Counter
  const log = await tx.tblCompCounterLog.create({
    data: {
      compCounterId: counter.compCounterId,
      currentDate: counter.currentDate,
      currentValue: counter.currentValue,
      startDate: counter.startDate,
      startValue: counter.startValue,
      orderNo: counter.orderNo,
      deptId: counter.deptId ?? 1234,
      changedDate: new Date(),
      lastupdate: new Date(),
    },
  });

  if (counter.dependsOnId) {
    await tx.tblCompCounterLog.create({
      data: {
        compCounterId: counter.dependsOnId,
        currentDate: counter.currentDate,
        currentValue: counter.currentValue,
        startDate: counter.startDate,
        startValue: counter.startValue,
        orderNo: counter.orderNo,
        deptId: counter.deptId ?? 1234,
        changedDate: new Date(),
        lastupdate: new Date(),
      },
    });
  }

  return log;
}
