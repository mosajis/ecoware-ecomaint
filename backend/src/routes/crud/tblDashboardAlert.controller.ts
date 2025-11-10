import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDashboardAlert,
  TblDashboardAlertInputCreate,
  TblDashboardAlertInputUpdate,
  TblDashboardAlertPlain,
} from "orm/generated/prismabox/TblDashboardAlert";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDashboardAlert = new BaseService(prisma.tblDashboardAlert);

const ControllerTblDashboardAlert = new BaseController({
  prefix: "/tblDashboardAlert",
  swagger: {
    tags: ["tblDashboardAlert"],
  },
  service: ServiceTblDashboardAlert,
  createSchema: TblDashboardAlertInputCreate,
  updateSchema: TblDashboardAlertInputUpdate,
  responseSchema: buildResponseSchema(TblDashboardAlertPlain, TblDashboardAlert),
}).app;

export default ControllerTblDashboardAlert
