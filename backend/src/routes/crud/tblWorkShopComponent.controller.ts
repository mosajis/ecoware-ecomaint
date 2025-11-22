import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblWorkShopComponent,
  TblWorkShopComponentInputCreate,
  TblWorkShopComponentInputUpdate,
  TblWorkShopComponentPlain,
} from "orm/generated/prismabox/TblWorkShopComponent";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShopComponent = new BaseService(prisma.tblWorkShopComponent);

const ControllerTblWorkShopComponent = new BaseController({
  prefix: "/tblWorkShopComponent",
  swagger: {
    tags: ["tblWorkShopComponent"],
  },
  primaryKey: "wShopCompId",
  service: ServiceTblWorkShopComponent,
  createSchema: TblWorkShopComponentInputCreate,
  updateSchema: TblWorkShopComponentInputUpdate,
  responseSchema: buildResponseSchema(TblWorkShopComponentPlain, TblWorkShopComponent),
}).app;

export default ControllerTblWorkShopComponent
