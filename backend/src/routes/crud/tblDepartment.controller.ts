import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblDepartment,
  TblDepartmentInputCreate,
  TblDepartmentInputUpdate,
  TblDepartmentPlain,
} from "orm/generated/prismabox/TblDepartment";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblDepartment = new BaseService(prisma.tblDepartment);

const ControllerTblDepartment = new BaseController({
  prefix: "/tblDepartment",
  swagger: {
    tags: ["tblDepartment"],
  },
  service: ServiceTblDepartment,
  createSchema: TblDepartmentInputCreate,
  updateSchema: TblDepartmentInputUpdate,
  responseSchema: buildResponseSchema(TblDepartmentPlain, TblDepartment),
}).app;

export default ControllerTblDepartment
