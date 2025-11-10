import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFiltersInfo,
  TblFiltersInfoInputCreate,
  TblFiltersInfoInputUpdate,
  TblFiltersInfoPlain,
} from "orm/generated/prismabox/TblFiltersInfo";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFiltersInfo = new BaseService(prisma.tblFiltersInfo);

const ControllerTblFiltersInfo = new BaseController({
  prefix: "/tblFiltersInfo",
  swagger: {
    tags: ["tblFiltersInfo"],
  },
  service: ServiceTblFiltersInfo,
  createSchema: TblFiltersInfoInputCreate,
  updateSchema: TblFiltersInfoInputUpdate,
  responseSchema: buildResponseSchema(TblFiltersInfoPlain, TblFiltersInfo),
}).app;

export default ControllerTblFiltersInfo
