import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblPendingType,
  TblPendingTypeInputCreate,
  TblPendingTypeInputUpdate,
  TblPendingTypePlain,
} from "orm/generated/prismabox/TblPendingType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblPendingType = new BaseService(prisma.tblPendingType);

const ControllerTblPendingType = new BaseController({
  prefix: "/tblPendingType",
  swagger: {
    tags: ["tblPendingType"],
  },
  primaryKey: "pendTypeId",
  service: ServiceTblPendingType,
  createSchema: TblPendingTypeInputCreate,
  updateSchema: TblPendingTypeInputUpdate,
  responseSchema: buildResponseSchema(TblPendingTypePlain, TblPendingType),
}).app;

export default ControllerTblPendingType
