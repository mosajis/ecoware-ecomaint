import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblFailureReport,
  TblFailureReportInputCreate,
  TblFailureReportInputUpdate,
  TblFailureReportPlain,
} from "orm/generated/prismabox/TblFailureReport";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureReports = new BaseService(
  prisma.tblFailureReport,
);

const ControllerTblFailureReports = new BaseController({
  prefix: "/tblFailureReports",
  swagger: {
    tags: ["tblFailureReports"],
  },
  primaryKey: "failureReportId",
  service: ServiceTblFailureReports,
  createSchema: TblFailureReportInputCreate,
  updateSchema: TblFailureReportInputUpdate,
  responseSchema: buildResponseSchema(TblFailureReportPlain, TblFailureReport),
}).app;

export default ControllerTblFailureReports;
