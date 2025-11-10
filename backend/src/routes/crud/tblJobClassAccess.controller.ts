import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblJobClassAccess,
  TblJobClassAccessInputCreate,
  TblJobClassAccessInputUpdate,
  TblJobClassAccessPlain,
} from "orm/generated/prismabox/TblJobClassAccess";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblJobClassAccess = new BaseService(prisma.tblJobClassAccess);

const ControllerTblJobClassAccess = new BaseController({
  prefix: "/tblJobClassAccess",
  swagger: {
    tags: ["tblJobClassAccess"],
  },
  service: ServiceTblJobClassAccess,
  createSchema: TblJobClassAccessInputCreate,
  updateSchema: TblJobClassAccessInputUpdate,
  responseSchema: buildResponseSchema(TblJobClassAccessPlain, TblJobClassAccess),
}).app;

export default ControllerTblJobClassAccess
