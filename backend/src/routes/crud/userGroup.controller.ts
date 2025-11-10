import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  UserGroup,
  UserGroupInputCreate,
  UserGroupInputUpdate,
  UserGroupPlain,
} from "orm/generated/prismabox/UserGroup";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceUserGroup = new BaseService(prisma.userGroup);

const ControllerUserGroup = new BaseController({
  prefix: "/userGroup",
  swagger: {
    tags: ["userGroup"],
  },
  service: ServiceUserGroup,
  createSchema: UserGroupInputCreate,
  updateSchema: UserGroupInputUpdate,
  responseSchema: buildResponseSchema(UserGroupPlain, UserGroup),
}).app;

export default ControllerUserGroup
