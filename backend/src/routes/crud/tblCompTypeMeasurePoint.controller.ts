import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeMeasurePoint,
  TblCompTypeMeasurePointInputCreate,
  TblCompTypeMeasurePointInputUpdate,
  TblCompTypeMeasurePointPlain,
} from "orm/generated/prismabox/TblCompTypeMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeMeasurePoint,
  OperationEnum,
} from "../effects/EffectTblCompTypeMeasurePoint";

export const ServiceTblCompTypeMeasurePoint = new BaseService(
  prisma.tblCompTypeMeasurePoint,
);

const ControllerTblCompTypeMeasurePoint = new BaseController({
  prefix: "/tblCompTypeMeasurePoint",
  swagger: {
    tags: ["tblCompTypeMeasurePoint"],
  },
  primaryKey: "compTypeMeasurePointId",
  service: ServiceTblCompTypeMeasurePoint,
  createSchema: TblCompTypeMeasurePointInputCreate,
  updateSchema: TblCompTypeMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeMeasurePointPlain,
    TblCompTypeMeasurePoint,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeMeasurePointId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeMeasurePointId = Number(params.compTypeMeasurePointId);

          if (isNaN(compTypeMeasurePointId)) {
            set.status = 400;
            return {
              status: "ERROR",
              message: "Invalid compTypeMeasurePointId",
            };
          }

          await effectCompTypeMeasurePoint({
            compTypeMeasurePointId,
            operation: body.operation,
            oldCounterTypeId: body.oldCounterTypeId,
          });

          return { status: "OK" };
        } catch (err: any) {
          set.status = 400;
          return {
            status: "ERROR",
            message: err.message,
          };
        }
      },
      {
        tags: ["tblCompTypeMeasurePoint"],
        detail: {
          summary: "Apply MeasurePoint Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
          oldCounterTypeId: t.Optional(t.Number()),
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeMeasurePoint;
