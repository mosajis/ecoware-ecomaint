import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeJobTrigger,
  TblCompTypeJobTriggerInputCreate,
  TblCompTypeJobTriggerInputUpdate,
  TblCompTypeJobTriggerPlain,
} from "orm/generated/prismabox/TblCompTypeJobTrigger";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeJobTrigger,
  OperationEnum,
} from "../effects/EffectTblCompTypeJobTrigger";

export const ServiceTblCompTypeJobTrigger = new BaseService(
  prisma.tblCompTypeJobTrigger,
);

const ControllerTblCompTypeJobTrigger = new BaseController({
  prefix: "/tblCompTypeJobTrigger",
  swagger: {
    tags: ["tblCompTypeJobTrigger"],
  },
  primaryKey: "compTypeJobTriggerId",
  service: ServiceTblCompTypeJobTrigger,
  createSchema: TblCompTypeJobTriggerInputCreate,
  updateSchema: TblCompTypeJobTriggerInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeJobTriggerPlain,
    TblCompTypeJobTrigger,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeJobTriggerId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeJobTriggerId = Number(params.compTypeJobTriggerId);

          if (isNaN(compTypeJobTriggerId)) {
            set.status = 400;
            return {
              status: "ERROR",
              message: "Invalid compTypeJobTriggerId",
            };
          }

          const result = await effectCompTypeJobTrigger({
            compTypeJobTriggerId,
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
        tags: ["tblCompTypeJobTrigger"],
        detail: {
          summary: "Apply Job Trigger Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeJobTrigger;
