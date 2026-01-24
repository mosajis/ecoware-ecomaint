import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeAttachment,
  TblCompTypeAttachmentInputCreate,
  TblCompTypeAttachmentInputUpdate,
  TblCompTypeAttachmentPlain,
} from "orm/generated/prismabox/TblCompTypeAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

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
}).app;

export default ControllerTblCompTypeAttachment;
