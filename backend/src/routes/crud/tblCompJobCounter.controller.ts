import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompJobCounter,
  TblCompJobCounterInputCreate,
  TblCompJobCounterInputUpdate,
  TblCompJobCounterPlain,
} from "orm/generated/prismabox/TblCompJobCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompJobCounter = new BaseService(prisma.tblCompJobCounter);

const ControllerTblCompJobCounter = new BaseController({
  prefix: "/tblCompJobCounter",
  swagger: {
    tags: ["tblCompJobCounter"],
  },
  service: ServiceTblCompJobCounter,
  createSchema: TblCompJobCounterInputCreate,
  updateSchema: TblCompJobCounterInputUpdate,
  responseSchema: buildResponseSchema(TblCompJobCounterPlain, TblCompJobCounter),
}).app;

export default ControllerTblCompJobCounter
