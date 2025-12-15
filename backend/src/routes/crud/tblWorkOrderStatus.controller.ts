import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblWorkOrderStatus,
  TblWorkOrderStatusInputCreate,
  TblWorkOrderStatusInputUpdate,
  TblWorkOrderStatusPlain,
} from "orm/generated/prismabox/TblWorkOrderStatus";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkOrderStatus = new BaseService(prisma.tblWorkOrderStatus);

const ControllerTblWorkOrderStatus = new BaseController({
  prefix: "/tblWorkOrderStatus",
  swagger: {
    tags: ["tblWorkOrderStatus"],
  },
  primaryKey: "workOrderStatusId",
  service: ServiceTblWorkOrderStatus,
  createSchema: TblWorkOrderStatusInputCreate,
  updateSchema: TblWorkOrderStatusInputUpdate,
  responseSchema: buildResponseSchema(TblWorkOrderStatusPlain, TblWorkOrderStatus),
}).app;

export default ControllerTblWorkOrderStatus
