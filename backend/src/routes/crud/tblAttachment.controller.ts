import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblAttachment,
  TblAttachmentInputCreate,
  TblAttachmentInputUpdate,
  TblAttachmentPlain,
} from "orm/generated/prismabox/TblAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAttachment = new BaseService(prisma.tblAttachment);

const ControllerTblAttachment = new BaseController({
  prefix: "/tblAttachment",
  swagger: {
    tags: ["tblAttachment"],
  },
  primaryKey: "attachmentId",
  service: ServiceTblAttachment,
  createSchema: TblAttachmentInputCreate,
  updateSchema: TblAttachmentInputUpdate,
  responseSchema: buildResponseSchema(TblAttachmentPlain, TblAttachment),
}).app;

export default ControllerTblAttachment
