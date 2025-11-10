import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDefaultScreenConfig,
  TblDefaultScreenConfigInputCreate,
  TblDefaultScreenConfigInputUpdate,
  TblDefaultScreenConfigPlain,
} from "orm/generated/prismabox/TblDefaultScreenConfig";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDefaultScreenConfig = new BaseService(prisma.tblDefaultScreenConfig);

const ControllerTblDefaultScreenConfig = new BaseController({
  prefix: "/tblDefaultScreenConfig",
  swagger: {
    tags: ["tblDefaultScreenConfig"],
  },
  service: ServiceTblDefaultScreenConfig,
  createSchema: TblDefaultScreenConfigInputCreate,
  updateSchema: TblDefaultScreenConfigInputUpdate,
  responseSchema: buildResponseSchema(TblDefaultScreenConfigPlain, TblDefaultScreenConfig),
}).app;

export default ControllerTblDefaultScreenConfig
