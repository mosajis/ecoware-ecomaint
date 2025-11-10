import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUserAttachmentRelations,
  TblUserAttachmentRelationsInputCreate,
  TblUserAttachmentRelationsInputUpdate,
  TblUserAttachmentRelationsPlain,
} from "orm/generated/prismabox/TblUserAttachmentRelations";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserAttachmentRelations = new BaseService(prisma.tblUserAttachmentRelations);

const ControllerTblUserAttachmentRelations = new BaseController({
  prefix: "/tblUserAttachmentRelations",
  swagger: {
    tags: ["tblUserAttachmentRelations"],
  },
  service: ServiceTblUserAttachmentRelations,
  createSchema: TblUserAttachmentRelationsInputCreate,
  updateSchema: TblUserAttachmentRelationsInputUpdate,
  responseSchema: buildResponseSchema(TblUserAttachmentRelationsPlain, TblUserAttachmentRelations),
}).app;

export default ControllerTblUserAttachmentRelations
