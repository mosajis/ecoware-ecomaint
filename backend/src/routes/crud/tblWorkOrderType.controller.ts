import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblWorkOrderType,
  TblWorkOrderTypeInputCreate,
  TblWorkOrderTypeInputUpdate,
  TblWorkOrderTypePlain,
} from "orm/generated/prismabox/TblWorkOrderType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblWorkOrderType = new BaseService(prisma.tblWorkOrderType);

const ControllerTblWorkOrderType = new BaseController({
  prefix: "/tblWorkOrderType",
  swagger: {
    tags: ["tblWorkOrderType"],
  },
  primaryKey: "workOrderTypeId",
  service: ServiceTblWorkOrderType,
  createSchema: TblWorkOrderTypeInputCreate,
  updateSchema: TblWorkOrderTypeInputUpdate,
  responseSchema: buildResponseSchema(TblWorkOrderTypePlain, TblWorkOrderType),
}).app;

export default ControllerTblWorkOrderType;
