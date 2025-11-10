import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblJobTrigger,
  TblJobTriggerInputCreate,
  TblJobTriggerInputUpdate,
  TblJobTriggerPlain,
} from "orm/generated/prismabox/TblJobTrigger";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobTrigger = new BaseService(prisma.tblJobTrigger);

const ControllerTblJobTrigger = new BaseController({
  prefix: "/tblJobTrigger",
  swagger: {
    tags: ["tblJobTrigger"],
  },
  service: ServiceTblJobTrigger,
  createSchema: TblJobTriggerInputCreate,
  updateSchema: TblJobTriggerInputUpdate,
  responseSchema: buildResponseSchema(TblJobTriggerPlain, TblJobTrigger),
}).app;

export default ControllerTblJobTrigger
