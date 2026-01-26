import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

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
  primaryKey: "rotationLogId",
  service: ServiceTblRotationLog,
  createSchema: TblRotationLogInputCreate,
  updateSchema: TblRotationLogInputUpdate,
  responseSchema: buildResponseSchema(TblRotationLogPlain, TblRotationLog),
}).app;

export default ControllerTblRotationLog;
