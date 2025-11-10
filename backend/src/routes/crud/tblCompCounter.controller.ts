import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompCounter,
  TblCompCounterInputCreate,
  TblCompCounterInputUpdate,
  TblCompCounterPlain,
} from "orm/generated/prismabox/TblCompCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompCounter = new BaseService(prisma.tblCompCounter);

const ControllerTblCompCounter = new BaseController({
  prefix: "/tblCompCounter",
  swagger: {
    tags: ["tblCompCounter"],
  },
  service: ServiceTblCompCounter,
  createSchema: TblCompCounterInputCreate,
  updateSchema: TblCompCounterInputUpdate,
  responseSchema: buildResponseSchema(TblCompCounterPlain, TblCompCounter),
}).app;

export default ControllerTblCompCounter
