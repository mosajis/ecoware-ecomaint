import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDailyReorts,
  TblDailyReortsInputCreate,
  TblDailyReortsInputUpdate,
  TblDailyReortsPlain,
} from "orm/generated/prismabox/TblDailyReorts";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDailyReorts = new BaseService(prisma.tblDailyReorts);

const ControllerTblDailyReorts = new BaseController({
  prefix: "/tblDailyReorts",
  swagger: {
    tags: ["tblDailyReorts"],
  },
  service: ServiceTblDailyReorts,
  createSchema: TblDailyReortsInputCreate,
  updateSchema: TblDailyReortsInputUpdate,
  responseSchema: buildResponseSchema(TblDailyReortsPlain, TblDailyReorts),
}).app;

export default ControllerTblDailyReorts
