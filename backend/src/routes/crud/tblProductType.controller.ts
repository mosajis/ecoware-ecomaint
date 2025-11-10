import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblProductType,
  TblProductTypeInputCreate,
  TblProductTypeInputUpdate,
  TblProductTypePlain,
} from "orm/generated/prismabox/TblProductType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblProductType = new BaseService(prisma.tblProductType);

const ControllerTblProductType = new BaseController({
  prefix: "/tblProductType",
  swagger: {
    tags: ["tblProductType"],
  },
  service: ServiceTblProductType,
  createSchema: TblProductTypeInputCreate,
  updateSchema: TblProductTypeInputUpdate,
  responseSchema: buildResponseSchema(TblProductTypePlain, TblProductType),
}).app;

export default ControllerTblProductType
