import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblJobVersion,
  TblJobVersionInputCreate,
  TblJobVersionInputUpdate,
  TblJobVersionPlain,
} from "orm/generated/prismabox/TblJobVersion";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobVersion = new BaseService(prisma.tblJobVersion);

const ControllerTblJobVersion = new BaseController({
  prefix: "/tblJobVersion",
  swagger: {
    tags: ["tblJobVersion"],
  },
  primaryKey: "jobVersionId",
  service: ServiceTblJobVersion,
  createSchema: TblJobVersionInputCreate,
  updateSchema: TblJobVersionInputUpdate,
  responseSchema: buildResponseSchema(TblJobVersionPlain, TblJobVersion),
}).app;

export default ControllerTblJobVersion;
