import { PrismaClient } from 'orm/generated/prisma'

const prisma = new PrismaClient()

export async function effectCompTypeJobChange({
  compTypeJobId,
  operation,
}: {
  compTypeJobId: number
  operation: 0 | 1 | 2
}) {
  return prisma.$transaction(async tx => {
    const ctj = await tx.tblCompTypeJob.findUnique({
      where: { compTypeJobId },
    })

    if (!ctj) {
      throw new Error('CompTypeJob not found.')
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
    } = ctj

    if (!compTypeId || !jobDescId) {
      throw new Error('Invalid CompTypeJob data.')
    }

    // 2) Units
    const units = await tx.tblComponentUnit.findMany({
      where: { compTypeId },
      select: { compId: true },
    })

    if (!units.length) {
      return { status: 'OK', message: 'No component units found.' }
    }

    const compIds = units.map(u => u.compId)

    switch (operation) {
      // ================= INSERT =================
      case 0: {
        /**
         * فقط برای CompIDهایی که Job ندارند INSERT می‌کنیم
         * (بر اساس Unique واقعی دیتابیس)
         */
        const existing = await tx.tblCompJob.findMany({
          where: {
            jobDescId,
            compId: { in: compIds },
          },
          select: { compId: true },
        })

        const existingSet = new Set(existing.map(e => e.compId))

        const data = compIds
          .filter(compId => !existingSet.has(compId))
          .map(compId => ({
            compId,
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
          }))

        if (data.length) {
          await tx.tblCompJob.createMany({ data })
        }

        return {
          status: 'OK',
          message: `Inserted ${data.length} CompJob records.`,
        }
      }

      // ================= UPDATE =================
      case 1: {
        await tx.tblCompJob.updateMany({
          where: {
            jobDescId,
            compId: { in: compIds },
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
        })

        return { status: 'OK', message: 'Update complete.' }
      }

      // ================= SOFT DELETE =================
      case 2: {
        await tx.tblCompJob.updateMany({
          where: {
            jobDescId,
            compId: { in: compIds },
          },
          data: {
            exportMarker: 3,
            lastupdate: new Date(),
          },
        })

        return { status: 'OK', message: 'Soft delete complete.' }
      }

      default:
        throw new Error('Invalid operation.')
    }
  })
}
