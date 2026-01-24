import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblWorkShopDone,
  TblWorkShopDoneInputCreate,
  TblWorkShopDoneInputUpdate,
  TblWorkShopDonePlain,
} from "orm/generated/prismabox/TblWorkShopDone";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShopDone = new BaseService(prisma.tblWorkShopDone);

const ControllerTblWorkShopDone = new BaseController({
  prefix: "/tblWorkShopDone",
  swagger: {
    tags: ["tblWorkShopDone"],
  },
  primaryKey: "wShopDoneId",
  service: ServiceTblWorkShopDone,
  createSchema: TblWorkShopDoneInputCreate,
  updateSchema: TblWorkShopDoneInputUpdate,
  responseSchema: buildResponseSchema(TblWorkShopDonePlain, TblWorkShopDone),
}).app;

export default ControllerTblWorkShopDone;
