import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblStockType,
  TblStockTypeInputCreate,
  TblStockTypeInputUpdate,
  TblStockTypePlain,
} from "orm/generated/prismabox/TblStockType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblStockType = new BaseService(prisma.tblStockType);

const ControllerTblStockType = new BaseController({
  prefix: "/tblStockType",
  swagger: {
    tags: ["tblStockType"],
  },
  primaryKey: "stockTypeId",
  service: ServiceTblStockType,
  createSchema: TblStockTypeInputCreate,
  updateSchema: TblStockTypeInputUpdate,
  responseSchema: buildResponseSchema(TblStockTypePlain, TblStockType),
}).app;

export default ControllerTblStockType
