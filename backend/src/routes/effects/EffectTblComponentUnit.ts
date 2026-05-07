import { prisma } from "@/utils/prisma";
import { t } from "elysia";

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
});

export async function effectComponentUnitChange({
  componentUnitId,
  employeeId,
  instId,
}: {
  componentUnitId: number;
  employeeId: number;
  instId: number;
}) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    // =========================================================================
    // ComponentUnit
    // =========================================================================
    const componentUnit = await tx.tblComponentUnit.findUnique({
      where: { compId: componentUnitId, instId },
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
      tx.tblCompTypeJob.findMany({ where: { compTypeId, instId } }),
      tx.tblCompTypeMeasurePoint.findMany({ where: { compTypeId, instId } }),
      tx.tblCompTypeCounter.findMany({ where: { compTypeId, instId } }),
      tx.tblCompTypeAttachment.findMany({ where: { compTypeId, instId } }),
    ]);

    // =========================================================================
    // CompJob
    // =========================================================================
    await tx.tblCompJob.createMany({
      data: compTypeJobs.map((j) => ({
        instId,
        compId,
        lastUpdate: now,
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
        maintClassId: j.maintClassId,
        maintCauseId: j.maintCauseId,
        maintTypeId: j.maintTypeId,
        priority: j.priority,
        window: j.window,
        mandatoryHistory: j.mandatoryHistory,
        createdEmployeeId: employeeId,
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
              instId,
              compTypeJobId: { in: compTypeJobIds },
            },
          });

    if (compTypeJobTriggers.length > 0) {
      const compJobs = await tx.tblCompJob.findMany({
        where: { compId, instId },
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
            instId,
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
        instId,
        compId,
        counterTypeId: m.counterTypeId,
        unitId: m.unitId,
        setValue: m.setValue,
        operationalMinValue: m.operationalMinValue,
        operationalMaxValue: m.operationalMaxValue,

        orderNo: m.orderNo,
        lastUpdate: now,
        currentValue: 0,
      })),
    });

    // =========================================================================
    // Counters
    // =========================================================================
    await tx.tblCompCounter.createMany({
      data: compTypeCounters.map((c) => ({
        instId,
        compId,
        counterTypeId: c.counterTypeId,

        orderNo: c.orderNo,
        averageCountRate: c.averageCountRate,
        useCalcAverage: c.useCalcAverage,
        lastUpdate: now,
        currentValue: 0,
      })),
    });

    // =========================================================================
    // Attachments
    // =========================================================================
    await tx.tblComponentUnitAttachment.createMany({
      data: compTypeAttachments.map((a) => ({
        instId,
        compId,
        attachmentId: a.attachmentId,
        orderNo: a.orderNo,
        createdEmployeeId: employeeId,
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
              instId,
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
          instId,
          compJobId: job.compJobId,
          compCounterId: counter.compCounterId,
          frequency: jc.frequency,
          window: jc.window,
          orderNo: jc.orderNo,
          updateByFunction: jc.updateByFunction,
          showInAlert: jc.showInAlert,
          lastUpdate: now,
          createdEmployeeId: employeeId,
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
