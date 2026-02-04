import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeMeasurePoint({
  compTypeMeasurePointId,
  operation,
}: {
  compTypeMeasurePointId: number;
  operation: OperationType;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeMeasurePoint =================
    const ctmp = await tx.tblCompTypeMeasurePoint.findUnique({
      where: { compTypeMeasurePointId },
    });

    if (!ctmp) {
      throw new Error("CompTypeMeasurePoint not found.");
    }

    const {
      compTypeId,
      counterTypeId,
      unitId,
      setValue,
      operationalMinValue,
      operationalMaxValue,
      deptId,
      orderNo,
    } = ctmp;

    if (!compTypeId || !counterTypeId) {
      throw new Error("Invalid CompTypeMeasurePoint data.");
    }

    // ================= Fetch Component Units =================
    const compIds = await tx.tblComponentUnit
      .findMany({
        where: { compTypeId },
        select: { compId: true },
      })
      .then((rows) => rows.map((r) => r.compId));

    if (!compIds.length) {
      return { status: "OK", message: "No component units found." };
    }

    // ================= Shared payload =================
    const baseData = {
      counterTypeId,
      unitId,
      setValue,
      operationalMinValue,
      operationalMaxValue,
      deptId,
      orderNo,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompMeasurePoint.findMany({
          where: {
            counterTypeId,
            compId: { in: compIds },
          },
          select: { compId: true },
        });

        const existingSet = new Set(existing.map((e) => e.compId));

        const data = compIds
          .filter((compId) => !existingSet.has(compId))
          .map((compId) => ({
            compId,
            ...baseData,
          }));

        if (data.length) {
          await tx.tblCompMeasurePoint.createMany({ data });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompMeasurePoint records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const result = await tx.tblCompMeasurePoint.updateMany({
          where: {
            counterTypeId,
            compId: { in: compIds },
          },
          data: {
            ...baseData,
            lastupdate: new Date(),
          },
        });

        return {
          status: "OK",
          message: `Updated ${result.count} CompMeasurePoint records.`,
        };
      }

      // ========= DELETE =========
      case 2: {
        const result = await tx.tblCompMeasurePoint.deleteMany({
          where: {
            counterTypeId,
            compId: { in: compIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompMeasurePoint records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
