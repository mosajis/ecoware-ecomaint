import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";

import {
  TblCompType,
  TblCompTypeInputCreate,
  TblCompTypeInputUpdate,
  TblCompTypePlain,
} from "orm/generated/prismabox/TblCompType";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompType = new BaseService(prisma.tblCompType);

const ControllerTblCompType = new BaseController({
  prefix: "/tblCompType",
  swagger: {
    tags: ["tblCompType"],
  },
  primaryKey: "compTypeId",
  service: ServiceTblCompType,
  createSchema: TblCompTypeInputCreate,
  updateSchema: TblCompTypeInputUpdate,
  responseSchema: buildResponseSchema(TblCompTypePlain, TblCompType),
}).app;

export default ControllerTblCompType;
