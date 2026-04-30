import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblFunction,
  TblFunctionInputCreate,
  TblFunctionInputUpdate,
  TblFunctionPlain,
} from "orm/generated/prismabox/TblFunction";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFunctions = new BaseService(prisma.tblFunction);

const ControllerTblFunctions = new BaseController({
  prefix: "/tblFunctions",
  swagger: {
    tags: ["tblFunctions"],
  },
  primaryKey: "functionId",
  service: ServiceTblFunctions,
  createSchema: TblFunctionInputCreate,
  updateSchema: TblFunctionInputUpdate,
  responseSchema: buildResponseSchema(TblFunctionPlain, TblFunction),
  scope: true,
}).app;

export default ControllerTblFunctions;
