import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFailureSeverityLevel,
  TblFailureSeverityLevelInputCreate,
  TblFailureSeverityLevelInputUpdate,
  TblFailureSeverityLevelPlain,
} from "orm/generated/prismabox/TblFailureSeverityLevel";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureSeverityLevel = new BaseService(
  prisma.tblFailureSeverityLevel,
);

const ControllerTblFailureSeverityLevel = new BaseController({
  prefix: "/tblFailureSeverityLevel",
  swagger: {
    tags: ["tblFailureSeverityLevel"],
  },
  primaryKey: "failureSeverityLevelId",
  service: ServiceTblFailureSeverityLevel,
  createSchema: TblFailureSeverityLevelInputCreate,
  updateSchema: TblFailureSeverityLevelInputUpdate,
  responseSchema: buildResponseSchema(
    TblFailureSeverityLevelPlain,
    TblFailureSeverityLevel,
  ),
}).app;

export default ControllerTblFailureSeverityLevel;
