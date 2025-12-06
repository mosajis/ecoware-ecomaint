import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblCompJobTrigger, TblCompJobTriggerInputCreate, TblCompJobTriggerInputUpdate, TblCompJobTriggerPlain, } from "orm/generated/prismabox/TblCompJobTrigger";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblCompJobTrigger = new BaseService(prisma.tblCompJobTrigger);
const ControllerTblCompJobTrigger = new BaseController({
    prefix: "/tblCompJobTrigger",
    swagger: {
        tags: ["tblCompJobTrigger"],
    },
    primaryKey: "compJobTriggerId",
    service: ServiceTblCompJobTrigger,
    createSchema: TblCompJobTriggerInputCreate,
    updateSchema: TblCompJobTriggerInputUpdate,
    responseSchema: buildResponseSchema(TblCompJobTriggerPlain, TblCompJobTrigger),
}).app;
export default ControllerTblCompJobTrigger;
