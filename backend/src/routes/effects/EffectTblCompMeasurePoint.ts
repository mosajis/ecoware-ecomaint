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
      changedDate: new Date(),
      orderNo: measurePoint.orderNo,
      unitId: measurePoint.unitId ?? null,
      lastUpdate: new Date(),
    },
  });

  return log;
}
