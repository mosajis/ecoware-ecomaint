import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFialureSeverityLevel,
  TblFialureSeverityLevelInputCreate,
  TblFialureSeverityLevelInputUpdate,
  TblFialureSeverityLevelPlain,
} from "orm/generated/prismabox/TblFialureSeverityLevel";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFialureSeverityLevel = new BaseService(
  prisma.tblFialureSeverityLevel,
);

const ControllerTblFialureSeverityLevel = new BaseController({
  prefix: "/tblFialureSeverityLevel",
  swagger: {
    tags: ["tblFialureSeverityLevel"],
  },
  primaryKey: "failureSeverityLevelId",
  service: ServiceTblFialureSeverityLevel,
  createSchema: TblFialureSeverityLevelInputCreate,
  updateSchema: TblFialureSeverityLevelInputUpdate,
  responseSchema: buildResponseSchema(
    TblFialureSeverityLevelPlain,
    TblFialureSeverityLevel,
  ),
}).app;

export default ControllerTblFialureSeverityLevel;
