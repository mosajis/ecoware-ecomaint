import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblLoginAudit,
  TblLoginAuditInputCreate,
  TblLoginAuditInputUpdate,
  TblLoginAuditPlain,
} from "orm/generated/prismabox/TblLoginAudit";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblLoginAudit = new BaseService(prisma.tblLoginAudit);

const ControllerTblLoginAudit = new BaseController({
  prefix: "/tblLoginAudit",
  swagger: {
    tags: ["tblLoginAudit"],
  },
  primaryKey: "loginAuditId",
  service: ServiceTblLoginAudit,
  createSchema: TblLoginAuditInputCreate,
  updateSchema: TblLoginAuditInputUpdate,
  responseSchema: buildResponseSchema(TblLoginAuditPlain, TblLoginAudit),
}).app;

export default ControllerTblLoginAudit;
