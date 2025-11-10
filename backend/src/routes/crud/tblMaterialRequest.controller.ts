import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblMaterialRequest,
  TblMaterialRequestInputCreate,
  TblMaterialRequestInputUpdate,
  TblMaterialRequestPlain,
} from "orm/generated/prismabox/TblMaterialRequest";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblMaterialRequest = new BaseService(prisma.tblMaterialRequest);

const ControllerTblMaterialRequest = new BaseController({
  prefix: "/tblMaterialRequest",
  swagger: {
    tags: ["tblMaterialRequest"],
  },
  service: ServiceTblMaterialRequest,
  createSchema: TblMaterialRequestInputCreate,
  updateSchema: TblMaterialRequestInputUpdate,
  responseSchema: buildResponseSchema(TblMaterialRequestPlain, TblMaterialRequest),
}).app;

export default ControllerTblMaterialRequest
