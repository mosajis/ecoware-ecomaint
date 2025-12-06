import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblLogDiscipline, TblLogDisciplineInputCreate, TblLogDisciplineInputUpdate, TblLogDisciplinePlain, } from "orm/generated/prismabox/TblLogDiscipline";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblLogDiscipline = new BaseService(prisma.tblLogDiscipline);
const ControllerTblLogDiscipline = new BaseController({
    prefix: "/tblLogDiscipline",
    swagger: {
        tags: ["tblLogDiscipline"],
    },
    primaryKey: "logDiscId",
    service: ServiceTblLogDiscipline,
    createSchema: TblLogDisciplineInputCreate,
    updateSchema: TblLogDisciplineInputUpdate,
    responseSchema: buildResponseSchema(TblLogDisciplinePlain, TblLogDiscipline),
}).app;
export default ControllerTblLogDiscipline;
