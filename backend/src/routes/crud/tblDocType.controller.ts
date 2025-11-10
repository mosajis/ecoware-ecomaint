import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDocType,
  TblDocTypeInputCreate,
  TblDocTypeInputUpdate,
  TblDocTypePlain,
} from "orm/generated/prismabox/TblDocType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDocType = new BaseService(prisma.tblDocType);

const ControllerTblDocType = new BaseController({
  prefix: "/tblDocType",
  swagger: {
    tags: ["tblDocType"],
  },
  service: ServiceTblDocType,
  createSchema: TblDocTypeInputCreate,
  updateSchema: TblDocTypeInputUpdate,
  responseSchema: buildResponseSchema(TblDocTypePlain, TblDocType),
}).app;

export default ControllerTblDocType
