import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblAttachmentType,
  TblAttachmentTypeInputCreate,
  TblAttachmentTypeInputUpdate,
  TblAttachmentTypePlain,
} from "orm/generated/prismabox/TblAttachmentType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAttachmentType = new BaseService(
  prisma.tblAttachmentType,
);

const ControllerTblAttachmentType = new BaseController({
  prefix: "/tblAttachmentType",
  swagger: {
    tags: ["tblAttachmentType"],
  },
  primaryKey: "attachmentTypeId",
  service: ServiceTblAttachmentType,
  createSchema: TblAttachmentTypeInputCreate,
  updateSchema: TblAttachmentTypeInputUpdate,
  responseSchema: buildResponseSchema(
    TblAttachmentTypePlain,
    TblAttachmentType,
  ),
}).app;

export default ControllerTblAttachmentType;
