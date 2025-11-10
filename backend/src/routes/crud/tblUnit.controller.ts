import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUnit,
  TblUnitInputCreate,
  TblUnitInputUpdate,
  TblUnitPlain,
} from "orm/generated/prismabox/TblUnit";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUnit = new BaseService(prisma.tblUnit);

const ControllerTblUnit = new BaseController({
  prefix: "/tblUnit",
  swagger: {
    tags: ["tblUnit"],
  },
  service: ServiceTblUnit,
  createSchema: TblUnitInputCreate,
  updateSchema: TblUnitInputUpdate,
  responseSchema: buildResponseSchema(TblUnitPlain, TblUnit),
}).app;

export default ControllerTblUnit
