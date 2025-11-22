import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompOilInfo,
  TblCompOilInfoInputCreate,
  TblCompOilInfoInputUpdate,
  TblCompOilInfoPlain,
} from "orm/generated/prismabox/TblCompOilInfo";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompOilInfo = new BaseService(prisma.tblCompOilInfo);

const ControllerTblCompOilInfo = new BaseController({
  prefix: "/tblCompOilInfo",
  swagger: {
    tags: ["tblCompOilInfo"],
  },
  primaryKey: "compOilInfoId",
  service: ServiceTblCompOilInfo,
  createSchema: TblCompOilInfoInputCreate,
  updateSchema: TblCompOilInfoInputUpdate,
  responseSchema: buildResponseSchema(TblCompOilInfoPlain, TblCompOilInfo),
}).app;

export default ControllerTblCompOilInfo
