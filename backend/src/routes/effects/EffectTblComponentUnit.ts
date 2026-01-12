import { t } from 'elysia'
import {
  PrismaClient,
  type TblCompJob,
  type TblCompMeasurePoint,
} from 'orm/generated/prisma'

const prisma = new PrismaClient()

export const OperationEnum = t.Enum({
  CREATE: 0,
  DELETE: 2,
})

export async function effectComponentUnitChange({
  componentUnitId,
  userId,
}: {
  componentUnitId: number
  userId: number
}) {
  return prisma.$transaction(async tx => {
    const componentUnit = await tx.tblComponentUnit.findUnique({
      where: { compId: componentUnitId },
    })

    if (!componentUnit) {
      throw new Error('componentUnit not found.')
    }

    const { compTypeId } = componentUnit

    if (!compTypeId) {
      throw new Error('Invalid compType data.')
    }

    // ------------------------------- CompTypeJob ------------------------------------------
    // Read From CompTypeJob
    const compTypeJobs = await tx.tblCompTypeJob.findMany({
      where: { compTypeId },
    })

    // Parsed CompTypeJob To compJobs
    const compJobs = compTypeJobs.map(i => ({
      compId: componentUnit.compId,
      exportMarker: 0,
      lastupdate: new Date(),
      orderNo: i.orderNo,
      discId: i.discId,
      jobDescId: i.jobDescId,
      jobConditionId: i.jobConditionId,
      frequency: i.frequency,
      frequencyPeriod: i.frequencyPeriod,
      planningMethod: i.planningMethod,
      statusNone: i.statusNone,
      statusInUse: i.statusInUse,
      statusAvailable: i.statusAvailable,
      statusRepair: i.statusRepair,
      outputFormat: i.outputFormat,
      maintClassId: i.maintClassId,
      maintCauseId: i.maintCauseId,
      maintTypeId: i.maintTypeId,
      rescheduleLimitId: i.rescheduleLimitId,
      priority: i.priority,
      window: i.window,
      active: i.active,
      mandatoryHistory: i.mandatoryHistory,
      deptId: i.deptId,
      mandatoryResource: i.mandatoryResource,
      mandatoryStockUsage: i.mandatoryStockUsage,
      createdUserId: userId,
      changeReason: '',
      notes: '',
      lastDone: null,
      nextDueDate: null,
      cbmStatus: null,
    }))

    // write to tblCompJob
    await tx.tblCompJob.createMany({ data: compJobs })

    // ------------------------------- CompTypeMeasurePoint ----------------------------------
    // Read From CompTypeMeasurePoint
    const compTypeMeasurePoint = await tx.tblCompTypeMeasurePoint.findMany({
      where: { compTypeId },
    })

    // Parsed CompTypeMeasurePoint To CompMeasurePoint
    const compMeasurePoints = compTypeMeasurePoint.map(i => ({
      compId: componentUnit.compId,
      counterTypeId: i.counterTypeId,
      unitId: i.unitId,
      setValue: i.setValue,
      operationalMinValue: i.operationalMinValue,
      operationalMaxValue: i.operationalMaxValue,
      deptId: i.deptId,
      orderNo: i.orderNo,
      lastupdate: new Date(),
      changedBy: null,
      currentDate: null,
      currentValue: 0,
      exportMarker: 0,
    }))

    // write to CompMeasurePoint
    await tx.tblCompMeasurePoint.createMany({ data: compMeasurePoints })

    // ------------------------------- CompTypeCounter --------------------------------------
    // Read From CompTypeCounter
    const compTypeCounter = await tx.tblCompTypeCounter.findMany({
      where: { compTypeId },
    })

    // Parsed CompTypeCounter To CompCounter
    const compCounters = compTypeCounter.map(i => ({
      compId: componentUnit.compId,
      counterTypeId: i.counterTypeId,
      deptId: i.deptId,
      orderNo: i.orderNo,
      averageCountRate: i.averageCountRate,
      useCalcAverage: i.useCalcAverage,
      exportMarker: 0,
      lastupdate: new Date(),
      // Check this fields
      dependsOnId: null,
      startDate: null,
      startValue: null,
      lastZeroedValue: null,
      zeroedDate: null,
      changedBy: null,
      currentDate: null,
      currentValue: 0,
    }))

    // write to CompMeasurePoint
    await tx.tblCompCounter.createMany({ data: compCounters })

    // ------------------------------- CompTypeAttachmnet --------------------------------------
    // Read From CompTypeAttachments
    const compTypeAttachments = await tx.tblCompTypeAttachment.findMany({
      where: { compTypeId },
    })

    // Parsed CompTypeAttachment To CompAttachment
    const compAttachments = compTypeAttachments.map(i => ({
      compId: componentUnit.compId,
      attachmentId: i.attachmentId,
      orderNo: i.orderNo,
      createdUserId: userId,
      createdAt: new Date(),
    }))

    // write to CompMeasurePoint
    await tx.tblComponentUnitAttachment.createMany({ data: compAttachments })

    // ------------------------------- CompTypeJobCounter --------------------------------------
    compTypeJobs.forEach(async i => {
      const compTypeJobCounter = await tx.tblCompTypeJobCounter.findFirst({
        where: { compTypeJobId: i.compTypeJobId },
        include: {
          tblCompTypeCounter: true,
        },
      })

      if (compTypeJobCounter) {
        const compCoutner = await tx.tblCompCounter.findFirst({
          where: {
            counterTypeId: compTypeJobCounter.tblCompTypeCounter?.counterTypeId,
          },
        })
        if (compCoutner) {
          const compJob = await tx.tblCompJob.findFirst({
            where: {
              jobDescId: i.jobDescId,
            },
          })
          await tx.tblCompJobCounter.create({
            data: {
              compJobId: compJob?.compJobId,
              compCounterId: compCoutner.compCounterId,
              frequency: compTypeJobCounter.frequency,
              window: compTypeJobCounter.window,
              deptId: compTypeJobCounter.deptId,
              orderNo: compTypeJobCounter.orderNo,
              updateByFunction: compTypeJobCounter.updateByFunction,
              showInAlert: compTypeJobCounter.showInAlert,
              exportMarker: 0,
              lastupdate: new Date(),
              createdUserId: userId,
              lastDoneCount: null,
              nextDueCount: null,
              orderNumber: 0,
            },
          })
        }
      }
    })
  })
}
