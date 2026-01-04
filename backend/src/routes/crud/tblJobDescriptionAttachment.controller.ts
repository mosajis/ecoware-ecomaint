import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblJobDescriptionAttachment,
  TblJobDescriptionAttachmentInputCreate,
  TblJobDescriptionAttachmentInputUpdate,
  TblJobDescriptionAttachmentPlain,
} from "orm/generated/prismabox/TblJobDescriptionAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobDescriptionAttachment = new BaseService(prisma.tblJobDescriptionAttachment);

const ControllerTblJobDescriptionAttachment = new BaseController({
  prefix: "/tblJobDescriptionAttachment",
  swagger: {
    tags: ["tblJobDescriptionAttachment"],
  },
  primaryKey: "jobDescriptionAttachmentId",
  service: ServiceTblJobDescriptionAttachment,
  createSchema: TblJobDescriptionAttachmentInputCreate,
  updateSchema: TblJobDescriptionAttachmentInputUpdate,
  responseSchema: buildResponseSchema(TblJobDescriptionAttachmentPlain, TblJobDescriptionAttachment),
}).app;

export default ControllerTblJobDescriptionAttachment
