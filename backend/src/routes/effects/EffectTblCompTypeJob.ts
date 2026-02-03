import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeJob({
  compTypeJobId,
  operation,
  oldCompTypeId,
}: {
  compTypeJobId: number;
  operation: OperationType;
  oldCompTypeId?: number;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeJob =================
    const ctj = await tx.tblCompTypeJob.findUnique({
      where: { compTypeJobId },
    });

    if (!ctj) {
      throw new Error("CompTypeJob not found.");
    }

    const {
      compTypeId,
      jobDescId,
      discId,
      frequency,
      frequencyPeriod,
      jobConditionId,
      planningMethod,
      window,
      outputFormat,
      active,
      mandatoryResource,
      deptId,
      priority,
      maintClassId,
      maintCauseId,
      maintTypeId,
      statusNone,
      statusInUse,
      statusAvailable,
      statusRepair,
    } = ctj;

    if (!compTypeId || !jobDescId) {
      throw new Error("Invalid CompTypeJob data.");
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
      discId,
      frequency,
      frequencyPeriod,
      jobConditionId,
      planningMethod,
      window,
      outputFormat,
      active,
      mandatoryResource,
      deptId,
      priority,
      maintClassId,
      maintCauseId,
      maintTypeId,
      statusNone,
      statusInUse,
      statusAvailable,
      statusRepair,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompJob.findMany({
          where: {
            jobDescId,
            compId: { in: compIds },
          },
          select: { compId: true },
        });

        const existingSet = new Set(existing.map((e) => e.compId));

        const data = compIds
          .filter((compId) => !existingSet.has(compId))
          .map((compId) => ({
            compId,
            jobDescId,
            ...baseData,
          }));

        if (data.length) {
          await tx.tblCompJob.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompJob records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const result = await tx.tblCompJob.updateMany({
          where: {
            jobDescId,
            compId: { in: compIds },
          },
          data: {
            ...baseData,
            lastupdate: new Date(),
          },
        });

        return {
          status: "OK",
          message: `Updated ${result.count} CompJob records.`,
        };
      }

      case 2: {
        const result = await tx.tblCompJob.deleteMany({
          where: {
            jobDescId,
            compId: { in: compIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompJob records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
