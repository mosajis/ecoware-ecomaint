import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { prisma } from "@/utils/prisma";
import { t } from "elysia";
import {
  TblCompTypeAttachment,
  TblCompTypeAttachmentInputCreate,
  TblCompTypeAttachmentInputUpdate,
  TblCompTypeAttachmentPlain,
} from "orm/generated/prismabox/TblCompTypeAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import {
  effectCompTypeAttachment,
  OperationEnum,
} from "../effects/EffectTblCompTypeAttachment";
import { authPlugin } from "../auth/auth.guard";

export const ServiceTblCompTypeAttachment = new BaseService(
  prisma.tblCompTypeAttachment,
);

const ControllerTblCompTypeAttachment = new BaseController({
  prefix: "/tblCompTypeAttachment",
  swagger: {
    tags: ["tblCompTypeAttachment"],
  },
  scope: true,

  primaryKey: "compTypeAttachmentId",
  service: ServiceTblCompTypeAttachment,
  createSchema: TblCompTypeAttachmentInputCreate,
  updateSchema: TblCompTypeAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeAttachmentPlain,
    TblCompTypeAttachment,
  ),

  extend: (app) => {
    app.use(authPlugin).post(
      "/:compTypeAttachmentId/effect",
      async ({ params, body, set, headers }) => {
        try {
          const instId = Number(headers["x-inst-id"] || 0);

          if (!instId) {
            throw new Error("Instance ID is required");
          }

          const compTypeAttachmentId = Number(params.compTypeAttachmentId);

          if (isNaN(compTypeAttachmentId)) {
            set.status = 400;
            return { status: "ERROR", message: "Invalid compTypeAttachmentId" };
          }

          const result = await effectCompTypeAttachment({
            compTypeAttachmentId,
            operation: body.operation,
            instId,
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
        tags: ["tblCompTypeAttachment"],
        detail: {
          summary: "Apply Attachment Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeAttachment;
