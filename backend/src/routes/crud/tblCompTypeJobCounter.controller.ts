import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeJobCounter,
  TblCompTypeJobCounterInputCreate,
  TblCompTypeJobCounterInputUpdate,
  TblCompTypeJobCounterPlain,
} from "orm/generated/prismabox/TblCompTypeJobCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeJobCounter,
  OperationEnum,
} from "../effects/EffectTblCompTypeJobCounter";

export const ServiceTblCompTypeJobCounter = new BaseService(
  prisma.tblCompTypeJobCounter,
);

const ControllerTblCompTypeJobCounter = new BaseController({
  prefix: "/tblCompTypeJobCounter",
  swagger: {
    tags: ["tblCompTypeJobCounter"],
  },
  primaryKey: "compTypeJobCounterId",
  service: ServiceTblCompTypeJobCounter,
  createSchema: TblCompTypeJobCounterInputCreate,
  updateSchema: TblCompTypeJobCounterInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeJobCounterPlain,
    TblCompTypeJobCounter,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeJobCounterId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeJobCounterId = Number(params.compTypeJobCounterId);

          if (isNaN(compTypeJobCounterId)) {
            set.status = 400;
            return {
              status: "ERROR",
              message: "Invalid compTypeJobCounterId",
            };
          }

          await effectCompTypeJobCounter({
            compTypeJobCounterId,
            operation: body.operation,
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
        tags: ["tblCompTypeJobCounter"],
        detail: {
          summary: "Apply Job Counter Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeJobCounter;
