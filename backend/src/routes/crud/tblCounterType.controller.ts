import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCounterType,
  TblCounterTypeInputCreate,
  TblCounterTypeInputUpdate,
  TblCounterTypePlain,
} from "orm/generated/prismabox/TblCounterType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCounterType = new BaseService(prisma.tblCounterType);

const ControllerTblCounterType = new BaseController({
  prefix: "/tblCounterType",
  swagger: {
    tags: ["tblCounterType"],
  },
  service: ServiceTblCounterType,
  createSchema: TblCounterTypeInputCreate,
  updateSchema: TblCounterTypeInputUpdate,
  responseSchema: buildResponseSchema(TblCounterTypePlain, TblCounterType),
}).app;

export default ControllerTblCounterType
