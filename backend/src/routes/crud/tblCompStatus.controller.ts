import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompStatus,
  TblCompStatusInputCreate,
  TblCompStatusInputUpdate,
  TblCompStatusPlain,
} from "orm/generated/prismabox/TblCompStatus";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompStatus = new BaseService(prisma.tblCompStatus);

const ControllerTblCompStatus = new BaseController({
  prefix: "/tblCompStatus",
  swagger: {
    tags: ["tblCompStatus"],
  },
  primaryKey: "compStatusId",
  service: ServiceTblCompStatus,
  createSchema: TblCompStatusInputCreate,
  updateSchema: TblCompStatusInputUpdate,
  responseSchema: buildResponseSchema(TblCompStatusPlain, TblCompStatus),
}).app;

export default ControllerTblCompStatus;
