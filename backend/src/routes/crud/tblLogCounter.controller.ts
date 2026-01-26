import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblLogCounter,
  TblLogCounterInputCreate,
  TblLogCounterInputUpdate,
  TblLogCounterPlain,
} from "orm/generated/prismabox/TblLogCounter";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblLogCounter = new BaseService(prisma.tblLogCounter);

const ControllerTblLogCounter = new BaseController({
  prefix: "/tblLogCounter",
  swagger: {
    tags: ["tblLogCounter"],
  },
  primaryKey: "logCounterId",
  service: ServiceTblLogCounter,
  createSchema: TblLogCounterInputCreate,
  updateSchema: TblLogCounterInputUpdate,
  responseSchema: buildResponseSchema(TblLogCounterPlain, TblLogCounter),
}).app;

export default ControllerTblLogCounter;
