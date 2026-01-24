import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaintLogStocks,
  TblMaintLogStocksInputCreate,
  TblMaintLogStocksInputUpdate,
  TblMaintLogStocksPlain,
} from "orm/generated/prismabox/TblMaintLogStocks";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintLogStocks = new BaseService(
  prisma.tblMaintLogStocks,
);

const ControllerTblMaintLogStocks = new BaseController({
  prefix: "/tblMaintLogStocks",
  swagger: {
    tags: ["tblMaintLogStocks"],
  },
  primaryKey: "maintLogStockId",
  service: ServiceTblMaintLogStocks,
  createSchema: TblMaintLogStocksInputCreate,
  updateSchema: TblMaintLogStocksInputUpdate,
  responseSchema: buildResponseSchema(
    TblMaintLogStocksPlain,
    TblMaintLogStocks,
  ),
}).app;

export default ControllerTblMaintLogStocks;
