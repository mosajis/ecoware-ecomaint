import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblActionUsers,
  TblActionUsersInputCreate,
  TblActionUsersInputUpdate,
  TblActionUsersPlain,
} from "orm/generated/prismabox/TblActionUsers";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblActionUsers = new BaseService(prisma.tblActionUsers);

const ControllerTblActionUsers = new BaseController({
  prefix: "/tblActionUsers",
  swagger: {
    tags: ["tblActionUsers"],
  },
  service: ServiceTblActionUsers,
  createSchema: TblActionUsersInputCreate,
  updateSchema: TblActionUsersInputUpdate,
  responseSchema: buildResponseSchema(TblActionUsersPlain, TblActionUsers),
}).app;

export default ControllerTblActionUsers
