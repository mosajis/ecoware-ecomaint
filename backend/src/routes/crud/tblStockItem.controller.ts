import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblStockItem,
  TblStockItemInputCreate,
  TblStockItemInputUpdate,
  TblStockItemPlain,
} from "orm/generated/prismabox/TblStockItem";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblStockItem = new BaseService(prisma.tblStockItem);

const ControllerTblStockItem = new BaseController({
  prefix: "/tblStockItem",
  swagger: {
    tags: ["tblStockItem"],
  },
  primaryKey: "stockItemId",
  service: ServiceTblStockItem,
  createSchema: TblStockItemInputCreate,
  updateSchema: TblStockItemInputUpdate,
  responseSchema: buildResponseSchema(TblStockItemPlain, TblStockItem),
}).app;

export default ControllerTblStockItem
