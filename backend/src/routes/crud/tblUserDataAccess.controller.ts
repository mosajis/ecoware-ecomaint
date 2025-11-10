import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUserDataAccess,
  TblUserDataAccessInputCreate,
  TblUserDataAccessInputUpdate,
  TblUserDataAccessPlain,
} from "orm/generated/prismabox/TblUserDataAccess";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUserDataAccess = new BaseService(prisma.tblUserDataAccess);

const ControllerTblUserDataAccess = new BaseController({
  prefix: "/tblUserDataAccess",
  swagger: {
    tags: ["tblUserDataAccess"],
  },
  service: ServiceTblUserDataAccess,
  createSchema: TblUserDataAccessInputCreate,
  updateSchema: TblUserDataAccessInputUpdate,
  responseSchema: buildResponseSchema(TblUserDataAccessPlain, TblUserDataAccess),
}).app;

export default ControllerTblUserDataAccess
