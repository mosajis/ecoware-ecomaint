import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblJobTriggerLog, TblJobTriggerLogInputCreate, TblJobTriggerLogInputUpdate, TblJobTriggerLogPlain, } from "orm/generated/prismabox/TblJobTriggerLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblJobTriggerLog = new BaseService(prisma.tblJobTriggerLog);
const ControllerTblJobTriggerLog = new BaseController({
    prefix: "/tblJobTriggerLog",
    swagger: {
        tags: ["tblJobTriggerLog"],
    },
    primaryKey: "jobTriggerLogId",
    service: ServiceTblJobTriggerLog,
    createSchema: TblJobTriggerLogInputCreate,
    updateSchema: TblJobTriggerLogInputUpdate,
    responseSchema: buildResponseSchema(TblJobTriggerLogPlain, TblJobTriggerLog),
}).app;
export default ControllerTblJobTriggerLog;
