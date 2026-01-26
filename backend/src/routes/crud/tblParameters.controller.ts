import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblParameters,
  TblParametersInputCreate,
  TblParametersInputUpdate,
  TblParametersPlain,
} from "orm/generated/prismabox/TblParameters";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblParameters = new BaseService(prisma.tblParameters);

const ControllerTblParameters = new BaseController({
  prefix: "/tblParameters",
  swagger: {
    tags: ["tblParameters"],
  },
  primaryKey: "parameterId",
  service: ServiceTblParameters,
  createSchema: TblParametersInputCreate,
  updateSchema: TblParametersInputUpdate,
  responseSchema: buildResponseSchema(TblParametersPlain, TblParameters),
}).app;

export default ControllerTblParameters;
