import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblJobDescription,
  TblJobDescriptionInputCreate,
  TblJobDescriptionInputUpdate,
  TblJobDescriptionPlain,
} from "orm/generated/prismabox/TblJobDescription";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobDescription = new BaseService(prisma.tblJobDescription);

const ControllerTblJobDescription = new BaseController({
  prefix: "/tblJobDescription",
  swagger: {
    tags: ["tblJobDescription"],
  },
  primaryKey: "jobDescId",
  service: ServiceTblJobDescription,
  createSchema: TblJobDescriptionInputCreate,
  updateSchema: TblJobDescriptionInputUpdate,
  responseSchema: buildResponseSchema(TblJobDescriptionPlain, TblJobDescription),
}).app;

export default ControllerTblJobDescription
