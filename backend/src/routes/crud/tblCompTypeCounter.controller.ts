import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeCounter,
  TblCompTypeCounterInputCreate,
  TblCompTypeCounterInputUpdate,
  TblCompTypeCounterPlain,
} from "orm/generated/prismabox/TblCompTypeCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeCounter,
  OperationEnum,
} from "../effects/EffectTblCompTypeCounter";

export const ServiceTblCompTypeCounter = new BaseService(
  prisma.tblCompTypeCounter,
);

const ControllerTblCompTypeCounter = new BaseController({
  prefix: "/tblCompTypeCounter",
  swagger: {
    tags: ["tblCompTypeCounter"],
  },
  primaryKey: "compTypeCounterId",
  service: ServiceTblCompTypeCounter,
  createSchema: TblCompTypeCounterInputCreate,
  updateSchema: TblCompTypeCounterInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeCounterPlain,
    TblCompTypeCounter,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeCounterId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeCounterId = Number(params.compTypeCounterId);

          if (isNaN(compTypeCounterId)) {
            set.status = 400;
            return { status: "ERROR", message: "Invalid compTypeCounterId" };
          }

          await effectCompTypeCounter({
            compTypeCounterId,
            operation: body.operation,
            oldCompTypeId: body.oldCompTypeId,
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
        tags: ["tblCompTypeCounter"],
        detail: {
          summary: "Apply Counter Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
          oldCompTypeId: t.Optional(t.Number()),
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeCounter;
