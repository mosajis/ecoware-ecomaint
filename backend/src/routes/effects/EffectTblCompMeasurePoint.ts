import type { Prisma, TblCompMeasurePoint } from "orm/generated/prisma/client";

export async function effectCompMeasurePoint(
  tx: Prisma.TransactionClient,
  measurePoint: TblCompMeasurePoint,
) {
  const hasCurrent =
    measurePoint.currentDate && measurePoint.currentValue !== null;

  if (!hasCurrent) return null;

  const log = await tx.tblCompMeasurePointLog.create({
    data: {
      compMeasurePointId: measurePoint.compMeasurePointId,
      currentDate: measurePoint.currentDate,
      currentValue: measurePoint.currentValue,
      changedBy: measurePoint.changedBy ?? null,
      changedDate: new Date(),
      orderNo: measurePoint.orderNo,
      deptId: measurePoint.deptId ?? 0,
      unitId: measurePoint.unitId ?? null,
      exportMarker: measurePoint.exportMarker ?? 0,
      lastupdate: new Date(),
    },
  });

  return log;
}
