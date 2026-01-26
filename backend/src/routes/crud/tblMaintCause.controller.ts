import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblMaintCause,
  TblMaintCauseInputCreate,
  TblMaintCauseInputUpdate,
  TblMaintCausePlain,
} from "orm/generated/prismabox/TblMaintCause";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaintCause = new BaseService(prisma.tblMaintCause);

const ControllerTblMaintCause = new BaseController({
  prefix: "/tblMaintCause",
  swagger: {
    tags: ["tblMaintCause"],
  },
  primaryKey: "maintCauseId",
  service: ServiceTblMaintCause,
  createSchema: TblMaintCauseInputCreate,
  updateSchema: TblMaintCauseInputUpdate,
  responseSchema: buildResponseSchema(TblMaintCausePlain, TblMaintCause),
}).app;

export default ControllerTblMaintCause;
