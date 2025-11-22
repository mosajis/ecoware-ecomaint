import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompCounterLog,
  TblCompCounterLogInputCreate,
  TblCompCounterLogInputUpdate,
  TblCompCounterLogPlain,
} from "orm/generated/prismabox/TblCompCounterLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompCounterLog = new BaseService(prisma.tblCompCounterLog);

const ControllerTblCompCounterLog = new BaseController({
  prefix: "/tblCompCounterLog",
  swagger: {
    tags: ["tblCompCounterLog"],
  },
  primaryKey: "compCounterLogId",
  service: ServiceTblCompCounterLog,
  createSchema: TblCompCounterLogInputCreate,
  updateSchema: TblCompCounterLogInputUpdate,
  responseSchema: buildResponseSchema(TblCompCounterLogPlain, TblCompCounterLog),
}).app;

export default ControllerTblCompCounterLog
