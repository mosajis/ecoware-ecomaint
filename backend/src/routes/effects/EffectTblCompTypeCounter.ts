import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeCounter({
  compTypeCounterId,
  operation,
  oldCompTypeId,
}: {
  compTypeCounterId: number;
  operation: OperationType;
  oldCompTypeId?: number;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeCounter =================
    const ctc = await tx.tblCompTypeCounter.findUnique({
      where: { compTypeCounterId },
    });

    if (!ctc) {
      throw new Error("CompTypeCounter not found.");
    }

    const {
      compTypeId,
      counterTypeId,
      averageCountRate,
      useCalcAverage,
      deptId,
      orderNo,
    } = ctc;

    if (!compTypeId || !counterTypeId) {
      throw new Error("Invalid CompTypeCounter data.");
    }

    // ================= Determine which compTypeId to use =================
    const targetCompTypeId =
      operation === 1 && oldCompTypeId ? oldCompTypeId : compTypeId;

    // ================= Fetch Component Units =================
    const compIds = await tx.tblComponentUnit
      .findMany({
        where: { compTypeId: targetCompTypeId },
        select: { compId: true },
      })
      .then((rows) => rows.map((r) => r.compId));

    if (!compIds.length) {
      return { status: "OK", message: "No component units found." };
    }

    // ================= Shared payload =================
    const baseData = {
      counterTypeId,
      averageCountRate,
      useCalcAverage,
      deptId,
      orderNo,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompCounter.findMany({
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
          await tx.tblCompCounter.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompCounter records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const result = await tx.tblCompCounter.updateMany({
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
          message: `Updated ${result.count} CompCounter records.`,
        };
      }

      // ========= DELETE =========
      case 2: {
        const result = await tx.tblCompCounter.deleteMany({
          where: {
            counterTypeId,
            compId: { in: compIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompCounter records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
