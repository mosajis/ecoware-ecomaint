import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblCompTypeCounter, TblCompTypeCounterInputCreate, TblCompTypeCounterInputUpdate, TblCompTypeCounterPlain, } from "orm/generated/prismabox/TblCompTypeCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblCompTypeCounter = new BaseService(prisma.tblCompTypeCounter);
const ControllerTblCompTypeCounter = new BaseController({
    prefix: "/tblCompTypeCounter",
    swagger: {
        tags: ["tblCompTypeCounter"],
    },
    primaryKey: "compTypeCounterId",
    service: ServiceTblCompTypeCounter,
    createSchema: TblCompTypeCounterInputCreate,
    updateSchema: TblCompTypeCounterInputUpdate,
    responseSchema: buildResponseSchema(TblCompTypeCounterPlain, TblCompTypeCounter),
}).app;
export default ControllerTblCompTypeCounter;
