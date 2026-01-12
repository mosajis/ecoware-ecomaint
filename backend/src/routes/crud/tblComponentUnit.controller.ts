import { t } from 'elysia'
import { BaseController } from '@/utils/base.controller'
import { BaseService } from '@/utils/base.service'
import { buildResponseSchema } from '@/utils/base.schema'
import { prisma } from '@/utils/prisma'
import {
  TblComponentUnit,
  TblComponentUnitInputCreate,
  TblComponentUnitInputUpdate,
  TblComponentUnitPlain,
} from 'orm/generated/prismabox/TblComponentUnit'
import {
  effectComponentUnitChange,
  OperationEnum,
} from '../effects/EffectTblComponentUnit'

export const ServiceTblComponentUnit = new BaseService(prisma.tblComponentUnit)

const ControllerTblComponentUnit = new BaseController({
  prefix: '/tblComponentUnit',
  swagger: {
    tags: ['tblComponentUnit'],
  },
  primaryKey: 'compId',
  service: ServiceTblComponentUnit,
  createSchema: TblComponentUnitInputCreate,
  updateSchema: TblComponentUnitInputUpdate,
  responseSchema: buildResponseSchema(TblComponentUnitPlain, TblComponentUnit),
  extend: app => {
    app.post(
      '/:componentUnitId/effect',
      async ({ params, body, set }) => {
        try {
          const componentUnitId = Number(params.componentUnitId)

          if (isNaN(componentUnitId)) {
            set.status = 400
            return { status: 'ERROR', message: 'Invalid componentUnitId' }
          }

          await effectComponentUnitChange({
            componentUnitId,
            operation: body.operation,
          })

          return { status: 'OK' }
        } catch (err: any) {
          set.status = 400
          return {
            status: 'ERROR',
            message: err.message,
          }
        }
      },
      {
        tags: ['tblComponentUnit'],
        detail: {
          summary: 'Apply Change Effect',
        },
        body: t.Object({
          operation: OperationEnum,
        }),
      }
    )
  },
}).app

export default ControllerTblComponentUnit
