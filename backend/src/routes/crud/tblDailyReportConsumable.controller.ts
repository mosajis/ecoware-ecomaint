import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDailyReportConsumable,
  TblDailyReportConsumableInputCreate,
  TblDailyReportConsumableInputUpdate,
  TblDailyReportConsumablePlain,
} from "orm/generated/prismabox/TblDailyReportConsumable";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDailyReportConsumable = new BaseService(prisma.tblDailyReportConsumable);

const ControllerTblDailyReportConsumable = new BaseController({
  prefix: "/tblDailyReportConsumable",
  swagger: {
    tags: ["tblDailyReportConsumable"],
  },
  service: ServiceTblDailyReportConsumable,
  createSchema: TblDailyReportConsumableInputCreate,
  updateSchema: TblDailyReportConsumableInputUpdate,
  responseSchema: buildResponseSchema(TblDailyReportConsumablePlain, TblDailyReportConsumable),
}).app;

export default ControllerTblDailyReportConsumable
