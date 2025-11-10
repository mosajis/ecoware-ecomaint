import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblCompStatusLog,
  TblCompStatusLogInputCreate,
  TblCompStatusLogInputUpdate,
  TblCompStatusLogPlain,
} from "orm/generated/prismabox/TblCompStatusLog";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblCompStatusLog = new BaseService(prisma.tblCompStatusLog);

const ControllerTblCompStatusLog = new BaseController({
  prefix: "/tblCompStatusLog",
  swagger: {
    tags: ["tblCompStatusLog"],
  },
  service: ServiceTblCompStatusLog,
  createSchema: TblCompStatusLogInputCreate,
  updateSchema: TblCompStatusLogInputUpdate,
  responseSchema: buildResponseSchema(TblCompStatusLogPlain, TblCompStatusLog),
}).app;

export default ControllerTblCompStatusLog
