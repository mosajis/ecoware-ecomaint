import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblFunctions,
  TblFunctionsInputCreate,
  TblFunctionsInputUpdate,
  TblFunctionsPlain,
} from "orm/generated/prismabox/TblFunctions";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFunctions = new BaseService(prisma.tblFunctions);

const ControllerTblFunctions = new BaseController({
  prefix: "/tblFunctions",
  swagger: {
    tags: ["tblFunctions"],
  },
  primaryKey: "functionId",
  service: ServiceTblFunctions,
  createSchema: TblFunctionsInputCreate,
  updateSchema: TblFunctionsInputUpdate,
  responseSchema: buildResponseSchema(TblFunctionsPlain, TblFunctions),
}).app;

export default ControllerTblFunctions;
