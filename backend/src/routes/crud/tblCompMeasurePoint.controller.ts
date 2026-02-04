import { t } from "elysia";
import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

import {
  TblCompMeasurePoint,
  TblCompMeasurePointInputCreate,
  TblCompMeasurePointInputUpdate,
  TblCompMeasurePointPlain,
} from "orm/generated/prismabox/TblCompMeasurePoint";

import { effectCompMeasurePoint } from "../effects/EffectTblCompMeasurePoint";

export const ServiceTblCompMeasurePoint = new BaseService(
  prisma.tblCompMeasurePoint,
);

const ControllerTblCompMeasurePoint = new BaseController({
  prefix: "/tblCompMeasurePoint",
  swagger: {
    tags: ["tblCompMeasurePoint"],
  },
  primaryKey: "compMeasurePointId",
  service: ServiceTblCompMeasurePoint,
  createSchema: TblCompMeasurePointInputCreate,
  updateSchema: TblCompMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompMeasurePointPlain,
    TblCompMeasurePoint,
  ),
  extend: (app) => {
    // Update
    app.put(
      "/:compMeasurePointId",
      async ({ params, body }) => {
        const compMeasurePointId = Number(params.compMeasurePointId);
        const data = body;

        const result = await prisma.$transaction(async (tx) => {
          const measurePoint = await tx.tblCompMeasurePoint.update({
            where: { compMeasurePointId },
            data: {
              setValue: data.setValue ?? null,
              operationalMinValue: data.operationalMinValue ?? null,
              operationalMaxValue: data.operationalMaxValue ?? null,
              orderNo: data.orderNo ?? null,
              unitId: data?.tblUnit?.connect?.unitId ?? null,
              currentValue: data.currentValue ?? null,
              currentDate: data.currentDate ?? null,
            },
          });

          await effectCompMeasurePoint(tx, measurePoint);
          return measurePoint;
        });

        return result;
      },
      {
        tags: ["tblCompMeasurePoint"],
        detail: {
          summary: "Update",
          description:
            "Update TblCompMeasurePoint and run side effects in transaction",
        },
        params: t.Object({
          compMeasurePointId: t.Number(),
        }),
        body: TblCompMeasurePointInputUpdate,
        response: buildResponseSchema(
          TblCompMeasurePointPlain,
          TblCompMeasurePoint,
        ),
      },
    );
  },
}).app;

export default ControllerTblCompMeasurePoint;
