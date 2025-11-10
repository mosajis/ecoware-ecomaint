import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompTypeJobTrigger,
  TblCompTypeJobTriggerInputCreate,
  TblCompTypeJobTriggerInputUpdate,
  TblCompTypeJobTriggerPlain,
} from "orm/generated/prismabox/TblCompTypeJobTrigger";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompTypeJobTrigger = new BaseService(prisma.tblCompTypeJobTrigger);

const ControllerTblCompTypeJobTrigger = new BaseController({
  prefix: "/tblCompTypeJobTrigger",
  swagger: {
    tags: ["tblCompTypeJobTrigger"],
  },
  service: ServiceTblCompTypeJobTrigger,
  createSchema: TblCompTypeJobTriggerInputCreate,
  updateSchema: TblCompTypeJobTriggerInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypeJobTriggerPlain, TblCompTypeJobTrigger),
}).app;

export default ControllerTblCompTypeJobTrigger
