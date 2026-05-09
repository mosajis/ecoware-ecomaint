import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeJobCounter({
  compTypeJobCounterId,
  operation,
  instId,
}: {
  compTypeJobCounterId: number;
  operation: OperationType;
  instId: number;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeJobCounter =================
    const ctjc = await tx.tblCompTypeJobCounter.findUnique({
      where: { compTypeJobCounterId, instId },
      include: {
        tblCompTypeJob: true,
        tblCompTypeCounter: true,
      },
    });

    if (!ctjc || !ctjc.tblCompTypeJob || !ctjc.tblCompTypeCounter) {
      throw new Error("CompTypeJobCounter or related data not found.");
    }

    const {
      compTypeJobId,
      compTypeCounterId,
      frequency,
      window,
      showInAlert,
      updateByFunction,
      orderNo,
      createdEmployeeId,
    } = ctjc;

    const { compTypeId, jobDescId } = ctjc.tblCompTypeJob;
    const { counterTypeId } = ctjc.tblCompTypeCounter;

    if (!compTypeId || !jobDescId || !compTypeCounterId || !counterTypeId) {
      throw new Error("Invalid CompTypeJobCounter data.");
    }

    // ================= Fetch Component Units =================
    const compIds = await tx.tblComponentUnit
      .findMany({
        where: { compTypeId, instId },
        select: { compId: true },
      })
      .then((rows) => rows.map((r) => r.compId));

    if (!compIds.length) {
      return { status: "OK", message: "No component units found." };
    }

    // ================= Get CompJobIds =================
    const compJobs = await tx.tblCompJob.findMany({
      where: {
        instId,
        jobDescId,
        compId: { in: compIds },
      },
      select: { compJobId: true, compId: true },
    });

    if (!compJobs.length) {
      return { status: "OK", message: "No CompJob records found." };
    }

    // ================= Get CompCounterIds =================
    const compCounters = await tx.tblCompCounter.findMany({
      where: {
        instId,
        compId: { in: compIds },
        counterTypeId,
      },
      select: { compCounterId: true, compId: true },
    });

    const counterMap = new Map(
      compCounters.map((c) => [c.compId!, c.compCounterId]),
    );

    // ================= Shared payload =================
    const baseData = {
      instId,
      frequency,
      window,
      showInAlert,
      updateByFunction,
      orderNo,
      createdEmployeeId,
    };

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompJobCounter.findMany({
          where: {
            instId,
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
          },
          select: { compJobId: true, compCounterId: true },
        });

        const existingSet = new Set(
          existing.map((e) => `${e.compJobId}-${e.compCounterId}`),
        );

        const data = compJobs
          .map((cj) => {
            const compCounterId = counterMap.get(cj.compId!);
            if (!compCounterId) return null;

            const key = `${cj.compJobId}-${compCounterId}`;
            if (existingSet.has(key)) return null;

            return {
              compJobId: cj.compJobId,
              compCounterId,
              ...baseData,
            };
          })
          .filter((d) => d !== null);

        if (data.length) {
          await tx.tblCompJobCounter.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompJobCounter records.`,
        };
      }

      // ========= UPDATE =========
      case 1: {
        const compCounterIds = Array.from(counterMap.values());

        const result = await tx.tblCompJobCounter.updateMany({
          where: {
            instId,
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
            compCounterId: { in: compCounterIds },
          },
          data: {
            ...baseData,
            lastUpdate: new Date(),
          },
        });

        return {
          status: "OK",
          message: `Updated ${result.count} CompJobCounter records.`,
        };
      }

      // ========= DELETE =========
      case 2: {
        const compCounterIds = Array.from(counterMap.values());

        const result = await tx.tblCompJobCounter.deleteMany({
          where: {
            instId,
            compJobId: { in: compJobs.map((cj) => cj.compJobId) },
            compCounterId: { in: compCounterIds },
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompJobCounter records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
