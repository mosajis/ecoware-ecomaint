import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import { TblWorkOrder, TblWorkOrderInputCreate, TblWorkOrderInputUpdate, TblWorkOrderPlain, } from "orm/generated/prismabox/TblWorkOrder";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";
export const ServiceTblWorkOrder = new BaseService(prisma.tblWorkOrder);
const ControllerTblWorkOrder = new BaseController({
    prefix: "/tblWorkOrder",
    swagger: {
        tags: ["tblWorkOrder"],
    },
    primaryKey: "workOrderId",
    service: ServiceTblWorkOrder,
    createSchema: TblWorkOrderInputCreate,
    updateSchema: TblWorkOrderInputUpdate,
    responseSchema: buildResponseSchema(TblWorkOrderPlain, TblWorkOrder),
}).app;
export default ControllerTblWorkOrder;
