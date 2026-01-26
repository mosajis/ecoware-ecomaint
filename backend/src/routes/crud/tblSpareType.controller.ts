import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblSpareType,
  TblSpareTypeInputCreate,
  TblSpareTypeInputUpdate,
  TblSpareTypePlain,
} from "orm/generated/prismabox/TblSpareType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblSpareType = new BaseService(prisma.tblSpareType);

const ControllerTblSpareType = new BaseController({
  prefix: "/tblSpareType",
  swagger: {
    tags: ["tblSpareType"],
  },
  primaryKey: "partTypeId",
  service: ServiceTblSpareType,
  createSchema: TblSpareTypeInputCreate,
  updateSchema: TblSpareTypeInputUpdate,
  responseSchema: buildResponseSchema(TblSpareTypePlain, TblSpareType),
}).app;

export default ControllerTblSpareType;
