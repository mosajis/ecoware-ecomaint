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

export const ServiceTblFunction = new BaseService(prisma.tblFunction);

const ControllerTblFunction = new BaseController({
  scope: true,
  prefix: "/tblFunction",
  swagger: {
    tags: ["tblFunction"],
  },
  primaryKey: "functionId",
  service: ServiceTblFunction,
  createSchema: TblFunctionInputCreate,
  updateSchema: TblFunctionInputUpdate,
  responseSchema: buildResponseSchema(TblFunctionPlain, TblFunction),
}).app;

export default ControllerTblFunction;
