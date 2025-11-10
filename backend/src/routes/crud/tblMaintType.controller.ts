import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintType,
  TblMaintTypeInputCreate,
  TblMaintTypeInputUpdate,
  TblMaintTypePlain,
} from "orm/generated/prismabox/TblMaintType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintType = new BaseService(prisma.tblMaintType);

const ControllerTblMaintType = new BaseController({
  prefix: "/tblMaintType",
  swagger: {
    tags: ["tblMaintType"],
  },
  service: ServiceTblMaintType,
  createSchema: TblMaintTypeInputCreate,
  updateSchema: TblMaintTypeInputUpdate,
  responseSchema: buildResponseSchema(TblMaintTypePlain, TblMaintType),
}).app;

export default ControllerTblMaintType
