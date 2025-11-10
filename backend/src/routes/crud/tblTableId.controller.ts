import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblTableId,
  TblTableIdInputCreate,
  TblTableIdInputUpdate,
  TblTableIdPlain,
} from "orm/generated/prismabox/TblTableId";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblTableId = new BaseService(prisma.tblTableId);

const ControllerTblTableId = new BaseController({
  prefix: "/tblTableId",
  swagger: {
    tags: ["tblTableId"],
  },
  service: ServiceTblTableId,
  createSchema: TblTableIdInputCreate,
  updateSchema: TblTableIdInputUpdate,
  responseSchema: buildResponseSchema(TblTableIdPlain, TblTableId),
}).app;

export default ControllerTblTableId
