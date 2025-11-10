import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblAppSysParams,
  TblAppSysParamsInputCreate,
  TblAppSysParamsInputUpdate,
  TblAppSysParamsPlain,
} from "orm/generated/prismabox/TblAppSysParams";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAppSysParams = new BaseService(prisma.tblAppSysParams);

const ControllerTblAppSysParams = new BaseController({
  prefix: "/tblAppSysParams",
  swagger: {
    tags: ["tblAppSysParams"],
  },
  service: ServiceTblAppSysParams,
  createSchema: TblAppSysParamsInputCreate,
  updateSchema: TblAppSysParamsInputUpdate,
  responseSchema: buildResponseSchema(TblAppSysParamsPlain, TblAppSysParams),
}).app;

export default ControllerTblAppSysParams
