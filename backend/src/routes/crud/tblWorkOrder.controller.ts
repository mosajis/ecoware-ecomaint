import { BaseController } from '@/utils/base.controller'
import { BaseService } from '@/utils/base.service'
import { Prisma } from 'orm/generated/prisma'
import { buildResponseSchema } from '@/utils/base.schema'
import { prisma } from '@/utils/prisma'
import {
  TblWorkOrder,
  TblWorkOrderInputCreate,
  TblWorkOrderInputUpdate,
  TblWorkOrderPlain,
} from 'orm/generated/prismabox/TblWorkOrder'

export const ServiceTblWorkOrder = new BaseService(prisma.tblWorkOrder)

const ControllerTblWorkOrder = new BaseController({
  prefix: '/tblWorkOrder',
  swagger: {
    tags: ['tblWorkOrder'],
  },
  primaryKey: 'workOrderId',
  service: ServiceTblWorkOrder,
  createSchema: TblWorkOrderInputCreate,
  updateSchema: TblWorkOrderInputUpdate,
  responseSchema: buildResponseSchema(TblWorkOrderPlain, TblWorkOrder),
  extend: app => {
    app.post('/generate', async ({ params, body, set }: any) => {
      const userId = Number(body.userId)

      if (!userId) {
        throw new Error('User not found')
      }

      // Get all ComJobs with next Due Date null
      const compJobs = await prisma.tblCompJob.findMany({
        where: {
          nextDueDate: null,
        },
        select: {
          compJobId: true,
          discId: true,
          compId: true,
          priority: true,
          window: true,
          tblJobDescription: {
            select: {
              jobDescTitle: true,
            },
          },
        },
      })

      // map CompJobs To WorkOrders
      const workOrders: Prisma.TblWorkOrderCreateManyInput[] = compJobs.map(
        i => ({
          createdBy: userId,
          respDiscId: i.discId,
          compId: i.compId,
          title: i.tblJobDescription?.jobDescTitle,
          priority: i.priority,
          dueDate: new Date(),
          window: i.window,
          created: new Date(),
          workOrderStatusId: 2,
          exportMarker: 0,
          lastupdate: new Date(),
          workOrderTypeId: 2,
        })
      )

      // insert workOrders
      const resultTblWorkOrder = await prisma.tblWorkOrder.createMany({
        data: workOrders,
      })

      const resultTblCompJob = await prisma.tblCompJob.updateMany({
        data: {
          nextDueDate: new Date(),
          lastDone: new Date(),
          lastupdate: new Date(),
        },
        where: {
          compJobId: {
            in: compJobs.map(i => i.compJobId),
          },
        },
      })
      return { message: 'ok', resultTblWorkOrder, resultTblCompJob }
    })

    app.post('/generate/next', async ({ params, body, set }) => {})
  },
}).app

export default ControllerTblWorkOrder
