import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDashboardConfig,
  TblDashboardConfigInputCreate,
  TblDashboardConfigInputUpdate,
  TblDashboardConfigPlain,
} from "orm/generated/prismabox/TblDashboardConfig";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDashboardConfig = new BaseService(prisma.tblDashboardConfig);

const ControllerTblDashboardConfig = new BaseController({
  prefix: "/tblDashboardConfig",
  swagger: {
    tags: ["tblDashboardConfig"],
  },
  service: ServiceTblDashboardConfig,
  createSchema: TblDashboardConfigInputCreate,
  updateSchema: TblDashboardConfigInputUpdate,
  responseSchema: buildResponseSchema(TblDashboardConfigPlain, TblDashboardConfig),
}).app;

export default ControllerTblDashboardConfig
