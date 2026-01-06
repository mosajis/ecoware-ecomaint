import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  TblUsers,
  TblUsersInputCreate,
  TblUsersInputUpdate,
  TblUsersPlain,
} from "orm/generated/prismabox/TblUsers";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceTblUsers = new BaseService(prisma.tblUsers);

const ControllerTblUsers = new BaseController({
  prefix: "/tblUsers",
  swagger: {
    tags: ["tblUsers"],
  },
  primaryKey: "userId",
  service: ServiceTblUsers,
  createSchema: TblUsersInputCreate,
  updateSchema: TblUsersInputUpdate,
  responseSchema: buildResponseSchema(TblUsersPlain, TblUsers),
}).app;

export default ControllerTblUsers;
