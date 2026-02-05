import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

type OperationType = typeof OperationEnum.static;

export async function effectCompTypeJobTrigger({
  compTypeJobTriggerId,
  operation,
}: {
  compTypeJobTriggerId: number;
  operation: OperationType;
}) {
  return prisma.$transaction(async (tx) => {
    // ================= Fetch CompTypeJobTrigger =================
    const ctjt = await tx.tblCompTypeJobTrigger.findUnique({
      where: { compTypeJobTriggerId },
    });

    if (!ctjt?.compTypeJobId || !ctjt.jobTriggerId) {
      throw new Error("Invalid CompTypeJobTrigger data.");
    }

    const { compTypeJobId, jobTriggerId } = ctjt;

    // ================= Fetch CompTypeJob =================
    const compTypeJob = await tx.tblCompTypeJob.findUnique({
      where: { compTypeJobId },
    });

    if (!compTypeJob?.compTypeId || !compTypeJob.jobDescId) {
      throw new Error("Invalid CompTypeJob data.");
    }

    const { compTypeId, jobDescId } = compTypeJob;

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

    // ================= Fetch CompJobs =================
    const compJobs = await tx.tblCompJob.findMany({
      where: {
        compId: { in: compIds },
        jobDescId,
      },
      select: {
        compJobId: true,
      },
    });

    if (!compJobs.length) {
      return { status: "OK", message: "No comp jobs found." };
    }

    const compJobIds = compJobs.map((j) => j.compJobId);

    // ================= Operation Switch =================
    switch (operation) {
      // ========= CREATE =========
      case 0: {
        const existing = await tx.tblCompJobTrigger.findMany({
          where: {
            compJobId: { in: compJobIds },
            jobTriggerId,
          },
          select: { compJobId: true },
        });

        const existingSet = new Set(existing.map((e) => e.compJobId));

        const data = compJobIds
          .filter((compJobId) => !existingSet.has(compJobId))
          .map((compJobId) => ({
            compJobId,
            jobTriggerId,
          }));

        if (data.length) {
          await tx.tblCompJobTrigger.createMany({
            data,
          });
        }

        return {
          status: "OK",
          message: `Inserted ${data.length} CompJobTrigger records.`,
        };
      }

      // ========= UPDATE =========
      // (عملاً چیزی برای update نداریم، ولی برای completeness)
      case 1: {
        return {
          status: "OK",
          message: "No updatable fields for JobTrigger.",
        };
      }

      // ========= DELETE =========
      case 2: {
        const result = await tx.tblCompJobTrigger.deleteMany({
          where: {
            compJobId: { in: compJobIds },
            jobTriggerId,
          },
        });

        return {
          status: "OK",
          message: `Hard deleted ${result.count} CompJobTrigger records.`,
        };
      }

      default:
        throw new Error("Unsupported operation.");
    }
  });
}
