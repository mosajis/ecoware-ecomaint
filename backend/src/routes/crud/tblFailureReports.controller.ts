import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFailureReports,
  TblFailureReportsInputCreate,
  TblFailureReportsInputUpdate,
  TblFailureReportsPlain,
} from "orm/generated/prismabox/TblFailureReports";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureReports = new BaseService(prisma.tblFailureReports);

const ControllerTblFailureReports = new BaseController({
  prefix: "/tblFailureReports",
  swagger: {
    tags: ["tblFailureReports"],
  },
  primaryKey: "failureReportId",
  service: ServiceTblFailureReports,
  createSchema: TblFailureReportsInputCreate,
  updateSchema: TblFailureReportsInputUpdate,
  responseSchema: buildResponseSchema(TblFailureReportsPlain, TblFailureReports),
}).app;

export default ControllerTblFailureReports
