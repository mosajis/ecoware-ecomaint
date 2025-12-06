import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblCompTypeMeasurePoint, TblCompTypeMeasurePointInputCreate, TblCompTypeMeasurePointInputUpdate, TblCompTypeMeasurePointPlain, } from "orm/generated/prismabox/TblCompTypeMeasurePoint";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblCompTypeMeasurePoint = new BaseService(prisma.tblCompTypeMeasurePoint);
const ControllerTblCompTypeMeasurePoint = new BaseController({
    prefix: "/tblCompTypeMeasurePoint",
    swagger: {
        tags: ["tblCompTypeMeasurePoint"],
    },
    primaryKey: "compTypeMeasurePointId",
    service: ServiceTblCompTypeMeasurePoint,
    createSchema: TblCompTypeMeasurePointInputCreate,
    updateSchema: TblCompTypeMeasurePointInputUpdate,
    responseSchema: buildResponseSchema(TblCompTypeMeasurePointPlain, TblCompTypeMeasurePoint),
}).app;
export default ControllerTblCompTypeMeasurePoint;
