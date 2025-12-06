import { PrismaClient } from "orm/generated/prisma";

const prisma = new PrismaClient();

export async function effectCompTypeJobChange({
  compTypeJobId,
  operation,
}: {
  compTypeJobId: number;
  operation: 0 | 1 | 2;
}) {
  return prisma.$transaction(async (tx) => {
    // 1) دریافت اطلاعات CompTypeJob
    const compTypeJob = await tx.tblCompTypeJob.findUnique({
      where: { compTypeJobId },
    });

    if (!compTypeJob) {
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
    } = compTypeJob;

    // پیدا کردن Unitهای مرتبط با این CompType
    const units = await tx.tblComponentUnit.findMany({
      where: { compTypeId },
      select: { compId: true },
    });

    const existingJobs = await tx.tblCompJob.findMany({
      where: { jobDescId, compId: { in: units.map((u) => u.compId) } },
      select: { compId: true },
    });

    const existingUnitIds = new Set(existingJobs.map((j) => j.compId));

    switch (operation) {
      // ------------------- INSERT -------------------
      case 0:
        for (const unit of units) {
          if (!existingUnitIds.has(unit.compId)) {
            await tx.tblCompJob.create({
              data: {
                compId: unit.compId,
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
                exportMarker: 1,
                priority,
                maintClassId,
                maintCauseId,
                maintTypeId,
                statusNone,
                statusInUse,
                statusAvailable,
                statusRepair,
              },
            });
          }
        }
        return { status: "OK", message: "Insert complete." };

      // ------------------- UPDATE -------------------
      case 1:
        await tx.tblCompJob.updateMany({
          where: {
            jobDescId,
            compId: { in: units.map((u) => u.compId) },
          },
          data: {
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
            exportMarker: 2,
            priority,
            maintClassId,
            maintCauseId,
            maintTypeId,
            statusNone,
            statusInUse,
            statusAvailable,
            statusRepair,
            lastupdate: new Date(),
          },
        });
        return { status: "OK", message: "Update complete." };

      // ------------------- SOFT DELETE -------------------
      case 2:
        await tx.tblCompJob.updateMany({
          where: {
            jobDescId,
            compId: { in: units.map((u) => u.compId) },
          },
          data: {
            exportMarker: 3,
            lastupdate: new Date(),
          },
        });
        return { status: "OK", message: "Delete complete (soft-delete)." };

      default:
        throw new Error("Invalid operation.");
    }
  });
}
