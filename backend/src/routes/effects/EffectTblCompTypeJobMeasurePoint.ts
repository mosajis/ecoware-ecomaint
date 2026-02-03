import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeJobMeasurePoint({
  compTypeJobMeasurePointId,
  operation,
  oldCompTypeId,
}: {
  compTypeJobMeasurePointId: number;
  operation: OperationType;
  oldCompTypeId?: number;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeJobMeasurePoint =================
    const ctjmp = await tx.tblCompTypeJobMeasurePoint.findUnique({
      where: { compTypeJobMeasurePointId },
      include: {
        tblCompTypeJob: true,
        tblCompTypeMeasurePoint: true,
      },
    });

    if (!ctjmp || !ctjmp.tblCompTypeJob || !ctjmp.tblCompTypeMeasurePoint) {
      throw new Error("CompTypeJobMeasurePoint or related data not found.");
    }

    const {
      compTypeJobId,
      compTypeMeasurePointId,
      triggerJob,
      useOperationalValues,
      minValue,
      maxValue,
      updateOnReport,
      deptId,
      orderNo,
    } = ctjmp;

    const { compTypeId, jobDescId } = ctjmp.tblCompTypeJob;
    const { counterTypeId } = ctjmp.tblCompTypeMeasurePoint;

    if (!compTypeId || !jobDescId || !counterTypeId) {
      throw new Error("Invalid CompTypeJobMeasurePoint data.");
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

    // ================= Get CompJobIds =================
    const compJobs = await tx.tblCompJob.findMany({
      where: {
        jobDescId,
        compId: { in: compIds },
      },
      select: { compJobId: true, compId: true },
    });

    if (!compJobs.length) {
      return { status: "OK", message: "No CompJob records found." };
    }

    // ================= Get CompMeasurePointIds =================
    const compMeasurePoints = await tx.tblCompMeasurePoint.findMany({
      where: {
        compId: { in: compIds },
        counterTypeId,
      },
      select: { compMeasurePointId: true, compId: true },
    });

    const measurePointMap = new Map(
      compMeasurePoints.map((mp) => [mp.compId!, mp.compMeasurePointId]),
    );

    // ================= Shared payload =================
    const baseData = {
      triggerJob,
      useOperationalValues,
      minValue,
      maxValue,
      updateOnReport,
      deptId,
      orderNo,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompJobMeasurePoint.findMany({
          where: {
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
          },
          select: { compJobId: true, compMeasurePointId: true },
        });

        const existingSet = new Set(
          existing.map((e) => `${e.compJobId}-${e.compMeasurePointId}`),
        );

        const data = compJobs
          .map((cj) => {
            const compMeasurePointId = measurePointMap.get(cj.compId!);
            if (!compMeasurePointId) return null;

            const key = `${cj.compJobId}-${compMeasurePointId}`;
            if (existingSet.has(key)) return null;

            return {
              compJobId: cj.compJobId,
              compMeasurePointId,
              ...baseData,
            };
          })
          .filter((d) => d !== null);

        if (data.length) {
          await tx.tblCompJobMeasurePoint.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompJobMeasurePoint records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const compMeasurePointIds = Array.from(measurePointMap.values());

        const result = await tx.tblCompJobMeasurePoint.updateMany({
          where: {
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
            compMeasurePointId: { in: compMeasurePointIds },
          },
          data: {
            ...baseData,
            lastupdate: new Date(),
          },
        });

        return {
          status: "OK",
          message: `Updated ${result.count} CompJobMeasurePoint records.`,
        };
      }

      // ========= DELETE =========
      case 2: {
        const compMeasurePointIds = Array.from(measurePointMap.values());

        const result = await tx.tblCompJobMeasurePoint.deleteMany({
          where: {
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
            compMeasurePointId: { in: compMeasurePointIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompJobMeasurePoint records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
