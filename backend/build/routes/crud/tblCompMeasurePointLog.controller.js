import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblCompMeasurePointLog, TblCompMeasurePointLogInputCreate, TblCompMeasurePointLogInputUpdate, TblCompMeasurePointLogPlain, } from "orm/generated/prismabox/TblCompMeasurePointLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblCompMeasurePointLog = new BaseService(prisma.tblCompMeasurePointLog);
const ControllerTblCompMeasurePointLog = new BaseController({
    prefix: "/tblCompMeasurePointLog",
    swagger: {
        tags: ["tblCompMeasurePointLog"],
    },
    primaryKey: "compMeasurePointLogId",
    service: ServiceTblCompMeasurePointLog,
    createSchema: TblCompMeasurePointLogInputCreate,
    updateSchema: TblCompMeasurePointLogInputUpdate,
    responseSchema: buildResponseSchema(TblCompMeasurePointLogPlain, TblCompMeasurePointLog),
}).app;
export default ControllerTblCompMeasurePointLog;
