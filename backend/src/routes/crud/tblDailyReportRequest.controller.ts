import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDailyReportRequest,
  TblDailyReportRequestInputCreate,
  TblDailyReportRequestInputUpdate,
  TblDailyReportRequestPlain,
} from "orm/generated/prismabox/TblDailyReportRequest";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDailyReportRequest = new BaseService(prisma.tblDailyReportRequest);

const ControllerTblDailyReportRequest = new BaseController({
  prefix: "/tblDailyReportRequest",
  swagger: {
    tags: ["tblDailyReportRequest"],
  },
  service: ServiceTblDailyReportRequest,
  createSchema: TblDailyReportRequestInputCreate,
  updateSchema: TblDailyReportRequestInputUpdate,
  responseSchema: buildResponseSchema(TblDailyReportRequestPlain, TblDailyReportRequest),
}).app;

export default ControllerTblDailyReportRequest
