import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblComponentUnitAttachment,
  TblComponentUnitAttachmentInputCreate,
  TblComponentUnitAttachmentInputUpdate,
  TblComponentUnitAttachmentPlain,
} from "orm/generated/prismabox/TblComponentUnitAttachment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblComponentUnitAttachment = new BaseService(
  prisma.tblComponentUnitAttachment,
);

const ControllerTblComponentUnitAttachment = new BaseController({
  prefix: "/tblComponentUnitAttachment",
  swagger: {
    tags: ["tblComponentUnitAttachment"],
  },
  primaryKey: "componentUnitAttachmentId",
  service: ServiceTblComponentUnitAttachment,
  createSchema: TblComponentUnitAttachmentInputCreate,
  updateSchema: TblComponentUnitAttachmentInputUpdate,
  responseSchema: buildResponseSchema(
    TblComponentUnitAttachmentPlain,
    TblComponentUnitAttachment,
  ),
}).app;

export default ControllerTblComponentUnitAttachment;
