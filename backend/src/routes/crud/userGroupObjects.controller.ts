import { BaseController } from "@/utils/base.controller";
import { BaseService } from "@/utils/base.service";
import { PrismaClient } from "orm/generated/prisma";
import {
  UserGroupObjects,
  UserGroupObjectsInputCreate,
  UserGroupObjectsInputUpdate,
  UserGroupObjectsPlain,
} from "orm/generated/prismabox/UserGroupObjects";
import { buildResponseSchema } from "@/utils/base.schema";
import { prisma } from "@/utils/prisma";

export const ServiceUserGroupObjects = new BaseService(prisma.userGroupObjects);

const ControllerUserGroupObjects = new BaseController({
  prefix: "/userGroupObjects",
  swagger: {
    tags: ["userGroupObjects"],
  },
  service: ServiceUserGroupObjects,
  createSchema: UserGroupObjectsInputCreate,
  updateSchema: UserGroupObjectsInputUpdate,
  responseSchema: buildResponseSchema(UserGroupObjectsPlain, UserGroupObjects),
}).app;

export default ControllerUserGroupObjects
