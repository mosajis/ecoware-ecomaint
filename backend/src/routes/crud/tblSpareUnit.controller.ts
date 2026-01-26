import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblSpareUnit,
  TblSpareUnitInputCreate,
  TblSpareUnitInputUpdate,
  TblSpareUnitPlain,
} from "orm/generated/prismabox/TblSpareUnit";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblSpareUnit = new BaseService(prisma.tblSpareUnit);

const ControllerTblSpareUnit = new BaseController({
  prefix: "/tblSpareUnit",
  swagger: {
    tags: ["tblSpareUnit"],
  },
  primaryKey: "partId",
  service: ServiceTblSpareUnit,
  createSchema: TblSpareUnitInputCreate,
  updateSchema: TblSpareUnitInputUpdate,
  responseSchema: buildResponseSchema(TblSpareUnitPlain, TblSpareUnit),
}).app;

export default ControllerTblSpareUnit;
