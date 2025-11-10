import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblRotationLog,
  TblRotationLogInputCreate,
  TblRotationLogInputUpdate,
  TblRotationLogPlain,
} from "orm/generated/prismabox/TblRotationLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblRotationLog = new BaseService(prisma.tblRotationLog);

const ControllerTblRotationLog = new BaseController({
  prefix: "/tblRotationLog",
  swagger: {
    tags: ["tblRotationLog"],
  },
  service: ServiceTblRotationLog,
  createSchema: TblRotationLogInputCreate,
  updateSchema: TblRotationLogInputUpdate,
  responseSchema: buildResponseSchema(TblRotationLogPlain, TblRotationLog),
}).app;

export default ControllerTblRotationLog
