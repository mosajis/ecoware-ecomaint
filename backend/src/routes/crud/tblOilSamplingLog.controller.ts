import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblOilSamplingLog,
  TblOilSamplingLogInputCreate,
  TblOilSamplingLogInputUpdate,
  TblOilSamplingLogPlain,
} from "orm/generated/prismabox/TblOilSamplingLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblOilSamplingLog = new BaseService(
  prisma.tblOilSamplingLog,
);

const ControllerTblOilSamplingLog = new BaseController({
  prefix: "/tblOilSamplingLog",
  swagger: {
    tags: ["tblOilSamplingLog"],
  },
  primaryKey: "oilSamplingLogId",
  service: ServiceTblOilSamplingLog,
  createSchema: TblOilSamplingLogInputCreate,
  updateSchema: TblOilSamplingLogInputUpdate,
  responseSchema: buildResponseSchema(
    TblOilSamplingLogPlain,
    TblOilSamplingLog,
  ),
}).app;

export default ControllerTblOilSamplingLog;
