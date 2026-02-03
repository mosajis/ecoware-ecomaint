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

export const ServiceTblCompTypeAttachment = new BaseService(
  prisma.tblCompTypeAttachment,
);

const ControllerTblCompTypeAttachment = new BaseController({
  prefix: "/tblCompTypeAttachment",
  swagger: {
    tags: ["tblCompTypeAttachment"],
  },
  primaryKey: "compTypeAttachmentId",
  service: ServiceTblCompTypeAttachment,
  createSchema: TblCompTypeAttachmentInputCreate,
  updateSchema: TblCompTypeAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblCompTypeAttachmentPlain,
    TblCompTypeAttachment,
  ),

  extend: (app) => {
    app.post(
      "/:compTypeAttachmentId/effect",
      async ({ params, body, set }) => {
        try {
          const compTypeAttachmentId = Number(params.compTypeAttachmentId);

          if (isNaN(compTypeAttachmentId)) {
            set.status = 400;
            return { status: "ERROR", message: "Invalid compTypeAttachmentId" };
          }

          await effectCompTypeAttachment({
            compTypeAttachmentId,
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
        tags: ["tblCompTypeAttachment"],
        detail: {
          summary: "Apply Attachment Change Effect",
        },
        body: t.Object({
          operation: OperationEnum,
          oldCompTypeId: t.Optional(t.Number()),
        }),
      },
    );
  },
}).app;

export default ControllerTblCompTypeAttachment;
