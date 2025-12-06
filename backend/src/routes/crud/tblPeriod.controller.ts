import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblPeriod,
  TblPeriodInputCreate,
  TblPeriodInputUpdate,
  TblPeriodPlain,
} from "orm/generated/prismabox/TblPeriod";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblPeriod = new BaseService(prisma.tblPeriod);

const ControllerTblPeriod = new BaseController({
  prefix: "/tblPeriod",
  swagger: {
    tags: ["tblPeriod"],
  },
  primaryKey: "periodId",
  service: ServiceTblPeriod,
  createSchema: TblPeriodInputCreate,
  updateSchema: TblPeriodInputUpdate,
  responseSchema: buildResponseSchema(TblPeriodPlain, TblPeriod),
}).app;

export default ControllerTblPeriod
