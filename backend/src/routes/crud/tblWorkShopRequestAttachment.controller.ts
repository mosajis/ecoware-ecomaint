import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblWorkShopRequestAttachment,
  TblWorkShopRequestAttachmentInputCreate,
  TblWorkShopRequestAttachmentInputUpdate,
  TblWorkShopRequestAttachmentPlain,
} from "orm/generated/prismabox/TblWorkShopRequestAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShopRequestAttachment = new BaseService(
  prisma.tblWorkShopRequestAttachment,
);

const ControllerTblWorkShopRequestAttachment = new BaseController({
  prefix: "/tblWorkShopRequestAttachment",
  swagger: {
    tags: ["tblWorkShopRequestAttachment"],
  },
  primaryKey: "wShopRequestAttachmentId",
  service: ServiceTblWorkShopRequestAttachment,
  createSchema: TblWorkShopRequestAttachmentInputCreate,
  updateSchema: TblWorkShopRequestAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblWorkShopRequestAttachmentPlain,
    TblWorkShopRequestAttachment,
  ),
}).app;

export default ControllerTblWorkShopRequestAttachment;
