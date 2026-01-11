import { t } from 'elysia'
import { PrismaClient } from 'orm/generated/prisma'

const prisma = new PrismaClient()

export const OperationEnum = t.Enum({
  CREATE: 0,
  UPDATE: 1,
  DELETE: 2,
})

export async function effectComponentUnitChange({
  componentUnitId,
  operation,
}: {
  componentUnitId: number
  operation: 0 | 1 | 2
}) {}
