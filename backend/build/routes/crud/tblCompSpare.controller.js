import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblCompSpare, TblCompSpareInputCreate, TblCompSpareInputUpdate, TblCompSparePlain, } from "orm/generated/prismabox/TblCompSpare";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblCompSpare = new BaseService(prisma.tblCompSpare);
const ControllerTblCompSpare = new BaseController({
    prefix: "/tblCompSpare",
    swagger: {
        tags: ["tblCompSpare"],
    },
    primaryKey: "compSpareId",
    service: ServiceTblCompSpare,
    createSchema: TblCompSpareInputCreate,
    updateSchema: TblCompSpareInputUpdate,
    responseSchema: buildResponseSchema(TblCompSparePlain, TblCompSpare),
}).app;
export default ControllerTblCompSpare;
