import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblJobClass,
  TblJobClassInputCreate,
  TblJobClassInputUpdate,
  TblJobClassPlain,
} from "orm/generated/prismabox/TblJobClass";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobClass = new BaseService(prisma.tblJobClass);

const ControllerTblJobClass = new BaseController({
  prefix: "/tblJobClass",
  swagger: {
    tags: ["tblJobClass"],
  },
  primaryKey: "jobClassId",
  service: ServiceTblJobClass,
  createSchema: TblJobClassInputCreate,
  updateSchema: TblJobClassInputUpdate,
  responseSchema: buildResponseSchema(TblJobClassPlain, TblJobClass),
}).app;

export default ControllerTblJobClass;
