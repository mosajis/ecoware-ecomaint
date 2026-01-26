import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblFailureStatus,
  TblFailureStatusInputCreate,
  TblFailureStatusInputUpdate,
  TblFailureStatusPlain,
} from "orm/generated/prismabox/TblFailureStatus";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblFailureStatus = new BaseService(prisma.tblFailureStatus);

const ControllerTblFailureStatus = new BaseController({
  prefix: "/tblFailureStatus",
  swagger: {
    tags: ["tblFailureStatus"],
  },
  primaryKey: "failureStatusId",
  service: ServiceTblFailureStatus,
  createSchema: TblFailureStatusInputCreate,
  updateSchema: TblFailureStatusInputUpdate,
  responseSchema: buildResponseSchema(TblFailureStatusPlain, TblFailureStatus),
}).app;

export default ControllerTblFailureStatus;
