import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeJobMeasurePoint,
  TblCompTypeJobMeasurePointInputCreate,
  TblCompTypeJobMeasurePointInputUpdate,
  TblCompTypeJobMeasurePointPlain,
} from "orm/generated/prismabox/TblCompTypeJobMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeJobMeasurePoint,
  OperationEnum,
} from "../effects/EffectTblCompTypeJobMeasurePoint";

export const ServiceTblCompTypeJobMeasurePoint = new BaseService(
  prisma.tblCompTypeJobMeasurePoint,
);

const ControllerTblCompTypeJobMeasurePoint = new BaseController({
  prefix: "/tblCompTypeJobMeasurePoint",
  swagger: {
    tags: ["tblCompTypeJobMeasurePoint"],
  },
  primaryKey: "compTypeJobMeasurePointId",
  service: ServiceTblCompTypeJobMeasurePoint,
  createSchema: TblCompTypeJobMeasurePointInputCreate,
  updateSchema: TblCompTypeJobMeasurePointInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeJobMeasurePointPlain,
    TblCompTypeJobMeasurePoint,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeJobMeasurePointId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeJobMeasurePointId = Number(
            params.compTypeJobMeasurePointId,
          );

          if (isNaN(compTypeJobMeasurePointId)) {
            set.status = 400;
            return {
              status: "ERROR",
              message: "Invalid compTypeJobMeasurePointId",
            };
          }

          const result = await effectCompTypeJobMeasurePoint({
            compTypeJobMeasurePointId,
            operation: body.operation,
          });

          return result;
        } catch (err: any) {
          set.status = 400;
          return {
            status: "ERROR",
            message: err.message,
          };
        }
      },
      {
        tags: ["tblCompTypeJobMeasurePoint"],
        detail: {
          summary: "Apply Job MeasurePoint Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeJobMeasurePoint;
