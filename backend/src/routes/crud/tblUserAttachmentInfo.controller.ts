import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUserAttachmentInfo,
  TblUserAttachmentInfoInputCreate,
  TblUserAttachmentInfoInputUpdate,
  TblUserAttachmentInfoPlain,
} from "orm/generated/prismabox/TblUserAttachmentInfo";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserAttachmentInfo = new BaseService(prisma.tblUserAttachmentInfo);

const ControllerTblUserAttachmentInfo = new BaseController({
  prefix: "/tblUserAttachmentInfo",
  swagger: {
    tags: ["tblUserAttachmentInfo"],
  },
  service: ServiceTblUserAttachmentInfo,
  createSchema: TblUserAttachmentInfoInputCreate,
  updateSchema: TblUserAttachmentInfoInputUpdate,
  responseSchema: buildResponseSchema(TblUserAttachmentInfoPlain, TblUserAttachmentInfo),
}).app;

export default ControllerTblUserAttachmentInfo
