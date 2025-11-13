import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblComponentUnit,
  TblComponentUnitInputCreate,
  TblComponentUnitInputUpdate,
  TblComponentUnitPlain,
} from "orm/generated/prismabox/TblComponentUnit";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblComponentUnit = new BaseService(prisma.tblComponentUnit);

const ControllerTblComponentUnit = new BaseController({
  prefix: "/tblComponentUnit",
  swagger: {
    tags: ["tblComponentUnit"],
  },
  service: ServiceTblComponentUnit,
  createSchema: TblComponentUnitInputCreate,
  updateSchema: TblComponentUnitInputUpdate,
  responseSchema: buildResponseSchema(TblComponentUnitPlain, TblComponentUnit),
}).app;

export default ControllerTblComponentUnit;
