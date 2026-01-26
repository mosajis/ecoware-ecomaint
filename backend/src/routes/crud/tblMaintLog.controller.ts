import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblMaintLog,
  TblMaintLogInputCreate,
  TblMaintLogInputUpdate,
  TblMaintLogPlain,
} from "orm/generated/prismabox/TblMaintLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintLog = new BaseService(prisma.tblMaintLog);

const ControllerTblMaintLog = new BaseController({
  prefix: "/tblMaintLog",
  swagger: {
    tags: ["tblMaintLog"],
  },
  primaryKey: "maintLogId",
  service: ServiceTblMaintLog,
  createSchema: TblMaintLogInputCreate,
  updateSchema: TblMaintLogInputUpdate,
  responseSchema: buildResponseSchema(TblMaintLogPlain, TblMaintLog),
}).app;

export default ControllerTblMaintLog;
