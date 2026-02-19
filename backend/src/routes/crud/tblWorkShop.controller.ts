import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblWorkShop,
  TblWorkShopInputCreate,
  TblWorkShopInputUpdate,
  TblWorkShopPlain,
} from "orm/generated/prismabox/TblWorkShop";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShop = new BaseService(prisma.tblWorkShop);

const ControllerTblWorkShop = new BaseController({
  prefix: "/tblWorkShop",
  swagger: {
    tags: ["tblWorkShop"],
  },
  primaryKey: "workShopId",
  service: ServiceTblWorkShop,
  createSchema: TblWorkShopInputCreate,
  updateSchema: TblWorkShopInputUpdate,
  responseSchema: buildResponseSchema(TblWorkShopPlain, TblWorkShop),
}).app;

export default ControllerTblWorkShop;
