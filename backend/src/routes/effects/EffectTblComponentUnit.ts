import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

export async function effectComponentUnitChange({
  componentUnitId,
  userId,
}: {
  componentUnitId: number;
  userId: number;
}) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    // =========================================================================
    // ComponentUnit
    // =========================================================================
    const componentUnit = await tx.tblComponentUnit.findUnique({
      where: { compId: componentUnitId },
      select: {
        compId: true,
        compTypeId: true,
      },
    });

    if (!componentUnit?.compTypeId) {
      throw new Error("Invalid componentUnit or compTypeId", { cause: "s" });
    }

    const { compId, compTypeId } = componentUnit;

    // =========================================================================
    // Read CompType data
    // =========================================================================
    const [
      compTypeJobs,
      compTypeMeasurePoints,
      compTypeCounters,
      compTypeAttachments,
    ] = await Promise.all([
      tx.tblCompTypeJob.findMany({ where: { compTypeId } }),
      tx.tblCompTypeMeasurePoint.findMany({ where: { compTypeId } }),
      tx.tblCompTypeCounter.findMany({ where: { compTypeId } }),
      tx.tblCompTypeAttachment.findMany({ where: { compTypeId } }),
    ]);

    // =========================================================================
    // CompJob
    // =========================================================================
    await tx.tblCompJob.createMany({
      data: compTypeJobs.map((j) => ({
        compId,
        exportMarker: 0,
        lastupdate: now,
        orderNo: j.orderNo,
        discId: j.discId,
        jobDescId: j.jobDescId,
        jobConditionId: j.jobConditionId,
        frequency: j.frequency,
        frequencyPeriod: j.frequencyPeriod,
        planningMethod: j.planningMethod,
        statusNone: j.statusNone,
        statusInUse: j.statusInUse,
        statusAvailable: j.statusAvailable,
        statusRepair: j.statusRepair,
        outputFormat: j.outputFormat,
        maintClassId: j.maintClassId,
        maintCauseId: j.maintCauseId,
        maintTypeId: j.maintTypeId,
        rescheduleLimitId: j.rescheduleLimitId,
        priority: j.priority,
        window: j.window,
        active: j.active,
        mandatoryHistory: j.mandatoryHistory,
        deptId: j.deptId,
        mandatoryResource: j.mandatoryResource,
        mandatoryStockUsage: j.mandatoryStockUsage,
        createdUserId: userId,
        changeReason: "",
        notes: "",
      })),
    });

    // =========================================================================
    // JobTrigger (ID-based)
    // =========================================================================
    const compTypeJobIds = compTypeJobs.map((j) => j.compTypeJobId);

    const compTypeJobTriggers =
      compTypeJobIds.length === 0
        ? []
        : await tx.tblCompTypeJobTrigger.findMany({
            where: {
              compTypeJobId: { in: compTypeJobIds },
            },
          });

    if (compTypeJobTriggers.length > 0) {
      const compJobs = await tx.tblCompJob.findMany({
        where: { compId },
      });

      const jobMap = new Map(compJobs.map((j) => [j.jobDescId, j]));

      const jobTriggerData = compTypeJobTriggers
        .map((ctjt) => {
          const compTypeJob = compTypeJobs.find(
            (j) => j.compTypeJobId === ctjt.compTypeJobId,
          );
          if (!compTypeJob) return null;

          const job = jobMap.get(compTypeJob.jobDescId);
          if (!job) return null;

          return {
            compJobId: job.compJobId,
            jobTriggerId: ctjt.jobTriggerId,
          };
        })
        .filter(Boolean);

      if (jobTriggerData.length > 0) {
        await tx.tblCompJobTrigger.createMany({
          data: jobTriggerData as any[],
        });
      }
    }

    // =========================================================================
    // Measure Points
    // =========================================================================
    await tx.tblCompMeasurePoint.createMany({
      data: compTypeMeasurePoints.map((m) => ({
        compId,
        counterTypeId: m.counterTypeId,
        unitId: m.unitId,
        setValue: m.setValue,
        operationalMinValue: m.operationalMinValue,
        operationalMaxValue: m.operationalMaxValue,
        deptId: m.deptId,
        orderNo: m.orderNo,
        lastupdate: now,
        currentValue: 0,
        exportMarker: 0,
      })),
    });

    // =========================================================================
    // Counters
    // =========================================================================
    await tx.tblCompCounter.createMany({
      data: compTypeCounters.map((c) => ({
        compId,
        counterTypeId: c.counterTypeId,
        deptId: c.deptId,
        orderNo: c.orderNo,
        averageCountRate: c.averageCountRate,
        useCalcAverage: c.useCalcAverage,
        exportMarker: 0,
        lastupdate: now,
        currentValue: 0,
      })),
    });

    // =========================================================================
    // Attachments
    // =========================================================================
    await tx.tblComponentUnitAttachment.createMany({
      data: compTypeAttachments.map((a) => ({
        compId,
        attachmentId: a.attachmentId,
        orderNo: a.orderNo,
        createdUserId: userId,
        createdAt: now,
      })),
    });

    // =========================================================================
    // JobCounter (کاملاً ID-based)
    // =========================================================================

    const compTypeJobCounters =
      compTypeJobIds.length === 0
        ? []
        : await tx.tblCompTypeJobCounter.findMany({
            where: {
              compTypeJobId: { in: compTypeJobIds },
            },
          });

    const [compJobs, compCounters] = await Promise.all([
      tx.tblCompJob.findMany({ where: { compId } }),
      tx.tblCompCounter.findMany({ where: { compId } }),
    ]);

    const jobMap = new Map(compJobs.map((j) => [j.jobDescId, j]));
    const counterMap = new Map(compCounters.map((c) => [c.counterTypeId, c]));

    const jobCounterData = compTypeJobCounters
      .map((jc) => {
        const compTypeJob = compTypeJobs.find(
          (j) => j.compTypeJobId === jc.compTypeJobId,
        );
        if (!compTypeJob) return null;

        const job = jobMap.get(compTypeJob.jobDescId);
        const counter = counterMap.get(jc.compTypeCounterId);

        if (!job || !counter) return null;

        return {
          compJobId: job.compJobId,
          compCounterId: counter.compCounterId,
          frequency: jc.frequency,
          window: jc.window,
          deptId: jc.deptId,
          orderNo: jc.orderNo,
          updateByFunction: jc.updateByFunction,
          showInAlert: jc.showInAlert,
          exportMarker: 0,
          lastupdate: now,
          createdUserId: userId,
          orderNumber: 0,
        };
      })
      .filter(Boolean);

    if (jobCounterData.length > 0) {
      await tx.tblCompJobCounter.createMany({
        data: jobCounterData as any[],
      });
    }
  });
}
