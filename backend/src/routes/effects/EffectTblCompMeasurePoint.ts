import type { Prisma, TblCompMeasurePoint } from "orm/generated/prisma/client";

export async function effectCompMeasurePoint(
  tx: Prisma.TransactionClient,
  measurePoint: TblCompMeasurePoint,
  instId = 0,
) {
  const hasCurrent =
    measurePoint.currentDate && measurePoint.currentValue !== null;

  if (!hasCurrent) return null;

  const log = await tx.tblCompMeasurePointLog.create({
    data: {
      instId,
      compMeasurePointId: measurePoint.compMeasurePointId,
      currentDate: measurePoint.currentDate,
      currentValue: measurePoint.currentValue,
      changedBy: measurePoint.changedBy ?? null,
      orderNo: measurePoint.orderNo,
      unitId: measurePoint.unitId ?? null,
      changedDate: new Date(),
      lastUpdate: new Date(),
    },
  });

  return log;
}
