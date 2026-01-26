import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblWorkShopRequest,
  TblWorkShopRequestInputCreate,
  TblWorkShopRequestInputUpdate,
  TblWorkShopRequestPlain,
} from "orm/generated/prismabox/TblWorkShopRequest";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkShopRequest = new BaseService(
  prisma.tblWorkShopRequest,
);

const ControllerTblWorkShopRequest = new BaseController({
  prefix: "/tblWorkShopRequest",
  swagger: {
    tags: ["tblWorkShopRequest"],
  },
  primaryKey: "wShopRequestId",
  service: ServiceTblWorkShopRequest,
  createSchema: TblWorkShopRequestInputCreate,
  updateSchema: TblWorkShopRequestInputUpdate,
  responseSchema: buildResponseSchema(
    TblWorkShopRequestPlain,
    TblWorkShopRequest,
  ),
}).app;

export default ControllerTblWorkShopRequest;
