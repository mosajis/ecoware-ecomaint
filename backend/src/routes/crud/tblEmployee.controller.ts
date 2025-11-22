import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblEmployee,
  TblEmployeeInputCreate,
  TblEmployeeInputUpdate,
  TblEmployeePlain,
} from "orm/generated/prismabox/TblEmployee";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblEmployee = new BaseService(prisma.tblEmployee);

const ControllerTblEmployee = new BaseController({
  prefix: "/tblEmployee",
  swagger: {
    tags: ["tblEmployee"],
  },
  primaryKey: "employeeId",
  service: ServiceTblEmployee,
  createSchema: TblEmployeeInputCreate,
  updateSchema: TblEmployeeInputUpdate,
  responseSchema: buildResponseSchema(TblEmployeePlain, TblEmployee),
}).app;

export default ControllerTblEmployee
