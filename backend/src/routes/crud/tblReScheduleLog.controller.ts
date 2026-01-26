import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblReScheduleLog,
  TblReScheduleLogInputCreate,
  TblReScheduleLogInputUpdate,
  TblReScheduleLogPlain,
} from "orm/generated/prismabox/TblReScheduleLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblReScheduleLog = new BaseService(prisma.tblReScheduleLog);

const ControllerTblReScheduleLog = new BaseController({
  prefix: "/tblReScheduleLog",
  swagger: {
    tags: ["tblReScheduleLog"],
  },
  primaryKey: "rescheduleLogId",
  service: ServiceTblReScheduleLog,
  createSchema: TblReScheduleLogInputCreate,
  updateSchema: TblReScheduleLogInputUpdate,
  responseSchema: buildResponseSchema(TblReScheduleLogPlain, TblReScheduleLog),
}).app;

export default ControllerTblReScheduleLog;
