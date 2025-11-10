import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblAppInfo,
  TblAppInfoInputCreate,
  TblAppInfoInputUpdate,
  TblAppInfoPlain,
} from "orm/generated/prismabox/TblAppInfo";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblAppInfo = new BaseService(prisma.tblAppInfo);

const ControllerTblAppInfo = new BaseController({
  prefix: "/tblAppInfo",
  swagger: {
    tags: ["tblAppInfo"],
  },
  service: ServiceTblAppInfo,
  createSchema: TblAppInfoInputCreate,
  updateSchema: TblAppInfoInputUpdate,
  responseSchema: buildResponseSchema(TblAppInfoPlain, TblAppInfo),
}).app;

export default ControllerTblAppInfo
