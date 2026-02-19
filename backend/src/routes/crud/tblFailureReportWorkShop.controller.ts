import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import {
  TblFailureReportWorkShop,
  TblFailureReportWorkShopInputCreate,
  TblFailureReportWorkShopInputUpdate,
  TblFailureReportWorkShopPlain,
} from "orm/generated/prismabox/TblFailureReportWorkShop";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureReportWorkShop = new BaseService(prisma.tblFailureReportWorkShop);

const ControllerTblFailureReportWorkShop = new BaseController({
  prefix: "/tblFailureReportWorkShop",
  swagger: {
    tags: ["tblFailureReportWorkShop"],
  },
  primaryKey: "failureReportWorkShopId",
  service: ServiceTblFailureReportWorkShop,
  createSchema: TblFailureReportWorkShopInputCreate,
  updateSchema: TblFailureReportWorkShopInputUpdate,
  responseSchema: buildResponseSchema(TblFailureReportWorkShopPlain, TblFailureReportWorkShop),
}).app;

export default ControllerTblFailureReportWorkShop;
