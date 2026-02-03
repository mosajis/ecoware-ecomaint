import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeJob,
  TblCompTypeJobInputCreate,
  TblCompTypeJobInputUpdate,
  TblCompTypeJobPlain,
} from "orm/generated/prismabox/TblCompTypeJob";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeJob,
  OperationEnum,
} from "../effects/EffectTblCompTypeJob";

export const ServiceTblCompTypeJob = new BaseService(prisma.tblCompTypeJob);

const ControllerTblCompTypeJob = new BaseController({
  prefix: "/tblCompTypeJob",
  swagger: {
    tags: ["tblCompTypeJob"],
  },
  primaryKey: "compTypeJobId",
  service: ServiceTblCompTypeJob,
  createSchema: TblCompTypeJobInputCreate,
  updateSchema: TblCompTypeJobInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeJobPlain, TblCompTypeJob),

  extend: (app) => {
    app.post(
      "/:compTypeJobId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeJobId = Number(params.compTypeJobId);

          if (isNaN(compTypeJobId)) {
            set.status = 400;
            return { status: "ERROR", message: "Invalid compTypeJobId" };
          }

          await effectCompTypeJob({
            compTypeJobId,
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
        tags: ["tblCompTypeJob"],
        detail: {
          summary: "Apply Job Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
          oldCompTypeId: t.Optional(t.Number()),
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeJob;
