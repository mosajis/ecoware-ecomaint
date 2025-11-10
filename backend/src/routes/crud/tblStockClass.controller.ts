import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblStockClass,
  TblStockClassInputCreate,
  TblStockClassInputUpdate,
  TblStockClassPlain,
} from "orm/generated/prismabox/TblStockClass";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblStockClass = new BaseService(prisma.tblStockClass);

const ControllerTblStockClass = new BaseController({
  prefix: "/tblStockClass",
  swagger: {
    tags: ["tblStockClass"],
  },
  service: ServiceTblStockClass,
  createSchema: TblStockClassInputCreate,
  updateSchema: TblStockClassInputUpdate,
  responseSchema: buildResponseSchema(TblStockClassPlain, TblStockClass),
}).app;

export default ControllerTblStockClass
