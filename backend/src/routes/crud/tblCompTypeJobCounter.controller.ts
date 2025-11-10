import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeJobCounter,
  TblCompTypeJobCounterInputCreate,
  TblCompTypeJobCounterInputUpdate,
  TblCompTypeJobCounterPlain,
} from "orm/generated/prismabox/TblCompTypeJobCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeJobCounter = new BaseService(prisma.tblCompTypeJobCounter);

const ControllerTblCompTypeJobCounter = new BaseController({
  prefix: "/tblCompTypeJobCounter",
  swagger: {
    tags: ["tblCompTypeJobCounter"],
  },
  service: ServiceTblCompTypeJobCounter,
  createSchema: TblCompTypeJobCounterInputCreate,
  updateSchema: TblCompTypeJobCounterInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeJobCounterPlain, TblCompTypeJobCounter),
}).app;

export default ControllerTblCompTypeJobCounter
