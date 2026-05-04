import type { Prisma, TblCompCounter } from "orm/generated/prisma/client";

export async function effectCompCounter(
  tx: Prisma.TransactionClient,
  counter: TblCompCounter,
  instId: number,
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
      changedDate: new Date(),
      lastUpdate: new Date(),
      instId,
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
        changedDate: new Date(),
        lastUpdate: new Date(),
        instId,
      },
    });
  }

  return log;
}
