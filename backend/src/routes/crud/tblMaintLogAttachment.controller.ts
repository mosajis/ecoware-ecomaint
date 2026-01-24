import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintLogAttachment,
  TblMaintLogAttachmentInputCreate,
  TblMaintLogAttachmentInputUpdate,
  TblMaintLogAttachmentPlain,
} from "orm/generated/prismabox/TblMaintLogAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintLogAttachment = new BaseService(
  prisma.tblMaintLogAttachment,
);

const ControllerTblMaintLogAttachment = new BaseController({
  prefix: "/tblMaintLogAttachment",
  swagger: {
    tags: ["tblMaintLogAttachment"],
  },
  primaryKey: "maintLogAttachmentId",
  service: ServiceTblMaintLogAttachment,
  createSchema: TblMaintLogAttachmentInputCreate,
  updateSchema: TblMaintLogAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblMaintLogAttachmentPlain,
    TblMaintLogAttachment,
  ),
}).app;

export default ControllerTblMaintLogAttachment;
