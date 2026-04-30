import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblWorkShopAttachment,
  TblWorkShopAttachmentInputCreate,
  TblWorkShopAttachmentInputUpdate,
  TblWorkShopAttachmentPlain,
} from "orm/generated/prismabox/TblWorkShopAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShopAttachment = new BaseService(
  prisma.tblWorkShopAttachment,
);

const ControllerTblWorkShopAttachment = new BaseController({
  prefix: "/tblWorkShopAttachment",
  swagger: {
    tags: ["tblWorkShopAttachment"],
  },
  scope: true,

  primaryKey: "workShopAttachmentId",
  service: ServiceTblWorkShopAttachment,
  createSchema: TblWorkShopAttachmentInputCreate,
  updateSchema: TblWorkShopAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblWorkShopAttachmentPlain,
    TblWorkShopAttachment,
  ),
}).app;

export default ControllerTblWorkShopAttachment;
